export function getInitials(name: string) {
  const names = name.split(" ");
  const firstInitial = names?.[0].substring(0, 1).toUpperCase();
  const lastInitial = names?.[names.length - 1].substring(0, 1).toUpperCase();
  return `${firstInitial}${lastInitial}`;
}