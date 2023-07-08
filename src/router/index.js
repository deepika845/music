import { createRouter, createWebHashHistory } from 'vue-router'
import Home from "../views/HomeView.vue"
import About from "../views/AboutView.vue"
import Manage from "../views/Manage.vue"
import useUserStore from "../stores/user"
import Song from "../views/Song.vue"

const routes = [
  {
    name: "home",
    path: "/",
    component: Home
  },
  {
    name: "about",
    path: "/about",
    component: About
  },
  {
    name: 'song',
    path: '/song/:id',
    component: Song
  },
  {
    name: "manage",
    path: "/manage-music",
    component: Manage,
    beforeEnter: (to, from, next) => {
      console.log("Manage route guard");
      next();
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/manage",
    redirect: { name: "manage" }
  },
  {
    path: "/:catchAll(.*)*",
    redirect: { name: "home" }
  }
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500'
})

router.beforeEach((to, from, next) => {
  console.log("to", to)
  if (!to.meta.requiresAuth) {
    next();
  }
  const store = useUserStore();
  if (store.userLoggedIn) {
    next()
  }
  else {
    next({ name: 'home' })
  }
})
export default router
