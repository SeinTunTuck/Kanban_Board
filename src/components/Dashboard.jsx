import { AlertTriangle, CheckCircle2, Circle, Clock3, ListChecks, TrendingUp } from "lucide-react";
import { STATUSES } from "../data";
import { isOverdue } from "../utils";

function SummaryCard({ label, value, icon: Icon, tone }) {
  return (
    <article className="summary-card">
      <span className={`summary-icon ${tone}`}><Icon size={21} /></span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

function DonutChart({ values, total }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="donut-wrap">
      <svg className="donut-chart" viewBox="0 0 140 140" role="img" aria-label="Task count by status">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#eef0f5" strokeWidth="17" />
        {values.map((item) => {
          const length = total ? (item.value / total) * circumference : 0;
          const circle = (
            <circle
              key={item.id}
              cx="70" cy="70" r={radius}
              fill="none" stroke={item.color} strokeWidth="17"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform="rotate(-90 70 70)"
            />
          );
          offset += length;
          return circle;
        })}
      </svg>
      <div className="donut-center"><strong>{total}</strong><span>Total tasks</span></div>
    </div>
  );
}

export default function Dashboard({ tasks, categories }) {
  const statusValues = STATUSES.map((status) => ({
    ...status,
    value: tasks.filter((task) => task.status === status.id).length,
  }));
  const overdue = tasks.filter(isOverdue).length;
  const categoryValues = categories
    .map((category) => ({ ...category, value: tasks.filter((task) => task.categoryId === category.id).length }))
    .filter((category) => category.value > 0);
  const categoryMax = Math.max(1, ...categoryValues.map((entry) => entry.value));
  const doneTasks = tasks.filter((task) => task.status === "done" && task.completeDate && task.dueDate);
  const completionValues = [
    { label: "Early", value: doneTasks.filter((task) => task.completeDate < task.dueDate).length, color: "#3ab78f" },
    { label: "On time", value: doneTasks.filter((task) => task.completeDate === task.dueDate).length, color: "#6658e8" },
    { label: "Late", value: doneTasks.filter((task) => task.completeDate > task.dueDate).length, color: "#eb6a67" },
  ];
  const performanceMax = Math.max(1, ...completionValues.map((entry) => entry.value));

  return (
    <main className="page-content dashboard-page">
      <div className="page-heading-row dashboard-heading">
        <div>
          <span className="eyebrow">Overview</span>
          <h1>Dashboard</h1>
          <p>A quick pulse check on your team’s progress.</p>
        </div>
        <div className="insight-chip"><TrendingUp size={17} /> Live from your board</div>
      </div>

      <section className="summary-grid" aria-label="Task summary">
        <SummaryCard label="Total tasks" value={tasks.length} icon={ListChecks} tone="purple" />
        <SummaryCard label="To do" value={statusValues[0].value} icon={Circle} tone="amber" />
        <SummaryCard label="Doing" value={statusValues[1].value} icon={Clock3} tone="blue" />
        <SummaryCard label="Done" value={statusValues[2].value} icon={CheckCircle2} tone="green" />
        <SummaryCard label="Overdue" value={overdue} icon={AlertTriangle} tone="red" />
      </section>

      <section className="dashboard-grid">
        <article className="chart-card status-chart-card">
          <div className="chart-heading">
            <div><h2>Task status</h2><p>How work is distributed right now</p></div>
          </div>
          <div className="status-chart-body">
            <DonutChart values={statusValues} total={tasks.length} />
            <div className="chart-legend">
              {statusValues.map((status) => (
                <div className="legend-row" key={status.id}>
                  <span className="legend-dot" style={{ background: status.color }} />
                  <span>{status.label}</span>
                  <strong>{status.value}</strong>
                  <small>{tasks.length ? Math.round(status.value / tasks.length * 100) : 0}%</small>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="chart-card category-chart-card">
          <div className="chart-heading">
            <div><h2>Tasks by category</h2><p>Where the team is spending time</p></div>
          </div>
          <div className="bar-chart" role="img" aria-label="Task count by category">
            {categoryValues.length ? categoryValues.map((category) => (
              <div className="bar-row" key={category.id}>
                <div className="bar-label"><span>{category.name}</span><strong>{category.value}</strong></div>
                <div className="bar-track"><span style={{ width: `${category.value / categoryMax * 100}%`, background: category.color }} /></div>
              </div>
            )) : <p className="empty-chart">Create a task to see category insights.</p>}
          </div>
        </article>

        <article className="chart-card performance-card">
          <div className="chart-heading">
            <div><h2>Completion performance</h2><p>Completed tasks compared with their due dates</p></div>
            <span className="completed-count">{doneTasks.length} completed</span>
          </div>
          <div className="performance-chart" role="img" aria-label="Early, on-time and late task completion counts">
            {completionValues.map((item) => (
              <div className="performance-item" key={item.label}>
                <div className="performance-number" style={{ color: item.color }}>{item.value}</div>
                <div className="performance-column"><span style={{ height: `${Math.max(item.value ? 18 : 4, item.value / performanceMax * 100)}%`, background: item.color }} /></div>
                <strong>{item.label}</strong>
              </div>
            ))}
          </div>
          {!doneTasks.length && <p className="chart-note">Complete a task to start measuring performance.</p>}
        </article>
      </section>
    </main>
  );
}
