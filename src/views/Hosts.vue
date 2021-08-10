<template>
    <q-page>
        <div class="row">
            <div class="col q-pa-md">
                <HostTable :rows="hosts" />
            </div>
        </div>
    </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import HostTable from "@/components/Hosts/HostTable.vue";

export default defineComponent({
    name: "Hosts",

    components: {
        HostTable,
    },

    computed: {
        ...mapGetters({
            hosts: "hosts/getAsArray",
        }),
    },
});
</script>

<style scoped></style>
