export default function HomePageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <main className="relative w-full lg:mt-20 lg:max-w-7xl lg:mx-auto flex flex-col min-h-screen">
        {children}
      </main>
    </>
  )
}
