import { Card } from "@/components/ui/card"
import { FormSelect } from "@/components/ui/form"
import { MonitorCog, Moon, Sun } from "lucide-react"

const ViewSettings = () => {
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
                        <button className="flex items-center justify-center py-4 px-4 gap-2 bg-[#00BB1C] bg-opacity-25 rounded-sm text-[#00BB1C] font-semibold">
                            <MonitorCog/>
                            <p>Default Sistem</p>
                        </button>
                        <button className="flex items-center justify-center py-4 px-4 gap-2 text-gray-600 hover:text-[#00BB1C]">
                            <Sun/>
                            <p>Terang</p>
                        </button>
                        <button className="flex items-center justify-center py-4 px-4 gap-2 text-gray-600 hover:text-[#00BB1C]">
                            <Moon/>
                            <p>Gelap</p>
                        </button>
                    </div>
                </Card>
            </div>
            <div className="flex justify-end px-2 pt-5">
                <button className="bg-[#00BB1C] text-white font-semibold px-8 py-2 rounded-sm hover:bg-opacity-75">
                    Save
                </button>
            </div>
        </div>
    )
}

export default ViewSettings