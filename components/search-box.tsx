'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Navigation, Loader2, MapPin } from 'lucide-react';
import Script from 'next/script'; 
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { useState } from 'react';

export const SearchBox = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoadingLoc, setIsLoadingLoc] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { types: ['(cities)'] },
    debounce: 300,
    initOnMount: scriptLoaded,
  });

  const handleSelect = async (address: string) => {
    setValue(address, false); 
    clearSuggestions();
    setIsFocused(false);

    try {
      // 1. Convert "Delhi, India" -> Coordinates
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      
      // 2. Extract a pretty name (e.g., "Delhi")
      const name = address.split(',')[0];

      // 3. Push BOTH to URL: city=coords (for API) & name=text (for UI)
      router.push(`/?city=${lat},${lng}&name=${encodeURIComponent(name)}`);
      setValue("", false);
    } catch (error) {
      console.error("Geocoding error: ", error);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    if (!scriptLoaded) return alert('Maps service is loading...');
    
    setIsLoadingLoc(true);
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const results = await getGeocode({ location: { lat: latitude, lng: longitude } });
          let cityName = "Current Location";
          
          if (results[0]) {
             // Try to find the city name
             const cityComponent = results[0].address_components.find((c: any) => c.types.includes('locality'));
             cityName = cityComponent ? cityComponent.long_name : results[0].formatted_address.split(',')[0];
          }
          
          router.push(`/?city=${latitude},${longitude}&name=${encodeURIComponent(cityName)}`);
        } catch (error) {
          router.push(`/?city=${latitude},${longitude}`);
        }
        
        setIsLoadingLoc(false);
        setValue("", false);
      },
      () => {
        alert('Location access denied.');
        setIsLoadingLoc(false);
      }
    );
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`}
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />

      <div className="absolute top-6 left-0 right-0 z-50 flex flex-col items-center px-4 pointer-events-none">
        <div className={`
          pointer-events-auto relative
          flex items-center gap-3 w-full max-w-lg p-3 px-4 rounded-2xl
          bg-[#0f141e]/80 backdrop-blur-xl border border-white/10
          shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transition-all duration-300
          ${isFocused ? 'bg-[#0f141e]/95 border-white/20' : ''}
        `}>
          <Search size={18} className="text-white/40 min-w-[18px]" />
          <input
            value={value}
            placeholder={scriptLoaded ? "Search for a city..." : "Loading maps..."}
            disabled={!ready}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/40 text-base h-full w-full font-medium tracking-wide"
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />
          <div className="w-[1px] h-6 bg-white/10" />
          <button 
            onClick={handleCurrentLocation}
            disabled={isLoadingLoc || !scriptLoaded}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 text-white/80 transition-all disabled:opacity-30"
          >
            {isLoadingLoc ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} className="transform -rotate-45" />}
          </button>
        </div>

        {isFocused && status === "OK" && (
          <div className="pointer-events-auto w-full max-w-lg mt-2 bg-[#0f141e]/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2">
            {data.map((place) => (
              <button
                key={place.place_id}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors border-b border-white/5 last:border-none"
                onClick={() => handleSelect(place.description)}
              >
                <MapPin size={16} className="text-white/30" />
                <span className="truncate">
                  <span className="text-white font-medium">{place.structured_formatting.main_text}</span>
                  <span className="text-white/40 ml-1 text-sm">{place.structured_formatting.secondary_text}</span>
                </span>
              </button>
            ))}
            <div className="px-4 py-1 flex justify-end">
               <img src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-non-white3.png" alt="Powered by Google" className="h-4 opacity-60" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};