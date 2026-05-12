import React from "react";
import TaskCard from "./TaskCard";
import { t } from "../i18n";

export default function TaskList({ tasks, onToggle, onDelete, onEdit, undoId, undoContent, onUndo, lang, deletingId, showArchive, onRestore }) {
  if (!tasks.length) {
    return (
      <div id="task-area">
        <div id="task-list">
          {showArchive ? (
            <div className="empty-state">
              <svg className="empty-icon" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="21 8 21 21 3 21 3 8" />
                <rect x="1" y="3" width="22" height="5" />
                <line x1="10" y1="12" x2="14" y2="12" />
              </svg>
              <span className="empty-text">{t(lang, "noArchived")}</span>
              <hr className="empty-divider" />
              <span className="empty-hint">{t(lang, "noArchivedHint")}</span>
            </div>
          ) : (
            <div className="empty-state">
              <svg className="empty-icon" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <span className="empty-text">{t(lang, "noTasks")}</span>
              <hr className="empty-divider" />
              <span className="empty-hint">{t(lang, "noTasksHint")}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="task-area">
      <div id="task-list">
        {undoId && !showArchive && (
          <div className="undo-bar">
            <span>{t(lang, "deletePrefix")}: {undoContent}</span>
            <button className="undo-btn" onClick={onUndo}>Undo</button>
          </div>
        )}
        {tasks.map((t, i) => (
          <TaskCard key={t.id} task={t} index={i} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} lang={lang} deletingId={deletingId} showArchive={showArchive} onRestore={onRestore} />
        ))}
      </div>
    </div>
  );
}
