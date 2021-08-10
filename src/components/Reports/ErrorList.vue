<template>
    <q-card>
        <q-card-section>
            <div class="text-h6">Fehler</div>
        </q-card-section>

        <q-separator />

        <q-list class="q-mb-sm" v-for="(error, index) in data" :key="index">
            <q-expansion-item expand-separator icon="warning" :label="error.message">
                <template v-slot:header>
                    <q-item-section avatar>
                        <q-icon name="error" color="negative" />
                    </q-item-section>

                    <q-item-section>
                        <div>{{ error.message }}</div>
                        <div class="text-grey">Anklicken für mehr Informationen zu diesem Fehler</div>
                    </q-item-section>
                </template>
                <q-card>
                    <q-card-section>
                        <VueJsonPretty :showLine="false" :data="error" />
                    </q-card-section>
                </q-card>
            </q-expansion-item>
        </q-list>
    </q-card>
</template>

<script>
import { defineComponent } from "vue";

import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

export default defineComponent({
    name: "Error List",

    components: {
        VueJsonPretty,
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
