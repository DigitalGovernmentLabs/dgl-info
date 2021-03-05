<template>
  <div>
    <input-faq
      v-model="creatingFaq"
      :target-faq-id="null"
      :group-id="faqGroupId"
      @create="
        (arg) => {
          refresh();
          $snackbar.open('FAQ を作成しました');
          $emit('create', arg);
        }
      "
    />
    <v-btn @click="startCreateFaq">FAQ の追加</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    faqGroupId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      creatingFaq: false,
    };
  },
  methods: {
    refresh(): void {
      this.creatingFaq = false;
    },
    startCreateFaq(): void {
      this.creatingFaq = true;
    },
  },
});
</script>
