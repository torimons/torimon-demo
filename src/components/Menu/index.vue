<template>
    <v-app id="menu">
        <v-navigation-drawer
            v-model="drawer"
            app
            right
        >
        <v-list dense>
                <v-list-item link>
                    <v-list-item-content>
                        <v-list-item-title>新規登録</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item link>
                    <v-list-item-content>
                        <v-list-item-title>ログイン</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar
            app
            color="primary"
            dark
        >
            <v-spacer></v-spacer>
            <v-toolbar-title>Torimon Home</v-toolbar-title>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        </v-app-bar>

        <slot></slot>

        <v-footer
            color="primary"
            app
        >
            <v-spacer></v-spacer>

            <span class="white--text">&copy; 2020</span>
        </v-footer>
    </v-app>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Menu extends Vue {
    private drawer = null;
}
</script>