// utils/priority.js
export function getDynamicPriority(issue) {
  // If issue is already resolved, lock its priority
  if (issue.status === "resolved" || issue.isResolved === true) {
    return issue.priority || "normal"; // keep its last known priority
  }

  // Calculate how many hours have passed since creation
  const hours = (Date.now() - new Date(issue.createdAt)) / (1000 * 60 * 60);

  if (hours >= 48) return "high";     // after 48 hours
  if (hours >= 24) return "medium";   // after 24 hours
  return "normal";                    // default
}
