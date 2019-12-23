<template>
    <div id="floor-switch-button">
        <ul>
            <li v-for="floorName in floorNames" v-bind:key="floorName">
                <span>{{ floorName }}</span>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" src='./index.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#floor-switch-button {
    width: 2%;
    border: solid;
    position:absolute;
    left: 20px;
    bottom: 20px;
    z-index: 1000;
    position: absolute;
}
#floor-switch-button ul {
    list-style: none;
    margin: 0;
    padding: 0;
}
#floor-switch-button ul li span {
    display: block;
    padding: .4em .8em;
    text-decoration: none;
    background: #fff;
    color: #333;
    text-align: center;
    margin: .2em 0;
}
#floor-switch-button ul li span:hover {
    background: #eee;
    text-align: center;
}
</style>
