<template>
  <v-container>
    <v-row justify="center">
      <v-col col="12" md="6" lg="4">
        <v-card elevation="2" :loading="processing" :disabled="processing">
          <v-card-title>DGLユーザ認証</v-card-title>
          <v-divider class="mx-4"></v-divider>
          <v-card-text>
            <v-form ref="form" @submit.prevent="submit">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="name"
                    autofocus
                    label="ユーザ名"
                    :rules="[rules.required]"
                    hide-details="auto"
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    label="パスワード"
                    :rules="[rules.required]"
                    :type="showPassword ? 'text' : 'password'"
                    hide-details="auto"
                  >
                    <template #append>
                      <v-btn
                        tabindex="-1"
                        icon
                        @mousedown="showPassword = true"
                        @mouseup="showPassword = false"
                        @mouseleave="showPassword = false"
                      >
                        <v-icon>
                          {{ showPassword ? "mdi-eye-off" : "mdi-eye" }}
                        </v-icon></v-btn
                      >
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div
                    class="text-caption text-right font-weight-light red--text"
                  >
                    {{ resultError }}
                  </div>
                </v-col>
              </v-row>
              <v-row justify="end">
                <v-col md="4">
                  <v-btn color="primary" type="submit" block>ログイン</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { isAxiosError } from "~/utils/axios";

export default Vue.extend({
  layout: "slim",
  data() {
    return {
      name: "",
      password: "",
      resultError: "",
      showPassword: false,
      processing: false,
      rules: {
        required: (value: string) => Boolean(value) || "入力してください。",
      },
    };
  },
  methods: {
    async authCheck() {
      await this.$auth.refetch();
      const user = await this.$auth.get();
      if (user) {
        this.$router.push("/");
        return true;
      }
      return false;
    },
    async submit() {
      this.resultError = "";
      const valid = (this.$refs.form as any).validate?.();
      if (!valid) return;
      this.processing = true;
      try {
        await this.$auth.login(this.name, this.password);
        if (!(await this.authCheck())) {
          this.resultError =
            "クッキーへの保存に失敗しました。使用している設定を確認してください。";
        }
      } catch (e: unknown) {
        this.handleError(e);
      } finally {
        this.processing = false;
      }
    },
    handleError(e: unknown) {
      // eslint-disable-next-line no-console
      console.error(e);
      this.resultError = "予期せぬエラーが発生。";
      if (isAxiosError(e)) {
        const status = e.response?.status;
        if (status === 400) {
          this.resultError = "ユーザ名もしくはパスワードが間違っています。";
        } else if (status === 500) {
          this.resultError = "サーバーエラーが発生。";
        } else {
          this.resultError = "通信エラーが発生。";
        }
      }
    },
  },
});
</script>
