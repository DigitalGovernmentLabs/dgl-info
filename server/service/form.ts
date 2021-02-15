type Rule = (value: string) => true | string;
const composite = (...rules: Rule[]): Rule =>
  rules.reduce(
    (x, y) => (value: string) => {
      const ok = x(value);
      if (ok === true) return y(value);
      return ok;
    },
    (() => true) as Rule,
  );

const required = (value: string) => Boolean(value) || "入力してください。";
const lowerAlphaNumerical = (value: string) =>
  /^[a-z0-9]*$/.test(value) ||
  "半角の小文字アルファベット・数字のみで入力してください。";
const minLength = (minLength: number) => (value: string) =>
  value.length >= minLength || `${minLength}文字以上で入力してください。`;
const maxLength = (maxLength: number) => (value: string) =>
  value.length <= maxLength || `${maxLength}文字以内で入力してください。`;

const isUserName = composite(required, lowerAlphaNumerical, maxLength(32));
const isPassword = composite(required, minLength(8), maxLength(1024));

export const rules = Object.freeze({
  required,
  lowerAlphaNumerical,
  maxLength,
  isUserName,
  isPassword,
});
