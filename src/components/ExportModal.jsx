import React, { useState, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import { t } from "../i18n";

function defaultRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return [start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)];
}

export default function ExportModal({ lang, tasks, onClose, showToast }) {
  const [startDate, setStartDate] = useState(() => defaultRange()[0]);
  const [endDate, setEndDate] = useState(() => defaultRange()[1]);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  // Group completed records by date within range
  const groups = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      // Weekly tasks: dates from completed_dates
      if (task.reminder_type === "weekly") {
        const dates = task.completed_dates || [];
        dates.forEach((d) => {
          if (d >= startDate && d <= endDate) {
            if (!map[d]) map[d] = [];
            map[d].push(task);
          }
        });
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
      `${lang === "zh" ? "📋 完成记录" : "📋 Completion Record"}`,
      `📅 ${startDate} ~ ${endDate}`,
      `${lang === "zh" ? `共计 ${totalCount} 项` : `${totalCount} items`}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
    ];
    groups.forEach((g) => {
      lines.push(``);
      const d = new Date(g.date);
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
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="export-date-field">
            <label>{t(lang, "endDate")}</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
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
          <button className="export-btn" onClick={handleSave} disabled={saving}>
            {saving ? "…" : t(lang, "saveFile")}
          </button>
        </div>
      </div>
    </>
  );
}
