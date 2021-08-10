<template>
    <q-card>
        <q-card-section>
            <div class="text-h6">E-Mail Konto</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
            <div class="row">
                <div class="col">
                    <div class="text-weight-medium">E-Mail Adresse</div>
                    <div class="text-grey-7">{{ account.user }}</div>
                </div>
                <div class="col">
                    <div class="text-weight-medium">Passwort</div>
                    <div class="text-grey-7">
                        <BlurredText>{{ account.password }}</BlurredText>
                    </div>
                </div>
            </div>

            <div class="row" v-if="host != null">
                <div class="col">
                    <div class="text-weight-medium">Posteingangsserver</div>
                    <div class="text-grey-7">{{ host.server }}</div>
                </div>
                <div class="col">
                    <div class="text-weight-medium">Port</div>
                    <div class="text-grey-7">
                        {{ host.port }}
                        <BooleanIcon :enabled="host.secure" icon-true="lock" icon-false="no_encryption" size="xs" />
                    </div>
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>

<script>
import { defineComponent } from "vue";

import BooleanIcon from "@/apponents/BooleanIcon.vue";
import BlurredText from "@/apponents/BlurredText.vue";

export default defineComponent({
    name: "Account Card",

    components: {
        BooleanIcon,
        BlurredText,
    },

    props: {
        account: Object,
        host: Object,
    },
});
</script>

<style scoped>
.q-card {
    width: 100%;
}
</style>
