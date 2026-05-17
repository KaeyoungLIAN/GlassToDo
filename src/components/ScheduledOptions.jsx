import React from "react";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import { t, dayLabels } from "../i18n";

const DAY_KEYS = [1, 2, 3, 4, 5, 6, 0];

export default function ScheduledOptions({
  lang, rtype, onRtypeChange,
  onceDate, onOnceDateChange, onceTime, onOnceTimeChange,
  activeDays, onToggleDay, weeklyTime, onWeeklyTimeChange,
  linkType, onLinkTypeChange, linkUrl, onLinkUrlChange,
  meetingCode, onMeetingCodeChange,
}) {
  return (
    <div id="reminder-inner">
      <div id="scheduled-row">
        <div className="segmented">
          <button
            className={"seg-btn" + (rtype === "once" ? " active" : "")}
            onClick={() => onRtypeChange("once")}
          >
            {t(lang, "oneTime")}
          </button>
          <button
            className={"seg-btn" + (rtype === "weekly" ? " active" : "")}
            onClick={() => onRtypeChange("weekly")}
          >
            {t(lang, "weekly")}
          </button>
        </div>
        {rtype === "once" ? (
          <div className="picker-line">
            <DatePicker value={onceDate} onChange={onOnceDateChange} lang={lang} />
            <span className="picker-sep">–</span>
            <TimePicker value={onceTime} onChange={onOnceTimeChange} lang={lang} />
          </div>
        ) : (
          <div className="picker-line">
            <div id="day-picker">
              {(() => {
                const labels = dayLabels(lang);
                return DAY_KEYS.map((key, i) => (
                  <button
                    key={key}
                    className={"day-btn" + (activeDays.has(key) ? " active" : "")}
                    onClick={() => onToggleDay(key)}
                  >
                    {labels[i]}
                  </button>
                ));
              })()}
            </div>
            <TimePicker value={weeklyTime} onChange={onWeeklyTimeChange} lang={lang} />
          </div>
        )}
      </div>
      {/* Link type segmented + inline input */}
      <div className="picker-line" style={{ marginTop: 8 }}>
        <div className="segmented">
          <button
            className={"seg-btn" + (linkType === "url" ? " active" : "")}
            onClick={() => onLinkTypeChange("url")}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            {t(lang, "webLink")}
          </button>
          <button
            className={"seg-btn" + (linkType === "meeting" ? " active" : "")}
            onClick={() => onLinkTypeChange("meeting")}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            {t(lang, "meetingLink")}
          </button>
        </div>
        {linkType === "url" ? (
          <input
            type="url"
            className="link-url-input"
            placeholder={t(lang, "linkPlaceholder")}
            value={linkUrl}
            onChange={(e) => onLinkUrlChange(e.target.value)}
            autoComplete="off"
          />
        ) : (
          <input
            type="text"
            className="link-url-input"
            placeholder={t(lang, "meetingCode")}
            value={meetingCode}
            onChange={(e) => onMeetingCodeChange(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
            autoComplete="off"
          />
        )}
      </div>
    </div>
  );
}
