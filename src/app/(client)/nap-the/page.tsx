"use client"
import { useState } from 'react';
import FeeComponent from "@/app/(client)/nap-the/FeeComponent";
import ChargeCardTextComponent from "@/app/(client)/nap-the/ChargeCardTextComponent";
import SingleCardFormComponent from "@/app/(client)/nap-the/SingleCardFormComponent";
import MultipleCardFormComponent from "@/app/(client)/nap-the/MultipleCardFormComponent";
import api from "@/app/services/axiosService";
import {toast} from "react-toastify";

interface SingleFormData {
    telco: { [key: string]: string };
    code: { [key: string]: string };
    serial: { [key: string]: string };
    amount: { [key: string]: string };
}

interface MultipleFormData {
    telco: string;
    price: string;
    code: string;
}

export default function ChargeCard() {
    const [activeTab, setActiveTab] = useState<string>('theoform');
    const handleTabChange = (tabId: string): void => {
        setActiveTab(tabId);
    };

    const handleSubmit = async (formData: SingleFormData | MultipleFormData, formType: 'single' | 'multiple'): void => {
        console.log(`Form submitted: ${formType}`);
        console.log('Form data:', formData);
        try {
            const response = await api.post(`card-charge/v1/charging?type=${formType}`, formData)
            if (response.status === 200) {
                toast.success('Đã tiếp nhận đơn nạp thẻ, vui lòng kiểm tra số dư sau ít phút')
            }
        } catch (e) {
            toast.error(e.response.data.message)
        }
    };

    return (
            <div className="container mx-auto p-4">
                <ChargeCardTextComponent/>
                <div className="tabs-m1">
                    <ul className="flex border-b mb-4">
                        <li className="mr-1">
                            <button
                                className={`px-4 py-2 ${activeTab === 'theoform' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                onClick={() => handleTabChange('theoform')}
                            >
                                Đổi thẻ cào
                            </button>
                        </li>
                        <li className="mr-1">
                            <button
                                className={`px-4 py-2 ${activeTab === 'nhieuthe' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                onClick={() => handleTabChange('nhieuthe')}
                            >
                                Đổi nhiều thẻ
                            </button>
                        </li>
                    </ul>

                    <div className="tab-content">
                        <SingleCardFormComponent
                            activeTab={activeTab}
                            onSubmit={handleSubmit}
                        />
                        <MultipleCardFormComponent
                            activeTab={activeTab}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
                <FeeComponent/>
            </div>
    );
}