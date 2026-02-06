import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudLightning, CloudFog, Snowflake, Loader } from 'lucide-react';

export default function WeatherWidget() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  const getWeatherIcon = (code, size = 18, className = "") => {
    if (code === 0) return <Sun size={size} className={`text-yellow-300 ${className}`} />;
    if (code >= 1 && code <= 3) return <Cloud size={size} className={`text-slate-200 ${className}`} />;
    if (code === 45 || code === 48) return <CloudFog size={size} className={`text-slate-300 ${className}`} />;
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain size={size} className={`text-blue-300 ${className}`} />;
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return <Snowflake size={size} className={`text-cyan-200 ${className}`} />;
    if (code >= 95 && code <= 99) return <CloudLightning size={size} className={`text-purple-400 ${className}`} />;
    return <Sun size={size} className={`text-yellow-300 ${className}`} />;
  };

  useEffect(() => {
    // Coordenadas Ouro Branco
    const latitude = -20.5236;
    const longitude = -43.6917;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&timezone=America%2FSao_Paulo&forecast_days=1`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setCurrentWeather({
          temp: Math.round(data.current.temperature_2m),
          code: data.current.weather_code
        });

        const currentHour = new Date().getHours();
        const allHours = data.hourly.time;
        const allTemps = data.hourly.temperature_2m;
        const allCodes = data.hourly.weather_code;

        const nextHours = [];
        let count = 0;
        for (let i = 0; i < allHours.length; i++) {
          const apiHour = new Date(allHours[i]).getHours();
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
        console.error("Erro clima:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex justify-center p-4"><Loader className="animate-spin text-white/50" /></div>;
  if (!currentWeather) return null;

  return (
    <div className="flex flex-col items-center w-full text-white">
      
      {/* 1. Título Pequeno no Topo */}
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">
        Clima Agora
      </span>

      {/* 2. Ícone e Temperatura Grande */}
      <div className="flex flex-col items-center mb-4 relative z-10">
         <div className="drop-shadow-lg filter">
            {getWeatherIcon(currentWeather.code, 64)}
         </div>
         <span className="text-5xl font-bold mt-1 drop-shadow-md tracking-tighter">
            {currentWeather.temp}°
         </span>
      </div>

      {/* 3. Previsão Horária (Pequena e Organizada) */}
      <div className="w-full flex justify-between gap-1 mb-4 px-1">
         {hourlyForecast.map((hour, idx) => (
            <div key={idx} className="flex flex-col items-center">
               <span className="text-[9px] opacity-70 mb-1">{hour.time}</span>
               <div className="mb-1 opacity-90">
                  {getWeatherIcon(hour.code, 14)}
               </div>
               <span className="text-xs font-bold">{hour.temp}°</span>
            </div>
         ))}
      </div>

      {/* 4. Rodapé Cidade */}
      <div className="w-full border-t border-white/20 pt-2 text-center">
         <span className="text-[10px] font-medium opacity-80 tracking-wide">
            Ouro Branco - MG
         </span>
      </div>
    </div>
  );
}