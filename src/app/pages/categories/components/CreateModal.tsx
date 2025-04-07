import { useState } from "react";
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
import { Category } from "@/interfaces/categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/store/auth";import { useCreateCategory } from "@/hooks/categories/useAllCategoriesData";
;

interface CreateAlertProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (newCategory: Category) => void;
  allCategories: Category[] | null;
}

export default function CreateAlert({
  open,
  onCancel,
  onConfirm,
  allCategories,
}: CreateAlertProps) {
  const { user } = useAuth();

  const [categoryData, setCategoryData] = useState<Partial<Category>>({
    name: "",
    userId: Number(user?.id),
    type: "expense",
    color: "#ff0000",
    budgetLimit: null,
    parentId: null,
    createdAt: new Date().toISOString(),
  });

  const [loading, setLoading] = useState(false);
  const [isSubcategory, setIsSubcategory] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { value: string }
  ) => {
    if ("target" in e) {
      const { name, value } = e.target;
      setCategoryData((prev) => ({ ...prev, [name]: value }));
    } else {
      const { value } = e;
      setCategoryData((prev) => ({
        ...prev,
        parentId: value === "none" ? null : Number(value),
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const result = await useCreateCategory(categoryData as Category);
    setLoading(false);
    if (result) {
      onConfirm(result);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Criar nova categoria</AlertDialogTitle>
          <AlertDialogDescription>
            Adicione uma nova categoria ao seu orçamento.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            name="name"
            placeholder="Nome da categoria"
            value={categoryData.name}
            onChange={handleChange}
          />

          <Select
            onValueChange={() => handleChange}
            defaultValue={categoryData.type}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo da categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">income</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            name="budgetLimit"
            placeholder="Limite de Orçamento"
            value={categoryData.budgetLimit || ""}
            onChange={handleChange}
          />

          <div className="flex items-center">
            <Checkbox
              className="mr-2"
              checked={isSubcategory}
              onCheckedChange={(checked) => setIsSubcategory(checked === true)}
            />
            <p className="text-sm text-gray-700">É uma subcategoria?</p>
          </div>

          {isSubcategory && (
            <Select
              onValueChange={(value) => handleChange({ value })}
              defaultValue={
                categoryData.parentId ? String(categoryData.parentId) : "none"
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoria Pai (Opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                {(allCategories || []).map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-600">Cor - </span>
            <input
              type="color"
              name="color"
              value={categoryData.color}
              onChange={handleChange}
              className="w-10 h-10"
            />
            <span className="text-sm font-mono ml-2 text-gray-500 font-semibold">
              {categoryData.color}
            </span>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-500"
          >
            {loading ? "Salvando..." : "Criar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
