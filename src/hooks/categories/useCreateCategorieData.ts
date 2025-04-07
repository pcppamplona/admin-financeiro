import { Category } from "@/interfaces/categories";
import { api } from "@/lib/utils";
// import { useMutation } from "@tanstack/react-query";


// sem o reac query
export async function useByUserCategories(
  categoryData: Category
): Promise<Category | null> {
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


// Com react query
// async function fetchCreateByUserCategories(categoryData: Category
//   ): Promise<Category | null> {
//     try {
//       const newCategory: Category = await api
//         .post("categories", { json: categoryData })
//         .json();
//       return newCategory;
//     } catch (error) {
//       console.error("Erro ao criar categoria:", error);
//       return null;
//     }
//   }

// export function useByUserCategories() {
//   return useMutation({ mutationFn: fetchCreateByUserCategories });
// }

