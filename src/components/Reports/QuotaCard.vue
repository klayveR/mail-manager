<template>
    <q-card>
        <q-card-section horizontal>
            <q-card-section>
                <div class="text-h6">Füllstand</div>
            </q-card-section>

            <q-separator vertical />

            <q-card-section style="width: 100%">
                <div class="row q-gutter-md">
                    <div class="col q-pt-xs" v-if="data.storage != null">
                        <QuotaProgressBar :data="data.storage" />
                    </div>
                    <div class="col q-pt-xs" v-if="data.message != null">
                        <QuotaProgressBar :data="data.message" :use-numbers="true" name="Nachrichten" />
                    </div>
                </div>
            </q-card-section>
        </q-card-section>
    </q-card>
</template>

<script>
import { defineComponent } from "vue";

import QuotaProgressBar from "@/components/Reports/QuotaProgressBar.vue";

export default defineComponent({
    name: "Quota Card",

    components: {
        QuotaProgressBar,
    },

    props: {
        data: Object,
    },
});
</script>

<style scoped>
.q-card {
    width: 100%;
}
</style>
