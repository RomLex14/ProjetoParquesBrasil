// app/cookies/page.tsx

import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Política de Cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground prose dark:prose-invert">
              <p>
                <strong>Última atualização:</strong> 17 de Setembro de 2025
              </p>

              <h2 className="text-xl font-semibold text-foreground pt-4">O que são cookies?</h2>
              <p>Como é prática comum em quase todos os sites profissionais, este site usa cookies, que são pequenos arquivos baixados no seu computador, para melhorar sua experiência. Esta página descreve quais informações eles coletam, como as usamos e por que às vezes precisamos armazenar esses cookies.</p>

              <h2 className="text-xl font-semibold text-foreground pt-4">Como usamos os cookies</h2>
              <p>Utilizamos cookies por vários motivos, detalhados abaixo. Infelizmente, na maioria dos casos, não existem opções padrão do setor para desativar os cookies sem desativar completamente a funcionalidade e os recursos que eles adicionam a este site.</p>
              <ul>
                <li><strong>Cookies relacionados à conta:</strong> Se você criar uma conta conosco, usaremos cookies para o gerenciamento do processo de inscrição e administração geral. Esses cookies geralmente serão excluídos quando você sair do sistema, porém, em alguns casos, eles poderão permanecer posteriormente para lembrar as preferências do seu site ao sair.</li>
                <li><strong>Cookies relacionados ao login:</strong> Utilizamos cookies quando você está logado, para que possamos lembrar dessa ação. Isso evita que você precise fazer login sempre que visitar uma nova página.</li>
                <li><strong>Cookies de preferências do site:</strong> Para proporcionar uma ótima experiência neste site, fornecemos a funcionalidade para definir suas preferências de como esse site é executado quando você o usa. Para lembrar suas preferências, precisamos definir cookies para que essas informações possam ser chamadas sempre que você interagir com uma página.</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-foreground pt-4">Como Gerenciar Cookies</h2>
              <p>Você pode impedir a configuração de cookies ajustando as configurações do seu navegador (consulte a Ajuda do seu navegador para saber como fazer isso). Esteja ciente de que a desativação de cookies afetará a funcionalidade deste e de muitos outros sites que você visita.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}