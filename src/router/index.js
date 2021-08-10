import { createRouter, createWebHashHistory } from "vue-router";
const Accounts = () => import("@/views/Accounts.vue");
const Hosts = () => import("@/views/Hosts.vue");
const Reports = () => import("@/views/Reports.vue");
const Report = () => import("@/views/Report.vue");

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "accounts",
            component: Accounts,
        },
        {
            path: "/hosts",
            name: "hosts",
            component: Hosts,
        },
        {
            path: "/reports",
            name: "reports",
            component: Reports,
        },
        {
            path: "/report/:id",
            name: "report",
            component: Report,
        },
    ],
});
