<template>
    <div id="map-information-dialog">
        <v-card>
            <v-card-title style="text-align: center">
                <div v-if="!isMapCreated()">
                    <span class="headline">新規の地図を作成</span>
                </div>
                <div v-else>
                    <span class="headline">地図の情報を更新</span>
                </div>
            </v-card-title>
            <v-card-text>
                <v-container>
                <div>
                    <v-form v-model='isValidInput'>
                        <v-text-field
                            v-model='mapName'
                            label='地図の名前'
                            outlined
                            :rules='mapNameRules'
                        />
                        <v-textarea
                            v-model='mapDescription'
                            label='地図の説明'
                            rows="1"
                            outlined
                            :rules='mapDescriptionRules'
                            auto-grow
                        />
                    </v-form>
                </div>
                <div v-if="!isMapCreated()">
                    <div class="text-center">
                        <v-btn
                            class="ma-2"
                            @click="closeDialog"
                        >
                            キャンセル
                        </v-btn>

                        <router-link to="/CreationMapView">
                        <v-btn
                            color="#3F8373"
                            class="ma-2 white--text"
                            @click="startNewMap()"
                        >
                            作成開始
                        </v-btn>
                        </router-link>
                    </div>
                </div>
                <div v-else>
                    <div class="text-center">
                        <v-btn
                            class="ma-2"
                            @click="closeDialog"
                        >
                            編集に戻る
                        </v-btn>

                        <v-btn
                            color="#3F8373"
                            class="ma-2 white--text"
                            @click="upload()"
                            :loading="loading"
                            :disabled="loading"
                        >
                            アップロード
                            <v-icon right>mdi-cloud-upload</v-icon>
                        </v-btn>
                    </div>
                </div>
                </v-container>
            </v-card-text>
        </v-card>
    </div>
</template>

<script lang='ts' src='./index.ts'/>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
