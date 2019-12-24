<template>
    <div id="search-box">
        <v-form>
            <v-container>
                <v-text-field
                    placeholder="ここで検索できます"
                    clearable
                ></v-text-field>
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
