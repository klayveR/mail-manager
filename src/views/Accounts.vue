<template>
    <q-page>
        <div class="row">
            <div class="col q-pa-md">
                <AccountTable :rows="accounts" :hosts="hosts" />
            </div>
        </div>
    </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";
import AccountTable from "@/components/Accounts/AccountTable.vue";

export default defineComponent({
    name: "Accounts",

    components: {
        AccountTable,
    },

    computed: {
        ...mapGetters({
            accounts: "accounts/getAsArray",
        }),
        ...mapState("hosts", {
            hosts: (state) => state.items,
        }),
    },
});
</script>

<style scoped></style>
