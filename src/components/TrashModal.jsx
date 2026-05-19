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
                        <span>⏰ {task.reminder_data.datetime.slice(0, 10)}</span>
                      )}
                      {task.reminder_type === "weekly" && task.reminder_data?.days?.length > 0 && (
                        <span>📅 {lang === "zh" ? "每周" : "Weekly"}</span>
                      )}
                      {task.pinned && <span>📌 {lang === "zh" ? "已置顶" : "Pinned"}</span>}
                      {task.persist && <span>💾 {lang === "zh" ? "储留" : "Persist"}</span>}
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
