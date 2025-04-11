import { NextRequest, NextResponse } from "next/server";
import { initRepository } from "@/app/models/connect";
import { System } from "@/app/models/entities/System";
import { uploadFileToPinata } from "@/app/services/pinataService";

export const GET = async () => {
  try {
    const systemRepo = await initRepository(System);
    const system = await systemRepo.findOneBy({ id: 1 });
    return NextResponse.json({ system }, { status: 200 });
  } catch (e) {
    console.log((e as Error).message);
    return NextResponse.json({
      result: false,
      message: (e as Error).message
    });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const systemRepo = await initRepository(System);
    const system = await systemRepo.findOneBy({ id: 1 });
    
    if (!system) {
      return NextResponse.json({ result: false, message: "Không tìm thấy thông tin hệ thống" }, { status: 404 });
    }
    
    const formData = await req.formData();
    
    // In ra log để kiểm tra dữ liệu gửi lên
    console.log("Các trường dữ liệu nhận được:");
    for (const [key, value] of formData.entries()) {
      const valueInfo = value instanceof File 
        ? `File: ${value.name}, Size: ${value.size}, Type: ${value.type}` 
        : value;
      console.log(`${key}: ${valueInfo}`);
    }
    
    // Tạo object mới để lưu dữ liệu cập nhật
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newData: Record<string, any> = {};
    
    // Xử lý các trường văn bản
    ['name', 'phone', 'email', 'youtube', 'facebook', 'tiktok'].forEach(field => {
      const value = formData.get(field);
      if (value) newData[field] = value;
    });
    
    // Xử lý riêng file logo
    const logoFile = formData.get('logo');
    if (logoFile instanceof File && logoFile.size > 0) {
      console.log("Đang xử lý file logo:", logoFile.name);
      try {
        newData.logo = await uploadFileToPinata(logoFile);
        console.log("Logo đã upload thành công:", newData.logo);
      } catch (error) {
        console.error("Lỗi khi upload logo:", error);
        newData.logo = system.logo; // Giữ nguyên giá trị cũ nếu upload lỗi
      }
    } else {
      newData.logo = system.logo;
    }
    
    // Xử lý riêng file QR code
    const qrCodeFile = formData.get('qr_code');
    if (qrCodeFile instanceof File && qrCodeFile.size > 0) {
      console.log("Đang xử lý file QR code:", qrCodeFile.name);
      try {
        newData.qr_code = await uploadFileToPinata(qrCodeFile);
        console.log("QR code đã upload thành công:", newData.qr_code);
      } catch (error) {
        console.error("Lỗi khi upload QR code:", error);
        newData.qr_code = system.qr_code; // Giữ nguyên giá trị cũ nếu upload lỗi
      }
    } else {
      newData.qr_code = system.qr_code;
    }
    
    console.log("Dữ liệu sẽ update:", newData);
    
    // Cập nhật vào database
    await systemRepo.update(1, newData);
    
    // Lấy thông tin đã cập nhật để trả về
    const updatedSystem = await systemRepo.findOneBy({ id: 1 });
    
    return NextResponse.json({ 
      system: updatedSystem, 
      result: true,
      message: "Cập nhật thông tin thành công" 
    }, { status: 200 });
  } catch (e) {
    console.error("Lỗi trong PATCH handler:", (e as Error).message);
    return NextResponse.json({
      result: false,
      message: `Lỗi: ${(e as Error).message}`
    }, { status: 500 });
  }
};