export const extractVariables = (content: string): string[] => {
  if (!content) return [];
  const regex = /\{([^}]+)\}/g;
  const matches = new Set<string>();
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match[1] && match[1].trim()) {
      matches.add(match[1].trim());
    }
  }

  return Array.from(matches);
};