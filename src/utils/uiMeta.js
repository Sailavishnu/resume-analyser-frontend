const companyColors = [
  '#6366f1', '#0ea5e9', '#0d9488', '#8b5cf6',
  '#ec4899', '#f59e0b', '#10b981', '#3b82f6'
];

export function getCompanyColor(name = '') {
  if (!name) return '#6366f1';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return companyColors[Math.abs(hash) % companyColors.length];
}
