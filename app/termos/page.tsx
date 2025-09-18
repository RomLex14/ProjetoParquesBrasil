// app/termos/page.tsx

import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Termos de Uso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground prose dark:prose-invert">
              <p>
                <strong>Última atualização:</strong> 17 de Setembro de 2025
              </p>
              <p>
                Bem-vindo ao Trilhas Brasil! Ao acessar e usar nossa plataforma, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso.
              </p>

              <h2 className="text-xl font-semibold text-foreground pt-4">1. Uso da Plataforma</h2>
              <p>Você concorda em usar o Trilhas Brasil apenas para fins lícitos e de maneira que não infrinja os direitos de, restrinja ou iniba o uso e gozo da plataforma por qualquer terceiro.</p>
              
              <h2 className="text-xl font-semibold text-foreground pt-4">2. Contas de Usuário</h2>
              <p>Para acessar certas funcionalidades, você pode ser solicitado a criar uma conta. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem sob sua conta.</p>

              <h2 className="text-xl font-semibold text-foreground pt-4">3. Conteúdo Gerado pelo Usuário</h2>
              <p>Ao enviar avaliações, fotos ou qualquer outro conteúdo, você nos concede uma licença mundial, não exclusiva, isenta de royalties para usar, reproduzir e exibir tal conteúdo em conexão com o serviço.</p>
              <p>Você garante que possui todos os direitos sobre o conteúdo que envia e que ele não viola os direitos de terceiros ou qualquer lei aplicável.</p>
              
              <h2 className="text-xl font-semibold text-foreground pt-4">4. Limitação de Responsabilidade</h2>
              <p>As informações sobre trilhas e parques são fornecidas "como estão". Embora nos esforcemos para garantir a precisão das informações, não garantimos que todos os dados (dificuldade, condições, etc.) estejam sempre corretos ou atualizados. A prática de atividades ao ar livre envolve riscos, e você é o único responsável por sua própria segurança.</p>

              <h2 className="text-xl font-semibold text-foreground pt-4">5. Alterações nos Termos</h2>
              <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Notificaremos sobre alterações significativas, mas é sua responsabilidade revisar os termos periodicamente.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}