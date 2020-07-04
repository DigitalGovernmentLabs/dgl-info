<template>
  <div class="container">
    <user-banner />
    <div>
      <logo />
      <h1 class="title">frourio-todo-app</h1>
      <div v-if="!$fetchState.pending">
        <div class="tasks">
          <div v-for="(menu, index) in menus" :key="index">
            {{ menu.name }}
            <div v-for="(link, linkIndex) in menu.links" :key="linkIndex">
              <a :href="link.url" target="_blank">{{ link.label }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { LinkMenu } from '~/server/types'

export default Vue.extend({
  async fetch() {
    await this.fetchTasks()
  },
  data() {
    return {
      menus: [] as LinkMenu[]
    }
  },
  methods: {
    async fetchTasks() {
      this.menus = await this.$api.links.$get()
    }
  }
})
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.tasks {
  width: 300px;
  padding: 0;
  margin: 20px auto 0;
  list-style-type: none;
  text-align: left;
}

.tasks > li {
  margin-top: 10px;
  border-bottom: 1px solid #eee;
}
</style>
