import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { LocationPoint, CampusLocation } from '../../types/ride';
import { DEFAULT_CAMPUS_LOCATIONS } from '../../constants/campus';

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';
export const MAPBOX_LIGHT_TILES = `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`;

// Fix Leaflet default marker icon paths in web builds
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Minimalist Mapbox Icons
const pickupIcon = L.divIcon({
  className: 'custom-map-icon',
  html: `<div style="background-color: #010101; width: 30px; height: 30px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 4px 14px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 13px;">A</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const dropoffIcon = L.divIcon({
  className: 'custom-map-icon',
  html: `<div style="background-color: #010101; width: 30px; height: 30px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 4px 14px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 13px;">B</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Bike Model / Vehicle Map Marker
const bikeIcon = L.divIcon({
  className: 'custom-bike-icon',
  html: `<div style="background-color: #010101; width: 38px; height: 38px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 6px 18px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 18px;">🏍️</div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

const carIcon = L.divIcon({
  className: 'custom-car-icon',
  html: `<div style="background-color: #010101; width: 38px; height: 38px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 6px 18px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 18px;">🚗</div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

const landmarkIcon = L.divIcon({
  className: 'custom-landmark-icon',
  html: `<div style="background-color: #FFFFFF; width: 24px; height: 24px; border-radius: 50%; border: 2px solid #010101; box-shadow: 0 2px 6px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; font-size: 11px;">📍</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
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
      map.setView(points[0], 15);
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
        name: `Custom Location (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`
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
  height = '320px',
  showLandmarks = true,
  vehicleType = 'bike'
}) => {
  const defaultCenter: [number, number] = [6.5173, 3.3890];

  const routePoints: [number, number][] = [];
  if (pickup) routePoints.push([pickup.latitude, pickup.longitude]);
  if (destination) routePoints.push([destination.latitude, destination.longitude]);

  return (
    <div className="relative w-full rounded-[28px] overflow-hidden shuttlex-shadow-sm border border-[#EEEEEE]" style={{ height }}>
      <MapContainer
        center={pickup ? [pickup.latitude, pickup.longitude] : defaultCenter}
        zoom={15}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
        zoomControl={false}
      >
        {/* Mapbox Light v11 Retina Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={MAPBOX_LIGHT_TILES}
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
                <div className="p-1">
                  <p className="font-extrabold text-xs text-[#010101]">{loc.name}</p>
                  <p className="text-[11px] text-[#666666]">{loc.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Pickup Pin */}
        {pickup && (
          <Marker position={[pickup.latitude, pickup.longitude]} icon={pickupIcon}>
            <Popup className="custom-popup">
              <div className="p-1">
                <p className="text-[10px] font-bold text-[#666666] uppercase">Pickup Point</p>
                <p className="font-extrabold text-xs text-[#010101]">{pickup.name}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Pin */}
        {destination && (
          <Marker position={[destination.latitude, destination.longitude]} icon={dropoffIcon}>
            <Popup className="custom-popup">
              <div className="p-1">
                <p className="text-[10px] font-bold text-[#666666] uppercase">Destination</p>
                <p className="font-extrabold text-xs text-[#010101]">{destination.name}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Live Rider Location (Bike Model or Car) */}
        {riderLocation && (
          <Marker 
            position={[riderLocation.latitude, riderLocation.longitude]} 
            icon={vehicleType === 'bike' ? bikeIcon : carIcon}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <p className="font-extrabold text-xs text-[#010101]">
                  {vehicleType === 'bike' ? '🏍️ Campus Bike Rider' : '🚗 ShuttleX Driver'}
                </p>
                <p className="text-[10px] text-[#666666]">Active live location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Line */}
        {routePoints.length === 2 && (
          <Polyline
            positions={routePoints}
            pathOptions={{
              color: '#010101',
              weight: 4,
              opacity: 0.85,
              dashArray: '8, 8',
              lineCap: 'round'
            }}
          />
        )}
      </MapContainer>

      {/* Mapbox Live Watermark Badge */}
      <div className="absolute bottom-2 left-2 z-20 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-extrabold text-[#010101] border border-white/60 shuttlex-shadow-sm flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-black"></span>
        <span>Mapbox Vector Engine</span>
      </div>
    </div>
  );
};
