import React, { useState, useMemo } from "react";
import { t } from "../i18n";

// Returns [start, end] as ISO strings for the last N days
function defaultRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return [start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)];
}

export default function ExportModal({ lang, tasks, onClose }) {
  const [startDate, setStartDate] = useState(() => defaultRange()[0]);
  const [endDate, setEndDate] = useState(() => defaultRange()[1]);
  const [copied, setCopied] = useState(false);

  // Group completed records by date within the range
  const groups = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      const dates = task.completed_dates || [];
      dates.forEach((d) => {
        if (d >= startDate && d <= endDate) {
          if (!map[d]) map[d] = [];
          map[d].push(task);
        }
      });
    });
    // Sort dates descending
    return Object.keys(map).sort((a, b) => b.localeCompare(a)).map((date) => ({
      date,
      items: map[date],
    }));
  }, [tasks, startDate, endDate]);

  const totalCount = groups.reduce((sum, g) => sum + g.items.length, 0);

  // Build human-readable text for clipboard
  const buildSummaryText = () => {
    const lines = [
      `📋 GlassToDo ${t(lang, "completionRecord")}`,
      `📅 ${startDate} ~ ${endDate}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
    ];
    groups.forEach((g) => {
      lines.push(``);
      const d = new Date(g.date);
      const dayNames = lang === "zh" ? ["日","一","二","三","四","五","六"] : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      const label = lang === "zh"
        ? `📌 ${g.date} (周${dayNames[d.getDay()]}) — ${g.items.length} 项`
        : `📌 ${g.date} (${dayNames[d.getDay()]}) — ${g.items.length} items`;
      lines.push(label);
      g.items.forEach((item) => {
        lines.push(`  ✅ ${item.content}`);
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
      // fallback
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

  const handleSave = () => {
    downloadText();
  };

  const downloadText = () => {
    const blob = new Blob([buildSummaryText()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GlassToDo_${startDate}_${endDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
          <div className="export-date-field">
            <label>{t(lang, "startDate")}</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="export-date-input" />
          </div>
          <span className="export-date-sep">—</span>
          <div className="export-date-field">
            <label>{t(lang, "endDate")}</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="export-date-input" />
          </div>
        </div>

        <div className="export-modal-summary">
          {t(lang, "totalCompleted")}: <strong>{totalCount}</strong>
        </div>

        <div className="export-modal-list">
          {groups.length === 0 ? (
            <div className="export-empty">{t(lang, "noCompletedInRange")}</div>
          ) : (
            groups.map((g) => {
              const d = new Date(g.date);
              const dayNames = lang === "zh" ? ["日","一","二","三","四","五","六"] : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
              return (
                <div key={g.date} className="export-day-group">
                  <div className="export-day-label">
                    {lang === "zh"
                      ? `${g.date} (周${dayNames[d.getDay()]}) — ${g.items.length} ${t(lang, "items")}`
                      : `${g.date} (${dayNames[d.getDay()]}) — ${g.items.length} ${t(lang, "items")}`}
                  </div>
                  {g.items.map((item) => (
                    <div key={item.id} className="export-item">
                      <span className="export-item-check">✅</span>
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
          <button className="export-btn" onClick={handleSave}>
            {t(lang, "saveFile")}
          </button>
        </div>
      </div>
    </>
  );
}
