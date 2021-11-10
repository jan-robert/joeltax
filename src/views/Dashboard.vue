<template>
  <v-container fill-height fluid>
    <v-row justify="space-around">
        <v-card
            color="#404040"
            width="600"
            height="120"
        >
              <v-toolbar
                color="#8a73ff"
                flat
              >
                <v-icon>mdi-account-circle</v-icon>
                <v-card-title>{{ userEmail }}</v-card-title>
              </v-toolbar>
              <p class='text-center mt-4'>Your user ID is: {{ userId }}</p>
        </v-card>
    </v-row>
  </v-container>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'Dashboard',

  data: () => ({
      userEmail: '',
      userId: ''
  }),
  created() {
      const user = firebase.auth().currentUser
      this.userEmail = user.email
      this.userId = user.uid
  }
}
</script>
