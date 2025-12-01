export const routes = [
    {
        path: '/',
        component: () => import('../pages/index.vue'),
    },
    {
        path: '/ancient',
        component: () => import('../pages/ancient.vue'),
    },
];
