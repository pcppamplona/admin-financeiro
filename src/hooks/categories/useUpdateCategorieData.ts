import { Category } from "@/interfaces/categories";
import { api } from "@/lib/utils";

export async function useUpdateCategory(
  categoryId: number,
  updatedData: Partial<Category>
): Promise<Category | null> {
  console.log(categoryId);

  try {
    const updatedCategory: Category = await api
      .put(`categories/${categoryId}`, {
        json: updatedData,
      })
      .json();

    return updatedCategory;
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return null;
  }
}
