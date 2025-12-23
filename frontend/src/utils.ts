export const formatDate = (dateString: string | Date) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const formatDateWithWeekday = (dateString: string | Date) =>
  new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const formatDateWithLongWeekday = (dateString: string | Date) =>
  new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const formatDateTime = (dateString: string | Date) =>
  new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const getMonthName = (year: number, month: number) =>
  new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

export const dateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getTodayString = (): string => dateToString(new Date());

export const isFutureDate = (date: Date | null): boolean => {
  if (!date) return false;
  const dateStr = dateToString(date);
  const todayStr = getTodayString();
  return dateStr > todayStr;
};

export const isTodayDate = (date: Date | null): boolean => {
  if (!date) return false;
  const dateStr = dateToString(date);
  const todayStr = getTodayString();
  return dateStr === todayStr;
};
