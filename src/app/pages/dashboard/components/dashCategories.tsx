import {
  IconCarrot,
  IconHome,
  IconReceipt,
  IconShoppingCart,
  IconTrendingUp,
  IconCategory,
  IconToolsKitchen2,
  IconBuildingSkyscraper,
  IconHeartbeat,
  IconTrain,
  IconBike,
  IconBrandCashapp,
} from "@tabler/icons-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JSX, useEffect, useState } from "react";
import { Category } from "@/interfaces/categories";
import { useAuth } from "@/store/auth";
import { useByUserCategoriesData } from "@/hooks/categories/useByUserCategoriesData";

// Mapeamento de ícones baseado no nome da categoria
const iconMap: { [key: string]: JSX.Element } = {
  home: <IconHome />,
  apartment: <IconBuildingSkyscraper />,
  receipt: <IconReceipt />,
  restaurant: <IconCarrot />,
  shopping_cart: <IconShoppingCart />,
  local_dining: <IconToolsKitchen2 />,
  directions_car: <IconTrain />,
  sports_esports: <IconBike />,
  local_hospital: <IconHeartbeat />,
  trending_up: <IconTrendingUp />,
  category: <IconCategory />,
  account_balance: <IconBrandCashapp />,
};

export function DashCategories() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(
    null
  );
  const { user } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await useByUserCategoriesData(Number(user?.id));
      setCategories(fetchedCategories);
    };

    fetchCategories();
  }, [user]);

  const handleCardClick = (id: number) => {
    if (expandedCategoryId === id) {
      setExpandedCategoryId(null);
    } else {
      setExpandedCategoryId(id);
    }
  };

  return (
    // <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
    <div>
      <Card className="@container/card h-full flex flex-col">
        <CardHeader>
          <CardDescription>
            Categorias do <span className="font-semibold">{user?.name}</span>
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
            Lista de Categorias
          </CardTitle>
        </CardHeader>

        <div className="px-4 lg:px-6">
          <ul className="space-y-4">
            {categories ? (
              categories.map((category: Category) => (
                <li
                  key={category.id}
                  className="p-2 border-l-[6px] border-[0.5px] bg-gray-50 rounded-lg hover:shadow-lg transition-shadow"
                  style={{ borderColor: category.color }}
                  onClick={() => handleCardClick(category.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center p-1.5 text-white"
                      style={{
                        backgroundColor: category.color,
                      }}
                    >
                      {iconMap[String(category.icon)] || <IconTrendingUp />}{" "}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">{category.name}</h3>
                    </div>
                  </div>

                  {/* Expande o conteúdo do card apenas quando clicado */}
                  {expandedCategoryId === category.id && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Tipo -{" "}
                        <span className="font-semibold">{category.type}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Limite de Orçamento -{" "}
                        <span className="font-semibold">
                          R$ {category.budgetLimit ?? "N/A"}
                        </span>
                      </p>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <p>Carregando categorias...</p>
            )}
          </ul>
        </div>
      </Card>
    </div>
  );
}
