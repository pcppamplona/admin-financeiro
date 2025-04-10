import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SectionCards } from "./components/SectionsCards";
import { DashCategories } from "./components/dashCategories";
import { DashGraphArea } from "./components/dashGraphArea";

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader titlePage="Dashboard" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-3 ">
                <div className="col-span-2 w-full min-w-0 flex flex-col ">
                  <DashGraphArea />
                </div>
                <div className="w-full min-w-0 flex flex-col">
                  <DashCategories />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
