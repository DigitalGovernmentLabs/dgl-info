import { Context, Plugin } from "@nuxt/types";
import { UserJwtPayload } from "$/types/user";

const createAuthInstance = (ctx: Context) => {
  let user: Promise<UserJwtPayload | null> = Promise.resolve(null);
  const refetch = () =>
    (user = ctx.$api.public.auth.get().then((res) => res.body.user));
  const get = () => user;
  const login = async (name: string, password: string) => {
    await ctx.$api.public.auth.post({
      body: {
        userName: name,
        password,
      },
    });
  };
  const logout = async () => {
    await ctx.$api.public.auth.delete();
    return await refetch();
  };
  const authInstance = {
    refetch,
    login,
    logout,
    get,
  };
  return authInstance;
};

type AuthInstance = ReturnType<typeof createAuthInstance>;

declare module "@nuxt/types" {
  interface Context {
    $auth: AuthInstance;
  }
  interface NuxtAppOptions {
    $auth: AuthInstance;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $auth: AuthInstance;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $auth: AuthInstance;
  }
}

declare module "vuex/types/index" {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  interface Store<S> {
    $auth: AuthInstance;
  }
}

const plugin: Plugin = (ctx, inject) => inject("auth", createAuthInstance(ctx));

export default plugin;
