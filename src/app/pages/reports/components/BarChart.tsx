import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GroupedChartData } from "@/utils/groupTransactionsByMonth";

const chartConfig = {
  income: {
    label: "Receitas",
    color: "#05df72",
  },
  expense: {
    label: "Despesas",
    color: "#fb2c36",
  },
} satisfies ChartConfig;

export default function BarChart({ chartData }: GroupedChartData[]) {
  return (
    <Card className="flex-1 min-w-0 h-full flex flex-col">
      <CardHeader>
        <CardDescription>Visualização das transações</CardDescription>
        <CardTitle className="text-2xl font-bold tabular-nums @[650px]/card:text-2xl text-gray-600">
          Mês a mês
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-2">
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} width={undefined} height={undefined}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={2}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />

            <Bar
              dataKey="income"
              fill="var(--color-income)"
              radius={4}
              barSize={40}
            />

            <Bar
              dataKey="expense"
              fill="var(--color-expense)"
              radius={4}
              barSize={40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
