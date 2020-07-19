<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
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
      <v-card-text>
        <v-row>
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
        <v-btn
          color="blue darken-1"
          text
          @click=";(dialog = false), addListTitle()"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue from 'vue'
import { LinkList, Link } from '~/server/types'

export default Vue.extend({
  data() {
    return {
      dialog: false,
      linkList: {} as LinkList,
      newLink: {
        url: '',
        name: '',
        description: ''
      } as Link
    }
  },
  methods: {
    async addListTitle() {
      // あとでlinkIdをとるようにlinks.vueからデータとして受領する。
      await this.$api.links._linkListId(1).post({ body: this.newLink })
    }
  }
})
</script>
