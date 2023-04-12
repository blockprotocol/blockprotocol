import { format, formatDistanceToNowStrict, isSameDay } from "date-fns";

export const formatDate = (date?: Date | string | null) => {
  if (!date) {
    return { relative: "Never", exact: "" };
  }

  const actualDate = typeof date === "string" ? new Date(date) : date;

  const sameDay = isSameDay(actualDate, Date.now());

  return {
    relative: formatDistanceToNowStrict(actualDate, {
      addSuffix: true,
    }),
    exact: sameDay
      ? `${format(actualDate, "kk:mm")} today`
      : format(actualDate, "MMMM d yyyy"),
  };
};
