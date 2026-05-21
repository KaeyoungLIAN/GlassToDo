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
  const [deletingId, setDeletingId] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [trash, setTrash] = useState([]);
  const submitLockRef = useRef(false);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const loadTasks = useCallback(async () => {
    try {
      const data = await invoke("get_tasks");
      setTasks(data);
      const alerts = await invoke("check_and_notify").catch((e) => console.error("check_and_notify:", e));
      if (alerts && alerts.length > 0) {
        // In-app toast fallback — shows even if system notification denied
        const msg = alerts.length <= 3
          ? `🔔 ${alerts.join(", ")}`
          : `🔔 ${alerts.length} ${t(lang, "reminders")}`;
        setToast(msg);
        setTimeout(() => setToast(null), 4000);
        // Refresh after notification updates last_reminded
        const fresh = await invoke("get_tasks");
        setTasks(fresh);
      }
    } catch (e) { console.error("loadTasks:", e); }
  }, []);

  const loadTrash = useCallback(async () => {
    try {
      const data = await invoke("get_trash");
      setTrash(data);
    } catch (e) { console.error("loadTrash:", e); }
  }, []);

  const addTask = useCallback(
    async (content, rtype, rdata, linkUrl) => {
      if (submitLockRef.current) return;
      submitLockRef.current = true;
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
      } finally {
        submitLockRef.current = false;
      }
    },
    [editingId, tasks, loadTasks, showToast, lang]
  );

  const deleteTask = useCallback(
    async (id, _content, _taskData) => {
      setDeletingId(id);
      try {
        await invoke("delete_task", { id });
        await loadTrash();
      } catch (e) {
        console.error("delete_task:", e);
        setDeletingId(null);
        showToast(t(lang, "error"));
        return;
      }
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setDeletingId(null);
    },
    [showToast, loadTrash, lang]
  );

  const restoreFromTrash = useCallback(async (id) => {
    try {
      await invoke("restore_from_trash", { id });
      await loadTrash();
      await loadTasks();
    } catch (e) {
      console.error("restore_from_trash:", e);
      showToast(t(lang, "error"));
    }
  }, [loadTrash, loadTasks, showToast, lang]);

  const emptyTrash = useCallback(async () => {
    try {
      await invoke("empty_trash");
      setTrash([]);
    } catch (e) {
      console.error("empty_trash:", e);
    }
  }, []);

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
    addTask, deleteTask, toggleComplete,
    startEdit, cancelEdit, togglePin, togglePersist, handleReorder,
    editingId, editText, editRtype, editRdata, editLinkUrl,
    deletingId, completingId,
    trash, loadTrash, restoreFromTrash, emptyTrash,
    toast, showToast, setToast,
  };
}
