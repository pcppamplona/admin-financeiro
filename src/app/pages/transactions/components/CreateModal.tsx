import { useState, useEffect, useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alertDialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useByUserCategoriesData } from "@/hooks/categories/useByUserCategoriesData";
import { useAuth } from "@/store/auth";
import { Transaction } from "@/interfaces/transaction";
import { useCreateTransaction } from "@/hooks/transactions/useCreateTransactionData";
import { Category } from "@/interfaces/categories";
import { IconTrash } from "@tabler/icons-react";

interface CreateAlertProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (newTransaction: Transaction) => void;
}

export default function CreateAlert({
  open,
  onCancel,
  onConfirm,
}: CreateAlertProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [transactionData, setTransactionData] = useState<Partial<Transaction>>({
    userId: Number(user?.id),
    type: "expense",
    isRecurring: false,
  });

  // simulacao do preview - melhorar depois
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.id) {
      useByUserCategoriesData(user.id).then(setCategories);
    }
  }, [user]);

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleChange = (field: keyof Transaction, value: any) => {
    setTransactionData((prev) => ({ ...prev, [field]: value }));
  };

  // const handleSubmit = async () => {
  //   const newTransaction = await useCreateTransaction(
  //     transactionData as Transaction
  //   );
  //   if (newTransaction) {
  //     onConfirm(newTransaction);
  //     handleReset();
  //   }
  // };

  const handleSubmit = async () => {
    const timestamp = new Date().toISOString();
  

    const updatedTransaction: Transaction = {
      ...transactionData, 
      createdAt: timestamp,
      updatedAt: timestamp,
      attachments: attachments.map((file) => URL.createObjectURL(file)),
    };
  
    const newTransaction = await useCreateTransaction(updatedTransaction);
    if (newTransaction) {
      onConfirm(newTransaction);
      handleReset();
    }
  };

  const handleReset = () => {
    setStep(1);
    setTransactionData({
      userId: Number(user?.id),
      type: "expense",
      isRecurring: false,
    });
    setAttachments([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onCancel();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Criar Nova Transação</AlertDialogTitle>
          <AlertDialogDescription>Passo {step} de 5</AlertDialogDescription>
        </AlertDialogHeader>
        <Progress
          value={(step / 5) * 100}
          className="bg-gray-200 dark:bg-gray-700 [&>div]:bg-green-500"
        />

        <div className="space-y-4">
          {step === 1 && (
            <>
              <Select onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Transação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Despesa</SelectItem>
                  <SelectItem value="income">Receita</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Valor"
                type="number"
                onChange={(e) => handleChange("amount", Number(e.target.value))}
              />
              <Input
                placeholder="Descrição"
                onChange={(e) => handleChange("description", e.target.value)}
              />
              <Input
                placeholder="Data"
                type="date"
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </>
          )}
          {step === 2 && (
            <>
              <Select
                onValueChange={(value) =>
                  handleChange("categoryId", Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {(categories ?? []).map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
          {step === 3 && (
            <>
              <Input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                multiple
                onChange={handleFileChange}
                ref={fileInputRef}
              />

              <div className="mt-4 grid grid-cols-3 gap-2">
                {attachments.map((file, index) => (
                  <div key={index} className="relative p-2 border rounded-md">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-20 object-cover rounded"
                      />
                    ) : (
                      <a
                        href={URL.createObjectURL(file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        📄 {file.name}
                      </a>
                    )}

                    <button
                      onClick={() => removeAttachment(index)}
                      className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-6 h-6 items-center justify-center flex"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <Checkbox
                onCheckedChange={(checked) =>
                  handleChange("isRecurring", checked as boolean)
                }
              />{" "}
              Recorrente?
              <Select
                onValueChange={(value) => handleChange("status", value)}
                value={transactionData.status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="completed">Completo</SelectItem>
                  <SelectItem value="canceled">Cancelado</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Notas"
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </>
          )}
          {step === 5 && (
            <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                📄 Resumo da Transação
              </h3>

              <div className="grid grid-cols-2 gap-4">
              
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <span className="text-base font-medium text-gray-700 capitalize">
                    {transactionData.type === "expense"
                      ? "💸 Despesa"
                      : "💰 Receita"}
                  </span>
                </div>

               
                <div>
                  <p className="text-sm text-gray-500">Valor</p>
                  <span className="text-base font-medium text-green-600">
                    R$ {transactionData.amount?.toFixed(2)}
                  </span>
                </div>

              
                <div>
                  <p className="text-sm text-gray-500">Categoria</p>
                  <span className="text-base font-medium text-gray-700">
                    {transactionData.categoryId}
                  </span>
                </div>

            
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`text-base font-medium ${
                      transactionData.isRecurring
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {transactionData.isRecurring ? "🔄 Recorrente" : "✅ Única"}
                  </span>
                </div>

              
                <div>
                  <p className="text-sm text-gray-500">Data</p>
                  <span className="text-base font-medium text-gray-700">
                    {transactionData.date
                      ? new Date(transactionData.date).toLocaleDateString()
                      : "Não informada"}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Notas</p>
                  <span className="text-base text-gray-700">
                    {transactionData.notes || "Sem descrição"}
                  </span>
                </div>


                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Descrição</p>
                  <span className="text-base text-gray-700">
                    {transactionData.description || "Sem descrição"}
                  </span>
                </div>

                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Anexos</p>
                  <div className="flex flex-wrap gap-2">
                    {attachments.length > 0 ? (
                      attachments.map((file, index) => (
                        <div
                          key={index}
                          className="relative w-24 h-24 border rounded-md overflow-hidden shadow-sm"
                        >
                          {file.type.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <a
                              href={URL.createObjectURL(file)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center w-full h-full bg-gray-200 text-sm text-blue-600 font-medium"
                            >
                              📄 {file.name}
                            </a>
                          )}
                          <button
                            onClick={() => removeAttachment(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-1 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-base text-gray-500">
                        Nenhum anexo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleReset} className="mr-auto">
            Cancelar
          </AlertDialogCancel>
          {step > 1 && (
            <AlertDialogCancel onClick={handleBack}>Voltar</AlertDialogCancel>
          )}
          {step < 5 ? (
            <AlertDialogAction onClick={handleNext} className="bg-blue-500">
              Próximo
            </AlertDialogAction>
          ) : (
            <AlertDialogAction onClick={handleSubmit} className="bg-green-500">
              Criar
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
