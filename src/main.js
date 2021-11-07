import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import firebase from 'firebase'

var firebaseConfig = {
  apiKey: "AIzaSyDhVmkgziDHy0JzSfbw8sscwXjWumCUVK4",
  authDomain: "joeltax-c9bd0.firebaseapp.com",
  projectId: "joeltax-c9bd0",
  storageBucket: "joeltax-c9bd0.appspot.com",
  messagingSenderId: "684666313915",
  appId: "1:684666313915:web:738d777e96ecb998ba9d9e",
  measurementId: "G-NB3N3B6LTW"
};

firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
