import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, MapPin, Loader } from 'lucide-react';

// Correção do ícone padrão do Leaflet no React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DEFAULT_CENTER = [-20.5236, -43.6914]; // Centro de Ouro Branco

// Componente auxiliar para atualizar a visão do mapa
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 16);
  }, [center, map]);
  return null;
}

export default function LocationPicker({ locationData, setLocationData }) {
  const [query, setQuery] = useState(locationData?.address || '');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState(
    locationData?.lat && locationData?.lng 
      ? [locationData.lat, locationData.lng] 
      : DEFAULT_CENTER
  );

  // Busca automática ao digitar (com delay de 1 seg para não travar a API gratuita)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 4 && query !== locationData?.address) {
        setSearching(true);
        try {
          // Usa a API gratuita Nominatim do OpenStreetMap
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Ouro Branco, MG')}&limit=5`);
          const data = await res.json();
          setResults(data);
        } catch (error) {
          console.error("Erro ao buscar endereço:", error);
        }
        setSearching(false);
      } else {
        setResults([]);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelectAddress = (item) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const addressName = item.display_name.split(',').slice(0, 3).join(','); // Pega a parte principal do endereço
    
    setQuery(addressName);
    setMapCenter([lat, lng]);
    setResults([]);
    setLocationData({ address: addressName, lat, lng });
  };

  // Componente que escuta os cliques no mapa para alterar o PIN manualmente
  function MapClickHandler() {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        setMapCenter([lat, lng]);
        
        // Reverse Geocoding (Descobre o nome da rua onde clicou)
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          const addressName = data.display_name ? data.display_name.split(',').slice(0, 3).join(',') : "Local selecionado no mapa";
          setQuery(addressName);
          setLocationData({ address: addressName, lat, lng });
        } catch (error) {
          setLocationData({ address: "Localização Manual", lat, lng });
        }
      },
    });
    return null;
  }

  return (
    <div className="w-full space-y-3">
      <div className="relative">
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Buscar Endereço do Imóvel</label>
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-3 text-slate-400" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite a rua, bairro..." 
            className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 transition"
          />
          {searching && <Loader size={18} className="absolute right-3 text-indigo-600 animate-spin" />}
        </div>
        
        {/* Dropdown de Resultados */}
        {results.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
            {results.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => handleSelectAddress(item)}
                className="p-3 hover:bg-indigo-50 cursor-pointer flex items-start gap-2 border-b border-slate-100 last:border-0"
              >
                <MapPin size={16} className="text-indigo-600 mt-1 shrink-0" />
                <span className="text-sm text-slate-700">{item.display_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500 flex items-center gap-1">
        <MapPin size={12}/> Ou clique no mapa para marcar a localização exata:
      </p>

      {/* MAPA */}
      <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-200 z-0 relative">
        <MapContainer center={mapCenter} zoom={15} scrollWheelZoom={true} className="w-full h-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapUpdater center={mapCenter} />
          <MapClickHandler />
          {locationData?.lat && locationData?.lng && (
            <Marker position={[locationData.lat, locationData.lng]} />
          )}
        </MapContainer>
      </div>
    </div>
  );
}