import type { Response } from "express";
import { successResponse } from "../../utils/response.js";
import { listUsers } from "./user.service.js";

export async function listUsersHandler(_req: unknown, res: Response) {
  const users = await listUsers();
  successResponse(res, {
    count: users.length,
    next: null,
    previous: null,
    results: users,
  });
}
