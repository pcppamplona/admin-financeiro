import { Category } from "@/interfaces/categories";
import { api } from "@/lib/utils";

export async function useCreateCategory(categoryData: Category) {
  try {
    const newCategory: Category = await api
      .post("categories", { json: categoryData })
      .json();
    return newCategory;
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return null;
  }
}
