import { Plugin } from "@nuxt/types";

type Handler = (text: string) => void;

const createSnackbarInstance = () => {
  const handlers = new Set<Handler>();
  const addHandler = (handler: Handler) => {
    handlers.add(handler);
  };
  const open = (text: string) => handlers.forEach((handler) => handler(text));
  const snackbarInstance = {
    addHandler,
    open,
  };
  return snackbarInstance;
};

type SnackbarInstance = ReturnType<typeof createSnackbarInstance>;

declare module "@nuxt/types" {
  interface Context {
    $snackbar: SnackbarInstance;
  }
  interface NuxtAppOptions {
    $snackbar: SnackbarInstance;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $snackbar: SnackbarInstance;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $snackbar: SnackbarInstance;
  }
}

declare module "vuex/types/index" {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  interface Store<S> {
    $snackbar: SnackbarInstance;
  }
}

const plugin: Plugin = (_ctx, inject) =>
  inject("snackbar", createSnackbarInstance());

export default plugin;
