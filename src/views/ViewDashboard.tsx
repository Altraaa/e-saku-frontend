import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, Layers, School, UsersRound, XCircle } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";


// Data untuk grafik
const chartData = [
  { day: "Monday", violations: 20, achievments: 13 },
  { day: "Tuesday", violations: 30, achievments: 22 },
  { day: "Wednesday", violations: 25, achievments: 10 },
  { day: "Thursday", violations: 10, achievments: 7 },
  { day: "Friday", violations: 40, achievments: 20 },
];

const chartConfig = {
  violations: {
    label: "Violations",
    color: "#14532d", // Warna hijau untuk pelanggaran
  },
  achievments: {
    label: "Achievements",
    color: "#00BB1C", // Warna oranye untuk pemulihan
  },
} satisfies ChartConfig;

const ViewDashboard = () => {
  return (
    <>
      <div className="gap-6 grid grid-cols-2">
        {/* Statistik Kotak-Kotak */}
        <div className="grid grid-cols-2 gap-6">
          {/* Card Total Siswa Melanggar */}
          <Card className="bg-green-500 text-white shadow-lg rounded-lg flex flex-col items-start justify-center">
            <CardHeader className="w-full">
              <div className="w-full flex justify-between items-start">
                <UsersRound className="h-12 w-12" />
                <div className="bg-white text-green-500 px-2.5 py-1.5 rounded-full text-sm font-semibold flex items-center justify-start gap-1">
                  <ArrowUp className="h-5 w-5"/>
                  <p>10%</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">40</p>
              <CardTitle className="text-lg font-medium">
                Total Siswa Melanggar
              </CardTitle>
            </CardContent>
          </Card>

          {/* Card Kelas Pelanggar Terbanyak */}
          <Card className="bg-green-500 text-white shadow-lg rounded-lg flex flex-col items-start justify-center">
            <CardHeader>
              <School className="h-12 w-12" />
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">XII RPL 3</p>
              <CardTitle className="text-lg font-medium">
                Kelas Pelanggar Terbanyak
              </CardTitle>
            </CardContent>
          </Card>

          {/* Card Total Poin Pelanggaran */}
          <Card className="bg-green-500 text-white shadow-lg rounded-lg flex flex-col items-start justify-center">
            <CardHeader className="w-full">
              <div className="w-full flex justify-between items-start">
                <XCircle className="h-12 w-12" />
                <div className="bg-white text-red-500 px-2.5 py-1.5 rounded-full text-sm font-semibold flex items-center justify-start gap-1">
                  <ArrowDown className="h-5 w-5"/>
                  <p>10%</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">800</p>
              <CardTitle className="text-lg font-medium">
                Total Poin Pelanggaran
              </CardTitle>
            </CardContent>
          </Card>

          {/* Card Tingkat Pelanggar Terbanyak */}
          <Card className="bg-green-500 text-white shadow-lg rounded-lg flex flex-col items-start justify-center">
            <CardHeader>
              <Layers className="h-12 w-12" />
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">XII</p>
              <CardTitle className="text-lg font-medium">
                Tingkat Pelanggar Terbanyak
              </CardTitle>
            </CardContent>
          </Card>
        </div>

        {/* Grafik */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Grafik Aktivitas Siswa SMKN 1 Denpasar
              </CardTitle>
              <div className="flex justify-between items-center">
                <div className="flex items-center justify-center">
                  <select className="rounded border-2 border-gray-500 py-2 px-6 text-sm" name="" id="">
                    <option value="">Semua</option>
                    <option value="">Pelanggaran</option>
                    <option value="">Prestasi</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <p className="flex items-center py-2 px-3 text-xs rounded border-2 border-gray-500">Mingguan</p>
                  <p className="flex items-center py-2 px-3 text-xs rounded border-2 border-gray-500">Bulanan</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar
                    dataKey="violations"
                    fill={chartConfig.violations.color}
                    radius={4}
                  />
                  <Bar
                    dataKey="achievments"
                    fill={chartConfig.achievments.color}
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-row justify-center items-start gap-5 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                <span className=" py-1 px-1.5 bg-[#14532d]"></span>
                <p>Pelanggaran</p>
              </div>
              <div className="flex gap-2 font-medium leading-none">
                <span className="py-1 px-1.5 bg-[#00BB1C]"></span>
                <p>Prestasi</p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Daftar Siswa yang Melanggar */}
      <div className="grid grid-cols-[2fr_1fr] gap-6">
        <Card className="bg-white mt-8">
          <CardHeader>
            <CardTitle className="text-xl">Daftar Siswa yang Melanggar hari ini</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="text-center">No</TableCell>
                  <TableCell className="text-center">NIS</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell className="text-center">Class</TableCell>
                  <TableCell className="text-center">Violation Type</TableCell>
                  <TableCell className="text-center">Violation Point</TableCell>
                  <TableCell className="text-center">Total Point</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-center">1</TableCell>
                  <TableCell className="text-center">30688</TableCell>
                  <TableCell>I Made Gerrald Wahyu Darmawan</TableCell>
                  <TableCell className="text-center">XII RPL 3</TableCell>
                  <TableCell className="text-center">Rambut Panjang</TableCell>
                  <TableCell className="text-center">2</TableCell>
                  <TableCell className="text-center">14</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center">2</TableCell>
                  <TableCell className="text-center">30890</TableCell>
                  <TableCell>Putu Berliana Suardana Putri</TableCell>
                  <TableCell className="text-center">XII MM 1</TableCell>
                  <TableCell className="text-center">Mencuri hatiku</TableCell>
                  <TableCell className="text-center">10</TableCell>
                  <TableCell className="text-center">69</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* Leaderboard */}
        <Card className="bg-white mt-8">
          <CardHeader className="flex justify-center items-center text-xl rounded bg-[#00BB1C]">
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <ol className="space-y-10">
              <li className="text-base">#1 I Made Gerrald Wahyu Darmawan - 69</li>
              <li className="text-base">#2 Putu Berliana Suardana Putri - 50</li>
              <li className="text-base">#3 Cristiyan Mikha Adi Putra - 48</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ViewDashboard;
