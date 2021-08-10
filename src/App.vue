<template>
    <q-layout view="lHh Lpr lFf">
        <q-header>
            <TopBar />
            <MainMenu />
        </q-header>

        <q-page-container class="bg-blue-grey-1">
            <q-scroll-area style="height: 100%">
                <router-view v-slot="{ Component }">
                    <keep-alive>
                        <component :is="Component" :key="$route.fullPath" />
                    </keep-alive>
                </router-view>
            </q-scroll-area>
        </q-page-container>
    </q-layout>
</template>

<script>
import TopBar from "@/components/TopBar.vue";
import MainMenu from "@/components/MainMenu.vue";

export default {
    name: "LayoutDefault",

    components: {
        TopBar,
        MainMenu,
    },
};
</script>

<style scoped>
.q-page-container {
    height: 100vh;
}

.q-scroll-area {
    height: 100%;
}
</style>
