import { DEFAULT_FARE_CONFIG } from '../constants/campus';
import type { FareConfig, FareEstimate, LocationPoint } from '../types/ride';

/**
 * Calculates straight-line and route distance in kilometers between two lat/lng coordinates
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const directDistance = R * c;
  
  // Campus roads factor (multiply by ~1.35 to estimate actual winding campus road distance)
  const routeDistance = directDistance * 1.35;
  // Minimum campus distance 0.4km
  return Math.max(0.4, Number(routeDistance.toFixed(2)));
}

/**
 * Calculates motorcycle travel time on campus (average 22 km/h considering campus speed limits & turns)
 */
export function calculateDurationMins(distanceKm: number): number {
  const avgSpeedKmH = 22;
  const rawMinutes = (distanceKm / avgSpeedKmH) * 60;
  // Add 1 min pickup buffer
  const totalMins = Math.ceil(rawMinutes + 1);
  return Math.max(2, totalMins);
}

/**
 * Configurable Fare Engine
 * Calculates base fare, distance charge, surge pricing, minimum fare floor.
 */
export function calculateFare(
  pickup: LocationPoint,
  destination: LocationPoint,
  customConfig?: Partial<FareConfig>
): FareEstimate {
  const config: FareConfig = {
    ...DEFAULT_FARE_CONFIG,
    ...customConfig
  };

  const distanceKm = calculateDistanceKm(
    pickup.latitude,
    pickup.longitude,
    destination.latitude,
    destination.longitude
  );

  const durationMins = calculateDurationMins(distanceKm);

  // Fare Formula: (Base + (Distance * PricePerKm)) * PeakMultiplier
  const rawCalculated = (config.baseFare + (distanceKm * config.pricePerKm)) * config.peakMultiplier;
  
  // Apply minimum fare rule & round to nearest ₦50 for Nigerian cash/wallet convenience
  const roundedFare = Math.ceil(Math.max(config.minimumFare, rawCalculated) / 50) * 50;

  return {
    baseFare: config.baseFare,
    distanceKm,
    durationMins,
    totalFare: roundedFare,
    currency: config.currency
  };
}
