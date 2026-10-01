import type { RideStatus } from '../types/ride';

/**
 * Valid allowed state transitions map
 */
const VALID_TRANSITIONS: Record<RideStatus, RideStatus[]> = {
  REQUESTED: ['SEARCHING', 'CANCELLED_BY_STUDENT', 'EXPIRED'],
  SEARCHING: ['OFFERED', 'CANCELLED_BY_STUDENT', 'EXPIRED'],
  OFFERED: ['ACCEPTED', 'DECLINED', 'SEARCHING', 'CANCELLED_BY_STUDENT', 'EXPIRED'],
  ACCEPTED: ['RIDER_EN_ROUTE', 'ARRIVED', 'CANCELLED_BY_STUDENT', 'CANCELLED_BY_RIDER', 'DISPUTED'],
  RIDER_EN_ROUTE: ['ARRIVED', 'CANCELLED_BY_STUDENT', 'CANCELLED_BY_RIDER', 'DISPUTED'],
  ARRIVED: ['TRIP_STARTED', 'CANCELLED_BY_STUDENT', 'CANCELLED_BY_RIDER', 'DISPUTED'],
  TRIP_STARTED: ['COMPLETED', 'DISPUTED'],
  COMPLETED: ['DISPUTED'],
  DECLINED: [],
  CANCELLED_BY_STUDENT: [],
  CANCELLED_BY_RIDER: [],
  EXPIRED: [],
  DISPUTED: []
};

/**
 * Validates whether transitioning from currentStatus to nextStatus is allowed
 */
export function canTransition(currentStatus: RideStatus, nextStatus: RideStatus): boolean {
  const allowedNext = VALID_TRANSITIONS[currentStatus] || [];
  return allowedNext.includes(nextStatus);
}

/**
 * Throws error or returns assertion for valid state transition
 */
export function validateStateTransition(currentStatus: RideStatus, nextStatus: RideStatus): void {
  if (!canTransition(currentStatus, nextStatus)) {
    throw new Error(
      `Invalid ride state transition: cannot change status from '${currentStatus}' to '${nextStatus}'.`
    );
  }
}
