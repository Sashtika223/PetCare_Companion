export const calculateVaccinationStatus = (nextDueDate?: Date | string | null): string => {
  if (!nextDueDate) return 'Up to Date';

  const dueDate = new Date(nextDueDate);
  const now = new Date();
  // Normalize dates to start of day for accurate comparison
  dueDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Overdue';
  } else if (diffDays <= 30) {
    return 'Due Soon';
  } else {
    return 'Up to Date';
  }
};
