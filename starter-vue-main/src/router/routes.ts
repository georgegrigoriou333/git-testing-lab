export const routes = [
    {
        path: '/',
        component: () => import('../pages/index.vue'),
    },
    {
        path: '/ancient',
        component: () => import('../pages/ancient.vue'),
    },
    {
        path: '/middletimes',
        component: () => import('../pages/middletimes.vue'),
    },
    {
        path: '/moderntimes',
        component: () => import('../pages/moderntimes.vue'),
    }
];
