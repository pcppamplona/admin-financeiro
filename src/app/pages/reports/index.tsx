import { AppSidebar } from "@/components/app-sidebar";
// import MultiStepForm from "@/components/multi-step";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ReportsTransactions from "./reportsTransactions";

export default function Reports() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader titlePage="Relatórios" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <ReportsTransactions />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
