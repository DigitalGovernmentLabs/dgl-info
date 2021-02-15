import type { AxiosError } from "axios";

export const isAxiosError = (e: unknown): e is AxiosError => {
  return Boolean((e as any).isAxiosError);
};
