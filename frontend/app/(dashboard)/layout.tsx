import { Header } from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        &copy; 2024 Sales Report System
      </footer>
    </div>
  );
}
