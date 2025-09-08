import { format, isToday, isYesterday, parseISO } from 'date-fns';

export const formatMessageTime = (timestamp) => {
  const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return `Yesterday ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'MMM dd, HH:mm');
  }
};

export const formatSessionDate = (timestamp) => {
  const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;
  
  if (isToday(date)) {
    return `Today at ${format(date, 'HH:mm')}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'MMM dd, yyyy at HH:mm');
  }
};

export const formatDate = (timestamp) => {
  const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;
  return format(date, 'MMM dd, yyyy');
};

export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const formatMoodScore = (score) => {
  return score ? score.toFixed(1) : 'N/A';
};

export const formatPercentage = (value, total) => {
  if (!total) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};