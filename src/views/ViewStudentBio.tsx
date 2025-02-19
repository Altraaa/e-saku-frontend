import { MoveLeft, SaveAll } from "lucide-react";

const ViewStudentBio = () => {
    return (
        <>
            <div className="m-1">
                <a href="/class?">
                    <div className="flex gap-2">
                        <MoveLeft />
                        <h1>Back</h1>
                    </div>
                </a>
                <div className="w-full flex  px-8 mt-8">
                    <div className="w-[25%] max-w-[25%] ">
                        <div className="text-3xl font-bold mb-5">
                            Biodata Siswa
                        </div>
                        <div className="flex flex-col gap-3 justify-center items-center">
                            <div className="aspect-[3/4] w-full bg-gray-300 "></div>
                            <div className="w-full flex text-center">
                                <a
                                    href="/studentbio/accomplishments?nis"
                                    className="w-full bg-green-500 p-3 font-semibold text-white rounded-md hover:bg-green-600 transition-all duration-200"
                                >
                                    Student Accomplishments
                                </a>
                            </div>
                            <div className="w-full flex text-center">
                                <a
                                    href="/studentbio/violations/nis"
                                    className="w-full bg-red-500 p-3 font-semibold text-white rounded-md hover:bg-red-600 transition-all duration-200"
                                >
                                    Student Violations
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="w-[75%] max-w-[75%] pl-10">
                        <form action="">
                            <div className="flex justify-end gap-3">
                                <div className="flex gap-3 px-4 py-2 bg-green-500 w-fit rounded-md text-white">
                                    <button className="text-lg font-semibold">
                                        Save
                                    </button>
                                    <SaveAll className="w-7" />
                                </div>
                            </div>

                            <div className="shadow-md border p-8 mt-5 flex flex-col gap-2 max-h-full overflow-y-auto">
                                <h1 className="text-3xl font-bold mb-1">
                                    Personal Information
                                </h1>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="studentname">
                                        Student Name
                                        <span className="text-lg text-red-500 font-semibold">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        id="studentname"
                                        className="w-full p-3 px-5 rounded-md border border-gray-300"
                                    />
                                </div>
                                <div className="flex gap-12">
                                    <div className="flex flex-col gap-1 w-1/2">
                                        <label htmlFor="nisn">
                                            NISN
                                            <span className="text-lg text-red-500 font-semibold">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="nisn"
                                            className="w-full p-3 px-5 rounded-md border border-gray-300"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1 w-1/2">
                                        <label htmlFor="nis">
                                            NIS
                                            <span className="text-lg text-red-500 font-semibold">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="nis"
                                            className="w-full p-3 px-5 rounded-md border border-gray-300"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="placedatebirth">
                                        Place, Date of Birth
                                        <span className="text-lg text-red-500 font-semibold">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        id="placedatebirth"
                                        className="w-full p-3 px-5 rounded-md border border-gray-300"
                                    />
                                </div>
                                <div className="flex gap-12">
                                    <div className="flex flex-col gap-1 w-1/2">
                                        <label htmlFor="gender">
                                            Gender
                                            <span className="text-lg text-red-500 font-semibold">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="gender"
                                            className="w-full p-3 px-5 rounded-md border border-gray-300"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1 w-1/2">
                                        <label htmlFor="religion">
                                            Religion
                                            <span className="text-lg text-red-500 font-semibold">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="religion"
                                            className="w-full p-3 px-5 rounded-md border border-gray-300"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="address">
                                        Address
                                        <span className="text-lg text-red-500 font-semibold">
                                            *
                                        </span>
                                    </label>
                                    <textarea
                                        id="address"
                                        className="w-full h-20 p-3 px-5 rounded-md border border-gray-300"
                                    ></textarea>
                                </div>
                                <div className="flex gap-12">
                                    <div className="flex flex-col gap-1 w-1/3">
                                        <label htmlFor="childnumber">
                                            Child Number
                                            <span className="text-lg text-red-500 font-semibold">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="childnumber"
                                            className="w-full p-3 px-5 rounded-md border border-gray-300"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1 w-2/3">
                                        <label htmlFor="studentphonenumber">
                                            Student Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            id="studentphonenumber"
                                            className="w-full p-3 px-5 rounded-md border border-gray-300"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 ">
                                    <h2 className="text-lg font-medium">
                                        Accepted at this School
                                    </h2>
                                    <div className="flex gap-12 ml-7">
                                        <div className="flex flex-col gap-1 w-1/2">
                                            <label htmlFor="atclass">
                                                At Class
                                                <span className="text-lg text-red-500 font-semibold">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                id="atclass"
                                                className="w-full p-3 px-5 rounded-md border border-gray-300"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1 w-1/2">
                                            <label htmlFor="date">
                                                Date
                                                <span className="text-lg text-red-500 font-semibold">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                id="date"
                                                className="w-full p-3 px-5 rounded-md border border-gray-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-12">
                                    <div className="flex flex-col gap-1 w-1/2">
                                        <label htmlFor="childnumber">
                                            Height (cm)
                                        </label>
                                        <input
                                            type="text"
                                            id="childnumber"
                                            className="w-full p-3 px-5 rounded-md border border-gray-300"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1 w-1/2">
                                        <label htmlFor="studentphonenumber">
                                            Weight (kg)
                                        </label>
                                        <input
                                            type="text"
                                            id="studentphonenumber"
                                            className="w-full p-3 px-5 rounded-md border border-gray-300"
                                        />
                                    </div>
                                </div>

                                <div className="h-[1px] bg-black w-full my-1"></div>

                                <h1 className="text-3xl font-bold mb-1">
                                    Student's Parents
                                </h1>
                                <div className="flex flex-col gap-1 ">
                                    <h2 className="text-lg font-medium">
                                        Parents Name
                                    </h2>
                                    <div className="flex flex-col gap-1 ml-7">
                                        <div className="flex flex-col gap-1 w-full">
                                            <label htmlFor="fathername">
                                                Father Name
                                                <span className="text-lg text-red-500 font-semibold">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                id="fathername"
                                                className="w-full p-3 px-5 rounded-md border border-gray-300"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1 w-full">
                                            <label htmlFor="mothername">
                                                Mother Name
                                                <span className="text-lg text-red-500 font-semibold">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                id="mothername"
                                                className="w-full p-3 px-5 rounded-md border border-gray-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="parentsaddress">
                                        Parents Address
                                        <span className="text-lg text-red-500 font-semibold">
                                            *
                                        </span>
                                    </label>
                                    <textarea
                                        id="parentsaddress"
                                        className="w-full h-20 p-3 px-5 rounded-md border border-gray-300"
                                    ></textarea>
                                </div>
                                <div className="flex flex-col gap-1 w-full">
                                    <label htmlFor="parentphonenumber">
                                        Parent Phone Number
                                        <span className="text-lg text-red-500 font-semibold">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        id="parentphonenumber"
                                        className="w-full p-3 px-5 rounded-md border border-gray-300"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 ">
                                    <h2 className="text-lg font-medium">
                                        Parents Occupation
                                    </h2>
                                    <div className="flex flex-col gap-1 ml-7">
                                        <div className="flex flex-col gap-1 w-full">
                                            <label htmlFor="fatherocc">
                                                Father
                                                <span className="text-lg text-red-500 font-semibold">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                id="fatherocc"
                                                className="w-full p-3 px-5 rounded-md border border-gray-300"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1 w-full">
                                            <label htmlFor="motherocc">
                                                Mother
                                                <span className="text-lg text-red-500 font-semibold">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                id="motherocc"
                                                className="w-full p-3 px-5 rounded-md border border-gray-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[1px] bg-black w-full my-1"></div>

                                <h1 className="text-3xl font-bold mb-1">
                                    Student's Guradian
                                </h1>
                                <div className="flex flex-col gap-1 w-full">
                                    <label htmlFor="namestudentguardian">
                                        Name of Student Guardian
                                    </label>
                                    <input
                                        type="text"
                                        id="namestudentguardian"
                                        className="w-full p-3 px-5 rounded-md border border-gray-300"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 w-full">
                                    <label htmlFor="phonenumberstudentguardian">
                                        Phone Number of Student Guardian
                                    </label>
                                    <input
                                        type="text"
                                        id="phonenumberstudentguardian"
                                        className="w-full p-3 px-5 rounded-md border border-gray-300"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewStudentBio;
