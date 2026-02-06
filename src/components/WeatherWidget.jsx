import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudLightning, CloudFog, Snowflake, Loader } from 'lucide-react';

export default function WeatherWidget() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para escolher o ícone baseado no código WMO da API
  const getWeatherIcon = (code, size = 18, className = "") => {
    // 0: Céu limpo
    if (code === 0) return <Sun size={size} className={`text-yellow-400 ${className}`} />;
    // 1, 2, 3: Parcialmente nublado
    if (code >= 1 && code <= 3) return <Cloud size={size} className={`text-slate-200 ${className}`} />;
    // 45, 48: Neblina
    if (code === 45 || code === 48) return <CloudFog size={size} className={`text-slate-300 ${className}`} />;
    // 51-67, 80-82: Chuva
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain size={size} className={`text-blue-300 ${className}`} />;
    // 71-77, 85-86: Neve (Raro no BR, mas bom ter)
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return <Snowflake size={size} className={`text-cyan-200 ${className}`} />;
    // 95-99: Trovoada
    if (code >= 95 && code <= 99) return <CloudLightning size={size} className={`text-purple-400 ${className}`} />;
    
    // Padrão
    return <Sun size={size} className={`text-yellow-400 ${className}`} />;
  };

  useEffect(() => {
    const latitude = -20.5236; // Ouro Branco
    const longitude = -43.6917;
    
    // URL atualizada para pedir dados horários (hourly)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&timezone=America%2FSao_Paulo&forecast_days=1`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        // 1. Clima Atual
        setCurrentWeather({
          temp: Math.round(data.current.temperature_2m),
          code: data.current.weather_code
        });

        // 2. Previsão Horária (Próximas 5 horas)
        const currentHour = new Date().getHours();
        const allHours = data.hourly.time; // Array com horários (ISO string)
        const allTemps = data.hourly.temperature_2m;
        const allCodes = data.hourly.weather_code;

        // Encontra o índice da hora atual na lista da API
        // A API retorna strings tipo "2023-10-25T14:00"
        const nextHours = [];
        
        // Vamos varrer e pegar as próximas 5 horas
        let count = 0;
        for (let i = 0; i < allHours.length; i++) {
          const apiHour = new Date(allHours[i]).getHours();
          
          // Se for hora futura e ainda não pegamos 5
          if (apiHour > currentHour && count < 5) {
            nextHours.push({
              time: `${apiHour}:00`,
              temp: Math.round(allTemps[i]),
              code: allCodes[i]
            });
            count++;
          }
        }
        
        setHourlyForecast(nextHours);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar clima:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex justify-center p-4"><Loader className="animate-spin text-white/50" /></div>;
  if (!currentWeather) return null;

  return (
    <div className="w-full">
      {/* Parte de Cima: Clima Atual Grande */}
      <div className="flex flex-col items-center mb-4">
        <div className="scale-150 mb-2 drop-shadow-lg">
           {getWeatherIcon(currentWeather.code, 32)}
        </div>
        <span className="text-4xl font-bold text-white drop-shadow-md">{currentWeather.temp}°C</span>
      </div>

      {/* Divisória Suave */}
      <div className="w-full h-px bg-white/20 mb-3"></div>

      {/* Parte de Baixo: Próximas 5 horas */}
      <div className="flex justify-between gap-2 overflow-x-auto text-center pb-1 scrollbar-hide">
        {hourlyForecast.map((hour, idx) => (
          <div key={idx} className="flex flex-col items-center min-w-[40px]">
            <span className="text-[10px] text-indigo-100 font-medium mb-1">{hour.time}</span>
            <div className="mb-1 drop-shadow-sm">
              {getWeatherIcon(hour.code, 16)}
            </div>
            <span className="text-xs font-bold text-white">{hour.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}