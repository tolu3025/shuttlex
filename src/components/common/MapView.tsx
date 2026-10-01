import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { LocationPoint, CampusLocation } from '../../types/ride';
import { DEFAULT_CAMPUS_LOCATIONS } from '../../constants/campus';

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';
export const MAPBOX_STREETS_TILES = MAPBOX_TOKEN
  ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`
  : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const MAPBOX_LIGHT_TILES = MAPBOX_TOKEN
  ? `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`
  : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

// Fix Leaflet default marker icon paths in web builds
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom ShuttleX Green & Amber Map Icons
const pickupIcon = L.divIcon({
  className: 'custom-map-icon',
  html: `<div style="background-color: #0B6B4B; width: 34px; height: 34px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 4px 14px rgba(11,107,75,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 14px;">A</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const dropoffIcon = L.divIcon({
  className: 'custom-map-icon',
  html: `<div style="background-color: #071F17; width: 34px; height: 34px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 4px 14px rgba(7,31,23,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 14px;">B</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

// Bike Model / Rider Map Marker
const bikeIcon = L.divIcon({
  className: 'custom-bike-icon',
  html: `<div style="background-color: #F4B740; width: 42px; height: 42px; border-radius: 50%; border: 3px solid #071F17; box-shadow: 0 6px 18px rgba(7,31,23,0.35); display: flex; align-items: center; justify-content: center; font-size: 20px;">🏍️</div>`,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

const carIcon = L.divIcon({
  className: 'custom-car-icon',
  html: `<div style="background-color: #0B6B4B; width: 42px; height: 42px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 6px 18px rgba(11,107,75,0.35); display: flex; align-items: center; justify-content: center; font-size: 20px;">🚗</div>`,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

const landmarkIcon = L.divIcon({
  className: 'custom-landmark-icon',
  html: `<div style="background-color: #FFFFFF; width: 28px; height: 28px; border-radius: 50%; border: 2px solid #0B6B4B; box-shadow: 0 2px 8px rgba(11,107,75,0.2); display: flex; align-items: center; justify-content: center; font-size: 12px;">🏛️</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

interface MapViewProps {
  pickup?: LocationPoint;
  destination?: LocationPoint;
  riderLocation?: { latitude: number; longitude: number };
  campusLocations?: CampusLocation[];
  onSelectMapLocation?: (point: LocationPoint) => void;
  height?: string;
  showLandmarks?: boolean;
  vehicleType?: 'bike' | 'car';
}

// Map Auto-Fitter Component
const MapRecenter: React.FC<{
  pickup?: LocationPoint;
  destination?: LocationPoint;
  riderLocation?: { latitude: number; longitude: number };
}> = ({ pickup, destination, riderLocation }) => {
  const map = useMap();

  useEffect(() => {
    const points: [number, number][] = [];
    if (pickup) points.push([pickup.latitude, pickup.longitude]);
    if (destination) points.push([destination.latitude, destination.longitude]);
    if (riderLocation) points.push([riderLocation.latitude, riderLocation.longitude]);

    if (points.length >= 2) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    } else if (points.length === 1) {
      map.setView(points[0], 16);
    }
  }, [pickup, destination, riderLocation, map]);

  return null;
};

// Map Click Handler Component
const MapClickHandler: React.FC<{ onSelect: (point: LocationPoint) => void }> = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
        name: `Pin (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`
      });
    }
  });
  return null;
};

export const MapView: React.FC<MapViewProps> = ({
  pickup,
  destination,
  riderLocation,
  campusLocations = DEFAULT_CAMPUS_LOCATIONS,
  onSelectMapLocation,
  height = '340px',
  showLandmarks = true,
  vehicleType = 'bike'
}) => {
  const defaultCenter: [number, number] = [6.5173, 3.3890]; // UNILAG Campus Coordinates

  const routePoints: [number, number][] = [];
  if (pickup) routePoints.push([pickup.latitude, pickup.longitude]);
  if (destination) routePoints.push([destination.latitude, destination.longitude]);

  return (
    <div className="relative w-full rounded-[28px] overflow-hidden shuttlex-shadow-lg border border-[#E5EAE6]" style={{ height }}>
      <MapContainer
        center={pickup ? [pickup.latitude, pickup.longitude] : defaultCenter}
        zoom={16}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
        zoomControl={false}
      >
        {/* Mapbox Streets/Light Retina Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={MAPBOX_STREETS_TILES}
          tileSize={512}
          zoomOffset={-1}
          maxZoom={19}
        />

        <MapRecenter pickup={pickup} destination={destination} riderLocation={riderLocation} />
        {onSelectMapLocation && <MapClickHandler onSelect={onSelectMapLocation} />}

        {/* Campus Landmarks */}
        {showLandmarks &&
          campusLocations.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.latitude, loc.longitude]}
              icon={landmarkIcon}
              eventHandlers={{
                click: () => {
                  if (onSelectMapLocation) {
                    onSelectMapLocation({
                      latitude: loc.latitude,
                      longitude: loc.longitude,
                      name: loc.name
                    });
                  }
                }
              }}
            >
              <Popup className="custom-popup">
                <div className="p-1.5">
                  <p className="font-extrabold text-xs text-[#071F17]">{loc.name}</p>
                  <p className="text-[11px] text-[#738078]">{loc.description}</p>
                  <p className="text-[10px] text-[#0B6B4B] font-bold mt-1">Tap to select as stop</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Pickup Pin */}
        {pickup && (
          <Marker position={[pickup.latitude, pickup.longitude]} icon={pickupIcon}>
            <Popup className="custom-popup">
              <div className="p-1.5">
                <p className="text-[10px] font-extrabold text-[#0B6B4B] uppercase tracking-wider">Pickup Point (A)</p>
                <p className="font-extrabold text-xs text-[#071F17]">{pickup.name}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Pin */}
        {destination && (
          <Marker position={[destination.latitude, destination.longitude]} icon={dropoffIcon}>
            <Popup className="custom-popup">
              <div className="p-1.5">
                <p className="text-[10px] font-extrabold text-[#071F17] uppercase tracking-wider">Destination (B)</p>
                <p className="font-extrabold text-xs text-[#071F17]">{destination.name}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Live Rider Location (Bike Model) */}
        {riderLocation && (
          <Marker 
            position={[riderLocation.latitude, riderLocation.longitude]} 
            icon={vehicleType === 'bike' ? bikeIcon : carIcon}
          >
            <Popup className="custom-popup">
              <div className="p-1.5">
                <p className="font-extrabold text-xs text-[#071F17]">
                  {vehicleType === 'bike' ? '🏍️ Campus Rider (Online)' : '🚗 ShuttleX Driver'}
                </p>
                <p className="text-[10px] text-[#0B6B4B] font-semibold">Live GPS position</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Line */}
        {routePoints.length === 2 && (
          <Polyline
            positions={routePoints}
            pathOptions={{
              color: '#0B6B4B',
              weight: 5,
              opacity: 0.9,
              dashArray: '10, 8',
              lineCap: 'round'
            }}
          />
        )}
      </MapContainer>

      {/* Mapbox Live Watermark Badge */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-extrabold text-[#071F17] border border-[#E5EAE6] shuttlex-shadow-sm flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#0B6B4B] animate-pulse"></span>
        <span>Mapbox Vector Engine • Live Campus GPS</span>
      </div>
    </div>
  );
};
