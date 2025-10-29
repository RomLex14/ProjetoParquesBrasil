// app/rotas/finalizar/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Perfil } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Info, Route, Radio as RadioIcon, CalendarIcon, Cloud, CloudRain, CloudSnow, Sun, CloudLightning, CloudFog } from "lucide-react";
import Navbar from "@/components/navbar";
import AuthGuard from "@/components/auth-guard";
import { Card, CardContent } from "@/components/ui/card";
import { format, setHours, setMinutes, startOfDay } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
    getWeatherForecast as fetchFullWeatherForecast,
    ApiForecastEntry,
    WeatherApiResponse,
    WeatherData
} from '@/lib/weather-service';
import {
    calculateLevel,
    XP_PER_PLANNED_ROUTE,
    XP_PER_RECORDED_ROUTE
} from "@/lib/gamification";

interface SpecificWeatherData extends WeatherData {
  time?: string;
}

const generateOptions = (max: number, step: number = 1, pad: number = 2) => {
    const options = [];
    for (let i = 0; i < max; i += step) {
        options.push(i.toString().padStart(pad, '0'));
    }
    return options;
};
const hourOptions = generateOptions(24);
const minuteOptions = generateOptions(60, 15);

export default function FinalizarRotaPage() {
  const [waypoints, setWaypoints] = useState<{ lat: number; lng: number }[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [routeName, setRouteName] = useState("");
  const [routeDescription, setRouteDescription] = useState("");
  const [routeDifficulty, setRouteDifficulty] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<Perfil | null>(null);

  const [locationName, setLocationName] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState<string>('12');
  const [selectedMinute, setSelectedMinute] = useState<string>('00');
  const [specificForecast, setSpecificForecast] = useState<SpecificWeatherData | null | 'loading' | 'error' | 'unavailable'>(null);
  const [fullForecastList, setFullForecastList] = useState<ApiForecastEntry[]>([]);
  const [isLoadingFullForecast, setIsLoadingFullForecast] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const routeType = searchParams.get('type') as 'planejada' | 'gravada' | null;

  const fetchFullWeatherForLocation = async (coords: {lat: number, lon: number}) => {
      setIsLoadingFullForecast(true);
      setSpecificForecast(null);
      setFullForecastList([]);
      setLocationName(null);
      try {
        const response: WeatherApiResponse = await fetchFullWeatherForecast({ lat: coords.lat, lon: coords.lon });
         if (!response || !response.list || !response.location) {
            console.warn("Resposta da API de clima incompleta:", response);
            throw new Error("Formato de resposta da API de clima inesperado.");
        }
        setFullForecastList(response.list);
        setLocationName(response.location.name);
      } catch (error) {
        console.error("Erro ao buscar previsão completa:", error);
        setFullForecastList([]);
        setLocationName(null);
        setSpecificForecast('error');
      } finally {
        setIsLoadingFullForecast(false);
      }
  };

 useEffect(() => {
    setIsLoading(true);
    let initialWaypoints: { lat: number, lng: number }[] = [];

    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Erro", description: "Usuário não autenticado.", variant: "destructive"});
        router.push('/login');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('perfis').select('*').eq('id', user.id).single<Perfil>();
      if (profileError && profileError.code !== 'PGRST116') {
          console.error("Erro ao buscar perfil:", profileError);
      } else {
        setUserProfile(profileData);
      }

      const storedData = sessionStorage.getItem('finalizingRoute');
      if (storedData) {
          try {
              const data = JSON.parse(storedData);
              initialWaypoints = data.waypoints || [];
              if (initialWaypoints.length === 0) throw new Error("Waypoints vazios.");
              setWaypoints(initialWaypoints);
              setDistance(data.distance || null);
              setRouteName(data.name || `Minha rota ${routeType === 'gravada' ? 'gravada' : 'planejada'} em ${new Date().toLocaleDateString('pt-BR')}`);

              const firstWaypoint = initialWaypoints[0];
              await fetchFullWeatherForLocation({ lat: firstWaypoint.lat, lon: firstWaypoint.lng });

          } catch (e: any) {
              console.error("Erro ao processar dados da rota:", e);
              toast({ title: "Erro", description: "Não foi possível carregar os dados da rota.", variant: "destructive"});
              router.push('/rotas'); return;
          }
      } else {
          console.error("Nenhum dado de rota encontrado.");
          toast({ title: "Erro", description: "Dados da rota não encontrados.", variant: "destructive"});
          router.push('/rotas'); return;
      }
      setIsLoading(false);
    };
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const findSpecificForecast = () => {
      if (!locationName || !selectedDate || fullForecastList.length === 0) {
        setSpecificForecast(null); return;
      }
      setSpecificForecast('loading');
      const dateTime = setMinutes(setHours(startOfDay(selectedDate), parseInt(selectedHour)), parseInt(selectedMinute));
      let closestForecastData: ApiForecastEntry | null = null;
      let minDiff = Infinity;

      const firstForecastTimestamp = fullForecastList[0]?.dt * 1000;
      const lastForecastTimestamp = fullForecastList[fullForecastList.length - 1]?.dt * 1000;

      if (!firstForecastTimestamp || !lastForecastTimestamp) {
          setSpecificForecast('unavailable'); return;
      }

      const selectedTimestampStartOfDay = startOfDay(selectedDate).getTime();
      if (selectedTimestampStartOfDay < startOfDay(firstForecastTimestamp).getTime() || selectedTimestampStartOfDay > startOfDay(lastForecastTimestamp).getTime()) {
        setSpecificForecast('unavailable'); return;
      }

      fullForecastList.forEach((forecastItem) => {
        const forecastDateTime = new Date(forecastItem.dt * 1000);
        const currentDiff = Math.abs(dateTime.getTime() - forecastDateTime.getTime());
        if (currentDiff < minDiff) { minDiff = currentDiff; closestForecastData = forecastItem; }
      });

      if (closestForecastData && typeof closestForecastData === 'object') {
        const data = closestForecastData as ApiForecastEntry;
        const forecastDateTime = new Date(data.dt * 1000);
        const specificData: SpecificWeatherData = {
            date: format(forecastDateTime, "dd/MM HH:mm", { locale: ptBR }),
            time: format(forecastDateTime, "HH:mm"),
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            condition: getWeatherConditionCode(data.weather[0].id),
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6),
            weatherDescription: data.weather[0].description,
            weatherIcon: data.weather[0].icon,
            precipitation: typeof data.pop === 'number' ? Math.round(data.pop * 100) : 0,
        };
        setSpecificForecast(specificData);
      } else { setSpecificForecast('unavailable'); }
   };

  useEffect(() => {
    if (!isLoadingFullForecast && waypoints.length > 0 && selectedDate) {
      findSpecificForecast();
    } else if (waypoints.length === 0) {
      setSpecificForecast(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedHour, selectedMinute, fullForecastList, isLoadingFullForecast, waypoints]);

  const getWeatherConditionCode = (weatherId: number): WeatherData["condition"] => {
      if (weatherId >= 200 && weatherId < 300) return "stormy";
      if (weatherId >= 300 && weatherId < 600) return "rainy";
      if (weatherId >= 600 && weatherId < 700) return "snowy";
      if (weatherId >= 701 && weatherId <= 781) return "foggy";
      if (weatherId === 800) return "sunny";
      if (weatherId === 801 || weatherId === 802) return "partlyCloudy";
      if (weatherId === 803 || weatherId === 804) return "cloudy";
      return "cloudy";
  };
  const getWeatherIcon = (condition: WeatherData["condition"], size = "h-6 w-6") => {
      switch (condition) {
        case "sunny": return <Sun className={cn(size, "text-yellow-500")} />;
        case "cloudy": return <Cloud className={cn(size, "text-gray-400")} />;
        case "rainy": return <CloudRain className={cn(size, "text-blue-400")} />;
        case "snowy": return <CloudSnow className={cn(size, "text-blue-200")} />;
        case "stormy": return <CloudLightning className={cn(size, "text-purple-500")} />;
        case "foggy": return <CloudFog className={cn(size, "text-gray-300")} />;
        case "partlyCloudy": return <Sun className={cn(size, "text-yellow-500 opacity-70")} />;
        default: return <Cloud className={cn(size, "text-gray-400")} />;
      }
  };


  const handleSaveRoute = async () => {
    if (!routeName.trim()) {
        toast({ title: "Erro", description: "Dê um nome para a rota.", variant: "destructive" }); return;
    }
    if (!userProfile) {
        toast({ title: "Erro", description: "Perfil não carregado.", variant: "destructive" }); return;
    }
    setIsSaving(true);

    try {
        const { data: routeSaveData, error: routeSaveError } = await supabase.from('rotas_usuario').insert({
            usuario_id: userProfile.id,
            nome: routeName,
            descricao: routeDescription || null,
            dificuldade: routeDifficulty || null,
            waypoints: waypoints,
            distancia_total_km: distance ? parseFloat((distance / 1000).toFixed(2)) : null,
        }).select().single();

        if (routeSaveError) throw routeSaveError;

        if (routeSaveData) {
            const xpGain = routeType === 'gravada' ? XP_PER_RECORDED_ROUTE : XP_PER_PLANNED_ROUTE;
            const currentXp = userProfile.xp ?? 0;
            const newXp = currentXp + xpGain;
            const newLevel = calculateLevel(newXp);

            const { error: profileUpdateError } = await supabase
                .from('perfis')
                .update({ xp: newXp, nivel: newLevel })
                .eq('id', userProfile.id);

            if (profileUpdateError) {
                console.error("Erro ao atualizar XP/Nível:", profileUpdateError);
                toast({ title: "Aviso", description: "Rota salva, mas erro ao atualizar XP/Nível.", variant: "default" });
            } else {
                toast({ title: "Sucesso!", description: `Rota salva! +${xpGain.toFixed(1)} XP.` });
            }

            sessionStorage.removeItem('finalizingRoute');
            router.push(`/rotas/${routeSaveData.id}`);
        } else { throw new Error("Dados da rota não retornados."); }

    } catch (error: any) {
        console.error("Erro ao salvar rota:", error);
        toast({ title: "Erro ao Salvar", description: `Não foi possível salvar: ${error.message}`, variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) {
    return ( <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin" /></div> );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main className="container max-w-2xl mx-auto py-8 px-4">
          <div className="mb-6">
              <h1 className="text-3xl font-bold">
                {routeType === 'gravada' ? 'Finalizar Rota Gravada' : 'Finalizar Rota Planejada'}
              </h1>
              <p className="text-muted-foreground">Adicione os detalhes para salvar o seu percurso.</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md text-sm text-blue-800 dark:text-blue-300 flex items-start gap-3 mb-6">
              {routeType === 'gravada' ? <RadioIcon className="h-5 w-5 flex-shrink-0 mt-0.5" /> : <Route className="h-5 w-5 flex-shrink-0 mt-0.5" />}
              <p>
                Percurso com <strong>{waypoints.length} pontos</strong>
                {distance !== null && <span> e distância ~<strong>{(distance / 1000).toFixed(2)} km</strong></span>}.
                Complete os detalhes abaixo.
              </p>
          </div>

          <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Rota *</Label>
                <Input id="name" value={routeName} onChange={(e) => setRouteName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" value={routeDescription} onChange={(e) => setRouteDescription(e.target.value)} placeholder="Como foi a experiência? Pontos de interesse?" />
              </div>
              <div className="space-y-2">
                <Label>Dificuldade</Label>
                <RadioGroup value={routeDifficulty} onValueChange={setRouteDifficulty} className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
                    {["Fácil", "Moderado", "Difícil", "Extrema"].map(level => (
                        <div key={level} className="flex items-center space-x-2">
                          <RadioGroupItem value={level} id={`diff-${level}`} />
                          <Label htmlFor={`diff-${level}`} className="font-normal cursor-pointer">{level}</Label>
                        </div>
                    ))}
                </RadioGroup>
              </div>

               <div className="space-y-4 border-t pt-6">
                 <h3 className="text-lg font-medium">Consultar Previsão (Opcional)</h3>
                 <p className="text-sm text-muted-foreground">Verifique a previsão para o local e data planejados.</p>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                   <div className="space-y-1">
                     <Label htmlFor="routeDate" className="text-xs">Data</Label>
                     <Popover>
                       <PopoverTrigger asChild>
                         <Button id="routeDate" variant={"outline"} size="sm" className={cn("w-full justify-start text-left font-normal h-10", !selectedDate && "text-muted-foreground")} disabled={isLoadingFullForecast || waypoints.length === 0}>
                           <CalendarIcon className="mr-2 h-4 w-4" />
                           {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : <span>Escolha a data</span>}
                         </Button>
                       </PopoverTrigger>
                       <PopoverContent className="w-auto p-0">
                         <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus locale={ptBR}
                           disabled={(date) => { const today = startOfDay(new Date()); return date < today || date > new Date(new Date().setDate(today.getDate() + 4)); }}/>
                       </PopoverContent>
                     </Popover>
                   </div>
                   <div className="space-y-1">
                     <Label className="text-xs">Hora</Label>
                     <div className="flex items-center gap-1">
                       <Select value={selectedHour} onValueChange={setSelectedHour} disabled={!selectedDate || isLoadingFullForecast}>
                         <SelectTrigger className="w-[80px] h-10" aria-label="Hora"><SelectValue placeholder="HH" /></SelectTrigger>
                         <SelectContent>{hourOptions.map(hour => (<SelectItem key={hour} value={hour}>{hour}</SelectItem>))}</SelectContent>
                       </Select>
                       <span className="text-muted-foreground">:</span>
                       <Select value={selectedMinute} onValueChange={setSelectedMinute} disabled={!selectedDate || isLoadingFullForecast}>
                         <SelectTrigger className="w-[80px] h-10" aria-label="Minuto"><SelectValue placeholder="MM" /></SelectTrigger>
                         <SelectContent>{minuteOptions.map(minute => (<SelectItem key={minute} value={minute}>{minute}</SelectItem>))}</SelectContent>
                       </Select>
                     </div>
                   </div>
                   {locationName && (
                     <div className="space-y-1 hidden sm:block">
                       <Label className="text-xs">Local</Label>
                       <p className="text-sm font-medium text-muted-foreground truncate h-10 flex items-center" title={locationName}>{locationName}</p>
                     </div>
                   )}
                 </div>
                 {selectedDate && locationName && (
                   <div className="pt-2">
                     {(isLoadingFullForecast || specificForecast === 'loading') && ( <div className="flex items-center justify-center p-4 text-muted-foreground text-sm rounded border bg-muted/30"><Loader2 className="h-4 w-4 animate-spin mr-2" /> Buscando...</div> )}
                     {!isLoadingFullForecast && specificForecast === 'error' && ( <p className="text-xs text-destructive p-3 text-center rounded border border-destructive/50 bg-destructive/10">Erro ao carregar previsão.</p> )}
                     {!isLoadingFullForecast && specificForecast === 'unavailable' && ( <p className="text-xs text-muted-foreground p-3 text-center rounded border bg-muted/50">Previsão indisponível.</p> )}
                     {!isLoadingFullForecast && typeof specificForecast === 'object' && specificForecast !== null && (
                       <Card className="bg-muted/30 dark:bg-muted/20 border text-xs shadow-sm">
                         <CardContent className="p-3 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                           <div className="flex items-center gap-2 flex-shrink-0">
                             {getWeatherIcon(specificForecast.condition, "h-7 w-7")}
                             <div><p className="text-lg font-bold">{specificForecast.temperature}°C</p><p className="text-xs text-muted-foreground capitalize">{specificForecast.weatherDescription}</p></div>
                           </div>
                           <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground w-full sm:w-auto sm:ml-auto text-center sm:text-left">
                             <span>Sensação:</span> <span className="font-medium text-foreground">{specificForecast.feelsLike}°C</span>
                             <span>Humidade:</span> <span className="font-medium text-foreground">{specificForecast.humidity}%</span>
                             <span>Vento:</span> <span className="font-medium text-foreground">{specificForecast.windSpeed} km/h</span>
                             {specificForecast.precipitation !== undefined && ( <><span>Chuva:</span> <span className="font-medium text-foreground">{specificForecast.precipitation}%</span></> )}
                             <span className="col-span-2 text-[11px] mt-1 text-center sm:text-right">(~ {specificForecast.date})</span>
                           </div>
                         </CardContent>
                       </Card>
                     )}
                   </div>
                 )}
               </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                 <Button variant="outline" asChild><Link href="/rotas">Cancelar</Link></Button>
                 <Button onClick={handleSaveRoute} disabled={isSaving || isLoading}><Loader2 className={cn("mr-2 h-4 w-4 animate-spin", !isSaving && "hidden")} />Salvar Rota</Button>
              </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}