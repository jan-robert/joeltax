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

    <div class="d-flex flex-row justify-center">
        <v-card
        width="500"
        height="430"
        class="py-10"
        >
        <div class="d-flex flex-row">
            <h1 class="font-weight-light"><v-icon class="ml-10 mr-4" large>mdi-cash-plus</v-icon>Add Income</h1>
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
                label="Amount in USD"
                placeholder="eg. 123.12"
                v-model="amountInput"
                :rules="incomeRules"
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
                @click="addIncome"
            >
            Add Income
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
                        Amount
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="item in incomeList"
                    :key="item.amount"
                    >
                    <td>{{ item.date }}</td>
                    <td>${{ item.amount }}</td>
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
    name: 'Income',
    props: {
        userData: Object,
        userId: String
    },
    data: () => ({ 
        valid: false,
        checkbox: true,
        headers: [
            {text: 'Date', value: 'date'},
            {text: 'Amount', value: 'amount'}
        ],
        incomeList: [],
        amountInput: '',
        dateInput: '',
        dateRules: [
            v => (/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/).test(v) || 'Must be formatted like MM/DD/YYYY'
        ],
        incomeRules: [
            v => !!v || 'Input cannot be empty.',
            v => (/[0-9]+\.[0-9][0-9]/).test(v) || 'Must be formatted like 123.12'
        ],
        showSnackbar: false, 
        snackbarIcon: '',
        snackbarTitle: '',
        snackbarText: ''
    }),
    methods: {
        async addIncome() {
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

                this.incomeList.push({
                    amount: parseFloat(this.amountInput).toFixed(2),
                    date: date
                })

                const db = firebase.firestore()
                const dbUserIncome = db.collection('users').doc(this.userId)
                await dbUserIncome.update({
                    income: this.incomeList
                })
                        .then(async () => {
                            const delay = ms => new Promise(res => setTimeout(res, ms))
                            this.snackbarTitle = 'Success'
                            this.snackbarText = 'Income added!'
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
        refreshIncome() {
            if (this.userData.income.length !== undefined) {
                this.incomeList = this.userData.income
            }
        }
    },
    created () {
        this.refreshIncome()
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