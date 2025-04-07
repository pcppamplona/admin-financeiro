import { useEffect, useState } from "react";
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
import { useUpdateCategory } from "@/hooks/categories/useUpdateCategorieData";

interface EditAlertProps {
  category: Category | null;
  onCancel: () => void;
  onConfirm: (updatedCategory: Category) => void;
}

export default function EditAlert({ category, onCancel, onConfirm }: EditAlertProps) {
  const [updatedCategory, setUpdatedCategory] = useState<Partial<Category>>({});

  useEffect(() => {
    if (category) {
      setUpdatedCategory({
        ...category,
        budgetLimit: category.budgetLimit ?? 0,
      });
    }
  }, [category]);

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!category) return;
    setLoading(true);
    const result = await useUpdateCategory(category.id, updatedCategory);
    setLoading(false);
    if (result) {
      onConfirm(result);
    }
  };

  return (
    <AlertDialog open={!!category} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Editar Categoria</AlertDialogTitle>
          <AlertDialogDescription>Atualize os dados da categoria selecionada.</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            name="name"
            placeholder="Nome"
            value={updatedCategory.name || ""}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="type"
            placeholder="Tipo"
            value={updatedCategory.type || ""}
            onChange={handleChange}
          />
          <Input
            type="number"
            name="budgetLimit"
            placeholder="Limite de Orçamento"
            value={updatedCategory.budgetLimit || ""}
            onChange={handleChange}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={loading} className="bg-blue-500">
            {loading ? "Salvando..." : "Confirmar Edição"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
