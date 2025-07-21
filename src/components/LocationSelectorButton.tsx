import { MapPin } from "lucide-react";
import LocationSelectorModal from "./LocationSelectorModal";
import { useState } from "react";

const LocationSelectorButton = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Select Location");

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
      >
        <MapPin className="w-4 h-4" />
        <span className="text-sm">{selectedLocation}</span>
      </button>

      {modalOpen && (
        <LocationSelectorModal
          onClose={() => setModalOpen(false)}
          onLocationSelect={handleLocationSelect}
        />
      )}
    </>
  );
};

export default LocationSelectorButton;
