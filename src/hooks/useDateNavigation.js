import { useState, useMemo, useCallback } from "react";

function taskDate(t) {
  if (t.reminder_data?.datetime && t.reminder_data.datetime.length >= 10)
    return t.reminder_data.datetime.slice(0, 10);
  return t.created_at.slice(0, 10);
}

function fmt(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function useDateNavigation(tasks) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const dateStr = fmt(currentDate);
  const today = new Date();
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  const yesterdayStr = fmt(yesterday);

  const weekStart = new Date(today);
  const day = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() - (day === 0 ? 6 : day - 1));
  const weekStartStr = fmt(weekStart);

  const isTaskCompletedOn = (t, d) => t.completed || t.completed_dates?.includes(d);

  const yesterdayCompleted = useMemo(
    () => tasks.filter((t) => isTaskCompletedOn(t, yesterdayStr)).length,
    [tasks, yesterdayStr]
  );

  const weekCompleted = useMemo(() =>
    tasks.filter((t) => {
      if (t.completed_dates?.some((d) => d >= weekStartStr && d <= dateStr)) return true;
      return t.completed && taskDate(t) >= weekStartStr && taskDate(t) <= dateStr;
    }).length,
    [tasks, weekStartStr, dateStr]
  );

  const goPrev = useCallback(() => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1)), []);
  const goNext = useCallback(() => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)), []);
  const goToday = useCallback(() => setCurrentDate(new Date()), []);
  const goToDate = useCallback((d) => setCurrentDate(d), []);

  return {
    currentDate, dateStr,
    goPrev, goNext, goToday, goToDate,
    yesterdayCompleted, weekCompleted,
  };
}
