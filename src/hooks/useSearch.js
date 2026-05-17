import { useState, useMemo, useCallback } from "react";

function taskDate(t) {
  if (t.reminder_data?.datetime && t.reminder_data.datetime.length >= 10)
    return t.reminder_data.datetime.slice(0, 10);
  return t.created_at.slice(0, 10);
}

export default function useSearch(tasks) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const q = searchQuery.toLowerCase().trim();

  const searchResults = useMemo(() => {
    if (!q) return [];
    const matched = tasks.filter((t) => t.content.toLowerCase().includes(q));
    const groups = {};
    for (const t of matched) {
      const d = taskDate(t);
      if (!groups[d]) groups[d] = [];
      groups[d].push(t);
    }
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [tasks, q]);

  const closeSearch = useCallback(() => {
    setSearchQuery("");
    setShowSearch(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setShowSearch((s) => !s);
  }, []);

  return {
    searchQuery, setSearchQuery,
    showSearch, setShowSearch,
    searchResults,
    closeSearch, toggleSearch,
  };
}
