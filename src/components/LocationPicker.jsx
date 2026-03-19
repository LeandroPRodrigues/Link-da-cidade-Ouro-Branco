import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader, Autocomplete, Circle } from '@react-google-maps/api';
import { MapPin, Search, Target, Map } from 'lucide-react';

const LIBRARIES = ['places']; 
const DEFAULT_CENTER = { lat: -20.5236, lng: -43.6914 }; 
const CIRCLE_RADIUS = 500; 

const typeColors = {
  'Venda': { hex: '#EF4444', url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' },     
  'Aluguel': { hex: '#3B82F6', url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' },   
  'Temporada': { hex: '#10B981', url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' },
  'Padrao': { hex: '#EF4444', url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' }
};

export default function LocationPicker({ locationData, setLocationData, propertyType, variant = 'property' }) {
  // Se for variant="guide", usa sempre o padrão. Se for "property", usa a cor do tipo.
  const currentStyle = variant === 'property' && propertyType ? typeColors[propertyType] : typeColors['Padrao'];

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const [mapCenter, setMapCenter] = useState(
    locationData?.lat && locationData?.lng ? { lat: locationData.lat, lng: locationData.lng } : DEFAULT_CENTER
  );
  
  const [addressText, setAddressText] = useState(locationData?.address || '');
  const [autocomplete, setAutocomplete] = useState(null);

  useEffect(() => {
    if (locationData?.lat && locationData?.lng) setMapCenter({ lat: locationData.lat, lng: locationData.lng });
    if (locationData?.address) setAddressText(locationData.address);
  }, [locationData]);

  const updateLocation = useCallback((lat, lng, address, privacy = null) => {
    const finalPrivacy = privacy || locationData?.privacy || 'exact'; 
    setMapCenter({ lat, lng });
    setAddressText(address);
    setLocationData({ ...locationData, address, lat, lng, privacy: finalPrivacy });
  }, [setLocationData, locationData]);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        updateLocation(place.geometry.location.lat(), place.geometry.location.lng(), place.formatted_address || place.name);
      }
    }
  };

  const onMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        updateLocation(lat, lng, results[0].formatted_address.split(',').slice(0, 3).join(','));
      } else {
        updateLocation(lat, lng, "Localização Manual");
      }
    });
  };

  if (loadError) return <div className="p-4 bg-red-50 text-red-600 rounded-xl">Erro ao carregar o mapa.</div>;
  if (!isLoaded) return <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl">Carregando mapa...</div>;

  return (
    <div className="w-full space-y-4 relative">
      {/* Correção vital: Força a lista do Google a aparecer na frente do Modal do Tailwind */}
      <style>{`.pac-container { z-index: 99999 !important; border-radius: 12px; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }`}</style>

      {/* SELETOR DE PRIVACIDADE (SÓ APARECE PARA IMÓVEIS) */}
      {variant === 'property' && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Privacidade no Mapa</label>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setLocationData({ ...locationData, privacy: 'exact' })}
              className={`flex items-center gap-2 p-3 border rounded-xl transition font-bold text-sm ${locationData?.privacy !== 'approx' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              <Target size={18} /> Ponto Exato
            </button>
            <button type="button" onClick={() => setLocationData({ ...locationData, privacy: 'approx' })}
              className={`flex items-center gap-2 p-3 border rounded-xl transition font-bold text-sm ${locationData?.privacy === 'approx' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              <Map size={18} /> Apenas Região (Círculo)
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
          {variant === 'property' ? 'Endereço do Imóvel' : 'Endereço do Local'}
        </label>
        <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged} restrictions={{ country: 'br' }}>
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-3 text-slate-400 z-10" />
            <input 
              type="text" value={addressText} onChange={(e) => setAddressText(e.target.value)}
              placeholder="Digite e selecione na lista..." 
              className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
            />
          </div>
        </Autocomplete>
      </div>

      <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-200 z-0 relative">
        <GoogleMap mapContainerStyle={{ width: '100%', height: '100%' }} center={mapCenter} zoom={16} onClick={onMapClick} options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}>
          {locationData?.lat && locationData?.lng && (
             locationData?.privacy === 'approx' ? (
              <Circle center={{ lat: locationData.lat, lng: locationData.lng }} radius={CIRCLE_RADIUS} options={{ fillColor: currentStyle.hex, fillOpacity: 0.35, strokeColor: currentStyle.hex, strokeOpacity: 0.8, strokeWeight: 2 }} />
            ) : (
              <Marker position={{ lat: locationData.lat, lng: locationData.lng }} icon={currentStyle.url} />
            )
          )}
        </GoogleMap>
      </div>
    </div>
  );
}