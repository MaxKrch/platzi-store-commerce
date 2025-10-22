const getPageNumbers = (
  currentPage: number,
  pageCount: number | undefined,
  visiblePageArround: number
): number[] => {
  const pages = new Set<number>();

  pages.add(1);
  if (pageCount) pages.add(pageCount);

  const start = Math.max(2, currentPage - visiblePageArround);
  const end = pageCount
    ? Math.min(pageCount - 1, currentPage + visiblePageArround)
    : currentPage + visiblePageArround + 1;

  for (let i = start; i <= end; i++) {
    pages.add(i);
  }

  return Array.from(pages).sort((a, b) => a - b);
};

export default getPageNumbers;
