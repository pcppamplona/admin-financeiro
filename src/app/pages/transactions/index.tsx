import { AppSidebar } from "@/components/app-sidebar";
// import MultiStepForm from "@/components/multi-step";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ListTransactions from "./list-transactions";

export default function Transactions() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader titlePage="Transações" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {/* <MultiStepForm /> */}
                <ListTransactions />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
