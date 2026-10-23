import { request } from "./client";
import type { Round, RoundPayload } from "./types";

export const getRounds = () => request<Round[]>("/api/rounds");

export const createRound = (payload: RoundPayload) =>
  request<Round>("/api/rounds", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateRound = (id: number, payload: RoundPayload) =>
  request<Round>(`/api/rounds/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteRound = (id: number) =>
  request<void>(`/api/rounds/${id}`, { method: "DELETE" });
