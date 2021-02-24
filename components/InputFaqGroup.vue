<template>
  <v-dialog :value="value" width="600" @input="onClose">
    <v-card :loading="loading" :disabled="loading">
      <v-card-title>FAQグループ{{ creating ? "作成" : "変更" }}</v-card-title>
      <v-card-text>
        <v-form ref="createOrUpdateForm" @submit.prevent="submitCreateOrUpdate">
          <v-text-field
            label="ID (変更不可)"
            readonly
            :value="creating ? '自動で割り当てられます' : targetFaqGroupId"
          />
          <v-text-field
            v-model="name"
            label="グループ名"
            :rules="[rules.required]"
          />
          <v-textarea v-model="description" label="説明" :rules="[]" />
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
    targetFaqGroupId: {
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
      name: "",
      description: "",
    };
  },
  async fetch() {
    if (!this.creating) {
      const faqGroup = await this.$api.normal.faqGroup
        ._faqGroupId(this.targetFaqGroupId)
        .$get();
      this.name = faqGroup.name;
      this.description = faqGroup.description;
    }
  },
  computed: {
    creating(): boolean {
      return (
        this.targetFaqGroupId === null || this.targetFaqGroupId === undefined
      );
    },
    loading(): boolean {
      return this.$fetchState.pending || this.sending;
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
      this.name = "";
      this.description = "";
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
        const faqGroup = await this.$api.normal.faqGroup.$post({
          body: {
            name: this.name,
            description: this.description,
          },
        });
        this.$emit("create", faqGroup);
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
        await this.$api.normal.faqGroup
          ._faqGroupId(this.targetFaqGroupId)
          .$patch({
            body: {
              name: this.name,
              description: this.description,
            },
          });
        this.$emit("update");
      } catch (e: unknown) {
        this.resultError = handleError(e);
      } finally {
        this.sending = false;
      }
    },
  },
});
</script>
