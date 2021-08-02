import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'

function requireAuth (to, from, next) {
  if (!localStorage.getItem('token')) {
    next({
      path: '/auth',
    query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
}

const routes = [
  {
    path: '/Home',
    name: 'Home',
    component: Home,
    beforeEnter: requireAuth
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path: '',
    name: 'PublicPath',
    beforeEnter: requireAuth
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
