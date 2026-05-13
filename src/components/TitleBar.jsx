import React, { useState, useEffect, useRef, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function TitleBar({ onOpenSettings, showSearch, onToggleSearch }) {
  const [showHelp, setShowHelp] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const helpRef = useRef(null);

  const handleCloseHelp = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setShowHelp(false);
      setIsClosing(false);
    }, 150);
  }, []);

  useEffect(() => {
    if (!showHelp || isClosing) return;
    const handler = (e) => {
      if (helpRef.current && !helpRef.current.contains(e.target)) handleCloseHelp();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showHelp, isClosing, handleCloseHelp]);
  const handleMin = async () => {
    try {
      await invoke("minimize_window");
    } catch (e) {
      console.error("minimize failed:", e);
    }
  };
  const handleClose = async () => {
    try {
      await invoke("hide_window");
    } catch (e) {
      console.error("hide failed:", e);
    }
  };

  return (
    <div id="titlebar">
      <div id="title-left">
        <span id="title-dot" />
        <span id="title-text">GlassTodo</span>
        <button className="title-btn help-btn" id="help-btn" title="How to use" onClick={(e) => { e.stopPropagation(); showHelp ? handleCloseHelp() : setShowHelp(true); }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </button>
        {(showHelp || isClosing) && (
          <div className={"help-popover" + (isClosing ? " closing" : " open")} ref={helpRef}>
            <div className="help-popover-title">Task Operations</div>
            <div className="help-popover-list">
              <div className="help-item">
                <svg className="help-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Checkbox — mark complete / undo</span>
              </div>
              <div className="help-item">
                <svg className="help-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
                <span>Arrow buttons — reorder task</span>
              </div>
              <div className="help-item">
                <svg className="help-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="3" x2="12" y2="16" />
                  <polyline points="7 10 12 3 17 10" />
                </svg>
                <span>Pin — keep at top of list</span>
              </div>
              <div className="help-item">
                <svg className="help-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
                <span>Persist — show on every date view</span>
              </div>
              <div className="help-item">
                <svg className="help-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span>Edit — modify text or reminder</span>
              </div>
              <div className="help-item">
                <svg className="help-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                <span>Delete — swipe away, 5s undo</span>
              </div>
            </div>
            <div className="help-popover-footer">
              <span className="help-key">Enter</span> add task · <span className="help-key">Esc</span> close edit · swipe delete with undo
            </div>
          </div>
        )}
        <button className="title-btn search-toggle" id="search-toggle-btn" title="Search" onClick={(e) => { e.stopPropagation(); onToggleSearch(); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
      <div id="title-drag" data-tauri-drag-region />
      <div id="title-controls">
        <button className="title-btn" id="settings-btn" title="Settings" onClick={(e) => { e.stopPropagation(); onOpenSettings(); }}>
          <svg className="gear-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
        <button className="title-btn" id="min-btn" title="Minimize" onClick={(e) => { e.stopPropagation(); handleMin(); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button className="title-btn close-btn" id="close-btn" title="Hide to tray" onClick={(e) => { e.stopPropagation(); handleClose(); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
