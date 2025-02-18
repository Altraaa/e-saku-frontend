import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ViewStudent = () => {
  return (
    <>
      <div className="flex flex-col items-start gap-2 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <h1 className="text-3xl font-bold text-green-500">Elisabet Ni Nyoman Rusmiati, S.Pd</h1>
          <p className="text-xl ">Kelas yang diampu :</p>
        </div>
        <div className="flex gap-4 items-center p-3 bg-white rounded-md">
          <label htmlFor="searchName"><Search className="size-6" /></label>
          <input type="text" id="searchName" placeholder="Search by students name" className="w-72 text-sm outline-none placeholder:text-xs"/>
        </div>
      </div>

      <div className="my-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 px-20 mt-10">
        <a href="/class?xtkp1" className="group">
          <Card className="bg-white shadow-md w-72 2xl:w-96 py-24 flex flex-col items-center group-hover:shadow-green-500 transition-all duration-200">
            <CardHeader className="w-40 h-40 rounded-full bg-gray-400" />
            <CardTitle className="mt-8 text-3xl font-semibold">
              <a href="/class?xtkp1" className="group-hover:text-green-500 transition-all duration-200">X TKP 1</a> 
            </CardTitle>
            <CardContent className="text-gray-400 text-lg">31 siswa</CardContent>
          </Card>
        </a>
        
        <a href="/class?xtkp2" className="group">
          <Card className="bg-white shadow-md w-72 2xl:w-96 py-24 flex flex-col items-center group-hover:shadow-green-500 transition-all duration-200">
            <CardHeader className="w-40 h-40 rounded-full bg-gray-400" />
            <CardTitle className="mt-8 text-3xl font-semibold">
              <a href="/class?xtkp2" className="group-hover:text-green-500 transition-all duration-200">X TKP 2</a>
            </CardTitle>
            <CardContent className="text-gray-400 text-lg">31 siswa</CardContent>
          </Card>
        </a>

        <a href="/class?xirpl1" className="group">
          <Card className="bg-white shadow-md w-72 2xl:w-96 py-24 flex flex-col items-center group-hover:shadow-green-500 transition-all duration-200">
            <CardHeader className="w-40 h-40 rounded-full bg-gray-400" />
            <CardTitle className="mt-8 text-3xl font-semibold">
              <a href="/class?xirpl1" className="group-hover:text-green-500 transition-all duration-200">XI RPL 1</a>
            </CardTitle>
            <CardContent className="text-gray-400 text-lg">35 siswa</CardContent>
          </Card>
        </a>

        <a href="/class?xirpl2" className="group">
          <Card className="bg-white shadow-md w-72 2xl:w-96 py-24 flex flex-col items-center group-hover:shadow-green-500 transition-all duration-200">
            <CardHeader className="w-40 h-40 rounded-full bg-gray-400" />
            <CardTitle className="mt-8 text-3xl font-semibold">
              <a href="/class?xirpl2" className="group-hover:text-green-500 transition-all duration-200">XI RPL 2</a>
            </CardTitle>
            <CardContent className="text-gray-400 text-lg">35 siswa</CardContent>
          </Card>
        </a>

        <a href="/class?xirpl3" className="group">
          <Card className="bg-white shadow-md w-72 2xl:w-96 py-24 flex flex-col items-center group-hover:shadow-green-500 transition-all duration-200">
            <CardHeader className="w-40 h-40 rounded-full bg-gray-400" />
            <CardTitle className="mt-8 text-3xl font-semibold">
              <a href="/class?xirpl3" className="group-hover:text-green-500 transition-all duration-200">XI RPL 3</a>
            </CardTitle>
            <CardContent className="text-gray-400 text-lg">36 siswa</CardContent>
          </Card>
        </a>

        <a href="/class?xitkp1" className="group">
          <Card className="bg-white shadow-md w-72 2xl:w-96 py-24 flex flex-col items-center group-hover:shadow-green-500 transition-all duration-200">
            <CardHeader className="w-40 h-40 rounded-full bg-gray-400" />
            <CardTitle className="mt-8 text-3xl font-semibold">
              <a href="/class?xitkp1" className="group-hover:text-green-500 transition-all duration-200">XI TKP 1</a>
            </CardTitle>
            <CardContent className="text-gray-400 text-lg">26 siswa</CardContent>
          </Card>
        </a>

        <a href="/class?xitkp2" className="group">
          <Card className="bg-white shadow-md w-72 2xl:w-96 py-24 flex flex-col items-center group-hover:shadow-green-500 transition-all duration-200">
            <CardHeader className="w-40 h-40 rounded-full bg-gray-400" />
            <CardTitle className="mt-8 text-3xl font-semibold">
              <a href="/class?xitkp2" className="group-hover:text-green-500 transition-all duration-200">XI TKP 2</a>
            </CardTitle>
            <CardContent className="text-gray-400 text-lg">27 siswa</CardContent>
          </Card>
        </a>

        <a href="/class?xiibkp1" className="group">
          <Card className="bg-white shadow-md w-72 2xl:w-96 py-24 flex flex-col items-center group-hover:shadow-green-500 transition-all duration-200">
            <CardHeader className="w-40 h-40 rounded-full bg-gray-400" />
            <CardTitle className="mt-8 text-3xl font-semibold">
              <a href="/class?xiibkp1" className="group-hover:text-green-500 transition-all duration-200">XII BKP 1</a>
            </CardTitle>
            <CardContent className="text-gray-400 text-lg">33 siswa</CardContent>
          </Card>
        </a>

        <a href="/class?xiibkp2" className="group">
          <Card className="bg-white shadow-md w-72 2xl:w-96 py-24 flex flex-col items-center group-hover:shadow-green-500 transition-all duration-200">
            <CardHeader className="w-40 h-40 rounded-full bg-gray-400" />
            <CardTitle className="mt-8 text-3xl font-semibold">
              <a href="/class?xiibkp2" className="group-hover:text-green-500 transition-all duration-200">XII BKP 2</a>
            </CardTitle>
            <CardContent className="text-gray-400 text-lg">31 siswa</CardContent>
          </Card>
        </a>

        <a href="/class?xiirpl3" className="group">
          <Card className="bg-white shadow-md w-72 2xl:w-96 py-24 flex flex-col items-center group-hover:shadow-green-500 transition-all duration-200">
            <CardHeader className="w-40 h-40 rounded-full bg-gray-400" />
            <CardTitle className="mt-8 text-3xl font-semibold">
              <a href="/class?xiirpl3" className="group-hover:text-green-500 transition-all duration-200">XII RPL 3</a>
            </CardTitle>
            <CardContent className="text-gray-400 text-lg">38 siswa</CardContent>
          </Card>
        </a>
      </div>
      
    </>
  );
};

export default ViewStudent;
