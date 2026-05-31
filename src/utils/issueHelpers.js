/** Parse "Fever, Cough" into list matching known chips + custom extras */
export function parseIssueSelection(issueType, chips) {
  if (!issueType?.trim()) return [];
  const parts = issueType.split(',').map((s) => s.trim()).filter(Boolean);
  const known = parts.filter((p) => chips.includes(p));
  const extra = parts.filter((p) => !chips.includes(p));
  return [...known, ...extra];
}

export function joinIssueSelection(selected) {
  return selected.filter(Boolean).join(', ');
}
