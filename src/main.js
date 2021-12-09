import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import * as firebase from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDhVmkgziDHy0JzSfbw8sscwXjWumCUVK4",
    authDomain: "joeltax-c9bd0.firebaseapp.com",
    projectId: "joeltax-c9bd0",
    storageBucket: "joeltax-c9bd0.appspot.com",
    messagingSenderId: "684666313915",
    appId: "1:684666313915:web:738d777e96ecb998ba9d9e",
    measurementId: "G-NB3N3B6LTW"
  };

// joeltax color: #8a73ff

Vue.config.productionTip = false

// Init Firebase
firebase.initializeApp(firebaseConfig)

// Checks user auth before a the app is loaded from a refresh
let app

/*eslint-disable */
firebase.auth().onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})
/*eslint-enable */