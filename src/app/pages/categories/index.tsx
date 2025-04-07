import { AppSidebar } from "@/components/app-sidebar";
import ListCategories from "@/app/pages/categories/list-categories";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Categories() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader titlePage="Categorias" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <ListCategories />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
