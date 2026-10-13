import React, { useState, useCallback } from "react";
import TaskCard from "./TaskCard";
import { t } from "../i18n";

export default function TaskList({ tasks, overdue = [], onToggle, onDelete, onEdit, onPin, onReorder, lang, deletingId, completingId, onTogglePersist, dateStr }) {
  const [overdueOpen, setOverdueOpen] = useState(true);

  const moveTask = useCallback((idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= tasks.length) return;
    const ids = tasks.map((t) => t.id);
    [ids[idx], ids[targetIdx]] = [ids[targetIdx], ids[idx]];
    onReorder(ids);
  }, [tasks, onReorder]);

  if (!tasks.length && !overdue.length) {
    return (
      <div id="task-area">
        <div id="task-list">
          <div className="empty-state">
            <svg className="empty-icon" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <span className="empty-text">{t(lang, "noTasks")}</span>
            <hr className="empty-divider" />
            <span className="empty-hint">{t(lang, "noTasksHint")}</span>
          </div>
        </div>
      </div>
    );
  }

  const renderCard = (t, i) => (
    <TaskCard
      task={t}
      dateStr={dateStr}
      index={i}
      onToggle={onToggle}
      onDelete={onDelete}
      onEdit={onEdit}
      onPin={onPin}
      lang={lang}
      deletingId={deletingId}
      completingId={completingId}
      onTogglePersist={() => onTogglePersist(t.id)}
    />
  );

  return (
    <div id="task-area">
      <div id="task-list">
        {overdue.length > 0 && (
          <div className="overdue-section">
            <button className="overdue-header" onClick={() => setOverdueOpen((v) => !v)}>
              <svg className="overdue-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                {overdueOpen
                  ? <polyline points="6 9 12 15 18 9" />
                  : <polyline points="9 18 15 12 9 6" />}
              </svg>
              <svg className="overdue-mark" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className="overdue-title">{t(lang, "overdue")}</span>
              <span className="overdue-count">{overdue.length}</span>
            </button>
            {overdueOpen && (
              <div className="overdue-list">
                {overdue.map((t, i) => renderCard(t, i))}
              </div>
            )}
          </div>
        )}
        {tasks.map((t, i) => (
          <div key={t.id} className="drag-wrapper">
            <TaskCard
              task={t}
              dateStr={dateStr}
              index={i}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              onPin={onPin}
              lang={lang}
              deletingId={deletingId}
              completingId={completingId}
              reorder={{ isFirst: i === 0, isLast: i === tasks.length - 1, onMoveUp: () => moveTask(i, -1), onMoveDown: () => moveTask(i, 1) }}
              onTogglePersist={() => onTogglePersist(t.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
