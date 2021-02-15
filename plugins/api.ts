import { Plugin } from "@nuxt/types";
import aspida from "@aspida/axios";
import { NuxtAxiosInstance } from "@nuxtjs/axios";
import api from "~/server/api/$api";

const createInstance = (axios: NuxtAxiosInstance) =>
  api(aspida(axios, { withCredentials: true }));

type ApiInstance = ReturnType<typeof createInstance>;

declare module "@nuxt/types" {
  interface Context {
    $api: ApiInstance;
  }
  interface NuxtAppOptions {
    $api: ApiInstance;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $api: ApiInstance;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $api: ApiInstance;
  }
}

declare module "vuex/types/index" {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  interface Store<S> {
    $api: ApiInstance;
  }
}

const plugin: Plugin = ({ $axios }, inject) =>
  inject("api", createInstance($axios));

export default plugin;
