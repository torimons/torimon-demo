<template>
    <Menu>
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
                            <router-link to="map-select">
                                <v-btn color="#3F8373" large>
                                    <span class="white--text">地図利用</span>
                                </v-btn>
                            </router-link>
                        </div>
                        <div class="my-2">
                            <v-btn color="#3F8373" large href="MainCreationView">
                                <span class="white--text">地図作成</span>
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </Menu>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator';
import Menu from '@/components/Menu/index.vue';

@Component({
    components: {
        Menu,
    },
})
export default class Home extends Vue {
}
</script>
