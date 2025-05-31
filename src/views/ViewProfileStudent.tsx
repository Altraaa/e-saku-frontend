import { Form, FormInput } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, User, Users } from "lucide-react";
import { useState, useEffect } from "react";

const ViewProfileStudent = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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

    return (
        <>
            <div className="m-1">
                <div className="w-full flex px-8 mt-8 gap-10 items-start">
                    <div className="w-[25%] max-w-[25%] ">
                        <div className="text-4xl font-bold mb-6">
                            Biodata Siswa
                        </div>
                        <div className="flex flex-col gap-3 justify-center items-center">
                            <div className="flex w-full flex-col gap-3">
                                <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
                                    <CardHeader className="bg-white flex justify-center items-center py-4 border-b-2 border-green-400 pb-2">
                                        <CardTitle className="text-center text-xl font-bold text-black">Profil Siswa</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 sm:p-6 flex flex-col items-center">
                                    <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gray-200 flex items-center justify-center mb-4 sm:mb-6 border-4 border-green-100 overflow-hidden">
                                        {photoUrl ? (
                                        <img 
                                            src={photoUrl} 
                                            alt="Teacher profile" 
                                            className="w-full h-full object-cover"
                                        />
                                        ) : (
                                        <User className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-400" strokeWidth={1} />
                                        )}
                                    </div>
                                    <Form onSubmit={handleSubmit}>
                                            <div className="mt-5 flex flex-col gap-4">
                                                <div className="text-2xl font-bold mb-1">
                                                    Account Infomation
                                                </div>
                                                <FormInput
                                                    id="email"
                                                    label="Email"
                                                    type="email"
                                                    placeholder=""
                                                />
                                                <FormInput
                                                    id="username"
                                                    label="Username"
                                                    type="text"
                                                    placeholder=""
                                                />

                                                <div className="flex ml-2 items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                                                    <div>
                                                        <h1 className="text-xs">
                                                            Last update at 01
                                                            February 2024
                                                        </h1>
                                                    </div>
                                                </div>
                                            </div>
                                    <div className="w-full">
                                        <button type="submit" className="w-full text-sm bg-blue-600 p-2 font-semibold text-white rounded-md hover:bg-blue-500 transition-all duration-200">
                                            Update Account Information
                                        </button>
                                    </div>
                                </Form>
                                    </CardContent>
                                </Card>
                                
                            </div>
                        </div>
                    </div>
                    <div className="w-[75%] max-w-[75%]">
                        <Form onSubmit={handleSubmit}>
                            <div className="flex justify-end gap-6">
                                <div className="">
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 p-2 px-4 font-semibold text-white rounded-md hover:bg-blue-500 transition-all duration-200"
                                    >
                                        Update Personal Information
                                    </button>
                                </div>
                            </div>
                            <Card>
                                <CardContent>
                                    <div className="py-4 flex flex-col gap-4 max-h-full overflow-y-auto">
                                        <div className="flex justify-start items-center gap-3 border-b-2 border-green-400 pb-2">
                                            <User/>
                                            <h1 className="text-xl font-bold">Personal Information</h1>
                                        </div>
                                        <FormInput
                                            id="studentname"
                                            label="Student Name"
                                            type="text"
                                            placeholder=""
                                        />
                                        <div className="flex gap-12">
                                            <div className="flex flex-col gap-1 w-1/2">
                                                <FormInput
                                                    id="nisn"
                                                    label="NISN"
                                                    type="text"
                                                    placeholder=""
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1 w-1/2">
                                                <FormInput
                                                    id="nis"
                                                    label="NIS"
                                                    type="text"
                                                    placeholder=""
                                                />
                                            </div>
                                        </div>
                                        <FormInput
                                            id="placedatebirth"
                                            label="Place, Date of Birth"
                                            type="text"
                                            placeholder=""
                                        />
                                        <div className="flex gap-12">
                                            <div className="flex flex-col gap-1 w-1/2">
                                                <FormInput
                                                    id="gender"
                                                    label="Gender"
                                                    type="text"
                                                    placeholder=""
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1 w-1/2">
                                                <FormInput
                                                    id="religion"
                                                    label="Religion"
                                                    type="text"
                                                    placeholder=""
                                                />
                                            </div>
                                        </div>
                                        <FormInput
                                            id="address"
                                            label="Address"
                                            type="text"
                                            placeholder=""
                                        />
                                        <div className="flex gap-12">
                                            <div className="flex flex-col gap-1 w-1/3">
                                                <FormInput
                                                    id="childnumber"
                                                    label="Child Number"
                                                    type="text"
                                                    placeholder=""
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1 w-2/3">
                                                <FormInput
                                                    id="studentphonenumber"
                                                    label="Student Phone Number"
                                                    type="text"
                                                    placeholder=""
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <h2 className="text-lg font-medium">
                                                Accepted at this School
                                            </h2>
                                            <div className="flex gap-12 ml-7">
                                                <div className="flex flex-col gap-1 w-1/2">
                                                    <FormInput
                                                        id="childnumber"
                                                        label="Child Number"
                                                        type="text"
                                                        placeholder=""
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1 w-1/2">
                                                    <FormInput
                                                        id="studentphonenumber"
                                                        label="Student Phone Number"
                                                        type="text"
                                                        placeholder=""
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-12">
                                            <div className="flex flex-col gap-1 w-1/2">
                                                <FormInput
                                                    id="height"
                                                    label="Height (cm)"
                                                    type="text"
                                                    placeholder=""
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1 w-1/2">
                                                <FormInput
                                                    id="weight"
                                                    label="Weight (kg)"
                                                    type="text"
                                                    placeholder=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent>
                                    <div className="py-4 flex flex-col gap-4 max-h-full overflow-y-auto">
                                        <div className="flex justify-start items-center gap-3 border-b-2 border-green-500 pb-2">
                                            <Users/>
                                            <h1 className="text-xl font-bold">Student's Parent</h1>
                                        </div>
                                        <div className="flex flex-col gap-3 ">
                                            <h2 className="text-lg font-medium">
                                                Parents Name
                                            </h2>
                                            <div className="flex flex-col gap-3 ml-7">
                                                <FormInput
                                                    id="fathername"
                                                    label="Father Name"
                                                    type="text"
                                                    placeholder=""
                                                />
                                                <FormInput
                                                    id="mothername"
                                                    label="Mother Name"
                                                    type="text"
                                                    placeholder=""
                                                />
                                            </div>
                                        </div>
                                        <FormInput
                                            id="address"
                                            label="Address"
                                            type="text"
                                            placeholder=""
                                        />
                                        <FormInput
                                            id="parentphonenumber"
                                            label="Parent Phone Number"
                                            type="text"
                                            placeholder=""
                                        />
                                        <div className="flex flex-col gap-3 ">
                                            <h2 className="text-lg font-medium">
                                                Parents Occupation
                                            </h2>
                                            <div className="flex flex-col gap-3 ml-7">
                                                <FormInput
                                                    id="fatherocc"
                                                    label="Father"
                                                    type="text"
                                                    placeholder=""
                                                />
                                                <FormInput
                                                    id="motherocc"
                                                    label="Mother"
                                                    type="text"
                                                    placeholder=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                            <CardContent>
                                    <div className="py-4 flex flex-col gap-4 max-h-full overflow-y-auto">
                                        <div className="flex justify-start items-center gap-3 border-b-2 border-green-500 pb-2">
                                            <ShieldCheck/>
                                            <h1 className="text-xl font-bold">Student's Guardian</h1>
                                        </div>
                                        <FormInput
                                            id="namestudentguardian"
                                            label="Name of Student Guardian"
                                            type="text"
                                            placeholder=""
                                        />
                                        <FormInput
                                            id="phonenumberstudentguardian"
                                            label="Phone Number of Student Guardian"
                                            type="text"
                                            placeholder=""
                                        />
                                    </div>
                                </CardContent>  
                            </Card>   
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewProfileStudent;