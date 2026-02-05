// src/api/getErrorMessage.ts

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function getErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "Unknown error occurred";
  }

  const err = error as FetchBaseQueryError;

  if (typeof err.status === "number") {
    const data = err.data as any;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    return `HTTP ${err.status}`;
  }

  if ("message" in err && typeof err.message === "string") {
    return err.message;
  }

  return "Request failed. Please try again.";
}
