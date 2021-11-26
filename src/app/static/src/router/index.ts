import VueRouter, { RouteConfig } from "vue-router";
import Vue from "vue";
import Home from "../views/Home.vue";

const routes: RouteConfig[] = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/about",
        name: "About",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
    },
    {
        path: "/accessibility",
        name: "Accessibility",
        component: () => import(/* webpackChunkName: "accessibility" */ "../views/Accessibility.vue")
    }
];

const router = new VueRouter({
    mode: "history",
    routes
});

Vue.use(VueRouter);

export default router;
