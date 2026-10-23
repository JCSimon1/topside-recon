import { request } from "./client";
import type { AppConfig } from "./types";

export const getConfig = () => request<AppConfig>("/api/config");
