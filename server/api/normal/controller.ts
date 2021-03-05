import { defineController } from "./$relay";

export default defineController(() => ({
  get: () => ({ status: 200, body: { status: "ok" } }),
  post: () => ({ status: 200, body: { status: "ok" } }),
}));
