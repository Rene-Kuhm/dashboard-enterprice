import { Sidebar } from '@/components/layouts/sidebar';
import { Header } from '@/components/layouts/header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
