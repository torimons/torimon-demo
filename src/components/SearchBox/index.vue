<template>
    <div id="search-box">
        <v-form @submit.prevent>
            <v-container>
                <v-row>
                    <v-btn >
                        <v-icon>keyboard_arrow_left</v-icon>
                    </v-btn>
                    <v-text-field
                        v-model='searchWord'
                        placeholder="ここで検索できます"
                        clearable
                    ></v-text-field>
                </v-row>
            </v-container>
        </v-form>
    </div>
</template>

<script lang="ts" src='./index.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#search-box {
    position:absolute;
    left: 10px;
    top: 10px;
    z-index: 1000;
    /* background-color: white; */
}

</style>
