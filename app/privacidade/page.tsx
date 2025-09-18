// app/privacidade/page.tsx

import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Política de Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground prose dark:prose-invert">
              <p>
                <strong>Última atualização:</strong> 17 de Setembro de 2025
              </p>
              <p>
                A sua privacidade é de extrema importância para nós. Esta Política de Privacidade descreve como o Trilhas Brasil (doravante "nós", "nosso" ou "plataforma") coleta, usa, armazena e protege as informações pessoais de seus usuários ("você").
              </p>

              <h2 className="text-xl font-semibold text-foreground pt-4">1. Informações que Coletamos</h2>
              <p>Podemos coletar e processar os seguintes tipos de informações:</p>
              <ul>
                <li><strong>Informações de Cadastro:</strong> Quando você cria uma conta, coletamos seu nome, nome de usuário, endereço de e-mail e senha.</li>
                <li><strong>Informações de Perfil:</strong> Você pode optar por fornecer informações adicionais ao seu perfil, como biografia, localização e foto (URL do avatar).</li>
                <li><strong>Conteúdo Gerado pelo Usuário:</strong> Coletamos as informações que você publica na plataforma, incluindo avaliações, comentários e fotos de trilhas e parques.</li>
                <li><strong>Dados de Uso:</strong> Registramos informações sobre sua interação com a plataforma, como trilhas visualizadas, buscas realizadas e funcionalidades utilizadas.</li>
              </ul>

              <h2 className="text-xl font-semibold text-foreground pt-4">2. Como Usamos Suas Informações</h2>
              <p>Utilizamos as informações coletadas para:</p>
              <ul>
                <li>Fornecer, operar e manter nossos serviços.</li>
                <li>Melhorar, personalizar e expandir nossos serviços.</li>
                <li>Processar suas transações e gerenciar sua conta.</li>
                <li>Comunicar com você, seja para atendimento ao cliente, para fornecer atualizações e outras informações relacionadas ao serviço.</li>
                <li>Para fins de conformidade, incluindo a aplicação dos nossos Termos de Uso.</li>
              </ul>

              <h2 className="text-xl font-semibold text-foreground pt-4">3. Seus Direitos de Proteção de Dados (LGPD)</h2>
              <p>Você tem o direito de acessar, corrigir, atualizar ou solicitar a exclusão de suas informações pessoais. Você pode gerenciar as informações do seu perfil diretamente na seção "Editar Perfil" ou entrando em contato conosco.</p>

              <h2 className="text-xl font-semibold text-foreground pt-4">4. Segurança dos Dados</h2>
              <p>Empregamos medidas de segurança técnicas e administrativas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.</p>
              
              <h2 className="text-xl font-semibold text-foreground pt-4">5. Contato</h2>
              <p>Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco através da nossa página de <a href="/contato" className="text-primary hover:underline">Contato</a>.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}