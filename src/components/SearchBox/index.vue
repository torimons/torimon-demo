<template>
    <div id="search-box">
        <v-form @submit.prevent>
            <v-container>
                <v-text-field
                    v-model='searchWord'
                    placeholder="ここで検索できます"
                    clearable
                    solo
                    full-width
                    @focus="focus"
                    @blur="cancel"
                >
                    <template
                        v-slot:prepend-inner
                    >
                        <v-btn
                            text
                            icon
                            v-show="!onFocus"
                        >
                            <v-icon>place</v-icon>
                        </v-btn>
                        <v-btn
                            text
                            icon
                            v-show="onFocus"
                        >
                            <v-icon>keyboard_arrow_left</v-icon>
                        </v-btn>
                    </template>
                </v-text-field>
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
