import { Category } from "@/interfaces/categories";
import { useState, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconPencil,
  IconTrash,
  IconSearch,
  IconDownload,
  IconPlus,
  IconChevronsDown,
  IconChevronsUp,
} from "@tabler/icons-react";
import { useByUserCategoriesData } from "@/hooks/categories/useByUserCategoriesData";
import { useAuth } from "@/store/auth";
import { useDeleteCategory } from "@/hooks/categories/useDeleteCategorieData";
import DeleteAlert from "./components/DeleteModal";
import EditAlert from "@/app/pages/categories/components/EditModal";
import CreateAlert from "./components/CreateModal";
import { SkeletonTable } from "../../../components/skeletons/tableCategorySkeleton";

export default function ListCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Dialogs -------------
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.id) return;
      const categoriesData = await useByUserCategoriesData(Number(user.id));
      setCategories(categoriesData);
      setLoading(false);
    };

    const timer = setTimeout(() => {
      fetchCategories();
    }, 1500);

    return () => clearTimeout(timer);
  }, [user]);

  const handleEdit = (category: Category) => {
    setCategoryToEdit(category);
  };

  const handleDelete = (id: number) => {
    setCategoryToDelete(id);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      console.log("Deletar categoria com id:", categoryToDelete);
      useDeleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleConfirmCreate = (newCategory: Category) => {
    console.log(newCategory);
    setCategories((prev) => (prev ? [...prev, newCategory] : [newCategory]));
    setIsCreateModalOpen(false);
  };

  const handleDownloadCSV = () => {
    console.log("Baixar CSV");
  };

  const filteredCategories = categories?.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <DeleteAlert
        toDelete={categoryToDelete}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
      />

      <EditAlert
        category={categoryToEdit}
        onCancel={() => setCategoryToEdit(null)}
        onConfirm={(updatedCategory) => {
          setCategories((prev) =>
            prev
              ? prev.map((cat) =>
                  cat.id === updatedCategory.id
                    ? { ...cat, ...updatedCategory }
                    : cat
                )
              : []
          );
          setCategoryToEdit(null);
        }}
      />

      <CreateAlert
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onConfirm={handleConfirmCreate}
        allCategories={categories}
      />

      <div className="w-full px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardDescription>Categorias</CardDescription>
            <CardTitle className="text-2xl font-bold tabular-nums @[650px]/card:text-2xl text-gray-600">
              Lista de Categorias
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 mt-4">
                <IconSearch size={16} className="mr-2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Pesquisar categorias"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="outline-none text-sm w-full"
                />
              </div>
            </CardTitle>
            <div className="flex justify-self-end items-center space-x-4 mt-4">
              <button
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg"
                onClick={handleCreate}
              >
                <IconPlus size={16} className="mr-2" />
                Criar Categoria
              </button>

              <button
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={handleDownloadCSV}
              >
                <IconDownload size={16} className="mr-2" />
                Baixar CSV
              </button>
            </div>
          </CardHeader>

          <div className="px-4 lg:px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="font-semibold text-gray-500">
                    ID
                  </TableCell>
                  <TableCell className="font-semibold text-gray-500">
                    Nome
                  </TableCell>
                  <TableCell className="font-semibold text-gray-500">
                    Tipo
                  </TableCell>
                  <TableCell className="font-semibold text-gray-500">
                    Limite de Orçamento
                  </TableCell>
                  <TableCell className="font-semibold text-gray-500">
                    Data de criação
                  </TableCell>
                  <TableCell className="font-semibold text-gray-500">
                    Ações
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <SkeletonTable />
                ) : filteredCategories?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      Não foi possível encontrar categorias.
                    </td>
                  </tr>
                ) : (
                  filteredCategories?.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.id}</TableCell>
                      <TableCell>
                        <p
                          className="px-2 py-1 font-medium border-l-4"
                          style={{ borderColor: category.color }}
                        >
                          {category.name}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {category.type === "expense" ? (
                            <IconChevronsDown
                              size={16}
                              className="text-red-500"
                            />
                          ) : (
                            <IconChevronsUp
                              size={16}
                              className="text-green-500"
                            />
                          )}

                          <p
                            className={`font-medium
                            ${
                              category.type === "expense"
                                ? "text-red-500"
                                : "text-green-500"
                            }
                        `}
                          >
                            {category.type}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {category.budgetLimit
                          ? `R$ ${category.budgetLimit}`
                          : "Sem limite"}
                      </TableCell>
                      <TableCell>
                        {new Date(category.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <button
                          className="text-blue-500 p-2 hover:bg-blue-100 rounded-full"
                          onClick={() => handleEdit(category)}
                        >
                          <IconPencil size={20} />
                        </button>
                        <button
                          className="text-red-500 p-2 hover:bg-red-100 rounded-full ml-2"
                          onClick={() => handleDelete(Number(category.id))}
                        >
                          <IconTrash size={20} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </>
  );
}
