"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import Navbar from "@/components/navbar";
import AuthGuard from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast"; // Seu hook de toast
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Esquema de validação com Zod
const profileFormSchema = z.object({
  nome_completo: z.string().min(3, { message: "Nome completo deve ter pelo menos 3 caracteres." }).max(100).optional().or(z.literal('')),
  nome_usuario: z.string().min(3, { message: "Nome de usuário deve ter pelo menos 3 caracteres." }).max(50)
    .regex(/^[a-zA-Z0-9_.]+$/, { message: "Nome de usuário pode conter apenas letras, números, underscores e pontos."})
    .optional().or(z.literal('')),
  biografia: z.string().max(250, { message: "Biografia não pode exceder 250 caracteres." }).optional().or(z.literal('')),
  localizacao: z.string().max(100).optional().or(z.literal('')),
  url_avatar: z.string().url({ message: "Por favor, insira uma URL válida para o avatar." }).max(255).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Tipo para os dados do perfil vindo do Supabase
interface PerfilData {
  id: string;
  nome_usuario?: string | null;
  nome_completo?: string | null;
  biografia?: string | null;
  url_avatar?: string | null;
  localizacao?: string | null;
}


export default function EditProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
  });

  useEffect(() => {
    const fetchUserDataAndProfile = async () => {
      setLoadingUser(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      if (authUser) {
        const { data: profileData, error } = await supabase
          .from("perfis")
          .select("*")
          .eq("id", authUser.id)
          .single<PerfilData>();

        if (error && error.code !== 'PGRST116') { // PGRST116: no rows found, o que é ok
          console.error("Erro ao buscar perfil:", error);
          toast({ title: "Erro", description: "Não foi possível carregar os dados do seu perfil.", variant: "destructive" });
        } else if (profileData) {
          setValue("nome_completo", profileData.nome_completo || "");
          setValue("nome_usuario", profileData.nome_usuario || "");
          setValue("biografia", profileData.biografia || "");
          setValue("localizacao", profileData.localizacao || "");
          setValue("url_avatar", profileData.url_avatar || "");
        }
      }
      setLoadingUser(false);
    };

    fetchUserDataAndProfile();
  }, [setValue, toast]);

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    if (!user) {
      toast({ title: "Erro", description: "Usuário não autenticado.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    // Filtrar campos vazios para não enviar null se o usuário apagar o conteúdo
    const updateData: Partial<PerfilData> = {};
    if (data.nome_completo) updateData.nome_completo = data.nome_completo;
    if (data.nome_usuario) updateData.nome_usuario = data.nome_usuario;
    if (data.biografia) updateData.biografia = data.biografia;
    if (data.localizacao) updateData.localizacao = data.localizacao;
    if (data.url_avatar) updateData.url_avatar = data.url_avatar;


    const { error } = await supabase
      .from("perfis")
      .update(updateData)
      .eq("id", user.id);

    if (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({ title: "Erro ao Atualizar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso!", description: "Seu perfil foi atualizado." });
      // Atualizar user_metadata se nome_completo ou url_avatar mudaram, para refletir no Navbar
      const userMetaDataToUpdate: any = {};
      if (data.nome_completo && data.nome_completo !== user.user_metadata?.nome_completo) {
        userMetaDataToUpdate.nome_completo = data.nome_completo;
      }
      if (data.url_avatar && data.url_avatar !== user.user_metadata?.avatar_url) {
        userMetaDataToUpdate.avatar_url = data.url_avatar;
      }
      if (Object.keys(userMetaDataToUpdate).length > 0) {
        await supabase.auth.updateUser({ data: userMetaDataToUpdate });
      }
      router.push("/profile"); // Redireciona para a página de perfil
      router.refresh(); // Força a atualização dos dados na página de perfil
    }
    setIsSubmitting(false);
  };

  if (loadingUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <Link href="/profile">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Voltar para o Perfil
              </Button>
            </Link>
          </div>

          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Editar Perfil</CardTitle>
              <CardDescription>Atualize suas informações pessoais.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="nome_completo">Nome Completo</Label>
                  <Input id="nome_completo" {...register("nome_completo")} placeholder="Seu nome como será exibido" className="mt-1"/>
                  {errors.nome_completo && <p className="text-sm text-red-500 mt-1">{errors.nome_completo.message}</p>}
                </div>

                <div>
                  <Label htmlFor="nome_usuario">Nome de Usuário</Label>
                  <Input id="nome_usuario" {...register("nome_usuario")} placeholder="Ex: joao_silva123" className="mt-1"/>
                  {errors.nome_usuario && <p className="text-sm text-red-500 mt-1">{errors.nome_usuario.message}</p>}
                  <p className="text-xs text-muted-foreground mt-1">Pode conter letras, números, "_" e ".".</p>
                </div>

                <div>
                  <Label htmlFor="biografia">Biografia</Label>
                  <Textarea id="biografia" {...register("biografia")} placeholder="Conte um pouco sobre você..." rows={4} className="mt-1"/>
                  {errors.biografia && <p className="text-sm text-red-500 mt-1">{errors.biografia.message}</p>}
                </div>

                <div>
                  <Label htmlFor="localizacao">Localização</Label>
                  <Input id="localizacao" {...register("localizacao")} placeholder="Ex: São Paulo, SP" className="mt-1"/>
                  {errors.localizacao && <p className="text-sm text-red-500 mt-1">{errors.localizacao.message}</p>}
                </div>

                <div>
                  <Label htmlFor="url_avatar">URL do Avatar</Label>
                  <Input id="url_avatar" {...register("url_avatar")} type="url" placeholder="https://exemplo.com/imagem.png" className="mt-1"/>
                  {errors.url_avatar && <p className="text-sm text-red-500 mt-1">{errors.url_avatar.message}</p>}
                  <p className="text-xs text-muted-foreground mt-1">Cole a URL de uma imagem para seu avatar.</p>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
         {/* Footer (mantido como placeholder, conforme solicitado na HomePage) */}
        <footer className="bg-gray-900 text-white dark:bg-slate-950 mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-sm text-gray-500 dark:text-gray-600">
              © {new Date().getFullYear()} Parques Brasil. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
}
