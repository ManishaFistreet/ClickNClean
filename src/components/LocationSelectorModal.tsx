import React, { useState, useEffect } from "react";
import { useGeolocated } from "react-geolocated";

interface Props {
  onClose: () => void;
  onLocationSelect: (address: string, lat: number, lng: number) => void;
}

const LocationSelectorModal: React.FC<Props> = ({ onClose, onLocationSelect }) => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const { coords, getPosition } = useGeolocated({
    positionOptions: { enableHighAccuracy: true },
    userDecisionTimeout: 5000,
  });

  const fetchLocationName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      return data.display_name || "Unknown Location";
    } catch (error) {
      return "Unable to fetch address";
    }
  };

  const handleUseCurrentLocation = async () => {
    if (!coords) {
      getPosition();
      return;
    }
    const locationName = await fetchLocationName(coords.latitude, coords.longitude);
    onLocationSelect(locationName, coords.latitude, coords.longitude);
  };

  // 🔍 Fetch suggestions as the user types
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchText.trim() === "") {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchText
          )}`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Search error", error);
        setSuggestions([]);
      }
    }, 500); // debounce

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const handleSelectSuggestion = (item: any) => {
    onLocationSelect(item.display_name, parseFloat(item.lat), parseFloat(item.lon));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-lg font-semibold mb-4">Select Your Location</h2>

        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search for your area"
          className="w-full border px-3 py-2 rounded-md mb-2"
        />

        {/* 🧠 Suggestions list */}
        {suggestions.length > 0 && (
          <ul className="max-h-40 overflow-y-auto border rounded mb-4">
            {suggestions.map((item, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleSelectSuggestion(item)}
              >
                {item.display_name}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={handleUseCurrentLocation}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Use My Current Location
        </button>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default LocationSelectorModal;
