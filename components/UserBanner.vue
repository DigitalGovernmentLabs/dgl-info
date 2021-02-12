<template>
  <v-app-bar app>
    <v-toolbar-title>DGL</v-toolbar-title>
    <v-spacer />
    <div v-if="user">
      <span>{{ user.name }}</span>
      <v-btn @click="logout"> LOGOUT </v-btn>
    </div>
    <div v-else>
      <v-btn @click="login"> LOGIN </v-btn>
    </div>
    <template #extension>
      <v-tabs>
        <v-tab>ホーム</v-tab>
        <v-tab>法</v-tab>
        <v-tab>別表1</v-tab>
        <v-tab>別表1省令</v-tab>
        <v-tab>別表2</v-tab>
        <v-tab>別表2省令</v-tab>
        <v-tab>FAQ</v-tab>
        <v-tab>LINK</v-tab>
        <v-tab if="user?.isAdmin">ユーザ管理</v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import { UserJwtPayload } from "~/server/types/user";

export default Vue.extend({
  data() {
    return {
      user: null as UserJwtPayload | null,
    };
  },
  async fetch() {
    this.user = await this.$auth.refetch();
  },
  methods: {
    async refresh() {
      const user = await this.$auth.get();
      this.user = user;
    },
    async logout() {
      this.user = null;
      await this.$auth.logout();
      await this.refresh();
    },
    login() {
      this.$router.push("/login");
    },
  },
});
</script>

<style scoped>
.user-banner {
  position: fixed;
  top: 0;
  right: 0;
  padding: 20px;
}

.user-icon {
  width: 32px;
  height: 32px;
  background: #ddd;
  vertical-align: bottom;
}
</style>
