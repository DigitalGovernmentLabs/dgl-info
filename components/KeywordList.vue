<template>
  <div>
    <div>
      <keyword-chip
        v-for="keyword in list"
        :key="keyword"
        class="mb-2 mr-2"
        :keyword="keyword"
        :close="isAdmin"
        @delete="$emit('delete', keyword)"
      />
    </div>
    <div class="mt-2">
      <v-form ref="form" class="d-flex align-center" @submit.prevent="submit">
        <v-text-field
          :value="value"
          :loading="loading"
          :rules="[rules.required]"
          :disabled="disabled"
          label="新しいキーワードを追加"
          @input="(v) => this.$emit('input', v)"
        />
        <v-btn color="primary" text type="submit">追加</v-btn>
      </v-form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { rules } from "~/server/service/form";
import { isVForm } from "~/utils/vuetify";

export default Vue.extend({
  props: {
    value: { type: String, default: "" },
    isAdmin: { type: Boolean, default: false },
    list: { type: Array, default: [] as string[] },
    loading: { type: Boolean, default: null },
    disabled: { type: Boolean, default: null },
  },
  data() {
    return {
      rules,
    };
  },
  watch: {
    value(): void {
      const { form } = this.$refs;
      if (!isVForm(form)) return;
      form.resetValidation();
    },
  },
  methods: {
    submit(): void {
      const { form } = this.$refs;
      if (!isVForm(form)) return;
      if (!form.validate()) return;
      this.$emit("add", this.value);
    },
  },
});
</script>
