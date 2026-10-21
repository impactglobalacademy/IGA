/**
 * Common utility functions
 */

export function formatCurrency(amount: number, currency = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^a-zA-Z\d]/.test(password)
  );
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getProgrammeCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'lap': 'Leadership Acceleration',
    'cap': 'Campus Activation',
    'bap': 'Business Acceleration',
    'specialized': 'Specialized Programme',
    'map': 'Mission & Ministry',
  };
  return labels[category.toLowerCase()] || capitalizeWords(category);
}

export function getProgrammeCategoryColor(
  category: string,
): 'primary' | 'secondary' | 'success' | 'info' | 'warning' {
  const colors: Record<string, 'primary' | 'secondary' | 'success' | 'info' | 'warning'> = {
    'lap': 'primary',
    'cap': 'secondary',
    'bap': 'success',
    'specialized': 'info',
    'map': 'warning',
  };
  return colors[category.toLowerCase()] || 'primary';
}

export function getMonthName(month: number): string {
  return new Date(2024, month - 1).toLocaleString('en-US', { month: 'long' });
}

export function isFutureDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj > new Date();
}

export function getDaysSince(date: Date | string): number {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - dateObj.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getProgrammeDuration(weeks: number): string {
  if (weeks === 1) return '1 week';
  if (weeks < 4) return `${weeks} weeks`;
  const months = Math.round(weeks / 4);
  return months === 1 ? '1 month' : `${months} months`;
}
