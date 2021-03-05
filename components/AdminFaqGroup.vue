<template>
  <div>
    <v-sheet class="my-6 px-6 py-6" elevation="2">
      <h2>FAQ グループ管理メニュー</h2>
      <v-divider />
      <div class="my-4">
        <v-btn @click="startCreateFaqGroup">FAQグループの追加</v-btn>
      </div>
    </v-sheet>
    <input-faq-group
      v-model="creatingFaqGroup"
      :target-faq-group-id="null"
      @create="
        (arg) => {
          refresh();
          $snackbar.open('FAQ グループを作成しました');
          $emit('create', arg);
        }
      "
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      creatingFaqGroup: false,
    };
  },
  methods: {
    refresh(): void {
      this.creatingFaqGroup = false;
    },
    startCreateFaqGroup(): void {
      this.creatingFaqGroup = true;
    },
  },
});
</script>
