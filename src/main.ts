import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { store } from './store';
import './registerServiceWorker';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;
Vue.use(Vuetify);

new Vue({
    router,
    store,
    vuetify: new Vuetify({
        icons: {
            iconfont: 'mdi',
        },
    }),
    render: (h) => h(App),
}).$mount('#app');
