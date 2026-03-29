export function formatRelativeDate(date: string | Date | number): string {
  try {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const parsedDate = new Date(date);
    const now = new Date();
    const diffDays = Math.round((parsedDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays === 0) return 'today';
    
    return rtf.format(diffDays, 'day');
  } catch {
    return String(date);
  }
}
