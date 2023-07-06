import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia';
import router from './routes';
import vuetify from './vuetify';
import 'vuetify/dist/vuetify.min.css';

createApp(App)
    .use(createPinia())
    .use(router)
    .use(vuetify)
    .mount('#app')
