import { useState, useEffect } from 'react';

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useGeolocation = (options?: GeolocationOptions) => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [altitude, setAltitude] = useState<number | null>(null); // Adicionado para altitude
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<GeolocationPositionError | null>(null);

  useEffect(() => {
    let watchId: number;

    const handleSuccess = (position: GeolocationPosition) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setAltitude(position.coords.altitude); // Captura a altitude
      setLoading(false);
      setError(null);
    };

    const handleError = (error: GeolocationPositionError) => {
      setError(error);
      setLoading(false);
    };

    if (navigator.geolocation) {
      // Usa watchPosition() para monitoramento contínuo, como você sugeriu
      watchId = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        options
      );
    } else {
      setLoading(false);
    }

    // Função de limpeza: para de observar a posição quando o componente é desmontado
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [options]); // O efeito é re-executado se as opções mudarem

  return { latitude, longitude, altitude, loading, error };
};