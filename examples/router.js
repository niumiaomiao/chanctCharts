import Vue from 'vue';
import VueRouter from 'vue-router';
// 注册路由
Vue.use(VueRouter);

import {
    BarPage,
    NotFoundPage,
} from './pages';

/* 路由配置 */
const routes = [
    { path: '', component: BarPage },
    { path: '/bar', component: BarPage },
    { path: '*', component: NotFoundPage }
];

/* 注册路由 */
const router = new VueRouter({
    mode: 'hash',
    routes
});

export default router;
