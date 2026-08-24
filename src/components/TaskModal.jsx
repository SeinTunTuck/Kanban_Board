import { useEffect, useState } from "react";
import { CalendarDays, Plus, X } from "lucide-react";
import { PEOPLE, STATUSES } from "../data";
import { todayISO } from "../utils";

const EMPTY_TASK = {
  title: "",
  description: "",
  categoryId: "",
  startDate: "",
  dueDate: "",
  completeDate: "",
  responsibleId: "",
  status: "todo",
};

const CATEGORY_COLORS = ["#a15ce5", "#4f7ee8", "#e05d89", "#e6963e", "#16a39a"];

export default function TaskModal({ task, categories, onClose, onSave, onAddCategory }) {
  const [form, setForm] = useState(() => ({ ...EMPTY_TASK, ...task }));
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function addCategory() {
    const name = newCategory.trim();
    if (!name) return;
    const existing = categories.find((category) => category.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      update("categoryId", existing.id);
    } else {
      const id = onAddCategory(name, CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length]);
      update("categoryId", id);
    }
    setNewCategory("");
    setShowNewCategory(false);
  }

  function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Please enter a task title.");
      return;
    }
    if (!form.categoryId || !form.responsibleId) {
      setError("Please choose a category and responsible person.");
      return;
    }
    if (!form.startDate || !form.dueDate) {
      setError("Please set both the start and due date.");
      return;
    }
    if (form.startDate > form.dueDate) {
      setError("The due date cannot be before the start date.");
      return;
    }

    const values = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      completeDate: form.status === "done" ? form.completeDate || todayISO() : "",
    };
    onSave(values);
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
        <div className="modal-header">
          <div>
            <span className="eyebrow">Task details</span>
            <h2 id="task-modal-title">{task ? "Edit task" : "Create a new task"}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="form-field full-width">
            <label htmlFor="task-title">Title</label>
            <input id="task-title" autoFocus value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="What needs to be done?" />
          </div>

          <div className="form-field full-width">
            <label htmlFor="task-description">Description <span>Optional</span></label>
            <textarea id="task-description" rows="3" value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Add a short description…" />
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="task-category">Category</label>
              <select id="task-category" value={form.categoryId} onChange={(event) => update("categoryId", event.target.value)}>
                <option value="">Choose category</option>
                {categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}
              </select>
              <button className="text-button" type="button" onClick={() => setShowNewCategory((value) => !value)}>
                <Plus size={14} /> Add category
              </button>
              {showNewCategory && (
                <div className="inline-create">
                  <input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="Category name" onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), addCategory())} />
                  <button type="button" onClick={addCategory}>Add</button>
                </div>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="task-person">Responsible person</label>
              <select id="task-person" value={form.responsibleId} onChange={(event) => update("responsibleId", event.target.value)}>
                <option value="">Choose person</option>
                {PEOPLE.map((person) => <option value={person.id} key={person.id}>{person.name}</option>)}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="task-start"><CalendarDays size={14} /> Start date</label>
              <input id="task-start" type="date" value={form.startDate} onChange={(event) => update("startDate", event.target.value)} />
            </div>

            <div className="form-field">
              <label htmlFor="task-due"><CalendarDays size={14} /> Due date</label>
              <input id="task-due" type="date" value={form.dueDate} min={form.startDate} onChange={(event) => update("dueDate", event.target.value)} />
            </div>

            <div className="form-field">
              <label htmlFor="task-status">Status</label>
              <select id="task-status" value={form.status} onChange={(event) => update("status", event.target.value)}>
                {STATUSES.map((status) => <option value={status.id} key={status.id}>{status.label}</option>)}
              </select>
            </div>

            {form.status === "done" && (
              <div className="form-field">
                <label htmlFor="task-complete"><CalendarDays size={14} /> Complete date</label>
                <input id="task-complete" type="date" value={form.completeDate || todayISO()} onChange={(event) => update("completeDate", event.target.value)} />
              </div>
            )}
          </div>

          <p className="form-error" role="alert">{error}</p>
          <div className="modal-actions">
            <button className="button secondary" type="button" onClick={onClose}>Cancel</button>
            <button className="button primary" type="submit">{task ? "Save changes" : "Create task"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
