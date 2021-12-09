<template>
  <v-container class="ma-0 pa-0">
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
            height="710"
            class="justify-center"
        >
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-card-title class="justify-center">
                <h1 class="text-center my-16">Edit Account</h1>
            </v-card-title>

            <div class="input-center">
              <v-text-field
                  v-model="firstName"
                  color="#8a73ff"
                  outlined
                  label="First name"
                  :rules="firstNameRules"
                  height="20"
                  style="width: 400px"
              >
              </v-text-field>
              <v-text-field
                  v-model="lastName"
                  color="#8a73ff"
                  outlined
                  label="Last name"
                  :rules="lastNameRules"
                  style="width: 400px"
              >
              </v-text-field>
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
              <v-text-field
                  v-model="confirmPassword"
                  color="#8a73ff"
                  outlined
                  label="Confirm password"
                  :rules="confirmPasswordRules"
                  :type="showPass2 ? 'text' : 'password'"
                  style="width: 400px"
                  class="center-block"
                  :append-icon="showPass2 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPass2 = !showPass2"
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
                Register
            </v-btn>
          </div>
        </v-card>
    </v-row>
  </v-container>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

export default {
    name: 'EditAccountForm',
    props: {
        userData: Object,
        userId: String
    },
    data: () => ({ 
        user: Object,
        userId: '',
        valid: false,
        showPass: false,
        showPass2: false,
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        confirmPassword: '',
        firstNameRules: [
            v => !!v || 'First name cannot be empty.'
        ],
        lastNameRules: [
            v => !!v || 'Last name cannot be empty.'
        ],
        emailRules: [
            v => !!v  || 'Email cannot be empty.',
            v => (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(v) || 'Must be a valid email address.'
        ],
        passwordRules: [
            v => !!v || 'Password cannot be empty.',
            v => v.length > 5 || 'Password cannot be less than 6 characters.',
        ],
        confirmPasswordRules: [],
        showSnackbar: false, 
        snackbarIcon: '',
        snackbarTitle: '',
        snackbarText: ''
    }),
    methods: {
        async loginUser() {
            const valid = this.$refs.form.validate()
            if (valid) {
                const db = firebase.firestore()
                const dbUsers = db.collection('users')
                let newUserId = ''

                await firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                    .then((returnedUser) => {
                        newUserId = returnedUser.user.uid
                    })
                    .catch(err => {
                        this.snackbarTitle = 'Error'
                        this.snackbarText = err.message
                        this.snackbarIcon = 'mdi-close'
                        this.showSnackbar = true
                        setTimeout(function(){
                            this.showSnackbar = false
                        }, 3000)
                    })
                    
                await dbUsers.doc(newUserId).set({
                    userInfo: {
                      firstName: this.firstName,
                      lastName: this.lastName
                    }
                })
                    .then(async () => {
                        const delay = ms => new Promise(res => setTimeout(res, ms));
                        this.snackbarTitle = 'Success'
                        this.snackbarText = 'Account created, signing you in and redirecting you to your dashboard.'
                        this.snackbarIcon = 'mdi-check'
                        this.showSnackbar = true
                        await delay(3500)
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
                    })
            }
        }
    },
    created() {

        this.confirmPasswordRules = [
            v => !!v || 'Confirmation cannot be empty.',
            v => v === this.password || 'Password does not match.',
        ]
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