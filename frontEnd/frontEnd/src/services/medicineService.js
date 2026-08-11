// src/services/medicineService.js

export const calculateNextDose = (frequency) => {
  const now = new Date();
  if (frequency.toLowerCase().includes('once')) {
    now.setHours(now.getHours() + 24);
  } else if (frequency.toLowerCase().includes('twice')) {
    now.setHours(now.getHours() + 12);
  } else {
    now.setHours(now.getHours() + 8);
  }
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const getRefillStatus = (stock) => {
  if (stock <= 2) return { label: 'Critical Refill Needed', color: '#ef4444' };
  if (stock <= 5) return { label: 'Refill Soon', color: '#f59e0b' };
  return { label: 'Stock Sufficient', color: '#10b981' };
};
