<template>
  <v-container fill-height fluid>
    <v-row>
      <v-row justify="space-around">
        <h1 class="mb-12 font-weight-light">Taxes are <span class="textHard">hard</span>. We make them <span class="textEasy">easy</span>.</h1>
      </v-row>
      <v-row justify="space-around">
        <div class="d-flex justify-center">
          <v-img
            alt="Doordash Logo"
            class="logo mx-8"
            contain
            src="../assets/doordashLogo.png"
          />
          <v-img
            alt="UberEats Logo"
            class="logo mx-8"
            contain
            src="../assets/ubereatsLogo.png"  
          />
          <v-img
            alt="Postmates Logo"
            class="logo mx-8"
            contain
            src="../assets/postmatesLogo.png"  
          />
        </div>
        <div class="d-flex justify-center">
          <v-img
            alt="Shipt Logo"
            class="logo mx-8"
            contain
            src="../assets/shiptLogo.png"  
          />
          <v-img
            alt="Instacart Logo"
            class="logo mx-8"
            contain
            src="../assets/instacartLogo.png"  
          />
          <v-img
            alt="Uber Logo"
            class="logo mx-8"
            contain
            src="../assets/uberLogo.png"  
          />
        </div>
      </v-row>
      <v-row justify="space-around">
        <v-btn
            v-if="!userLoggedIn"
            height="50"
            width="250"
            color="#8a73ff"
            class="mt-16"
            @click="$router.push('/login')"
        >
            Get Started
        </v-btn>
        <v-btn
            v-else
            height="50"
            width="250"
            color="#8a73ff"
            class="mt-16"
            @click="$router.push('/dashboard')"
        >
            Go To Dashboard
        </v-btn>
      </v-row>
    </v-row>
  </v-container>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'HomePage',

  data: () => ({
    userLoggedIn: false
  }),
  created () {
    firebase.auth().onAuthStateChanged(user => {
        this.userLoggedIn = !!user
    })
  },
}
</script>

<style scoped>
.textEasy {
  color: #62fc77;
}
.textHard {
  color: #ff6969;
}
.logo {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
  opacity: 0.3;
}
.logo:hover {
  -webkit-filter: grayscale(0%);
  filter: grayscale(0%);
  opacity: 1;
}
</style>