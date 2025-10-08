import Navbar from "@/components/navbar";
import RotaCreator from "@/components/rota-creator";
import AuthGuard from "@/components/auth-guard";

export default function CriarRotaPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <RotaCreator />
        </main>
      </div>
    </AuthGuard>
  );
}