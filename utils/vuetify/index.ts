export type VuetifyFormElement = {
  validate(): boolean;
  reset(): void;
  resetValidation(): void;
};
export const isVForm = (el: unknown): el is VuetifyFormElement => {
  return (
    el !== undefined &&
    el !== null &&
    typeof (el as any).validate === "function" &&
    typeof (el as any).reset === "function" &&
    typeof (el as any).resetValidation === "function"
  );
};
