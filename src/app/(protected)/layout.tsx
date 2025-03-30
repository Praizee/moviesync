import { Navbar } from "@/components/navbar";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[50dvh] flex flex-col">
      <Navbar />
      <div className="max-w-screen-xl mx-auto w-full min-h-[80dvh]">
        {children}
      </div>
    </div>
  );
}

