import { useState, useCallback, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { t } from "../i18n";

export default function useTasks(lang) {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRtype, setEditRtype] = useState("once");
  const [editRdata, setEditRdata] = useState(null);
  const [editLinkUrl, setEditLinkUrl] = useState("");
  const [toast, setToast] = useState(null);
  const [undoId, setUndoId] = useState(null);
  const [undoContent, setUndoContent] = useState("");
  const [undoTask, setUndoTask] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const undoTimerRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const loadTasks = useCallback(async () => {
    try {
      const data = await invoke("get_tasks");
      setTasks(data);
      await invoke("check_and_notify").catch((e) => console.error("check_and_notify:", e));
    } catch (e) { console.error("loadTasks:", e); }
  }, []);

  const addTask = useCallback(
    async (content, rtype, rdata, linkUrl) => {
      try {
        if (editingId !== null) {
          const original = tasks.find((x) => x.id === editingId);
          if (original) {
            const task = { ...original, content, reminder_type: rtype, reminder_data: rdata, link_url: linkUrl || null };
            await invoke("update_task", { task });
          }
          setEditingId(null);
          showToast(t(lang, "taskUpdated"));
        } else {
          await invoke("add_task", { content, reminderType: rtype, reminderData: rdata, linkUrl: linkUrl || null });
          showToast(t(lang, "taskAdded"));
        }
        await loadTasks();
      } catch (e) {
        showToast(t(lang, "error") + ": " + String(e));
      }
    },
    [editingId, tasks, loadTasks, showToast, lang]
  );

  const deleteTask = useCallback(
    async (id, content, taskData) => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      setDeletingId(id);
      try {
        await invoke("delete_task", { id });
      } catch (e) {
        console.error("delete_task:", e);
        setDeletingId(null);
        showToast(t(lang, "error"));
        return;
      }
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setDeletingId(null);
      setUndoId(id);
      setUndoContent(content.length > 30 ? content.slice(0, 30) + "..." : content);
      setUndoTask(taskData);
      undoTimerRef.current = setTimeout(() => {
        setUndoId(null);
        setUndoTask(null);
        undoTimerRef.current = null;
      }, 5000);
    },
    [showToast, lang]
  );

  const cancelDelete = useCallback(async () => {
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
    if (undoTask) {
      try {
        await invoke("add_task", {
          content: undoTask.content,
          reminderType: undoTask.reminder_type,
          reminderData: undoTask.reminder_data,
          linkUrl: undoTask.link_url || null,
        });
        showToast(t(lang, "deleteCancelled"));
      } catch (e) { console.error("add_task (undo):", e); }
    }
    setUndoId(null);
    setUndoTask(null);
    await loadTasks();
  }, [undoTask, showToast, loadTasks, lang]);

  const toggleComplete = useCallback(
    async (id, showCompleted) => {
      try {
        await invoke("toggle_complete", { id });
        if (!showCompleted) {
          setCompletingId(id);
          setTimeout(() => { loadTasks(); setCompletingId(null); }, 500);
        } else {
          await loadTasks();
        }
      } catch (e) { console.error("toggle_complete:", e); }
    },
    [loadTasks]
  );

  const startEdit = useCallback((t) => {
    setEditingId(t.id);
    setEditText(t.content);
    setEditRtype(t.reminder_type);
    setEditRdata(t.reminder_data);
    setEditLinkUrl(t.link_url || "");
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  const togglePin = useCallback(
    async (id) => {
      try {
        const found = tasks.find((x) => x.id === id);
        if (found) {
          await invoke("update_task", { task: { ...found, pinned: !found.pinned } });
          await loadTasks();
        }
      } catch (e) { console.error("toggle_pin:", e); }
    },
    [tasks, loadTasks]
  );

  const togglePersist = useCallback(
    async (id) => {
      try {
        const found = tasks.find((x) => x.id === id);
        if (found) {
          await invoke("update_task", { task: { ...found, persist: !found.persist } });
          await loadTasks();
        }
      } catch (e) { console.error("toggle_persist:", e); }
    },
    [tasks, loadTasks]
  );

  const handleReorder = useCallback(
    async (ids) => {
      try {
        await invoke("reorder_tasks", { ids });
        await loadTasks();
      } catch (e) { console.error("reorder_tasks:", e); }
    },
    [loadTasks]
  );

  return {
    tasks, setTasks, loadTasks,
    addTask, deleteTask, cancelDelete, toggleComplete,
    startEdit, cancelEdit, togglePin, togglePersist, handleReorder,
    editingId, editText, editRtype, editRdata, editLinkUrl,
    deletingId, completingId,
    undoId, undoContent, onUndo: cancelDelete,
    toast, showToast, setToast,
  };
}
