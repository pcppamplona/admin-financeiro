import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useByUserTransactionsData } from "@/hooks/transactions/useByUserTransactionsData";
import { Transaction } from "@/interfaces/transaction";
import { useAuth } from "@/store/auth";
import { formattedBrAmount } from "@/utils/balance";
import {
  IconChevronsDown,
  IconChevronsUp,
  IconHeartRateMonitor,
  IconMoneybag,
} from "@tabler/icons-react";
import { TrendingUpIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function SectionCards() {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    async function fetchTransactions() {
      if (!user) {
        throw new Error("Usuário não autenticado.");
      }

      try {
        const transactionsData = await useByUserTransactionsData(user.id);
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Erro ao buscar transações", error);
      }
    }

    fetchTransactions();
  }, [user]);

  const total = transactions.reduce(
    (acc, t) => acc + t.amount * (t.type === "expense" ? -1 : 1),
    0
  );

  const totalIncomes = transactions.reduce((sum, tr) => {
    return tr.type === "income" ? sum + tr.amount : sum;
  }, 0);

  const totalExpenses = transactions.reduce((sum, tr) => {
    return tr.type === "expense" ? sum + tr.amount : sum;
  }, 0);


  // só pra simular um ""simulador de saúde financeira""
  function getFinancialHealthLevel(score: number) {
    if (score >= 70) return { label: "Excelente", color: "#00c950" };
    if (score >= 40) return { label: "Boa", color: "#236ed1" };
    if (score >= 10) return { label: "Atenção", color: "#ff8c00" };
    return { label: "Crítica", color: "#d34d4d" };
  }

  const healthScore =
    totalIncomes === 0
      ? 0
      : ((totalIncomes - totalExpenses) / totalIncomes) * 100;

  const health = getFinancialHealthLevel(healthScore);
  return (
    <div className="*:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Total de Receitas</CardDescription>
          <CardTitle className="flex flex-row items-center">
            <span className="lg:text-xl xl:text-2xl font-bold">
              {formattedBrAmount(totalIncomes)}
            </span>
          </CardTitle>
          <CardAction>
            <IconChevronsUp size={30} color="#00c950" />
          </CardAction>
        </CardHeader>

        <CardFooter>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 text-green-600 font-semibold">
              <TrendingUpIcon className="w-4 h-4" color="#00c950" />
              12.5%
            </span>
            <span>em relação ao mês passado</span>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Total de Despesas</CardDescription>
          <CardTitle className="flex flex-row items-center">
            <span className="lg:text-xl xl:text-2xl font-bold">
              {formattedBrAmount(totalExpenses)}
            </span>
          </CardTitle>
          <CardAction>
            <IconChevronsDown size={30} color="#d34d4d" />
          </CardAction>
        </CardHeader>

        <CardFooter>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 text-red-600 font-semibold">
              <TrendingUpIcon className="w-4 h-4" color="#d34d4d" />
              8.1%
            </span>
            <span>em relação ao mês passado</span>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Caixa total</CardDescription>
          <CardTitle className="flex flex-row items-center">
            <span className="lg:text-xl xl:text-2xl font-bold">
              {formattedBrAmount(total)}
            </span>
          </CardTitle>
          <CardAction>
            <IconMoneybag size={30} color="#f0b100" />
          </CardAction>
        </CardHeader>

        <CardFooter>
          <span className="text-sm text-muted-foreground">
            Resultado operacional da relação entre
            <span className="ml-1 font-semibold">Receitas</span> x
            <span className="ml-1 font-semibold">Despesas</span>
          </span>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Saúde Financeira</CardDescription>
          <CardTitle className="flex flex-row items-center">
            <span className="lg:text-xl xl:text-2xl font-bold">
              {health.label}{" "}
              <span style={{ color: health.color }}>
                ({Math.round(healthScore)}%)
              </span>
            </span>
          </CardTitle>
          <CardAction>
            <IconHeartRateMonitor size={30} color={health.color} />
          </CardAction>
        </CardHeader>
        <CardFooter>
          Baseado na relação entre receitas e despesas. Representado atualmente
          pelo índice IDMC.
        </CardFooter>
      </Card>
    </div>
  );
}
