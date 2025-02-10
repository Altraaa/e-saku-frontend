import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import MainLayout from "@/components/layouts/MainLayout";
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
import { MessageCircleWarning, School, TrendingUp } from "lucide-react";
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
    <MainLayout>
      <div className="gap-6 grid grid-cols-2">
        {/* Statistik Kotak-Kotak */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-green-100 border-2 border-green-500 shadow-md rounded-lg py-2">
            <CardHeader className="flex items-center gap-4">
              <div className="bg-green-500 p-3 rounded-full text-white">
                <TrendingUp className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg text-center font-semibold">
                Total Students Violated
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-gray-800">40</p>
            </CardContent>
            <CardFooter className="text-red-600 flex justify-center items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-lg font-medium">10% Trending Up</span>
            </CardFooter>
          </Card>

          <Card className="bg-green-100 border-2 border-green-500 shadow-md rounded-lg py-2">
            <CardHeader className="flex items-center gap-4">
              <div className="bg-green-500 p-3 rounded-full text-white">
                <School className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-center font-semibold">
                Most Violator Class
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-gray-800">XII RPL 3</p>
            </CardContent>
          </Card>

          <Card className="bg-green-100 border-2 border-green-500 shadow-md rounded-lg py-2">
            <CardHeader className="flex items-center gap-4">
              <div className="bg-green-500 p-3 rounded-full text-white">
                <MessageCircleWarning className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-center font-semibold">
                Total Violation Points
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-gray-800">800</p>
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
    </MainLayout>
  );
};

export default ViewDashboard;
