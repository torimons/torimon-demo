<template>
  <v-app>
    <v-navigation-drawer
      v-model=drawer
      app
      overflow
    ></v-navigation-drawer>
    <v-app-bar
      app
      flat
    >
      <v-toolbar-title>TORIMON</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <section class="title">
          <v-row
            align="center"
            justify="center"
          >
            <v-col
              class="text-center"
              cols="8"
            >
                <h1>Welcom to Torimon!</h1>
                <p></p>
                <p>Torimonは地図を自由に作り、そして使うことができるサービスです。自分用の地図を作ったり、他の人が作成した地図を利用することもできます。</p>
            </v-col>
          </v-row>
        </section>
        <section class="use">
          <v-row
            justify="center"
          >
            <v-col
              cols="11"
              md="5"
            >
              <h1 class="text-center">地図を作る</h1>
              <p/>
              <p>自分の思いどおりに地図を作成することができます。好きな場所にピンを立てたり、部屋の形を描いたりすることが可能です。階層を追加することもできます！</p>
            </v-col>
            <v-col cols="11" md="1">
            </v-col>
            <v-col
              cols="11"
              md="5"
            >
              <h2 class="text-center">地図を使う</h2>
              <p/>
              <p>自分で作った地図を使ったり、他の人が作った地図を使ったりできます。</p>
              <p>地図に階層情報が含まれているとズームインすることで詳細な地図に自動的に切り替わります。</p>
              <p>検索することでより素早く目的の場所にたどりつけます。</p>
            </v-col>
          </v-row>
        </section>
      </v-container>
    </v-main>
    <v-footer
      inset
      app
    >
      <span class="px-4">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator';

@Component({
    components: {
    },
})
export default class Home extends Vue {
    private drawer: boolean = true;
}
</script>
