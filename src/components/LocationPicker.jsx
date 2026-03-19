import React, { useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { MapPin, Search } from 'lucide-react';

// A lista de bibliotecas DEVE ficar fora do componente para evitar bugs de re-renderização
const libraries = ['places']; 
const DEFAULT_CENTER = { lat: -20.5236, lng: -43.6914 }; // Centro de Ouro Branco

export default function LocationPicker({ locationData, setLocationData }) {
  // Carrega o script do Google usando a chave que você colocou no .env
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const [mapCenter, setMapCenter] = useState(
    locationData?.lat && locationData?.lng 
      ? { lat: locationData.lat, lng: locationData.lng } 
      : DEFAULT_CENTER
  );
  const [addressText, setAddressText] = useState(locationData?.address || '');
  const [autocomplete, setAutocomplete] = useState(null);

  const onLoadAutocomplete = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  // Função chamada quando o usuário escolhe um endereço na lista suspensa do Google
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const addressName = place.formatted_address || place.name;
        
        setMapCenter({ lat, lng });
        setAddressText(addressName);
        setLocationData({ address: addressName, lat, lng });
      }
    }
  };

  // Função chamada quando o usuário clica direto no mapa
  const onMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMapCenter({ lat, lng });

    // Pega as coordenadas e pergunta ao Google qual é o nome da rua (Reverse Geocoding)
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        // Pega as 3 primeiras partes do endereço (Rua, Bairro, Cidade) para não ficar gigante
        const addressParts = results[0].formatted_address.split(',').slice(0, 3).join(',');
        setAddressText(addressParts);
        setLocationData({ address: addressParts, lat, lng });
      } else {
        setLocationData({ address: "Localização Manual", lat, lng });
        setAddressText("Localização Manual");
      }
    });
  };

  if (loadError) return <div className="p-4 bg-red-50 text-red-600 rounded-xl">Erro ao carregar o mapa. Verifique sua chave de API ou faturamento.</div>;
  if (!isLoaded) return <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500">Carregando mapa do Google...</div>;

  return (
    <div className="w-full space-y-3">
      <div className="relative">
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Buscar Endereço do Imóvel/Empresa</label>
        
        {/* Caixa de busca inteligente do Google */}
        <Autocomplete
          onLoad={onLoadAutocomplete}
          onPlaceChanged={onPlaceChanged}
          restrictions={{ country: 'br' }} // Limita resultados ao Brasil para facilitar
        >
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-3 text-slate-400 z-10" />
            <input 
              type="text" 
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
              placeholder="Digite a rua, bairro..." 
              className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 transition"
            />
          </div>
        </Autocomplete>
      </div>

      <p className="text-xs text-slate-500 flex items-center gap-1">
        <MapPin size={12}/> Ou clique no mapa para marcar a localização exata:
      </p>

      {/* MAPA INTERATIVO */}
      <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-200 z-0 relative">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={16}
          onClick={onMapClick}
          options={{
            streetViewControl: false, // Desativa o bonequinho amarelo
            mapTypeControl: false,    // Desativa a troca para satélite
            fullscreenControl: false, // Desativa tela cheia
            gestureHandling: 'cooperative' // Evita dar zoom sem querer ao rolar a página
          }}
        >
          {locationData?.lat && locationData?.lng && (
            <Marker position={{ lat: locationData.lat, lng: locationData.lng }} />
          )}
        </GoogleMap>
      </div>
    </div>
  );
}