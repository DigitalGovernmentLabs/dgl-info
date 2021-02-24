<template>
  <v-dialog :value="value" width="500" @input="onClose">
    <v-card :loading="loading" :disabled="loading">
      <v-card-title>ユーザ{{ creating ? "作成" : "情報変更" }}</v-card-title>
      <v-card-text>
        <v-form ref="createOrUpdateForm" @submit.prevent="submitCreateOrUpdate">
          <v-text-field
            label="ID (変更不可)"
            readonly
            :value="creating ? '自動で割り当てられます' : targetUserId"
          />
          <v-text-field
            v-model="userName"
            label="ユーザ名 (ログイン時に使います)"
            :rules="[rules.isUserName]"
          />
          <password-field v-if="creating" v-model="password" />
          <v-checkbox v-model="isAdmin" label="管理者権限" />
          <v-row>
            <v-col>
              <form-error :message="resultError" />
            </v-col>
          </v-row>
          <v-row>
            <v-spacer />
            <v-btn color="primary" type="submit">{{
              creating ? "作成" : "変更"
            }}</v-btn>
          </v-row>
        </v-form>
        <div v-if="!creating">
          <v-divider class="mx-4 my-4" />
          <v-form
            ref="passwordChangeForm"
            @submit.prevent="submitPasswordChange"
          >
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
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { rules } from "~/server/service/form";
import { isVForm } from "~/utils/vuetify";
import { handleError } from "~/utils/axios";

export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
    targetUserId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      rules,
      resultError: "",
      sending: false,
      // フォーム入力 - 作成/更新
      isAdmin: false,
      userName: "",
      password: "",
      // フォーム入力 - パスワード変更
      newPassword: "",
    };
  },
  async fetch() {
    if (!this.creating) {
      const user = await this.$api.admin.user
        ._userId(this.targetUserId)
        .$get({});
      this.userName = user.name;
      this.isAdmin = user.isAdmin;
    }
  },
  computed: {
    creating(): boolean {
      return this.targetUserId === null || this.targetUserId === undefined;
    },
    loading(): boolean {
      return this.$fetchState.pending || this.sending;
    },
  },
  watch: {
    value(): void {
      this.resultError = "";
      this.newPassword = "";
      this.password = "";
      if (this.creating) {
        this.isAdmin = false;
        this.userName = "";
      }
      if (isVForm(this.$refs.createOrUpdateForm)) {
        this.$refs.createOrUpdateForm.resetValidation();
      }
    },
  },
  methods: {
    onClose(v: boolean): void {
      if (!this.loading) this.$emit("input", v);
    },
    async submitCreateOrUpdate(): Promise<void> {
      const valid = isVForm(this.$refs.createOrUpdateForm)
        ? this.$refs.createOrUpdateForm.validate()
        : false;
      if (!valid) return;
      if (this.creating) await this.create();
      else await this.update();
    },
    async submitPasswordChange(): Promise<void> {
      const valid = isVForm(this.$refs.createOrUpdateForm)
        ? this.$refs.createOrUpdateForm.validate()
        : false;
      if (!valid) return;
      await this.updatePassword();
    },
    async create(): Promise<void> {
      this.resultError = "";
      this.sending = true;
      try {
        const user = await this.$api.admin.user.$post({
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
    async update(): Promise<void> {
      this.resultError = "";
      this.sending = true;
      try {
        const user = await this.$api.admin.user
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
    async updatePassword(): Promise<void> {
      this.resultError = "";
      this.sending = true;
      try {
        const user = await this.$api.admin.user
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
