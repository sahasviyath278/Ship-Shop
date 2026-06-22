import Navbar from "@/components/Navbar";
import { AuthGuard } from "@/components/AuthGuard";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Navbar />
      <main className="container mx-auto p-4">{children}</main>
    </AuthGuard>
  );
}