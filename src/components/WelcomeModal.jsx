import React from "react";
import { t } from "../i18n";

export default function WelcomeModal({ lang, onClose, showWelcome, onToggleWelcome }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="welcome-modal" onClick={(e) => e.stopPropagation()}>
        <div className="welcome-header">
          <span id="title-dot" style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "var(--accent)", marginRight: 10 }} />
          <span className="welcome-title">{t(lang, "welcomeTitle")}</span>
        </div>

        <div className="welcome-desc">
          {t(lang, "welcomeDesc")}
        </div>

        <div className="welcome-guide-title">{t(lang, "quickGuide")}</div>

          <div className="welcome-list">
          <div className="welcome-item" style={{flexDirection: "column", alignItems: "stretch", gap: 4}}>
            <div style={{display: "flex", alignItems: "center", gap: 10}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}}>
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <span style={{fontWeight: 500}}>{lang === "zh" ? "创建任务 — 底部输入栏打字" : "Create tasks — Type in the bottom bar"}</span>
            </div>
            <div style={{paddingLeft: 24, display: "flex", flexDirection: "column", gap: 3}}>
              <span style={{fontSize: "0.85em", color: "var(--text-secondary)"}}>
                {lang === "zh" ? "• [普通]：无时间设定，卡片不显示 time badge" : "• [Normal]: No time set, no badge shown on card"}
              </span>
              <span style={{fontSize: "0.85em", color: "var(--text-secondary)"}}>
                {lang === "zh" ? "• [定时-单次]：选具体日期和时间，卡片显示日期+时间" : "• [Scheduled - Once]: Pick a date and time, card shows date+time badge"}
              </span>
              <span style={{fontSize: "0.85em", color: "var(--text-secondary)"}}>
                {lang === "zh" ? "• [定时-每周]：选星期和时间，卡片显示星期+时间" : "• [Scheduled - Weekly]: Pick days and time, card shows weekday+time badge"}
              </span>
            </div>
          </div>
          <div className="welcome-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{lang === "zh" ? "标记完成 — 点复选框完成，自动淡化。设置中可切换隐藏已完成" : "Mark complete — Check the box, task fades automatically. Toggle visibility in Settings"}</span>
          </div>
          <div className="welcome-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>{lang === "zh" ? "全局搜索 — 点搜索图标，按内容搜索所有日期任务，结果按日期分组" : "Global search — Click search icon, search content across all dates, results grouped by date"}</span>
          </div>
          <div className="welcome-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>{lang === "zh" ? "编辑与删除 — 点铅笔编辑，回车保存；点垃圾桶删除，可在回收站恢复" : "Edit & delete — Click pencil to edit, Enter to save. Click trash to delete, recover from trash"}</span>
          </div>
          <div className="welcome-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="20" x2="20" y2="20" /><line x1="12" y1="3" x2="12" y2="16" /><polyline points="7 10 12 3 17 10" />
            </svg>
            <span>{lang === "zh" ? "置顶 — 点大头针图标置顶，始终排在最前，不受日期切换影响" : "Pin — Click pin icon to keep at top regardless of date"}</span>
          </div>
          <div className="welcome-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
            <span>{lang === "zh" ? "储留 — 点储留图标，任务跨日期可见。配合每周提醒，指定星期自动每天出现" : "Persist — Click layers icon to make a task visible across dates. Pair with weekly reminder for auto-recurring to-dos"}</span>
          </div>
          <div className="welcome-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span>{lang === "zh" ? "链接会议/网页 — 创建时填入会议号或网址，卡片上点链接一键打开" : "Link meetings/URLs — Enter meeting code or URL when creating. Click link on card to open"}</span>
          </div>
          <div className="welcome-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 10l5-5 5 5" /><path d="M7 14l5 5 5-5" />
            </svg>
            <span>{lang === "zh" ? "调整顺序 — 点卡片左侧上下箭头调整，顺序持久保存" : "Reorder — Use up/down arrows on each card. Order is saved"}</span>
          </div>
          <div className="welcome-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{lang === "zh" ? "日期切换 — 左右箭头翻日期，点日期打开日历，一键回今天" : "Navigate dates — Arrow keys to switch days, click date for calendar, one-click back to today"}</span>
          </div>
        </div>

        <div className="welcome-footer">
          <label className="welcome-toggle-row" onClick={onToggleWelcome}>
            <div className={`toggle-track${!showWelcome ? " on" : ""}`}>
              <div className="toggle-thumb" />
            </div>
            <span className="welcome-toggle-label">{lang === "zh" ? "不再显示" : "Don't show again"}</span>
          </label>
          <button className="welcome-start-btn" onClick={onClose}>
            {lang === "zh" ? "开始使用" : "Get Started"}
          </button>
        </div>
      </div>
    </div>
  );
}