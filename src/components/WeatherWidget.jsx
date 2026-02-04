import React, { useState, useEffect } from 'react';
import { Cloud, Sun, Loader } from 'lucide-react';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Coordenadas de Ouro Branco, MG
    const latitude = -20.5236;
    const longitude = -43.6917;
    
    // URL da API Open-Meteo (Gratuita e sem chave)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=America%2FSao_Paulo`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          code: data.current.weather_code // Código para saber se é sol ou chuva
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar clima:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="animate-pulse bg-blue-400/20 w-16 h-8 rounded"></div>;
  if (!weather) return null;

  // Define ícone simples baseado no código (0-3 é sol/nuvens, o resto é chuva/trovoada)
  const isClear = weather.code <= 3;

  return (
    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-sm font-bold shadow-sm border border-white/30">
      {isClear ? <Sun size={18} className="text-yellow-300" /> : <Cloud size={18} className="text-gray-200" />}
      <span>{weather.temp}°C</span>
    </div>
  );
}