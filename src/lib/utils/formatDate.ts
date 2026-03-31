export function formatDate(date: string | Date | number): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  } catch {
    return String(date);
  }
}

export function formatSmartDate(date: string | Date | number): string {
  try {
    const d = new Date(date);

    const today = new Date();
    const localToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();

    const localDate = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

    const diff = localToday - localDate;

    if (diff === 0) return 'Today';
    if (diff === 24 * 60 * 60 * 1000) return 'Yesterday';

    return formatDate(d);
  } catch {
    return String(date);
  }
}
