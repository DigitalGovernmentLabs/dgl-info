<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-col cols="6">
        <v-card fab dark color="indigo" v-bind="attrs" v-on="on">
          <v-icon dark>mdi-plus</v-icon>
        </v-card>
      </v-col>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">外部リンク</span>
      </v-card-title>
      <v-card-text> リスト名：{{ linkList.listTitle }} </v-card-text>
      <v-card-text>
        <v-row>
          <v-label></v-label>
          <v-col cols="12">
            <v-text-field v-model="newLink.name" label="リンク名 *" required />
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="newLink.url" label="URL *" required />
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="newLink.description" label="説明" />
          </v-col>
          <small>*必須入力項目</small>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">
          Close
        </v-btn>
        <v-btn color="blue darken-1" text @click="addListTitle()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { LinkList, PickLink } from "~/server/types";

export default Vue.extend({
  props: {
    linkList: {
      type: Object,
      required: true,
    } as PropOptions<LinkList>,
  },
  data() {
    return {
      dialog: false,
      newLink: {
        url: "",
        name: "",
        description: "",
      } as PickLink,
    };
  },
  methods: {
    async addListTitle() {
      await this.$api.links.post({
        body: { listId: this.linkList.listId, pickLink: this.newLink },
      });
      this.dialog = false;
      this.$emit("refetch");
    },
  },
});
</script>
