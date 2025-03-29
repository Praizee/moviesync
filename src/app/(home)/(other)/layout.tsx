export default function ExternalsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[50dvh] flex flex-col">
      <div className="max-w-screen-xl mx-auto w-full min-h-[50dvh]">
        {children}
      </div>
    </div>
  );
}

