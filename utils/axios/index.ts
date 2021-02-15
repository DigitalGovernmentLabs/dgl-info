import type { AxiosError } from "axios";

export const isAxiosError = (e: unknown): e is AxiosError => {
  return Boolean((e as any).isAxiosError);
};

export const handleError = (e: unknown): string => {
  // eslint-disable-next-line no-console
  console.error(e);
  if (isAxiosError(e)) {
    const status = e.response?.status;
    if (status === 400) {
      const message = e.response?.data?.errorMessage;
      if (typeof message === "string") return message;
      return "入力が間違っています。";
    } else if (status === 500) {
      return "サーバーエラーが発生。";
    } else {
      return "通信エラーが発生。";
    }
  }
  return "予期せぬエラーが発生。";
};
