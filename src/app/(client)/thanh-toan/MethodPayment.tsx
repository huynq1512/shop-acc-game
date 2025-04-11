"use client";
import { Modal, Space, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import api from '@/app/services/axiosService';
import { SocialLink } from '@/components/SocialButton';
import { ISystem } from '@/app/interfaces/ISystem';
import Image from 'next/image';

const { Title } = Typography;

interface MethodPaymentProps {
    visible: boolean;
    onClose: () => void;
}

const FacebookIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12a10 10 0 1 0-11.56 9.88V15h-2.27v-3h2.27V9.5a3.13 3.13 0 0 1 3.34-3.5 13.38 13.38 0 0 1 2 .17v2.32h-1.38a1.27 1.27 0 0 0-1.43 1.38V12h2.5l-.4 3H14v6.88A10 10 0 0 0 22 12z" />
    </svg>
);

const WebsiteIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
                 10-4.48 10-10S17.52 2 12 2zm6.93 6h-2.12a15.38
                 15.38 0 0 0-1.44-3.56A8.027 8.027 0 0 1 18.93 8zM12
                 4c.84 0 2.49 2.39 2.91 6h-5.82C9.51 6.39 11.16 4
                 12 4zM4.07 8a8.027 8.027 0 0 1 3.56-3.56A15.38
                 15.38 0 0 0 6.19 8H4.07zM4 12c0-.68.07-1.34.18-2h3.64c-.1.65-.16
                 1.32-.16 2s.06 1.35.16 2H4.18c-.11-.66-.18-1.32-.18-2zm.07 4h2.12a15.38
                 15.38 0 0 0 1.44 3.56A8.027 8.027 0 0 1 4.07 16zM12
                 20c-.84 0-2.49-2.39-2.91-6h5.82c-.42 3.61-2.07 6-2.91
                 6zm2.37-.44A15.38 15.38 0 0 0 15.81 16h2.12a8.027
                 8.027 0 0 1-3.56 3.56zM16.18 14c.1-.65.16-1.32.16-2s-.06-1.35-.16-2h3.64c.11.66.18
                 1.32.18 2s-.07 1.34-.18 2h-3.64z" />
    </svg>
);


const ZaloIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#0068FF" /> {/* Nền tròn màu xanh lam */}
        <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="white"
            fontSize="16"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
        >
            Zalo
        </text>
    </svg>
);

const PhoneIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#1E90FF" />
        <path
            d="M34 36c-1.5 0-3-.5-4.5-1.5-3-2-6-4.5-9-7.5s-5-6-7-9c-1-1.5-1.5-3-1.5-4.5 0-1.5.5-3 1.5-4.5l2-2c.5-.5 1-.5 1.5 0l4 4c.5.5.5 1 0 1.5l-2 2c-.5.5-.5 1 0 1.5 1 1.5 2 3 3.5 4.5s3 2.5 4.5 3.5c.5.5 1 .5 1.5 0l2-2c.5-.5 1-.5 1.5 0l4 4c.5.5.5 1 0 1.5l-2 2c-1.5 1-3 1.5-4.5 1.5z"
            fill="white"
        />
    </svg>
);
export default function MethodPayment({ visible, onClose }: MethodPaymentProps) {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [data, setData] = useState<ISystem | undefined>(undefined);
    useEffect(() => {
        const fetchSystemData = async () => {
            try {
                const response = await api.get('/clients/systems');
                const data = response.data.system;
                setData(data)

                const links: SocialLink[] = [];

                if (data?.facebook) {
                    links.push({
                        name: 'Facebook',
                        url: data.facebook,
                        icon: <FacebookIcon />,
                        bgColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
                        hoverColor: 'hover:from-blue-600 hover:to-indigo-700',
                    });
                }

                if (data?.zalo) {
                    links.push({
                        name: 'Zalo',
                        url: `https://zalo.me/${data.zalo}`,
                        icon: <ZaloIcon />,
                        bgColor: 'bg-gradient-to-br from-blue-600 to-cyan-500',
                        hoverColor: 'hover:from-blue-700 hover:to-cyan-600',
                    });
                }

                if (data?.phone) {
                    links.push({
                        name: 'Phone',
                        url: `tel:${data.phone}`,
                        icon: <PhoneIcon />,
                        bgColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
                        hoverColor: 'hover:from-blue-600 hover:to-indigo-700',
                    });
                }
                links.push({
                    name: 'THESIEURE',
                    url: `https://thesieure.com`,
                    icon: <WebsiteIcon />,
                    bgColor: 'bg-gradient-to-br from-blue-600 to-cyan-500',
                    hoverColor: 'hover:from-blue-700 hover:to-cyan-600',
                });
                setSocialLinks(links);
            } catch (error) {
                console.error('Error fetching system data:', error);
            }
        };

        fetchSystemData();
    }, []);
    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            title={<Title level={4} className="text-center">Chọn phương thức thanh toán</Title>}
        >
            <div>
                {data && data.qr_code && (
                        <Image
                            height={300}
                            width={300}
                            src={data.qr_code}
                            alt={'QR Code'}
                            className='m-auto'
                        />
                )}
                <Space size="large" className="flex justify-center text-3xl mt-4">
                    {socialLinks.map((social, index) => (
                        <Tooltip title={social.name} color='blue' key={index}>
                            <div key={index} className="relative group">
                                <a
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`
                            block
                            w-12
                            h-12
                            rounded-full
                            ${social.bgColor}
                            ${social.hoverColor}
                            flex
                            items-center
                            justify-center
                            shadow-lg
                            hover:shadow-xl
                            transform
                            transition-all
                            duration-300
                            hover:scale-110
                            relative
                            overflow-hidden
                        `}
                                    style={{ animationDelay: `${index * 0.2}s` }}
                                >
                                    {/* Hiệu ứng ánh sáng khi hover */}
                                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transform skew-x-12 transition-opacity duration-300" />

                                    {/* Biểu tượng SVG */}
                                    <div className="text-white transform group-hover:scale-110 transition-transform duration-300">
                                        {social.icon}
                                    </div>

                                    {/* Hiệu ứng pulse */}
                                    <span
                                        className="absolute inset-0 rounded-full border-2 border-white opacity-20 scale-125 animate-[pulse_2s_infinite]"
                                        style={{ animationDelay: `${index * 0.4}s` }}
                                    />
                                </a>

                                {/* Tooltip cho Zalo */}
                                {social.name === 'Zalo' && social.phone && (
                                    <div
                                        className={`
                                top-1/2
                                -translate-y-1/2
                                bg-gray-800
                                text-white
                                px-3
                                py-1
                                rounded-lg
                                text-sm
                                font-medium
                                opacity-0
                                group-hover:opacity-100
                                transform
                                duration-300
                                pointer-events-none
                                whitespace-nowrap
                                shadow-md
                            `}
                                    >
                                        {social.phone}
                                    </div>
                                )}
                            </div>
                        </Tooltip>

                    ))}
                </Space>
            </div>
        </Modal>
    );
}
