import { Category } from "@/interfaces/categories";
import { api } from "@/lib/utils";

export async function useByUserCategoriesData(
  userId: number
): Promise<Category[] | null> {
  try {
    const categories: Category[] = await api
      .get(`categories`, { searchParams: { userId } })
      .json();
    return categories;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return null;
  }
}


// Com o react query
// const fetchCategoriesByUser = async ({ queryKey }: { queryKey: [string, string | number] }) => {
//   const [, userId] = queryKey;
//   const categories: Category[] = await api
//     .get("categories", { searchParams: { userId } })
//     .json();
//   return categories;
// };

// export function useByUserCategoriesData(userId: string | number) {
//   return useQuery({
//     queryKey: ["categories", userId],
//     queryFn: fetchCategoriesByUser,
//     enabled: !!userId,
//     staleTime: 1000 * 60 * 5,
    
//   });
// }
