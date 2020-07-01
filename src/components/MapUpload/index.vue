<template>
    <div id="map-upload">
        <v-app>
            <div>
                <v-form v-model='isValidInput'>
                    <v-row justify="center">
                        <v-col cols="12" md="4" class="text-center">
                            <v-text-field
                                v-model='mapName'
                                label='マップの名前'
                                outlined
                                :rules='mapNameRules'
                            />
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="12" md="4">
                            <v-textarea
                                v-model='mapDescription'
                                label='マップの詳細'
                                rows="1"
                                outlined
                                :rules='mapDescriptionRules'
                                auto-grow
                            />
                        </v-col>
                    </v-row>
                </v-form>
            </div>
            <div class="text-center">
                <router-link to="/">
                <v-btn
                    class="ma-2"
                >
                    キャンセル
                </v-btn>
                </router-link>

                <router-link to="/MainCreationView">
                <v-btn
                    color="#3F8373"
                    class="ma-2 white--text"
                >
                    作成開始
                    <v-icon right>mdi-cloud-upload</v-icon>
                </v-btn>
                </router-link>
            </div>
        </v-app>
    </div>
</template>

<script lang='ts' src='./index.ts'/>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
