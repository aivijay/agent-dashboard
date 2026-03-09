export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor(Date.now() - timestamp);
  
  if (seconds < 60000) return 'just now';
  if (seconds < 3600000) return `${Math.floor(seconds / 60000)}m ago`;
  if (seconds < 86400000) return `${Math.floor(seconds / 3600000)}h ago`;
  return `${Math.floor(seconds / 86400000)}d ago`;
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}
