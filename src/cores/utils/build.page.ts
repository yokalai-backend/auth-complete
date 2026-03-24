import { PageProps } from "../../global.schema";

export default function buildPagination(
  total: number,
  { page, limit }: PageProps,
) {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page * limit < total;
  const hasPrev = page > 1;

  return {
    page: page,
    limit: limit,
    total: total,
    totalPages: totalPages,
    hasNext: hasNext,
    hasPrev: hasPrev,
  };
}
