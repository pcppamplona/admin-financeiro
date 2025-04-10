import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  GroupedChartData,
  groupTransactionsByMonth,
} from "@/utils/groupTransactionsByMonth";
import { useEffect, useState } from "react";
import { useByUserTransactionsData } from "@/hooks/transactions/useByUserTransactionsData";
import { useAuth } from "@/store/auth";

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

export function DashGraphArea() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<GroupedChartData[]>([]);

  useEffect(() => {
    async function fetchTransactions() {
      if (!user) {
        throw new Error("Usuário não autenticado.");
      }

      try {
        const transactionsData = await useByUserTransactionsData(user.id);

        const groupedData: GroupedChartData[] =
          groupTransactionsByMonth(transactionsData);

        setChartData(groupedData);
      } catch (error) {
        console.error("Erro ao buscar transações", error);
      }
    }

    fetchTransactions();
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Área de Receita vs Despesa</CardTitle>
        <CardDescription>Visualização das transações</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -20,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={11}
              domain={[0, 10000]}
              ticks={Array.from({ length: 11 }, (_, i) => i * 1000)} 
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="income"
              type="natural"
              fill={chartConfig.income.color}
              fillOpacity={0.4}
              stroke={chartConfig.income.color}
              stackId="a"
            />
            <Area
              dataKey="expense"
              type="natural"
              fill={chartConfig.expense.color}
              fillOpacity={0.4}
              stroke={chartConfig.expense.color}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Tendência de alta de 5,2% neste mês{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Meses de 2025 até agora
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
