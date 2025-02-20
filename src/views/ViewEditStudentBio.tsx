import { MoveLeft, SaveAll } from "lucide-react";
import { Form, FormInput, FormButton } from "@/components/ui/form";

const ViewEditStudentBio = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logika untuk login di sini
    };
    return (
        <>
            <div className="m-1">
                <a href="/class?">
                    <div className="flex gap-2">
                        <MoveLeft />
                        <h1>Back</h1>
                    </div>
                </a>
                <Form onSubmit={handleSubmit}>
                    <div className="w-full flex  px-8 mt-8">
                        <div className="w-[25%] max-w-[25%] ">
                            <div className="text-3xl font-bold mb-5">
                                Biodata Siswa
                            </div>
                            <div className="flex flex-col gap-3 justify-center items-center">
                                <div className="aspect-[3/4] w-full bg-gray-300 "></div>
                                <div className="w-full">
                                    <button className="w-full bg-blue-600 p-3 font-semibold text-white rounded-md hover:bg-blue-500 transition-all duration-200">Update Profile Picture</button>
                                </div>
                                {/* <div className="w-full flex text-center">
                                <a
                                    href="/studentbio/accomplishments?nis"
                                    className="w-full bg-green-600 p-3 font-semibold text-white rounded-md hover:bg-green-500 transition-all duration-200"
                                >
                                    Student Accomplishments
                                </a>
                            </div>
                            <div className="w-full flex text-center">
                                <a
                                    href="/studentbio/violations?nis"
                                    className="w-full bg-red-600 p-3 font-semibold text-white rounded-md hover:bg-red-500 transition-all duration-200"
                                >
                                    Student Violations
                                </a>
                            </div> */}
                            </div>
                        </div>
                        <div className="w-[75%] max-w-[75%] pl-10">
                            <div className="flex justify-end gap-3">
                                <div className="w-32 flex">
                                    <FormButton>
                                        Save <SaveAll className="w-7" />
                                    </FormButton>
                                </div>
                            </div>
                            <div className="shadow-md border p-8 mt-5 flex flex-col gap-4 max-h-full overflow-y-auto">
                                <h1 className="text-3xl font-bold mb-1">
                                    Personal Information
                                </h1>
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

                                <div className="h-[1px] bg-black w-full my-1"></div>

                                <h1 className="text-3xl font-bold mb-1">
                                    Student's Parents
                                </h1>
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

                                <div className="h-[1px] bg-black w-full my-1"></div>

                                <h1 className="text-3xl font-bold mb-1">
                                    Student's Guradian
                                </h1>
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
                        </div>
                    </div>
                </Form>
            </div>
        </>
    );
};

export default ViewEditStudentBio;
