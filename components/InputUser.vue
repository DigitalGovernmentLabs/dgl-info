<template>
  <v-card :loading="isLoading()" :disabled="isLoading()">
    <v-card-title>ユーザ{{ isCreate() ? "作成" : "情報変更" }}</v-card-title>
    <v-card-text>
      <v-form ref="createOrUpdateForm" @submit.prevent="submitCreateOrUpdate">
        <v-text-field
          label="ID (変更不可)"
          readonly
          :value="isCreate() ? '自動で割り当てられます' : targetUserId"
        ></v-text-field>
        <v-text-field
          v-model="userName"
          label="ユーザ名 (ログイン時に使います)"
          :rules="[rules.isUserName]"
          >ユーザ名</v-text-field
        >
        <password-field v-if="isCreate()" v-model="password" />
        <v-checkbox v-model="isAdmin" label="管理者権限"></v-checkbox>
        <v-row>
          <v-col>
            <form-error :message="resultError" />
          </v-col>
        </v-row>
        <v-row>
          <v-spacer />
          <v-btn color="primary" type="submit">{{
            isCreate() ? "作成" : "変更"
          }}</v-btn>
        </v-row>
      </v-form>
      <div v-if="!isCreate()">
        <v-divider class="mx-4 my-4" />
        <v-form ref="passwordChangeForm" @submit.prevent="submitPasswordChange">
          <v-row
            ><v-col>
              <password-field
                v-model="newPassword"
                label="新しいパスワード"
              /> </v-col
          ></v-row>
          <v-row>
            <v-spacer />
            <v-btn color="error" type="submit">パスワード変更</v-btn>
          </v-row>
        </v-form>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { rules } from "~/server/service/form";
import { handleError } from "~/utils/axios";

export default Vue.extend({
  props: {
    targetUserId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      rules,
      resultError: "",
      isAdmin: false,
      userName: "",
      password: "",
      newPassword: "",
      sending: false,
    };
  },
  async fetch() {
    if (!this.isCreate()) {
      const user = await this.$api.admin.users
        ._userId(this.targetUserId)
        .$get({});
      this.userName = user.name;
      this.isAdmin = user.isAdmin;
    }
  },
  methods: {
    isCreate() {
      return this.targetUserId === null || this.targetUserId === undefined;
    },
    isLoading() {
      return this.$fetchState.pending || this.sending;
    },
    async submitCreateOrUpdate() {
      const valid = (this.$refs.createOrUpdateForm as any).validate?.();
      if (!valid) return;
      if (this.isCreate()) await this.create();
      else await this.update();
    },
    async submitPasswordChange() {
      const valid = (this.$refs.passwordChangeForm as any).validate?.();
      if (!valid) return;
      await this.updatePassword();
    },
    async create() {
      this.resultError = "";
      this.sending = true;
      try {
        const user = await this.$api.admin.users.$post({
          body: {
            isAdmin: this.isAdmin,
            userName: this.userName,
            password: this.password,
          },
        });
        this.$emit("create", user);
      } catch (e: unknown) {
        this.resultError = handleError(e);
      } finally {
        this.sending = false;
      }
    },
    async update() {
      this.resultError = "";
      this.sending = true;
      try {
        const user = await this.$api.admin.users
          ._userId(this.targetUserId)
          .$patch({
            body: {
              userId: this.targetUserId,
              isAdmin: this.isAdmin,
              userName: this.userName,
            },
          });
        this.$emit("update", user);
      } catch (e: unknown) {
        this.resultError = handleError(e);
      } finally {
        this.sending = false;
      }
    },
    async updatePassword() {
      this.resultError = "";
      this.sending = true;
      try {
        const user = await this.$api.admin.users
          ._userId(this.targetUserId)
          .$patch({
            body: {
              userId: this.targetUserId,
              password: this.password,
            },
          });
        this.$emit("updatePassword", user);
      } catch (e: unknown) {
        this.resultError = handleError(e);
      } finally {
        this.sending = false;
      }
    },
  },
});
</script>
