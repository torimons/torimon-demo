/*
 * Vuetifyコンポーネントを含んだテストを実行しようとすると
 * ```
 * [Vuetify] Multiple instances of Vue detected
 * ```
 * というエラーが発生した．下記イシューで取り上げられており
 * https://github.com/vuetifyjs/vuetify/issues/4964
 * 回避策として本設定ファイルを作成した．
 */

import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);
