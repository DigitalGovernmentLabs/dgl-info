import { defineHooks } from "./$relay";

export default defineHooks(() => ({
  preValidation: (req, reply, done) => {
    // ログインユーザのみ
    if (req.user === null) {
      void reply.code(403).send();
      return;
    }
    // 変更操作は Admin のみ
    if (!["GET", "OPTIONS"].includes(req.method)) {
      if (req.user.isAdmin !== true) {
        void reply.code(403).send();
        return;
      }
    }
    done();
  },
}));
