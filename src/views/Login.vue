<template>
  <v-container fill-height fluid>
    <v-snackbar
      color="#8a73ff"
      multi-line
      v-model="showSnackbar"
    >
      <v-layout align-center pr-4>
        <v-icon class="pr-3" dark large>{{ snackbarIcon }}</v-icon>
        <v-layout column>
          <div>
            <strong>{{ snackbarTitle }}</strong>
          </div>
          <div>{{ snackbarText }}</div>
        </v-layout>
      </v-layout>
    </v-snackbar>

    <v-row justify="space-around">
        <v-card
            color="#292929"
            width="500"
            height="600"
            class="justify-center"
        >
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-card-title class="justify-center">
                <h1 class="text-center my-16">Log In</h1>
            </v-card-title>

            <div class="input-center">
              <v-text-field
                  v-model="email"
                  color="#8a73ff"
                  outlined
                  label="Email"
                  :rules="emailRules"
                  style="width: 400px"
              >
              </v-text-field>
              <v-text-field
                  v-model="password"
                  color="#8a73ff"
                  outlined
                  label="Password"
                  :rules="passwordRules"
                  :type="showPass ? 'text' : 'password'"
                  style="width: 400px"
                  class="center-block"
                  :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPass = !showPass"
              >
              </v-text-field>
            </div>
          </v-form>
          <div class="text-center">
            <v-btn
                :disabled="!valid"
                height="50"
                width="400"
                color="#8a73ff"
                @click="loginUser()"
            >
                Log In
            </v-btn>
          </div>
          <div class="text-center mt-16">
            Don't have an account? <router-link class="router-link-color ml-2" to="/register">Sign up!</router-link>
          </div>
        </v-card>
    </v-row>
  </v-container>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/auth'

export default {
    name: 'Login',
    data: () => ({        
        valid: false,
        showPass: false,
        email: '',
        password: '',
        emailRules: [
            v => !!v  || 'Email cannot be empty.',
            v => (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(v) || 'Must be a valid email address.'
        ],
        passwordRules: [
            v => !!v || 'Password cannot be empty.',
        ],
        showSnackbar: false, 
        snackbarIcon: '',
        snackbarTitle: '',
        snackbarText: ''
    }),
    methods: {
        async loginUser() {
            const valid = this.$refs.form.validate()
            if (valid) {
              await firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                  .then(async () => {
                      const delay = ms => new Promise(res => setTimeout(res, ms));
                      this.snackbarTitle = 'Success'
                      this.snackbarText = 'Redirecting to your dashboard.'
                      this.snackbarIcon = 'mdi-check'
                      this.showSnackbar = true
                      await delay(2000)
                      this.showSnackbar = false
                      this.$router.push('/dashboard')
                  })
                  .catch(err => {
                      this.snackbarTitle = 'Error'
                      this.snackbarText = err.message
                      this.snackbarIcon = 'mdi-close'
                      this.showSnackbar = true
                      setTimeout(function(){
                          this.showSnackbar = false
                      }, 3000)
                  });
          }
        }
    }
}
</script>

<style scoped>
.input-center {
  position: relative;

  display: flex;
  flex-flow: column wrap;
  align-items: center;
}
.router-link-color {
  color: #A48DFF
}
.router-link-color:hover {
  filter: brightness(125%);
}
</style> 