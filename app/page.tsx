import { getTrilhas } from "@/lib/data-service";
import HomeClient from "@/components/home-client";


export const dynamic = 'force-dynamic';

export default async function HomePage() {

  const todasAsTrilhas = await getTrilhas();

  const trilhasDestaque = todasAsTrilhas.slice(29,34);


  return (
    <HomeClient featuredTrails={trilhasDestaque} />
  );
}