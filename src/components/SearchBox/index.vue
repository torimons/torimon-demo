<template>
    <div id="search-box">
        <v-card
            tile
            flat
            color="transparent"
        >
            <v-form @submit.prevent>
                <v-text-field
                    v-model='searchWord'
                    placeholder="ここで検索できます"
                    clearable
                    solo
                    full-width
                    @click="focus"
                    @blur="unfocus"
                    ref="searchTextField"
                    hide-details
                    height="8vh"
                    class="pa-2"
                >
                    <template
                        v-slot:prepend-inner
                    >
                        <v-btn
                            id="place"
                            text
                            icon
                            v-show="!onFocus"
                        >
                            <v-icon>place</v-icon>
                        </v-btn>
                        <v-btn
                            id="arrow"
                            text
                            icon
                            v-show="onFocus"
                            @click="exitSearch"
                        >
                            <v-icon>keyboard_arrow_left</v-icon>
                        </v-btn>
                    </template>
                </v-text-field>
            </v-form>
        </v-card>
    </div>
</template>

<script lang="ts" src='./index.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-card {
    pointer-events: auto;
}
</style>
