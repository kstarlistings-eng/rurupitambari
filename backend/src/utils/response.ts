import type { Response } from "express";

export function successResponse<T>(res: Response, data: T, status = 200) {
  res.status(status).json(data);
}

export function errorResponse(
  res: Response,
  message: string,
  status = 500,
  details?: Record<string, string>
) {
  const body: Record<string, unknown> = { error: message };
  if (details) body.details = details;
  res.status(status).json(body);
}

export function paginatedResponse<T>(
  res: Response,
  results: T[],
  total: number,
  limit: number,
  offset: number
) {
  res.status(200).json({
    count: total,
    next: offset + results.length < total ? offset + limit : null,
    previous: offset > 0 ? Math.max(0, offset - limit) : null,
    results,
  });
}
