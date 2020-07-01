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
            <div v-if="!isMapCreated()">
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
                    </v-btn>
                    </router-link>
                </div>
            </div>
            <div v-else>
                <div class="text-center">
                    <router-link to="/MainCreationView">
                    <v-btn
                        class="ma-2"
                    >
                        編集に戻る
                    </v-btn>
                    </router-link>

                    <v-btn
                        color="#3F8373"
                        class="ma-2 white--text"
                        @click="upload()"
                    >
                        アップロード
                        <v-icon right>mdi-cloud-upload</v-icon>
                    </v-btn>
                </div>

                <div class="mapsample">
                    <v-row justify="center">
                        <v-col cols="12" md="4">
                            <MapView style="height: 500px"/>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </v-app>
    </div>
</template>

<script lang='ts' src='./index.ts'/>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map-view {
    height: 100px;
}

#map-container {
    height: 100px;
}

#map {
    height: 100px;
}
</style>
