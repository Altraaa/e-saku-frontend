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
import { Layers, School, TrendingUp, UsersRound, XCircle } from "lucide-react";
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
    color: "#16a34a", // Warna oranye untuk pemulihan
  },
} satisfies ChartConfig;

const ViewDashboard = () => {
  return (
    <>
      <div className="gap-6 grid grid-cols-2">
        {/* Statistik Kotak-Kotak */}
        <div className="grid grid-cols-2 gap-6">
          {/* Card Total Siswa Melanggar */}
          <Card className="bg-green-500 text-white shadow-lg rounded-lg p-4">
            <CardHeader>
              <div className="w-full flex justify-between">
                <UsersRound className="h-8 w-8" />
                <div className="bg-white text-green-500 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  ↑ 10%
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
          <Card className="bg-green-500 text-white shadow-lg rounded-lg p-4">
            <CardHeader>
              <School className="h-8 w-8" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">XII RPL 3</p>
              <CardTitle className="text-lg font-medium">
                Kelas Pelanggar Terbanyak
              </CardTitle>
            </CardContent>
          </Card>

          {/* Card Total Poin Pelanggaran */}
          <Card className="bg-green-500 text-white shadow-lg rounded-lg p-4">
            <CardHeader>
              <div className="flex justify-between ">
                <XCircle className="h-8 w-8" />
                <div className="bg-white text-red-500 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  ↓ 5%
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
          <Card className="bg-green-500 text-white shadow-lg rounded-lg p-4">
            <CardHeader>
              <Layers className="h-8 w-8" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">XII</p>
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
                Weekly diagram - Multiple
              </CardTitle>
              <p className="text-lg text-gray-500">Monday - Friday</p>
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
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Trending up by 5.2% this day <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total achievements and violations for the last week
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Daftar Siswa yang Melanggar */}
      <div className="grid grid-cols-[2fr_1fr] gap-6">
        <Card className="bg-white mt-8">
          <CardHeader>
            <CardTitle>List of offending students</CardTitle>
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
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              <li>#1 I Made Gerrald Wahyu Darmawan - 69</li>
              <li>#2 Putu Berliana Suardana Putri - 50</li>
              <li>#3 Cristiyan Mikha Adi Putra - 48</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ViewDashboard;
