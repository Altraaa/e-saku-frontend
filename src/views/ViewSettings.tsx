import { Card } from "@/components/ui/card"
import { FormSelect } from "@/components/ui/form"
import { MonitorCog, Moon, Sun, Settings } from "lucide-react"
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
                <div className="w-14 h-14 border-4 border-gray-300 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        );
    }
    
    return(
        <div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6 shadow-sm">
                <div className="flex items-center mb-2">
                    <div className="bg-green-600/40 p-2 rounded-lg mr-3">
                        <Settings className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Pengaturan</h1>
                </div>
                <p className="text-gray-600 max-w-3xl">
                    Kelola pengaturan aplikasi sesuai preferensi Anda
                </p>
            </div>

            <div className="flex flex-col justify-between items-center pt-5 gap-5">
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