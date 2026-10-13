import React, { useState, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import { t } from "../i18n";

function pad(n) { return String(n).padStart(2, "0"); }
function fmt(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

function defaultRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return [fmt(start), fmt(end)];
}

// Start of week (Monday) and end of week (Sunday)
function weekRange(base) {
  const d = new Date(base);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // to Monday
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  return [fmt(start), fmt(end)];
}

function monthRange(base) {
  const start = new Date(base.getFullYear(), base.getMonth(), 1);
  const end = new Date(base.getFullYear(), base.getMonth() + 1, 0);
  return [fmt(start), fmt(end)];
}

// Shift a date range by +dir in units of "week" or "month"
function shiftRange(start, end, unit, dir) {
  const s = new Date(start);
  const e = new Date(end);
  if (unit === "month") {
    return monthRange(new Date(s.getFullYear(), s.getMonth() + dir, 1));
  }
  s.setDate(s.getDate() + dir * 7);
  e.setDate(e.getDate() + dir * 7);
  return [fmt(s), fmt(e)];
}

export default function ExportModal({ lang, tasks, onClose, showToast }) {
  const [startDate, setStartDate] = useState(() => defaultRange()[0]);
  const [endDate, setEndDate] = useState(() => defaultRange()[1]);
  const [period, setPeriod] = useState("custom"); // 'week' | 'month' | 'custom'
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  // Group completed records by date within range
  const groups = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      if (task.reminder_type === "weekly") {
        // Weekly tasks: dates from completed_dates
        const dates = task.completed_dates || [];
        dates.forEach((d) => {
          if (d >= startDate && d <= endDate) {
            if (!map[d]) map[d] = [];
            map[d].push(task);
          }
        });
      } else if (task.persist && task.completed && task.completed_at) {
        // Persisted tasks: show on each day from creation to completion
        const start = task.created_at.slice(0, 10);
        const end = task.completed_at;
        if (start > endDate || end < startDate) return;
        const d = new Date(start);
        const endD = new Date(end);
        while (d <= endD) {
          const ds = d.toISOString().slice(0, 10);
          if (ds >= startDate && ds <= endDate) {
            if (!map[ds]) map[ds] = [];
            map[ds].push(task);
          }
          d.setDate(d.getDate() + 1);
        }
      } else {
        // Regular / cron tasks: use completed_at
        if (task.completed && task.completed_at && task.completed_at >= startDate && task.completed_at <= endDate) {
          if (!map[task.completed_at]) map[task.completed_at] = [];
          map[task.completed_at].push(task);
        }
      }
    });
    return Object.keys(map).sort((a, b) => b.localeCompare(a)).map((date) => ({
      date,
      items: map[date],
    }));
  }, [tasks, startDate, endDate]);

  const totalCount = useMemo(() => groups.reduce((sum, g) => sum + g.items.length, 0), [groups]);

  // Build human-readable summary text for clipboard / file
  const buildSummaryText = () => {
    const dayNames = lang === "zh"
      ? ["日","一","二","三","四","五","六"]
      : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const lines = [
      `${lang === "zh" ? "完成记录" : "Completion Record"}`,
      `${startDate} ~ ${endDate}`,
      `${lang === "zh" ? `共计 ${totalCount} 项` : `${totalCount} items`}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
    ];
    groups.forEach((g) => {
      lines.push(``);
      const d = new Date(g.date);
      const label = lang === "zh"
        ? `${g.date} (周${dayNames[d.getDay()]}) — ${g.items.length} 项`
        : `${g.date} (${dayNames[d.getDay()]}) — ${g.items.length} items`;
      lines.push(label);
      g.items.forEach((item) => {
        lines.push(`  [x] ${item.content}`);
      });
    });
    if (groups.length === 0) {
      lines.push(`\n${t(lang, "noCompletedInRange")}`);
    }
    return lines.join("\n");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildSummaryText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const ta = document.createElement("textarea");
      ta.value = buildSummaryText();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const path = await invoke("save_export", { text: buildSummaryText() });
      if (showToast) showToast(t(lang, "saveSuccess").replace("{0}", path));
    } catch (e) {
      if (e !== "Saved cancelled" && showToast) {
        showToast(`${t(lang, "error")}: ${e}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const applyWeek = () => {
    const [s, e] = weekRange(new Date());
    setStartDate(s);
    setEndDate(e);
    setPeriod("week");
  };
  const applyMonth = () => {
    const [s, e] = monthRange(new Date());
    setStartDate(s);
    setEndDate(e);
    setPeriod("month");
  };
  const shiftPrev = () => {
    const unit = period === "month" ? "month" : "week";
    const [s, e] = shiftRange(startDate, endDate, unit, -1);
    setStartDate(s);
    setEndDate(e);
    setPeriod(unit);
  };
  const shiftNext = () => {
    const unit = period === "month" ? "month" : "week";
    const [s, e] = shiftRange(startDate, endDate, unit, 1);
    setStartDate(s);
    setEndDate(e);
    setPeriod(unit);
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="export-modal">
        <div className="export-modal-header">
          <h2>{t(lang, "completionRecord")}</h2>
          <button className="export-modal-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="export-modal-dates">
          <div className="export-presets">
            <button
              className={"export-preset" + (period === "week" ? " active" : "")}
              onClick={applyWeek}
            >
              {t(lang, "thisWeekRange")}
            </button>
            <button
              className={"export-preset" + (period === "month" ? " active" : "")}
              onClick={applyMonth}
            >
              {t(lang, "thisMonthRange")}
            </button>
            <button
              className={"export-preset" + (period === "custom" ? " active" : "")}
              onClick={() => setPeriod("custom")}
            >
              {t(lang, "customRange")}
            </button>
            <span className="export-preset-sep" />
            <button
              className="export-shift"
              onClick={shiftPrev}
              title={t(lang, "prevPeriod")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              className="export-shift"
              onClick={shiftNext}
              title={t(lang, "nextPeriod")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="export-modal-dates">
          <div className="export-date-field">
            <label>{t(lang, "startDate")}</label>
            <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPeriod("custom"); }} />
          </div>
          <div className="export-date-field">
            <label>{t(lang, "endDate")}</label>
            <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPeriod("custom"); }} />
          </div>
        </div>

        <div className="export-summary">
          {t(lang, "totalCompleted").replace("{0}", totalCount)}
        </div>

        <div className="export-list">
          {groups.length === 0 ? (
            <div className="export-empty">{t(lang, "noCompletedInRange")}</div>
          ) : (
            groups.map((g) => {
              const d = new Date(g.date);
              const dayNames = lang === "zh"
                ? ["日","一","二","三","四","五","六"]
                : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
              const label = lang === "zh"
                ? `${g.date} (周${dayNames[d.getDay()]}) — ${g.items.length} 项`
                : `${g.date} (${dayNames[d.getDay()]}) — ${g.items.length} items`;
              return (
                <div key={g.date} className="export-date-group">
                  <div className="export-date-label">{label}</div>
                  {g.items.map((item) => (
                    <div key={`${g.date}-${item.id}`} className="export-item">
                      <svg className="export-item-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><polyline points="8 12 11 15 16 9" />
                      </svg>
                      <span className="export-item-text">{item.content}</span>
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>

        <div className="export-modal-actions">
          <button className="export-btn" onClick={handleCopy}>
            {copied ? t(lang, "copied") : t(lang, "copyText")}
          </button>
          <button className="export-btn" onClick={handleSave} disabled={saving}>
            {saving ? "…" : t(lang, "saveFile")}
          </button>
        </div>
      </div>
    </>
  );
}
