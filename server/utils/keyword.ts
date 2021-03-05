export const sortKeywords = (keywords: string[]): string[] => {
  return keywords.sort((k1, k2) => {
    const l1 = k1.match(/^#*/)![0]!.length;
    const l2 = k2.match(/^#*/)![0]!.length;
    if (l1 === l2) return k1 === k2 ? 0 : k1 < k2 ? -1 : 1;
    if (l1 === 0) return 1;
    if (l2 === 0) return -1;
    return l1 < l2 ? -1 : 1;
  });
};
