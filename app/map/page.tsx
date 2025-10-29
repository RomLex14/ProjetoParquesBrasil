// app/rotas/criar/page.tsx
import RotaCreator from "@/components/rota-creator";
import AuthGuard from "@/components/auth-guard";

export default function CriarRotaPage() {
  return (
    <AuthGuard>
      <RotaCreator />
    </AuthGuard>
  );
}