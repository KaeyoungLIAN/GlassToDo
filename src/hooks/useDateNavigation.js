import { useState, useMemo, useCallback } from "react";

function fmt(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Return the single most accurate completion date for a task.
 * Weekly tasks record every occurrence in completed_dates[]; one-off and
 * persisted tasks record the moment of completion in completed_at.
 */
function completedDates(t) {
  const dates = [];
  if (t.completed_dates && t.completed_dates.length) {
    dates.push(...t.completed_dates);
  }
  if (t.completed && t.completed_at) {
    dates.push(t.completed_at);
  }
  // Backward compatibility: legacy tasks may only carry `completed` + a due date.
  if (t.completed && !t.completed_at && t.reminder_data?.datetime) {
    dates.push(t.reminder_data.datetime.slice(0, 10));
  }
  return dates;
}

export default function useDateNavigation(tasks) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const dateStr = fmt(currentDate);
  const today = new Date();
  const todayStr = fmt(today);
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  const yesterdayStr = fmt(yesterday);

  const weekStart = new Date(today);
  const day = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() - (day === 0 ? 6 : day - 1));
  const weekStartStr = fmt(weekStart);

  const yesterdayCompleted = useMemo(
    () => tasks.filter((t) => completedDates(t).includes(yesterdayStr)).length,
    [tasks, yesterdayStr]
  );

  const weekCompleted = useMemo(
    () => tasks.filter((t) =>
      completedDates(t).some((d) => d >= weekStartStr && d <= todayStr)
    ).length,
    [tasks, weekStartStr, todayStr]
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
