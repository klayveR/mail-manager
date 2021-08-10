<template>
    <q-toolbar class="bg-primary text-white shadow-2">
        <q-tabs inline-label active-color="white" content-class="text-grey-4" align="justify">
            <q-route-tab no-caps icon="manage_accounts" :to="{ name: 'accounts' }" label="E-Mail Konten" />
            <q-route-tab no-caps icon="storage" :to="{ name: 'hosts' }" label="Posteingangsserver" />
            <q-route-tab no-caps icon="analytics" :to="{ name: 'reports' }" label="Berichte">
                <q-badge v-if="unreadReportsCount > 0" color="blue" size="sm" rounded class="q-ml-sm" />
            </q-route-tab>
        </q-tabs>
    </q-toolbar>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
    name: "Main Menu",

    computed: {
        ...mapGetters({
            unreadReportsCount: "reports/unreadCount",
        }),
    },
});
</script>

<style scoped>
.q-tabs {
    width: 100%;
}
</style>
