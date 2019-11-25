<template>
    <div class="floor-switch-button">
        <ul>
            <li><span>1F</span></li>
            <li><span>2F</span></li>
            <li><span>3F</span></li>
            <li><span>4F</span></li>
            <li><span>5F</span></li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';


@Component
export default class FloorSwitchButton extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.floor-switch-button {
  width: 2%;
}
.floor-switch-button ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.floor-switch-button ul li span {
  display: block;
  padding: .4em .8em;
  text-decoration: none;
  background: #fff;
  color: #333;
  text-align: center;
  margin: .2em 0;
}
.floor-switch-button ul li span:hover {
  background: #eee;
}
</style>
