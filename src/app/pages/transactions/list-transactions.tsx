import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useByIdRecurringTransactionsData, useByUserTransactionsData } from "@/hooks/transactions/useByUserTransactionsData";
import { Transaction } from "@/interfaces/transaction";
import { useAuth } from "@/store/auth";
import {
  IconChevronDown,
  IconChevronRight,
  IconChevronsDown,
  IconChevronsUp,
  IconDownload,
  // IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { SkeletonTable } from "@/components/skeletons/tableCategorySkeleton";
// import CreateAlert from "./components/CreateModal";
import { useByUserCategoriesData } from "@/hooks/categories/useByUserCategoriesData";

export default function ListTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState(true);
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [categories, setCategories] = useState<{ [key: string]: string }>({});

  const [recurringData, setRecurringData] = useState<{ [key: string]: any }>({});
  const [expandedTransactionId, setExpandedTransactionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const transactionsData = await useByUserTransactionsData(user.id);
      setTransactions(transactionsData);
      console.log("Transações recebidas:", transactionsData);
      setLoading(false);
    };

    fetchTransactions();
  }, [user]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await useByUserCategoriesData(user.id);
      if (categoriesData) {
        const categoryMap = categoriesData.reduce((acc, category) => {
          (acc[category.id] = category.name), category;
          return acc;
        }, {} as { [key: string]: string });
        setCategories(categoryMap);
      }
    };
    fetchCategories();
  }, [user]);

  const handleRowClick = async (transactionId: string, recurringId: number | null) => {
    if (expandedTransactionId === transactionId) {
      setExpandedTransactionId(null);
    } else {
      setExpandedTransactionId(transactionId);
      if (recurringId && !recurringData[transactionId]) {
        const data = await useByIdRecurringTransactionsData(String(recurringId));
        if (data) {
          setRecurringData((prev) => ({ ...prev, [transactionId]: data }));
        }
      }
    }
  };
  

  // const handleCreate = () => {
  //   setIsCreateModalOpen(true);
  // };

  // const handleConfirmCreate = (newCategory: Transaction) => {};

  return (
<>
      {/* <CreateAlert
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onConfirm={handleConfirmCreate}
      /> */}

       <div className="w-full px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardDescription>Transações</CardDescription>
          <CardTitle className="text-2xl font-bold text-gray-600">
            Lista de Transações
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 mt-4">
              <IconSearch size={16} className="mr-2 text-gray-500" />
              <input type="text" placeholder="Pesquisar transações" className="outline-none text-sm w-full" />
            </div>
          </CardTitle>
          {/* <button
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg"
                onClick={handleCreate}
              >
                <IconPlus size={16} className="mr-2" />
                Nova transação
              </button> */}

          <div className="flex justify-end items-center space-x-4 mt-4">
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg">
              <IconDownload size={16} className="mr-2" />
              Baixar CSV
            </button>
          </div>
        </CardHeader>

        <div className="px-4 lg:px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Recorrente</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <SkeletonTable />
              ) : transactions?.map((transaction) => (
                <>
                  <TableRow key={transaction.id} onClick={() => handleRowClick(transaction.id.toString(), transaction.recurringId)}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{categories[transaction.categoryId] || "Desconhecido"}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {transaction.type === "expense" ? (
                          <IconChevronsDown size={16} className="text-red-500" />
                        ) : (
                          <IconChevronsUp size={16} className="text-green-500" />
                        )}
                        <p className={`font-medium ${transaction.type === "expense" ? "text-red-500" : "text-green-500"}`}>{transaction.type}</p>
                      </div>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>R$ {transaction.amount}</TableCell>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.status}</TableCell>
                    <TableCell className="flex items-center">
                      {transaction.isRecurring ? (
                        <>
                          Sim{" "}
                          {expandedTransactionId === transaction.id ? (
                            <IconChevronDown className="text-gray-600"/>
                          ) : (
                            <IconChevronRight className="text-gray-600"/>
                          )}
                        </>
                      ) : (
                        "Não"
                      )}
                    </TableCell>
                  </TableRow>

                  {expandedTransactionId === transaction.id && recurringData[transaction.id] && (
                    <TableRow className="bg-gray-100">
                      <TableCell colSpan={8}>
                        <Table className="w-full">
                          <TableHeader className="border-collapse border-b border-gray-300">
                            <TableRow>
                              <TableCell className="text-sm font-medium text-gray-500">ID</TableCell>
                              <TableCell className="text-sm font-medium text-gray-500">Valor</TableCell>
                              <TableCell className="text-sm font-medium text-gray-500">Recorrência</TableCell>
                              <TableCell className="text-sm font-medium text-gray-500">Início</TableCell>
                              <TableCell className="text-sm font-medium text-gray-500">Fim</TableCell>
                              <TableCell className="text-sm font-medium text-gray-500">Último Processamento</TableCell>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                      
                            <TableRow>
                              <TableCell className="text-sm font-semibold">{recurringData[transaction.id].id}</TableCell>
                              <TableCell className="text-sm font-semibold">R$ {recurringData[transaction.id].amount}</TableCell>
                              <TableCell className="text-sm font-semibold">{recurringData[transaction.id].frequency}</TableCell>
                              <TableCell className="text-sm font-semibold">{new Date(recurringData[transaction.id].startDate).toLocaleDateString()}</TableCell>
                              <TableCell className="text-sm font-semibold">{recurringData[transaction.id].endDate ? new Date(recurringData[transaction.id].endDate).toLocaleDateString() : "Indeterminado"}</TableCell>
                              <TableCell className="text-sm font-semibold">{new Date(recurringData[transaction.id].lastProcessed).toLocaleDateString()}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
    </>
  );
}
