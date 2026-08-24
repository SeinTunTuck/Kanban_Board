import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  Edit3,
  GripVertical,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { PEOPLE, STATUSES } from "../data";
import { formatDate, initials, isOverdue } from "../utils";

const STATUS_ICONS = { todo: Circle, doing: Clock3, done: CheckCircle2 };

function TaskCard({ task, category, person, onEdit, onDelete, onMove, onDragStart }) {
  const overdue = isOverdue(task);

  return (
    <article className="task-card" draggable onDragStart={(event) => onDragStart(event, task.id)}>
      <div className="task-card-top">
        <span className="category-pill" style={{ "--category-color": category?.color || "#7a8092" }}>
          {category?.name || "Uncategorized"}
        </span>
        <div className="task-actions">
          <button type="button" className="card-icon-button drag-handle" aria-label={`Drag ${task.title}`} title="Drag task">
            <GripVertical size={17} />
          </button>
          <button type="button" className="card-icon-button" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`} title="Edit task">
            <Edit3 size={16} />
          </button>
          <button type="button" className="card-icon-button delete" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`} title="Delete task">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3>{task.title}</h3>
      <p className="task-description">{task.description || "No description added."}</p>

      <div className="task-date-row">
        <CalendarDays size={15} />
        <span className={overdue ? "overdue-date" : ""}>
          {overdue ? "Overdue · " : "Due "}{formatDate(task.dueDate)}
        </span>
      </div>

      <div className="task-card-footer">
        <div className="person-chip" title={person?.name}>
          <span className="avatar">{initials(person?.name || "?")}</span>
          <span>{person?.name?.split(" ")[0] || "Unassigned"}</span>
        </div>
        <label className="move-select-label">
          <span className="sr-only">Move {task.title}</span>
          <select value={task.status} onChange={(event) => onMove(task.id, event.target.value)}>
            {STATUSES.map((status) => <option value={status.id} key={status.id}>{status.label}</option>)}
          </select>
          <ChevronDown size={14} />
        </label>
      </div>
    </article>
  );
}

function BoardColumn({ status, tasks, categories, onEdit, onDelete, onMove, onDragStart, onDrop }) {
  const Icon = STATUS_ICONS[status.id];
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <section
      className={isDragOver ? "board-column drag-over" : "board-column"}
      onDragOver={(event) => { event.preventDefault(); setIsDragOver(true); }}
      onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsDragOver(false); }}
      onDrop={(event) => { event.preventDefault(); setIsDragOver(false); onDrop(event, status.id); }}
      aria-labelledby={`column-${status.id}`}
    >
      <div className="column-header">
        <div className={`status-heading ${status.id}`}>
          <Icon size={18} />
          <h2 id={`column-${status.id}`}>{status.label}</h2>
          <span>{tasks.length}</span>
        </div>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-column">
            <span><CheckCircle2 size={22} /></span>
            <p>No tasks here</p>
            <small>Drag a task into this column.</small>
          </div>
        ) : tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            category={categories.find((entry) => entry.id === task.categoryId)}
            person={PEOPLE.find((entry) => entry.id === task.responsibleId)}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </section>
  );
}

export default function KanbanBoard({ tasks, categories, onCreate, onEdit, onDelete, onMove }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [personFilter, setPersonFilter] = useState("all");

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesSearch = !query || task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query);
      const matchesCategory = categoryFilter === "all" || task.categoryId === categoryFilter;
      const matchesPerson = personFilter === "all" || task.responsibleId === personFilter;
      return matchesSearch && matchesCategory && matchesPerson;
    });
  }, [tasks, search, categoryFilter, personFilter]);

  function dragStart(event, taskId) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", taskId);
  }

  function drop(event, status) {
    const taskId = event.dataTransfer.getData("text/plain");
    if (taskId) onMove(taskId, status);
  }

  return (
    <main className="page-content board-page">
      <div className="page-heading-row">
        <div>
          <span className="eyebrow">Workspace</span>
          <h1>Product sprint</h1>
          <p>Keep the team focused and move work forward.</p>
        </div>
        <button className="button primary create-button" type="button" onClick={onCreate}>
          <Plus size={18} /> New task
        </button>
      </div>

      <div className="board-toolbar" aria-label="Task filters">
        <label className="search-control">
          <Search size={17} />
          <span className="sr-only">Search tasks</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks…" />
        </label>
        <label className="filter-control">
          <span className="sr-only">Filter by category</span>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}
          </select>
          <ChevronDown size={15} />
        </label>
        <label className="filter-control">
          <span className="sr-only">Filter by responsible person</span>
          <select value={personFilter} onChange={(event) => setPersonFilter(event.target.value)}>
            <option value="all">Everyone</option>
            {PEOPLE.map((person) => <option value={person.id} key={person.id}>{person.name}</option>)}
          </select>
          <ChevronDown size={15} />
        </label>
        <span className="result-count">{filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}</span>
      </div>

      <div className="kanban-grid">
        {STATUSES.map((status) => (
          <BoardColumn
            key={status.id}
            status={status}
            tasks={filteredTasks.filter((task) => task.status === status.id)}
            categories={categories}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
            onDragStart={dragStart}
            onDrop={drop}
          />
        ))}
      </div>
    </main>
  );
}
