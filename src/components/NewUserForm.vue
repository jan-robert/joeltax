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
      <v-stepper
        dark
        vertical
        class="justify-center"
        style="width: 650px"
        color="#8a73ff"
        v-model="e6"
      >
        <h1 class="ml-6 mt-8">
            <v-icon class="mr-4" color="#8a73ff" large>mdi-account-cash</v-icon>
            <span class="font-weight-light">Welcome to JoelTax!</span>
        </h1>
        <small class="ml-16 pl-3">We just need you to answer some questions before you proceed.</small>
        <v-stepper-step :complete="e6 > 1" step="1" color="#8a73ff" class="mt-8">
            Occupation
            <small>What do you do for a living?</small>
        </v-stepper-step>
        <v-stepper-content step="1">
            <v-select
              :items="occupationList"
              v-model="occupation"
              item-color="#8a73ff"
              color="#8a73ff"
              style="width:500px"
            ></v-select>
            <v-btn 
              class="mr-2"
              color="#8a73ff"
              @click="e6 = e6 + 1"
              :disabled="occupation === ''"
            >
              Continue
            </v-btn>
        </v-stepper-content>
        <v-stepper-step :complete="e6 > 2" step="2" color="#8a73ff">
            Marital Status
            <small>How's your love life?</small>
        </v-stepper-step>
        <v-stepper-content step="2">
            <v-select
              :items="maritalStatusList"
              v-model="maritalStatus"
              item-color="#8a73ff"
              color="#8a73ff"
              style="width:500px"
            ></v-select>
            <v-btn
              class="mr-2"
              color="#8a73ff"
              @click="updateUser"
              :disabled="maritalStatus === ''"
            >
              Finish
            </v-btn>
            <v-btn @click="e6 = e6 - 1">Go Back</v-btn>
        </v-stepper-content>  
      </v-stepper>
    </v-row>
  </v-container>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

export default {
    name: 'NewUserForm',
    props: {
        userId: String
    },
    data: () => ({ 
        user: Object,
        occupationList: [
            'Driver',
            'Freelancer'
        ],
        occupation: '',
        maritalStatusList: [
            'Single, Widowed, Other',
            'Married (Filed Separate)',
            'Married (Filed Jointly)'
        ],
        maritalStatus: '',
        e6: 1,
        showSnackbar: false, 
        snackbarIcon: '',
        snackbarTitle: '',
        snackbarText: ''
    }),
    methods: {
        async updateUser() {
            const db = firebase.firestore()
            const dbUsers = db.collection('users')
            await dbUsers.doc(this.userId).update({
                occupation: this.occupation,
                maritalStatus: this.maritalStatus
            })
                .then(async () => {
                    const delay = ms => new Promise(res => setTimeout(res, ms))
                    this.snackbarTitle = 'Success'
                    this.snackbarText = 'Account info updated, welcome to JoelTax. Redirecting to Summary.'
                    this.snackbarIcon = 'mdi-check'
                    this.showSnackbar = true
                    await delay(3500)
                    this.showSnackbar = false
                    this.$emit('update-user')
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
}
</script>