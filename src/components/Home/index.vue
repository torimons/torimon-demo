<template>
    <v-app id="home">
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
            color="#3F8373"
            dark
        >
            <v-spacer></v-spacer>
            <v-toolbar-title>Torimon Home</v-toolbar-title>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        </v-app-bar>

        <v-content>
            <v-container
                class="fill-height"
                fluid
            >
                    <v-row
                        align="center"
                        justify="center"
                    >
                        <v-col class="text-center">
                            <div class="">
                                Torimon
                            </div>
                            <div class="">
                                Map for everyone.
                            </div>
                            <div class="my-2">
                                <v-btn color="#3F8373" large>
                                    <span class="white--text">地図利用</span>
                                </v-btn>
                            </div>
                            <div class="my-2">
                                <v-btn color="#3F8373" large>
                                    <span class="white--text">地図作成</span>
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
            </v-container>
        </v-content>

        <v-footer
            color="#3F8373"
            app
        >
            <v-spacer></v-spacer>

            <span class="white--text">&copy; 2020</span>
        </v-footer>
    </v-app>
</template>

<script>
export default {
    data: () => ({
        drawer: null,
    }),
};
</script>

<style>

</style>