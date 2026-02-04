import React from 'react';
import { MapPin } from 'lucide-react';

export default function LocationPicker({ lat, lng, privacy, onChange, readOnly }) {
  const handleMapClick = (e) => {
    if (readOnly) return;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Lógica simulada de coordenadas baseada em Ouro Branco
    onChange({ lat: -20.5 + (y/1000), lng: -43.7 + (x/1000) }); 
  };

  return (
    <div className="space-y-2">
      <div 
        className={`h-full min-h-[200px] w-full bg-slate-100 rounded-lg border border-slate-300 relative overflow-hidden ${!readOnly ? 'cursor-crosshair' : ''} group`} 
        onClick={handleMapClick}
      >
        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/2275px-Google_Maps_Logo_2020.svg.png')] bg-cover opacity-20 grayscale group-hover:grayscale-0 transition"></div>
        
        {!readOnly && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-xs text-slate-500 bg-white/80 px-2 py-1 rounded">Clique para definir o local</p>
          </div>
        )}
        
        {lat && (
          <div className="absolute transform -translate-x-1/2 -translate-y-full" style={{ top: '50%', left: '50%' }}>
            {privacy === 'exact' ? (
              <MapPin size={32} className="text-red-600 fill-current animate-bounce" />
            ) : (
              <div className="w-16 h-16 bg-blue-500/30 rounded-full border-2 border-blue-500 flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {!readOnly && (
        <div className="flex gap-4 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="privacy" checked={privacy === 'exact'} onChange={() => onChange({ privacy: 'exact' })} />
            <span>Localização Exata (Pino)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="privacy" checked={privacy === 'approx'} onChange={() => onChange({ privacy: 'approx' })} />
            <span>Região Aproximada (Círculo)</span>
          </label>
        </div>
      )}
    </div>
  );
}