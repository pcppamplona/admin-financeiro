import { api } from "@/lib/utils";
// import { Category } from "@/interfaces/categories";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function useDeleteCategory(
  categoryId: number | string
): Promise<boolean> {
  try {
    await api.delete(`categories/${categoryId}`);
    return true;
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return false;
  }
}


// Com react query
// async function fetchDeleteCategory(categoryId: number | string): Promise<void> {
//   try {
//     await api.delete(`categories/${categoryId}`);
//   } catch (error) {
//     console.error("Erro ao deletar categoria:", error);
//     throw new Error("Erro ao deletar categoria");
//   }
// }
// export function useDeleteCategory(userId: number | string) {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: fetchDeleteCategory,
//     onMutate: async (categoryId) => {
//       await queryClient.cancelQueries({ queryKey: ["categories", userId] });

//       const previousCategories = queryClient.getQueryData<Category[]>(["categories", userId]);
      
//       queryClient.setQueryData<Category[]>(["categories", userId], (old) => 
//         old?.filter(category => category.id !== categoryId) || []
//       );
      
//       return { previousCategories };

//     },
//     onError: (error, _, context) => {
//       if (context?.previousCategories) {
//         queryClient.setQueryData(["categories", userId], context.previousCategories);
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["categories", userId] });
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ 
//         queryKey: ["categories", userId],
//         refetchType: 'active' 
//       });
//     }
   
//   });
// }
