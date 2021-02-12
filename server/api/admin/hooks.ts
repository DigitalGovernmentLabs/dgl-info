import { defineHooks } from "./$relay";

export default defineHooks(() => ({
  preValidation: (req, reply, done) => {
    // Admin のみ
    if (req.user?.isAdmin !== true) {
      void reply.code(403).send();
      return;
    }
    done();
  },
}));
