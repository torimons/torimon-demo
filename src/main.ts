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
        theme: {
            themes: {
                light: {
                    primary: '#3F8373',
                    secondary: '#E18632',
                    info: '#CF944E',
                    warning: '#FF5252',
                    accent: '#3FA590',
                },
                dark: {
                    primary: '#3F8373',
                },
            },
        },
    }),
    render: (h) => h(App),
}).$mount('#app');
