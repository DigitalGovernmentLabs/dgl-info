<template>
  <v-text-field
    :value="value"
    :label="label"
    :rules="[requiredOnly ? rules.required : rules.isPassword]"
    :type="showPassword ? 'text' : 'password'"
    hide-details="auto"
    @input="(v) => $emit('input', v)"
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
</template>

<script lang="ts">
import Vue from "vue";
import { rules } from "~/server/service/form";

export default Vue.extend({
  props: {
    value: { type: String, default: null },
    label: { type: String, default: "パスワード" },
    requiredOnly: { type: Boolean, default: false },
  },
  data() {
    return {
      rules,
      showPassword: false,
    };
  },
});
</script>
