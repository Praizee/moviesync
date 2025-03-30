// import { DashboardTabs } from "@/components/dashboard-tabs";
import { Footer } from "@/components/footer";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[80dvh] flex flex-col">
      <div className="space-y-4">
        {/* <DashboardTabs /> */}
        {children}
      </div>
      <Footer />
    </div>
  );
}

