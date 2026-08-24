export const STATUSES = [
  { id: "todo", label: "To do", color: "#f2a93b" },
  { id: "doing", label: "Doing", color: "#6658e8" },
  { id: "done", label: "Done", color: "#3ab78f" },
];

// Replace this fixed list with the responsible-person data supplied by the instructor.
export const PEOPLE = [
  { id: "p1", name: "Maya Chen" },
  { id: "p2", name: "Noah Williams" },
  { id: "p3", name: "Sofia Martinez" },
  { id: "p4", name: "Leo Anderson" },
];

export const DEFAULT_CATEGORIES = [
  { id: "design", name: "Design", color: "#a15ce5" },
  { id: "development", name: "Development", color: "#4f7ee8" },
  { id: "research", name: "Research", color: "#e05d89" },
  { id: "marketing", name: "Marketing", color: "#e6963e" },
];

function dateFromToday(offset) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

export function createStarterTasks() {
  return [
    {
      id: "starter-1",
      title: "Plan user interviews",
      description: "Prepare the discussion guide and invite five participants.",
      categoryId: "research",
      startDate: dateFromToday(-3),
      dueDate: dateFromToday(2),
      completeDate: "",
      responsibleId: "p1",
      status: "todo",
      createdAt: new Date().toISOString(),
    },
    {
      id: "starter-2",
      title: "Build responsive navigation",
      description: "Implement the desktop sidebar and compact mobile navigation.",
      categoryId: "development",
      startDate: dateFromToday(-5),
      dueDate: dateFromToday(4),
      completeDate: "",
      responsibleId: "p2",
      status: "doing",
      createdAt: new Date().toISOString(),
    },
    {
      id: "starter-3",
      title: "Create dashboard wireframes",
      description: "Explore two clear layouts for status and performance metrics.",
      categoryId: "design",
      startDate: dateFromToday(-9),
      dueDate: dateFromToday(-3),
      completeDate: dateFromToday(-4),
      responsibleId: "p3",
      status: "done",
      createdAt: new Date().toISOString(),
    },
    {
      id: "starter-4",
      title: "Review launch checklist",
      description: "Confirm copy, analytics events, accessibility and final QA.",
      categoryId: "marketing",
      startDate: dateFromToday(-4),
      dueDate: dateFromToday(-1),
      completeDate: "",
      responsibleId: "p4",
      status: "todo",
      createdAt: new Date().toISOString(),
    },
  ];
}
