/**
 * Data Helper Functions
 * Utility functions for data transformation and validation
 */

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('ur-PK', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('ur-PK', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up':
      return '📈';
    case 'down':
      return '📉';
    case 'stable':
      return '➡️';
    default:
      return '➡️';
  }
}

export function getTrendColor(trend: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up':
      return 'text-emerald-500';
    case 'down':
      return 'text-rose-500';
    case 'stable':
      return 'text-slate-500';
    default:
      return 'text-slate-500';
  }
}