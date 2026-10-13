import React from "react";
import { t } from "../i18n";

export default function TrashModal({ lang, trash, onClose, onRestore, onEmpty }) {
  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="trash-modal">
        <div className="trash-modal-header">
          <h2>{lang === "zh" ? "回收站" : "Trash"}</h2>
          <button className="trash-close-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {trash.length === 0 ? (
          <div className="trash-empty">{lang === "zh" ? "回收站为空" : "Trash is empty"}</div>
        ) : (
          <>
            <div className="trash-list">
              {trash.slice().reverse().map((task) => (
                <div key={task.id} className="trash-item">
                  <div className="trash-item-content">
                    <div className="trash-item-text">{task.content}</div>
                    <div className="trash-item-meta">
                      {task.reminder_type === "once" && task.reminder_data?.datetime && (
                        <span className="trash-meta-item">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                          </svg>
                          {task.reminder_data.datetime.slice(0, 10)}
                        </span>
                      )}
                      {task.reminder_type === "weekly" && task.reminder_data?.days?.length > 0 && (
                        <span className="trash-meta-item">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {lang === "zh" ? "每周" : "Weekly"}
                        </span>
                      )}
                      {task.pinned && (
                        <span className="trash-meta-item">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="20" x2="20" y2="20" /><line x1="12" y1="3" x2="12" y2="16" /><polyline points="7 10 12 3 17 10" />
                          </svg>
                          {lang === "zh" ? "已置顶" : "Pinned"}
                        </span>
                      )}
                      {task.persist && (
                        <span className="trash-meta-item">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                          </svg>
                          {lang === "zh" ? "储留" : "Persist"}
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="trash-restore-btn" onClick={() => onRestore(task.id)}>
                    {lang === "zh" ? "恢复" : "Restore"}
                  </button>
                </div>
              ))}
            </div>
            <div className="trash-actions">
              <button className="trash-empty-all-btn" onClick={onEmpty}>
                {lang === "zh" ? "清空回收站" : "Empty Trash"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
