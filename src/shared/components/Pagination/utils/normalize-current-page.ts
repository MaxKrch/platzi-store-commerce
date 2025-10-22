const normalizeCurrentPage = (currentPage: number, pageCount: number | undefined) => {
  let normalizedPage = Math.max(1, currentPage);
  if (pageCount) {
    normalizedPage = Math.min(normalizedPage, pageCount);
  }

  return normalizedPage;
};

export default normalizeCurrentPage;
