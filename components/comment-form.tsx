
"use client"

import React, { useState } from "react"; // React importado
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRatingInput } from "@/components/ui/star-rating-input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";

interface CommentFormProps {
  trilhaId: string;
  user: User | null;
  onCommentSubmitted: () => void;
}

export default function CommentForm({ trilhaId, user, onCommentSubmitted }: CommentFormProps) {
  const [comentario, setComentario] = useState("");
  const [avaliacao, setAvaliacao] = useState(0);
  const [loading, setLoading] = useState(false);
  // O estado 'error' local não estava a ser usado para exibir mensagens, o toast é mais apropriado.
  // const [errorForm, setErrorForm] = useState<string | null>(null); 
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setErrorForm(null); // Se for usar o estado de erro local

    if (!user) {
      toast({ title: "Acesso Negado", description: "Você precisa estar logado para enviar uma avaliação.", variant: "destructive" });
      return;
    }
    if (avaliacao === 0) {
      toast({ title: "Avaliação Incompleta", description: "Por favor, selecione uma nota de 1 a 5 estrelas.", variant: "destructive" });
      return;
    }
    if (comentario.trim() === "") {
      toast({ title: "Avaliação Incompleta", description: "O comentário não pode estar vazio.", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from("avaliacoes")
        .insert([{
          trilha_id: trilhaId,
          usuario_id: user.id, // Garante que o ID do utilizador logado é usado
          comentario: comentario,
          avaliacao: avaliacao,
          // data_visita e imagens são opcionais conforme sua DDL.
          // Se quiser adicioná-los, precisará de campos no formulário.
        }]);

      if (insertError) {
        // Log detalhado do objeto de erro do Supabase
        console.error("Supabase error object (CommentForm - insert):", JSON.stringify(insertError, null, 2));
        throw insertError; // Lança o erro para ser apanhado pelo catch
      }

      toast({ title: "Sucesso!", description: "Sua avaliação foi enviada com sucesso." });
      setComentario("");
      setAvaliacao(0);
      onCommentSubmitted(); // Atualiza a lista de comentários na página pai
    } catch (e: any) {
      // Tratamento de erro melhorado
      const errorMessage = e?.message || (typeof e === 'object' && e !== null ? JSON.stringify(e) : "Ocorreu um erro desconhecido ao enviar sua avaliação.");
      console.error("Erro ao enviar avaliação (catch):", errorMessage, e); // Loga o erro original também
      
      // setErrorForm(errorMessage); // Se for usar o estado de erro local
      toast({ 
        title: "Erro ao Enviar", 
        description: `Não foi possível enviar sua avaliação: ${errorMessage.includes("RLS") || errorMessage.includes("policy") ? "Verifique as permissões de acesso." : errorMessage}`, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 border rounded-md bg-muted dark:bg-slate-800 text-muted-foreground dark:text-slate-400 text-sm">
        Você precisa estar <Link href={`/login?next=/trilhas/${trilhaId}`} className="underline hover:text-primary font-semibold">logado</Link> para deixar uma avaliação.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div>
        <Label htmlFor="rating" className="mb-2 block font-medium text-sm">Sua Nota:</Label>
        <StarRatingInput value={avaliacao} onChange={setAvaliacao} disabled={loading} size={28} />
      </div>
      <div>
        <Label htmlFor="commentText" className="mb-2 block font-medium text-sm">Seu Comentário:</Label>
        <Textarea
          id="commentText"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Deixe sua avaliação sobre a trilha..."
          rows={4}
          disabled={loading}
          className="text-sm"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Enviando..." : "Enviar Avaliação"}
      </Button>
    </form>
  );
}
