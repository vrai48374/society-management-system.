// utils/priority.js
export function getDynamicPriority(issue) {
  const hours = (Date.now() - new Date(issue.createdAt)) / (1000 * 60 * 60);

  if (hours >= 48) return "high";     // after 48 hrs
  if (hours >= 24) return "medium";   // after 24 hrs
  return "normal";                    // default
}
