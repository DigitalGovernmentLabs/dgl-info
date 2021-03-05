<template>
  <v-dialog :value="value" width="600" @input="onClose">
    <v-card :loading="loading" :disabled="loading">
      <v-card-title>FAQ {{ creating ? "作成" : "変更" }}</v-card-title>
      <v-card-text>
        <v-form ref="createOrUpdateForm" @submit.prevent="submitCreateOrUpdate">
          <v-text-field
            label="ID (変更不可)"
            readonly
            :value="creating ? '自動で割り当てられます' : targetFaqId"
          />
          <v-textarea v-model="question" label="質問" :rules="[]" />
          <v-textarea v-model="answer" label="答え" :rules="[]" />
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
      default: false,
    },
    targetFaqId: {
      type: Number,
      default: null,
    },
    groupId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      rules,
      resultError: "",
      sending: false,
      // フォーム入力 - 作成/更新
      question: "",
      answer: "",
    };
  },
  async fetch() {
    if (!this.creating) {
      const faq = await this.$api.normal.faq._faqId(this.targetFaqId).$get();
      this.question = faq.question;
      this.answer = faq.answer;
    }
  },
  computed: {
    creating(): boolean {
      return this.targetFaqId === null || this.targetFaqId === undefined;
    },
    loading(): boolean {
      return this.$fetchState.pending || this.sending;
    },
  },
  watch: {
    value(): void {
      if (this.targetFaqId === null) {
        this.referesh();
      }
    },
  },
  methods: {
    onClose(v: boolean): void {
      if (isVForm(this.$refs.createOrUpdateForm)) {
        this.$refs.createOrUpdateForm.resetValidation();
      }
      this.$emit("input", v);
    },
    referesh(): void {
      this.answer = "";
      this.question = "";
      if (isVForm(this.$refs.createOrUpdateForm)) {
        this.$refs.createOrUpdateForm.resetValidation();
      }
    },
    async submitCreateOrUpdate(): Promise<void> {
      const valid = (this.$refs.createOrUpdateForm as any).validate?.();
      if (!valid) return;
      if (this.creating) await this.create();
      else await this.update();
    },
    async create(): Promise<void> {
      this.resultError = "";
      this.sending = true;
      try {
        const faq = await this.$api.normal.faq.$post({
          body: {
            groupId: this.groupId,
            question: this.question,
            answer: this.answer,
          },
        });
        this.$emit("create", faq);
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
        const faq = await this.$api.normal.faq._faqId(this.targetFaqId).$patch({
          body: {
            question: this.question,
            answer: this.answer,
          },
        });
        this.$emit("update", faq);
      } catch (e: unknown) {
        this.resultError = handleError(e);
      } finally {
        this.sending = false;
      }
    },
  },
});
</script>
