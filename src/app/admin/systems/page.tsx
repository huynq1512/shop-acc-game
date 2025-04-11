"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/app/services/axiosService";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/(admin)/Error";
import { toast } from "react-toastify";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(1, "Tên website phải có ít nhất 1 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  youtube: z.string().url("Link Youtube không hợp lệ").optional().or(z.literal('')),
  facebook: z.string().url("Link Facebook không hợp lệ").optional().or(z.literal('')),
  tiktok: z.string().url("Link Tiktok không hợp lệ").optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

type FileData = {
  logo: string | null;
  qr_code: string | null;
};

const System: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fileData, setFileData] = useState<FileData>({
    logo: null,
    qr_code: null,
  });
  const [selectedFiles, setSelectedFiles] = useState<{ logo: File | null; qr_code: File | null }>({
    logo: null,
    qr_code: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("system");

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleFileChange = (type: keyof FileData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFiles(prev => ({ ...prev, [type]: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileData(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditing(prev => !prev);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Tạo FormData mới
      const formData = new FormData();
      
      // Thêm các trường văn bản vào FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string);
        }
      });

      // Thêm files vào FormData nếu có
      if (selectedFiles.logo) {
        formData.append("logo", selectedFiles.logo);
      }
      
      if (selectedFiles.qr_code) {
        formData.append("qr_code", selectedFiles.qr_code);
      }

      // Gửi request với header đúng cho multipart/form-data
      const response = await api.patch("systems", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 200) {
        toast.success("Cập nhật thông tin thành công");
        setError(false);
      } else {
        toast.error(`Cập nhật thất bại: ${response.data?.message || 'Lỗi không xác định'}`);
        setError(true);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error(`Lỗi khi cập nhật: ${(error as any).message || 'Lỗi không xác định'}`);
      setError(true);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await api.get("/systems");
      if (response.status === 200) {
        const systemData = response.data.system;
        setValue("name", systemData.name);
        setValue("phone", systemData.phone);
        setValue("email", systemData.email);
        setValue("youtube", systemData.youtube || '');
        setValue("facebook", systemData.facebook || '');
        setValue("tiktok", systemData.tiktok || '');
        setFileData({ 
          logo: systemData.logo, 
          qr_code: systemData.qr_code 
        });
        setError(false);
      } else {
        setError(true);
      }
    } catch (e) {
      setError(true);
      console.log((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? (
    <Loading />
  ) : error ? (
    <ErrorPage />
  ) : (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <ul className="nav nav-pills mb-5" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "system" ? "active" : ""}`}
                onClick={() => setActiveTab("system")}
                type="button"
              >
                Cập nhật hệ thống
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "password" ? "active" : ""}`}
                onClick={() => setActiveTab("password")}
                type="button"
              >
                Cập nhật mật khẩu
              </button>
            </li>
          </ul>
          {activeTab === "system" ? (
            <div className="card-body">
              <form className="theme-form theme-form-2 mega-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  {["logo", "qr_code"].map((type) => (
                    <div className="col-md-6" key={type}>
                      <label className="col-form-label">{type === 'logo' ? 'Logo website' : 'QR Code'}</label>
                      <input
                        className="form-control"
                        onChange={handleFileChange(type as keyof FileData)}
                        disabled={!isEditing}
                        type="file"
                        accept="image/*"
                        id={`file-${type}`}
                      />
                      {fileData[type as keyof FileData] && (
                        <div className="mt-4 mb-5">
                          <Image
                            height={100}
                            width={100}
                            src={fileData[type as keyof FileData] || "/admin/assets/images/placeholder.png"}
                            alt={type}
                            style={{ maxWidth: "300px", maxHeight: "250px" }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {[
                  { label: "Tên website", name: "name" as keyof FormData },
                  { label: "Số điện thoại", name: "phone" as keyof FormData },
                  { label: "Email", name: "email" as keyof FormData },
                  { label: "Link Youtube", name: "youtube" as keyof FormData },
                  { label: "Link Fan page", name: "facebook" as keyof FormData },
                  { label: "Link Tiktok", name: "tiktok" as keyof FormData },
                ].map(({ label, name }) => (
                  <div className="mb-4" key={name}>
                    <label className="form-label">{label}</label>
                    <input
                      className="form-control"
                      type="text"
                      disabled={!isEditing}
                      {...register(name)}
                    />
                    {errors[name] && (
                      <p className="text-danger">{errors[name]?.message}</p>
                    )}
                  </div>
                ))}

                <button type="button" onClick={toggleEdit} className="mt-3 btn btn-warning mr-2">
                  {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa thông tin"}
                </button>
                {isEditing && (
                  <button type="submit" className="mt-3 btn btn-primary ml-2">
                    Lưu thay đổi
                  </button>
                )}
              </form>
            </div>
          ) : (
            <div className="card-body">
              <form className="theme-form theme-form-2 mega-form">
                {["Mật khẩu cũ", "Mật khẩu mới", "Xác nhận mật khẩu"].map((label) => (
                  <div className="mb-4 row align-items-center" key={label}>
                    <label className="form-label-title col-sm-2 mb-0">{label}</label>
                    <div className="col-sm-10">
                      <input className="form-control" type="password" placeholder={`Enter Your ${label}`} />
                    </div>
                  </div>
                ))}
                <button className="mt-3 btn btn-primary">Cập nhật</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default System;