import { Card } from "@/components/ui/card"
import { FormSelect } from "@/components/ui/form"
import { MonitorCog, Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react";

const ViewSettings = () => {
    const [activeButton, setActiveButton] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleClick = (index: number) => {
        setActiveButton(index);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <style jsx>{`
                    .clean-loader {
                        width: 58px;
                        height: 58px;
                        border: 4px solid #e5e7eb;
                        border-top: 4px solid #10b981;
                        border-radius: 50%;
                        animation: cleanSpin 1s linear infinite;
                    }
                    
                    @keyframes cleanSpin {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                `}</style>
                <div className="clean-loader"></div>
            </div>
        );
    }
    
    return(
        <div>
            <h1 className="pl-2 text-2xl font-semibold">Settings</h1>

            <div className="flex flex-col justify-between items-center px-2 pt-5 gap-5">
                <Card className="flex items-center justify-between px-5 py-4 w-full">
                    <div className="w-full">
                        <h3 className="text-xl font-semibold">Bahasa</h3>
                        <p className="opacity-75 text-md">Pilih bahasa yang diinginkan untuk menyesuaikan pengalaman Anda</p>
                    </div>
                    <div className="flex items-center justify-end w-1/2">
                        <FormSelect
                          id="language"
                          label=""
                          placeholder="Select Language"
                          options={[
                            { value: "ind", label: "Indonesia" },
                            { value: "eng", label: "Inggris" },
                          ]}
                        />
                    </div>
                </Card>
                <Card className="flex items-center justify-between px-5 py-4 w-full">
                    <div className="w-full">
                        <h3 className="text-xl font-semibold">Tema</h3>
                        <p className="opacity-75 text-md">Atur tema aplikasi sesuai dengan preferensi visual Anda</p>
                    </div>
                    <div className="flex justify-end items-center gap-5 w-full">
                        <button
                            onClick={() => handleClick(0)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 
                            ${activeButton === 0
                                ? 'bg-blue-600 text-white shadow-xl transform scale-105'
                                : 'bg-transparent text-gray-600 hover:bg-gray-300'
                            }`}
                        >
                            <MonitorCog />
                            <p className="text-sm">Default Sistem</p>
                        </button>

                        <button
                            onClick={() => handleClick(1)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300
                            ${activeButton === 1
                                ? 'bg-yellow-500 text-white shadow-xl transform scale-105'
                                : 'bg-transparent text-gray-600 hover:bg-gray-300'
                            }`}
                        >
                            <Sun />
                            <p className="text-sm">Terang</p>
                        </button>

                        <button
                            onClick={() => handleClick(2)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 
                            ${activeButton === 2
                                ? 'bg-gray-800 text-white shadow-xl transform scale-105'
                                : 'bg-transparent text-gray-600 hover:bg-gray-300'
                            }`}
                        >
                            <Moon />
                            <p className="text-sm">Gelap</p>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default ViewSettings