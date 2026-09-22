import { User, ClassSession, Studio } from '../types';
import { MOCK_USER, UPCOMING_CLASSES, STUDIOS } from '../constants';

const STORAGE_KEYS = {
  USER: 'xpass_user_data',
  BOOKINGS: 'xpass_bookings',
  CLASSES: 'xpass_partner_classes',
  PARTNER_METRICS: 'xpass_partner_metrics',
  MEALS: 'xpass_meals',
};

export const getStoredUser = (): User => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse stored user', e);
  }
  return MOCK_USER;
};

export const saveStoredUser = (user: User): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user', e);
  }
};

export const getStoredBookings = (): ClassSession[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load bookings', e);
  }
  return UPCOMING_CLASSES;
};

export const saveBooking = (booking: ClassSession): ClassSession[] => {
  const current = getStoredBookings();
  const updated = [booking, ...current];
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save booking', e);
  }
  return updated;
};

export const getStoredPartnerMetrics = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PARTNER_METRICS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load partner metrics', e);
  }
  return { revenue: 450, checkIns: 12 };
};

export const savePartnerMetrics = (revenue: number, checkIns: number) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PARTNER_METRICS, JSON.stringify({ revenue, checkIns }));
  } catch (e) {
    console.error('Failed to save partner metrics', e);
  }
};
