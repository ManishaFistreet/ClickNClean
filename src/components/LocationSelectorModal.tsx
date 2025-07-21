import React, { useState, useEffect } from "react";
import { useGeolocated } from "react-geolocated";
import Button from "./Button";
import { closeX } from "../assets";

interface Props {
  onClose: () => void;
  onLocationSelect: (address: string, lat: number, lng: number) => void;
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  [key: string]: unknown;
}

const LocationSelectorModal: React.FC<Props> = ({ onClose, onLocationSelect }) => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);

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
      console.error("Unable to fetch address", error)
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

  const handleSelectSuggestion = (item: LocationSuggestion) => {
    onLocationSelect(item.display_name, parseFloat(item.lat), parseFloat(item.lon));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Select Your Location</h2>
          <img src={closeX} alt="Close" onClick={onClose}/>
        </div>
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
        <div className="flex justify-center">
          <Button
            onClick={handleUseCurrentLocation}
            variant="secondary"
            className="mt-4"
          >
            Use My Current Location
          </Button>
        </div>


      </div>
    </div>
  );
};

export default LocationSelectorModal;
