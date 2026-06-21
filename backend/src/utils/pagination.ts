export interface PaginationParams {
  limit: number;
  offset: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export function parsePagination(query: Record<string, unknown>): PaginationParams {
  const limit = Math.min(Math.max(Number(query.limit) || 8, 1), 100);
  const offset = Math.max(Number(query.offset) || 0, 0);
  const search = typeof query.search === "string" ? query.search : undefined;
  const sort = typeof query.sort === "string" ? query.sort : undefined;
  const order = query.order === "desc" ? "desc" : "asc";
  return { limit, offset, search, sort, order };
}

export function buildWhereClause(
  filters: Record<string, string | number | undefined>,
  startingIndex = 1
): { clause: string; values: (string | number)[]; nextIndex: number } {
  const conditions: string[] = [];
  const values: (string | number)[] = [];
  let index = startingIndex;

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      conditions.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
  }

  return {
    clause: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    values,
    nextIndex: index,
  };
}
