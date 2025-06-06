
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingParqueDetalhe() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="container mx-auto py-6 sm:py-8 px-4">
        <div className="mb-6">
          <div className="inline-flex items-center text-sm font-medium">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>

        <section className="mb-8">
          <Skeleton className="relative w-full h-[40vh] min-h-[300px] md:h-[60vh] max-h-[550px] rounded-lg" />
        </section>
        
        <section className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <div className="md:col-span-2 space-y-6 lg:space-y-8">
            <Card>
              <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><Skeleton className="h-7 w-64" /></CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-48 w-full rounded-lg" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 md:sticky md:top-24 self-start">
            <Card className="overflow-hidden shadow-lg">
               <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
              <CardContent className="p-0">
                <Skeleton className="aspect-video w-full" />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}