import { useCallback, useEffect, useState } from "react";
import AppShell from "./components/AppShell";
import Dashboard from "./components/Dashboard";
import KanbanBoard from "./components/KanbanBoard";
import TaskModal from "./components/TaskModal";
import { loadCategories, loadTasks, saveCategories, saveTasks } from "./storage";
import { makeId, todayISO } from "./utils";

function currentPage() {
  return window.location.hash === "#dashboard" ? "dashboard" : "board";
}

export default function App() {
  const [page, setPage] = useState(currentPage);
  const [tasks, setTasks] = useState(loadTasks);
  const [categories, setCategories] = useState(loadCategories);
  const [modalTask, setModalTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => setPage(currentPage());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => saveTasks(tasks), [tasks]);
  useEffect(() => saveCategories(categories), [categories]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalTask(null);
  }, []);

  function navigate(nextPage) {
    setPage(nextPage);
  }

  function createTask() {
    setModalTask(null);
    setIsModalOpen(true);
  }

  function editTask(task) {
    setModalTask(task);
    setIsModalOpen(true);
  }

  function saveTask(values) {
    if (modalTask) {
      setTasks((current) => current.map((task) => task.id === modalTask.id ? { ...task, ...values } : task));
    } else {
      setTasks((current) => [...current, { ...values, id: makeId("task"), createdAt: new Date().toISOString() }]);
    }
    closeModal();
  }

  function deleteTask(task) {
    if (window.confirm(`Delete “${task.title}”? This cannot be undone.`)) {
      setTasks((current) => current.filter((entry) => entry.id !== task.id));
    }
  }

  function moveTask(taskId, nextStatus) {
    setTasks((current) => current.map((task) => {
      if (task.id !== taskId || task.status === nextStatus) return task;
      return {
        ...task,
        status: nextStatus,
        completeDate: nextStatus === "done" ? todayISO() : "",
      };
    }));
  }

  function addCategory(name, color) {
    const category = { id: makeId("category"), name, color };
    setCategories((current) => [...current, category]);
    return category.id;
  }

  return (
    <AppShell page={page} onNavigate={navigate}>
      {page === "dashboard" ? (
        <Dashboard tasks={tasks} categories={categories} />
      ) : (
        <KanbanBoard
          tasks={tasks}
          categories={categories}
          onCreate={createTask}
          onEdit={editTask}
          onDelete={deleteTask}
          onMove={moveTask}
        />
      )}

      {isModalOpen && (
        <TaskModal
          task={modalTask}
          categories={categories}
          onClose={closeModal}
          onSave={saveTask}
          onAddCategory={addCategory}
        />
      )}
    </AppShell>
  );
}
