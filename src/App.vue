<script setup></script>

<template>
  <!-- Header -->
  <app-header></app-header>

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>

  <!-- Auth Modal -->
  <app-auth></app-auth>
  <app-player></app-player>
</template>

<script>
import AppAuth from './components/AppAuth.vue'
import AppHeader from './components/AppHeader.vue'
import AppPlayer from './components/Player.vue'

import { mapWritableState } from 'pinia'
import useUserStore from './stores/user'
import { auth } from './includes/firebase'
export default {
  name: 'App',
  components: {
    AppHeader,
    AppAuth,
    AppPlayer
  },
  computed: { ...mapWritableState(useUserStore, ['userLoggedIn']) },
  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true
    }
  }
}
</script>
<style>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.5s linear;
}
.fade-enter-leave {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
