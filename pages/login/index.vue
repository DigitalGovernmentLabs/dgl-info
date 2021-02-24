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
                  <password-field v-model="password" required-only />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <form-error :message="resultError" />
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
import { handleError } from "~/utils/axios";
import { rules } from "~/server/service/form";

export default Vue.extend({
  layout: "slim",
  data() {
    return {
      name: "",
      password: "",
      resultError: "",
      processing: false,
      rules,
    };
  },
  methods: {
    async authCheck(): Promise<boolean> {
      await this.$auth.refetch();
      const user = await this.$auth.get();
      if (user) {
        this.$router.push("/");
        return true;
      }
      return false;
    },
    async submit(): Promise<void> {
      this.resultError = "";
      const valid = (this.$refs.form as any).validate?.();
      if (!valid) return;
      this.processing = true;
      try {
        await this.$auth.login(this.name, this.password);
        if (!(await this.authCheck())) {
          this.resultError =
            "クッキーへの保存に失敗しました。使用しているブラウザの設定等を確認してください。";
          if (process.env.NODE_ENV === "development") {
            this.resultError +=
              "開発用の環境の場合は、 localhost ではなく 127.0.0.1 でのアクセスを試してください。";
          }
        }
      } catch (e: unknown) {
        this.resultError = handleError(e);
      } finally {
        this.processing = false;
      }
    },
  },
});
</script>
