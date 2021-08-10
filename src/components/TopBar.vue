<template>
    <q-bar :class="`bg-secondary ${textColor} shadow-2`">
        <q-icon name="mail" />
        <div class="bar-title non-selectable">E-Mail Manager</div>

        <q-space />

        <q-btn dense flat icon="minimize" @click="minimizeWindow" />
        <q-btn dense flat icon="crop_square" @click="maximizeWindow" />
        <q-btn dense flat icon="close" @click="closeWindow" />
    </q-bar>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "Top Bar",

    data() {
        return {
            windowFocused: true,
        };
    },

    mounted() {
        window.ipc.on("WINDOW_FOCUS", (focused) => {
            this.windowFocused = focused;
        });
    },

    computed: {
        textColor() {
            if (this.windowFocused) {
                return "text-grey-1";
            }

            return "text-grey-4";
        },
    },

    methods: {
        closeWindow() {
            window.close();
        },
        minimizeWindow() {
            window.ipc.send("MINIMIZE_WINDOW");
        },
        maximizeWindow() {
            window.ipc.send("MAXIMIZE_WINDOW");
        },
    },
});
</script>

<style scoped>
.bar-title {
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 600;
}

.q-bar {
    -webkit-app-region: drag;
}

.q-btn {
    -webkit-app-region: none !important;
}
</style>
