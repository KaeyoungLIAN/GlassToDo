import React, { useState, useReducer, useRef, useEffect } from "react";
import { t } from "../i18n";
import ScheduledOptions from "./ScheduledOptions";

function fmt(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const initialState = {
  content: "",
  rtype: "once",
  onceDate: "",
  onceTime: "14:30",
  activeDays: new Set(),
  weeklyTime: "09:00",
  linkType: "url",
  linkUrl: "",
  meetingCode: "",
  advanceMinutes: 0,
  expanded: false,
};

function editReducer(state, action) {
  switch (action.type) {
    case "SET":
      return { ...state, [action.field]: action.payload };
    case "TOGGLE_DAY": {
      const next = new Set(state.activeDays);
      next.has(action.day) ? next.delete(action.day) : next.add(action.day);
      return { ...state, activeDays: next };
    }
    case "LOAD_EDIT":
      return { ...state, ...action.payload };
    case "RESET":
      return { ...initialState, onceDate: action.onceDate || state.onceDate };
    default:
      return state;
  }
}

export default function BottomPanel({ editingId, editText, editRtype, editRdata, editLinkUrl, onSave, onCancelEdit, dateStr, lang, onEmptySubmit, showToast }) {
  const [state, dispatch] = useReducer(editReducer, { ...initialState, onceDate: dateStr });
  const [taskMode, setTaskMode] = useState("normal");
  const inputRef = useRef(null);
  const userSetOnceRef = useRef(false);

  // Auto-expand when editing
  useEffect(() => {
    if (editingId !== null) {
      const wxMatch = (editLinkUrl || "").match(/wemeet:\/\/page\/inmeeting\?meeting_code=([a-zA-Z0-9]+)/);
      const load = {
        content: editText,
        rtype: editRtype,
        linkType: wxMatch ? "meeting" : "url",
        meetingCode: wxMatch ? wxMatch[1] : "",
        linkUrl: wxMatch ? "" : (editLinkUrl || ""),
        expanded: true,
      };
      if (editRtype === "once" && editRdata?.datetime) {
        const p = editRdata.datetime.split("T");
        load.onceDate = p[0];
        load.onceTime = p[1]?.substring(0, 5) || "14:30";
      } else if (editRtype === "weekly") {
        load.activeDays = new Set(editRdata?.days || []);
        load.weeklyTime = editRdata?.time || "09:00";
      }
      dispatch({ type: "LOAD_EDIT", payload: load });
      setTaskMode("scheduled");
      const id = setTimeout(() => inputRef.current?.focus(), 350);
      return () => clearTimeout(id);
    }
  }, [editingId]);

  useEffect(() => { if (!userSetOnceRef.current) dispatch({ type: "SET", field: "onceDate", payload: dateStr }); }, [dateStr]);

  const toggleDay = (d) => {
    dispatch({ type: "TOGGLE_DAY", day: d });
  };

  const isValidUrl = (url) => {
    try {
      const u = new URL(url);
      return ['https:', 'http:', 'mailto:', 'tel:'].includes(u.protocol);
    } catch {
      return url.startsWith('wemeet://');
    }
  };

  const handleSubmit = () => {
    const text = state.content.trim();
    if (!text) {
      if (onEmptySubmit) onEmptySubmit();
      return;
    }

    const rawUrl = state.linkType === "meeting" && state.meetingCode.trim()
      ? `wemeet://page/inmeeting?meeting_code=${state.meetingCode.trim()}`
      : state.linkType === "meeting" ? ""
      : state.linkUrl;
    if (rawUrl && !isValidUrl(rawUrl)) {
      showToast(t(lang, "invalidLink"));
      return;
    }

    const finalLinkUrl = state.linkType === "meeting" && state.meetingCode.trim()
      ? `wemeet://page/inmeeting?meeting_code=${state.meetingCode.trim()}`
      : state.linkType === "meeting" ? ""
      : state.linkUrl;

    if (editingId === null && taskMode === "normal") {
      const rd = { datetime: `${dateStr}T23:59:00`, days: [], time: "09:00" };
      onSave(text, "once", rd);
      dispatch({ type: "SET", field: "content", payload: "" });
      dispatch({ type: "SET", field: "linkUrl", payload: "" });
      dispatch({ type: "SET", field: "meetingCode", payload: "" });
      inputRef.current?.focus();
      return;
    }

    const rd =
      state.rtype === "once"
        ? { datetime: `${state.onceDate || dateStr}T${state.onceTime}:00`, days: [], time: "09:00", advance_minutes: state.advanceMinutes }
        : { datetime: null, days: state.activeDays.size ? [...state.activeDays] : [1], time: state.weeklyTime, advance_minutes: state.advanceMinutes };
    onSave(text, state.rtype, rd, finalLinkUrl);
    dispatch({ type: "SET", field: "content", payload: "" });
    dispatch({ type: "SET", field: "linkUrl", payload: "" });
    dispatch({ type: "SET", field: "meetingCode", payload: "" });
    if (editingId === null) {
      dispatch({ type: "RESET", onceDate: dateStr });
      setTaskMode("normal");
      userSetOnceRef.current = false;
    }
    inputRef.current?.focus();
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  const switchMode = (mode) => {
    setTaskMode(mode);
    if (mode === "scheduled" && !state.expanded) dispatch({ type: "SET", field: "expanded", payload: true });
    if (mode === "normal") dispatch({ type: "SET", field: "expanded", payload: false });
    inputRef.current?.focus();
  };

  return (
    <div id="bottom-panel" className={taskMode === "scheduled" ? "has-reminder" : ""}>
      <div id="input-row">
        <input
          ref={inputRef}
          type="text"
          id="task-input"
          placeholder={t(lang, "whatNeedsDone")}
          value={state.content}
          onChange={(e) => dispatch({ type: "SET", field: "content", payload: e.target.value })}
          onKeyDown={handleKey}
          autoComplete="off"
        />
        <button id="add-btn" className={editingId ? "editing" : ""} onClick={handleSubmit}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>{editingId ? t(lang, "updateTask") : t(lang, "addTask")}</span>
        </button>
      </div>

      {/* Mode toggle pills */}
      <div id="mode-toggle">
        <button
          className={"mode-pill" + (taskMode === "normal" ? " active" : "")}
          onClick={() => switchMode("normal")}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <span>{t(lang, "normal")}</span>
        </button>
        <button
          className={"mode-pill" + (taskMode === "scheduled" ? " active" : "")}
          onClick={() => switchMode("scheduled")}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{t(lang, "scheduled")}</span>
        </button>
      </div>

      {/* Scheduled options — collapsible */}
      <div id="reminder-collapse" className={taskMode === "scheduled" ? "open" : ""}>
        <ScheduledOptions
          lang={lang}
          rtype={state.rtype}
          onRtypeChange={(v) => dispatch({ type: "SET", field: "rtype", payload: v })}
          onceDate={state.onceDate}
          onOnceDateChange={(v) => { userSetOnceRef.current = true; dispatch({ type: "SET", field: "onceDate", payload: v }); }}
          onceTime={state.onceTime}
          onOnceTimeChange={(v) => dispatch({ type: "SET", field: "onceTime", payload: v })}
          activeDays={state.activeDays}
          onToggleDay={toggleDay}
          weeklyTime={state.weeklyTime}
          onWeeklyTimeChange={(v) => dispatch({ type: "SET", field: "weeklyTime", payload: v })}
          linkType={state.linkType}
          onLinkTypeChange={(v) => dispatch({ type: "SET", field: "linkType", payload: v })}
          linkUrl={state.linkUrl}
          onLinkUrlChange={(v) => dispatch({ type: "SET", field: "linkUrl", payload: v })}
          meetingCode={state.meetingCode}
          onMeetingCodeChange={(v) => dispatch({ type: "SET", field: "meetingCode", payload: v })}
          advanceMin={state.advanceMinutes}
          onAdvanceMinChange={(v) => dispatch({ type: "SET", field: "advanceMinutes", payload: v })}
        />
      </div>
    </div>
  );
}
