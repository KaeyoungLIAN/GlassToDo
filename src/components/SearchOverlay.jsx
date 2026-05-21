import React from "react";
import { t } from "../i18n";
import TaskCard from "./TaskCard";

export default function SearchOverlay({
  searchQuery, setSearchQuery, searchResults,
  toggleComplete, deleteTask, startEdit, togglePin, togglePersist,
  lang, showCompleted, setShowSearch,
  deletingId, completingId,
}) {
  return (
    <div className="search-overlay">
      <div className={"search-overlay-header" + (searchQuery ? " has-query" : "")}>
        <svg className="search-overlay-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="search-overlay-input"
          type="text"
          placeholder={t(lang, "searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
        {searchQuery && (
          <button className="search-overlay-close" onClick={() => { setSearchQuery(""); setShowSearch(false); }} title={t(lang, "close")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
      {searchQuery && (
        <div className="search-overlay-results">
          {searchResults.length === 0 ? (
            <div className="search-overlay-empty">{t(lang, "noTasks")}</div>
          ) : (
            searchResults.map(([date, stasks]) => (
              <div key={date} className="search-date-group">
                <div className="search-date-label">{date}</div>
                {stasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    dateStr={date}
                    index={0}
                    onToggle={(id) => toggleComplete(id, showCompleted)}
                    onDelete={deleteTask}
                    onEdit={startEdit}
                    onPin={togglePin}
                    onTogglePersist={togglePersist}
                    lang={lang}
                    deletingId={deletingId}
                    completingId={completingId}
                    reorder={null}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
