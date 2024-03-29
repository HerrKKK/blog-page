import { createRouter, createWebHistory } from 'vue-router'
import {useUserStore} from "@/stores/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:filter?/:param?',
      name: 'home',
      component: () => import('@/views/MainView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/content/:id',
      name: 'content',
      component: () => import('@/views/BlogView.vue')
    },
    {
      path: '/manage',
      name: 'manage',
      component: () => import('@/views/ManageView.vue'),
      redirect: '/manage/blog',
      meta: {
        roles: ['admin']
      },
      children: [
        {
          path: 'editor/:id',
          name: 'editor',
          component: () => import('@/views/manage_subviews/EditorView.vue')
        },
        {
          path: 'blog',
          name: 'blog',
          component: () => import('@/views/manage_subviews/BlogManageView.vue'),
        },
        {
          path: 'category',
          name: 'category',
          component: () => import('@/views/manage_subviews/CategoryManageView.vue'),
        },
        {
          path: 'tag',
          name: 'tag',
          component: () => import('@/views/manage_subviews/TagManageView.vue'),
        },
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    return next()
  }

  if (to.path === '/login' && useUserStore().isLogin === true) {
    return next('/')
  }

  const roles = to.meta.roles as string[]
  if (roles == null) {
    return next()
  }

  const userStore = useUserStore()
  if (userStore.isLogin !== true) {
    return next('/')
  }

  for (const userRole of userStore.userInfo.roles) {
    for (const role of roles) {
      if (userRole.name === 'admin' || userRole.name === role) {
        return next()
      }
    }
  }
  return next('/')
})

export default router
