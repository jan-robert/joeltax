<template>
  <v-container fill-height fluid>
    <v-snackbar
      color="#8a73ff"
      v-model="showSnackbar"
    >
      {{ snackbarText }}
      <v-spacer></v-spacer>
      <v-icon>{{ snackbarIcon }}</v-icon>
    </v-snackbar>

    <v-row justify="space-around">
        <v-card
            color="#292929"
            width="500"
            height="700"
            class="justify-center"
        >

            <v-card-title class="justify-center">
                <h1 class="text-center my-16">Register</h1>
            </v-card-title>

            <div class="input-center">
                <v-text-field
                    v-model="email"
                    outlined
                    label="Email"
                    :rules="emailRules"
                    style="width: 400px"
                >
                </v-text-field>
                <v-text-field
                    v-model="password"
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

            <div class="text-center">
                <v-btn
                    :disabled="!formValid"
                    height="50"
                    width="400"
                    color="#8a73ff"
                    @click="loginUser()"
                >
                    Register
                </v-btn>
            </div>
        </v-card>
    </v-row>
  </v-container>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/auth'

export default {
    name: 'Register',
    data: () => ({        
        formValid: true,
        showPass: false,
        email: '',
        password: '',
        emailRules: [
            v => !!v  || 'Email cannot be empty.',
            v => (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(v) || 'Must be a valid email address.'
        ],
        passwordRules: [
            v => !!v || 'Password cannot be empty.',
            v => v.length > 4 || 'Password must be at least 6 characters.'
        ],
        showSnackbar: false, 
        snackbarIcon: '',
        snackbarText: ''
    }),
    methods: {
        async loginUser() {
            await firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then(async () => {
                    const delay = ms => new Promise(res => setTimeout(res, ms));
                    this.snackbarText = 'Successfully registered user. Please log in.'
                    this.snackbarIcon = 'mdi-check'
                    this.showSnackbar = true
                    await delay(2000)
                    this.showSnackbar = false
                    this.$router.push('/login')
                })
                .catch(err => {
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
</script>

<style scoped>
.input-center {
  position: relative;

  display: flex;
  flex-flow: column wrap;
  align-items: center;
}
</style> 