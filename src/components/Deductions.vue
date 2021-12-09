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

    <div v-if="deductionType === 'Driver'" class="d-flex flex-row justify-center">
        <v-card
        width="500"
        height="430"
        class="py-10"
        >
        <div class="d-flex flex-row">
            <h1 class="font-weight-light"><v-icon class="ml-10 mr-4" large>mdi-car</v-icon>Add Miles</h1>
        </div>
        <v-form
            ref="form"
            v-model="valid"
            lazy-validation
        >
        <div class="mx-16 mt-6 justify-center">
            <v-text-field
            label="Date"
            placeholder="eg. 01/01/2001"
            v-model="dateInput"
            :rules="checkbox ? undefined : dateRules" 
            :disabled="checkbox"
            outlined
            max-width="100px"
            color="#8a73ff"
            ></v-text-field>
            <v-checkbox
            v-model="checkbox"
            label="Use today's date"
            color="#8a73ff"
            class="mt-n2"
            ></v-checkbox>
        </div>
        <div class="d-flex mx-16">
            <v-text-field
                label="Miles"
                placeholder="eg. 123.1"
                v-model="milesInput"
                :rules="milesRules"
                outlined
                max-width="100px"
                color="#8a73ff"
            ></v-text-field>
            </div>
            <div class="text-center">
            <v-btn
                class="mx-2"
                dark
                color="#8a73ff"
                height="55px"
                :disabled="!valid"
                @click="addMiles"
            >
                Add Miles
            </v-btn>
            </div>
        </v-form>
        </v-card>
        <v-simple-table
          v-if="deductionType === 'Driver'"
          height="400px"
          style="width: 800px"
          class="ml-6"
        >
            <template v-slot:default>
                <thead>
                    <tr>
                    <th class="text-left">
                        Date
                    </th>
                    <th class="text-left">
                        Miles Driven
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="item in deductionList"
                    :key="item.miles"
                    >
                    <td>{{ item.date }}</td>
                    <td>{{ item.miles }}</td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
    </div>

    <div v-if="deductionType === 'Freelancer'" class="d-flex flex-row justify-center">
        <v-card
        width="500"
        height="530"
        class="py-10"
        >
        <div class="d-flex flex-row">
            <h1 class="font-weight-light"><v-icon class="ml-10 mr-4" large>mdi-briefcase-plus</v-icon>Add Deductions</h1>
        </div>
        <v-form
            ref="form"
            v-model="valid"
            lazy-validation
        >
        <div class="mx-16 mt-6 justify-center">
            <v-text-field
            label="Date"
            placeholder="eg. 01/01/2001"
            v-model="dateInput"
            :rules="checkbox ? undefined : dateRules" 
            :disabled="checkbox"
            outlined
            max-width="100px"
            color="#8a73ff"
            ></v-text-field>
            <v-checkbox
            v-model="checkbox"
            label="Use today's date"
            color="#8a73ff"
            class="mt-n2"
            ></v-checkbox>
            <v-autocomplete
                v-model="stateInput"
                :items="states"
                :rules="stateRules"
                outlined
                label="State Purchased"
                color="#8a73ff"
                class="my-3"
            ></v-autocomplete>
        </div>
        <div class="d-flex mx-16">
            <v-text-field
                label="Amount in USD"
                placeholder="eg. 123.12"
                v-model="amountInput"
                :rules="deductionRules"
                outlined
                max-width="100px"
                color="#8a73ff"
            ></v-text-field>
            </div>
            <div class="text-center">
            <v-btn
                class="mx-2"
                dark
                color="#8a73ff"
                height="55px"
                :disabled="!valid"
                @click="addDeduction"
            >
                Add Deduction
            </v-btn>
            </div>
        </v-form>
        </v-card>
        <v-simple-table
          height="400px"
          style="width: 800px"
          class="ml-6"
        >
            <template v-slot:default>
                <thead>
                    <tr>
                    <th class="text-left">
                        Date
                    </th>
                    <th class="text-left">
                        State Purchased
                    </th>
                    <th class="text-left">
                        Amount
                    </th>                    
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="item in deductionList"
                    :key="item.amount"
                    >
                    <td>{{ item.date }}</td>
                    <td>{{ item.state }}</td>
                    <td>{{ item.amount }}</td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
    </div>
  </v-container>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

export default {
    name: 'Deductions',
    props: {
        userData: Object,
        userId: String
    },
    data: () => ({ 
        valid: false,
        checkbox: true,
        deductionList: [],
        milesInput: '',
        amountInput: '', 
        dateInput: '',
        stateInput: '',
        dateRules: [
            v => (/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/).test(v) || 'Must be formatted like MM/DD/YYYY'
        ],
        stateRules: [
            v => !!v || 'State purchased required.'
        ],
        milesRules: [
            v => !!v || 'Input cannot be empty.',
            v => (/[0-9]+\.[0-9]/).test(v) || 'Must be formatted like 123.1'
        ],
        deductionRules: [
            v => !!v || 'Input cannot be empty.',
            v => (/[0-9]+\.[0-9][0-9]/).test(v) || 'Must be formatted like 123.12'
        ],
        deductionType: '',
        showSnackbar: false, 
        snackbarIcon: '',
        snackbarTitle: '',
        snackbarText: '',
        states: ["Alaska",
                  "Alabama",
                  "Arkansas",
                  "Arizona",
                  "California",
                  "Colorado",
                  "Connecticut",
                  "Delaware",
                  "Florida",
                  "Georgia",
                  "Hawaii",
                  "Iowa",
                  "Idaho",
                  "Illinois",
                  "Indiana",
                  "Kansas",
                  "Kentucky",
                  "Louisiana",
                  "Massachusetts",
                  "Maryland",
                  "Maine",
                  "Michigan",
                  "Minnesota",
                  "Missouri",
                  "Mississippi",
                  "Montana",
                  "North Carolina",
                  "North Dakota",
                  "Nebraska",
                  "New Hampshire",
                  "New Jersey",
                  "New Mexico",
                  "Nevada",
                  "New York",
                  "Ohio",
                  "Oklahoma",
                  "Oregon",
                  "Pennsylvania",
                  "Rhode Island",
                  "South Carolina",
                  "South Dakota",
                  "Tennessee",
                  "Texas",
                  "Utah",
                  "Virginia",
                  "Vermont",
                  "Washington",
                  "Wisconsin",
                  "West Virginia",
                  "Wyoming"]
    }),
    methods: {
        async addMiles() {
            const valid = this.$refs.form.validate()
            if (valid) {
                let date = ''

                if (this.checkbox) {
                    let today = new Date();
                    let dd = String(today.getDate()).padStart(2, '0')
                    let mm = String(today.getMonth() + 1).padStart(2, '0')
                    let yyyy = today.getFullYear()

                    date = mm + '/' + dd + '/' + yyyy
                } else {
                    date = this.dateInput
                }

                this.deductionList.push({
                    miles: parseFloat(this.milesInput).toFixed(1),
                    date: date
                })

                const db = firebase.firestore()
                const dbUserDeduction = db.collection('users').doc(this.userId)
                await dbUserDeduction.update({
                    deductions: this.deductionList
                })
                        .then(async () => {
                            const delay = ms => new Promise(res => setTimeout(res, ms))
                            this.snackbarTitle = 'Success'
                            this.snackbarText = 'Deduction added!'
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
        },
        async addDeduction() {
            const valid = this.$refs.form.validate()
            if (valid) {
                let date = ''

                if (this.checkbox) {
                    let today = new Date();
                    let dd = String(today.getDate()).padStart(2, '0')
                    let mm = String(today.getMonth() + 1).padStart(2, '0')
                    let yyyy = today.getFullYear()

                    date = mm + '/' + dd + '/' + yyyy
                } else {
                    date = this.dateInput
                }

                this.deductionList.push({
                    amount: parseFloat(this.amountInput).toFixed(2),
                    date: date,
                    state: this.stateInput
                })

                const db = firebase.firestore()
                const dbUserDeduction = db.collection('users').doc(this.userId)
                await dbUserDeduction.update({
                    deductions: this.deductionList
                })
                        .then(async () => {
                            const delay = ms => new Promise(res => setTimeout(res, ms))
                            this.snackbarTitle = 'Success'
                            this.snackbarText = 'Deduction added!'
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
        },
        refreshDeduction() {
            if (this.userData.deductions !== undefined) {
                this.deductionList = this.userData.deductions
            }
        }
    },
    created () {
        this.deductionType = this.userData.occupation
        this.refreshDeduction()
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