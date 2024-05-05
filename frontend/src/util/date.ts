import moment from 'moment/moment';

export function formatInputDateTime(date: Date): string {
  return moment(date).format('YYYY-MM-DD hh:mm');
}

export function parseInputDateTime(value: string): Date {
  return moment(value, 'YYYY-MM-DD hh:mm').toDate();
}