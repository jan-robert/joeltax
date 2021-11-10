<template> 
    <v-app-bar
      app
      color="#292929"
      dark
      height="80px"
    >
      <div class="d-flex align-center">
        <v-img
          alt="JoelTax Logo"
          class="mr-2 logo"
          contain
          src="../assets/JoelTaxLogo.png"  
          width="200"
          @click="$router.push('/')"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        v-if="userLoggedIn"
        :to="'/dashboard'"
        text
        class="mr-2"
      >
        <span class="mr-2">Dashboard</span>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>

      <v-btn
        v-if="!userLoggedIn"
        :to="'/login'"
        text
      >
        <span class="mr-2">Login</span>
        <v-icon>mdi-login</v-icon>
      </v-btn>
      <v-btn
        v-else
        text
        @click="userSignOut()"
      >
        <span class="mr-2">Sign Out</span>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'AppBar',

  data: () => ({
      userLoggedIn: false
  }),
  methods: {
      async userSignOut() {
        try {
            await firebase.auth().signOut()
            this.$router.push('/')
        } catch(err) {
            console.log(err)
        }
      }
  },
  created () {
    firebase.auth().onAuthStateChanged(user => {
        this.userLoggedIn = !!user
    })
  },
};
</script>

<style scoped>
.logo {
  cursor: pointer;
}
</style>