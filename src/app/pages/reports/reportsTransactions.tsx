import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Transaction } from "@/interfaces/transaction";
import { useAuth } from "@/store/auth";
import { useByUserTransactionsData } from "@/hooks/transactions/useByUserTransactionsData";
import {
  IconChevronsDown,
  IconChevronsUp,
  IconFilter,
} from "@tabler/icons-react";
import {Bar, BarChart, CartesianGrid, Line, XAxis, YAxis, LineChart  } from "recharts";

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
import { TrendingUp } from "lucide-react";

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

export default function ReportsTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Filtro das transactions
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [filterOn, setFilterOn] = useState(false);

  //Aqui é o stated dos graph
  const [chartData, setChartData] = useState<GroupedChartData[]>([]);

  useEffect(() => {
    async function fetchTransactions() {
      if (!user) {
        throw new Error("Usuário não autenticado.");
      }

      try {
        const transactionsData = await useByUserTransactionsData(user.id);
        setTransactions(transactionsData);
        setFilteredTransactions(transactionsData);

        const groupedData: GroupedChartData[] =
          groupTransactionsByMonth(transactionsData);
        setChartData(groupedData);
      } catch (error) {
        console.error("Erro ao buscar transações", error);
      }
    }

    fetchTransactions();
  }, [user]);

  // controle do estado dos filtrso sobtre o transactions
  useEffect(() => {
    let filtered = transactions;

    if (typeFilter && typeFilter !== "all") {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter((t) => {
        const d = new Date(t.date);
        return d >= new Date(dateRange.start) && d <= new Date(dateRange.end);
      });
    }
    setFilteredTransactions(filtered);
  }, [typeFilter, dateRange, transactions]);

  const total = filteredTransactions.reduce(
    (acc, t) => acc + t.amount * (t.type === "expense" ? -1 : 1),
    0
  );

  return (
    <div className="w-full gap-2 px-4 lg:px-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold tabular-nums @[650px]/card:text-2xl text-gray-600 flex flex-row items-center justify-between">
            Items dos relátorio de transações
            <button
              className="flex items-center px-6 py-4 text-sm bg-blue-500 text-white rounded-lg"
              onClick={() => setFilterOn(!filterOn)}
            >
              <IconFilter size={16} className="mr-2" />
              Filtros
            </button>
          </CardTitle>
        </CardHeader>
        {filterOn && (
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="mb-2">Tipo</Label>
                <Select onValueChange={setTypeFilter} value={typeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2">Data Início</Label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label className="mb-2">Data Fim</Label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setTypeFilter("");
                    setDateRange({ start: "", end: "" });
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="flex flex-row items-start justify-between gap-4 h-[600px]">
        <Card className="flex-1 w-[30%] h-full flex flex-col">
          <CardHeader>
            <CardDescription>Transações Filtradas</CardDescription>
            <CardTitle className="text-2xl font-bold tabular-nums @[650px]/card:text-2xl text-gray-600">
              <span className="text-sm font-medium">Total</span>
              <span> R${total.toFixed(2)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {filteredTransactions.map((t) => (
                <div key={t.id} className="flex justify-between border-b py-2">
                  <span className="text-gray-500">
                    {new Date(t.date).toLocaleDateString()} -{" "}
                    <span className="font-semibold text-black">
                      {t.description}
                    </span>
                  </span>
                  <span
                    className={`flex items-center gap-1 font-medium ${
                      t.type === "expense" ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    R$ {t.amount.toFixed(2)}
                    {t.type === "expense" ? (
                      <IconChevronsDown size={16} />
                    ) : (
                      <IconChevronsUp size={16} />
                    )}
                  </span>
                </div>
              ))}
              {filteredTransactions.length === 0 && (
                <p className="text-gray-500">Nenhuma transação encontrada.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-0 h-full flex flex-col">
          <CardHeader>
            <CardDescription>Visualização das transações</CardDescription>
            <CardTitle className="text-2xl font-bold tabular-nums @[650px]/card:text-2xl text-gray-600">
              Mês a mês
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4">
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receita vs Despesa</CardTitle>
          <CardDescription>Comparativo - Últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              data={chartData} width={undefined} height={undefined}
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
                tickFormatter={(value) => `R$${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="income"
                type="linear"
                stroke="var(--color-income)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="expense"
                type="linear"
                stroke="var(--color-expense)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Receita/Despesa mensal <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Mostrando comparativo dos últimos 6 meses
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
