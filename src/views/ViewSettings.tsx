import { Card } from "@/components/ui/card"
import { FormSelect } from "@/components/ui/form"
import { MonitorCog, Moon, Sun } from "lucide-react"
import { useState } from "react";

const ViewSettings = () => {
    const [activeButton, setActiveButton] = useState(0); // Untuk menyimpan tombol yang aktif
    
    const handleClick = (index:number) => {
      setActiveButton(index); // Mengubah state aktif berdasarkan tombol yang dipilih
    };

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