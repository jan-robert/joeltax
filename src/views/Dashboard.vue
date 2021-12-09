<template>
  <v-container 
    fill-height 
    fluid
    class="ma-0 pa-0"
  >
    <v-col 
      cols="2"
      class="ma-0 pa-0"
    >
      <v-navigation-drawer
        permanent
        absolute
        color="#292929"
      >
        <v-list
          nav
        >
          <v-list-item
            v-for="item in navData"
            :key="item.title"
            @click="newUser ? null : changeDisplay(item.title); calculateForecast()"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <span>{{ item.title }}</span>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-col>

    <v-col v-if="displayMode === 'Summary' && newUser">
      <new-user-form
        v-bind:userId="userId"
        @update-user="loadUser"
      >
      </new-user-form>
    </v-col>

    <v-col v-if="displayMode === 'Summary' && !newUser">
      <div class="mx-auto d-flex flex-row justify-center">
        <v-card
            color="#292929"
            width="600"
            height="250"
            class="mt-6"
        >
          <v-toolbar
            color="#8a73ff"
            height="75"
            flat
          >
            <div class="d-flex flex-row"> 
              <v-icon class="my-auto ml-2 mr-4" size="40">mdi-account-circle</v-icon>
              <v-spacer></v-spacer>
              <h2 class="my-auto font-weight-light">Personal Information</h2>
            </div>
          </v-toolbar>
          <div class="d-flex flex-row px-8 py-4">
            <h4 class="font-weight-light left my-auto">Full Name</h4>
            <v-spacer></v-spacer>
            <h4 class="font-weight-light right my-auto">{{ user.userInfo.firstName }} {{ user.userInfo.lastName }}</h4>
          </div>
          <v-divider></v-divider>
          <div class="d-flex flex-row px-8 py-4">
            <h4 class="font-weight-light left my-auto">Marital Status</h4>
            <v-spacer></v-spacer>
            <h4 class="font-weight-light right my-auto">{{ user.maritalStatus }}</h4>
          </div>
          <v-divider></v-divider>
          <div class="d-flex flex-row px-8 py-4">
            <h4 class="font-weight-light left my-auto">Occupation</h4>
            <v-spacer></v-spacer>
            <h4 class="font-weight-light right my-auto">{{ user.occupation }}</h4>
          </div>
        </v-card>
      </div>

      <div class="mx-auto d-flex flex-row justify-center">
        <v-card
            color="#292929"
            width="600"
            height="420"
            class="mt-6"
        >
          <v-toolbar
            color="#8a73ff"
            height="75"
            flat
          >
            <div class="d-flex flex-row"> 
              <v-icon class="my-auto ml-2 mr-4" size="40">mdi-format-list-bulleted</v-icon>
              <v-spacer></v-spacer>
              <h2 class="my-auto font-weight-light">Your Tax Summary</h2>
            </div>
          </v-toolbar>
          <div class="d-flex flex-row px-8 py-4">
            <h4 class="font-weight-light left my-auto">Total Income</h4>
            <v-spacer></v-spacer>
            <h4 class="font-weight-light right my-auto">${{ totalIncome }}</h4>
          </div>
          <v-divider></v-divider>
          <div class="d-flex flex-row px-8 py-4">
            <h4 class="font-weight-light left my-auto">Social Security Tax</h4>
            <v-spacer></v-spacer>
            <h4 class="font-weight-light right my-auto">${{ socialSecurityTax }}</h4>
          </div>
          <v-divider></v-divider>
          <div class="d-flex flex-row px-8 py-4">
            <h4 class="font-weight-light left my-auto">Medicare Tax</h4>
            <v-spacer></v-spacer>
            <h4 class="font-weight-light right my-auto">${{ medicareTax }}</h4>
          </div>
          <v-divider></v-divider>
          <div class="d-flex flex-row px-8 py-4">
            <h4 class="font-weight-light left my-auto">Income Tax</h4>
            <v-spacer></v-spacer>
            <h4 class="font-weight-light right my-auto">${{ incomeTax }}</h4>
          </div>
          <v-divider></v-divider>
          <div class="d-flex flex-row px-8 py-4">
            <h4 class="font-weight-light left my-auto">Total Asset Deductions</h4>
            <v-spacer></v-spacer>
            <h4 class="font-weight-light right my-auto">${{ totalAssetDeduction }}</h4>
          </div>
          <v-divider></v-divider>
          <div class="d-flex flex-row px-8 py-4">
            <h4 class="font-weight-bold left my-auto">Calculated Tax Forecast</h4>
            <v-spacer></v-spacer>
            <h4 class="font-weight-bold right my-auto">${{ taxForecast }}</h4>
          </div>
        </v-card>
      </div>
    </v-col>

    <v-col v-if="displayMode === 'Income'">
      <income
        v-bind:user-data="user"
        v-bind:user-id="userId"
        @update-user="loadUser"
      >
      </income>
    </v-col>

    <v-col v-if="displayMode === 'Deductions'">
      <deductions
        v-bind:user-data="user"
        v-bind:user-id="userId"
        @update-user="loadUser"
      >
      </deductions>
    </v-col>

    <!--
    <v-col v-if="displayMode === 'Edit Account'">
      <edit-account-form
        v-bind:userData="user"
        v-bind:userId=userId
      >
      </edit-account-form>
    </v-col>
    -->
  </v-container>
</template>

<script>
import NewUserForm from '../components/NewUserForm'
import Income from '../components/Income'
import Deductions from '../components/Deductions'
//import EditAccountForm from '../components/EditAccountForm'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

export default {
  components: { NewUserForm, Income, Deductions },
  name: 'Dashboard',
  data: () => ({
      user: Object,
      userId: '',
      displayMode: 'Summary',
      newUser: false,
      navData: [
        {icon: 'mdi-card-account-details', title: 'Summary'},
        {icon: 'mdi-cash-fast', title: 'Income'},
        {icon: 'mdi-cash-refund', title: 'Deductions'},
        {icon: 'mdi-account-edit', title: 'Edit Account'}
      ],
      taxForecast: 0.0,
      socialSecurityTax: 0.0,
      medicareTax: 0.0,
      incomeTax: 0.0,
      totalAssetDeduction: 0.0,
      totalIncome: 0.0
  }),
  methods: {
      async loadUser() {
        const db = firebase.firestore()
        const dbUsers = db.collection('users')
        const userAuth = firebase.auth().currentUser
        await dbUsers.doc(userAuth.uid).get()
            .then((doc) => {
                this.userId = doc.id
                this.user = doc.data()
                if (this.user.occupation === '' && this.user.maritalStatus === '') {
                  this.newUser = true
                } else {
                  this.newUser = false
                }
            })
        this.calculateForecast()
      },
      changeDisplay(mode) {
          if (mode === 'Edit Account') {
            window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')
          } else {
            this.displayMode = mode
          }
      },
      calcTotalIncome() {
          return this.user.income.map(item => parseFloat(item.amount)).reduce((prev, curr) => prev + curr, 0).toFixed(2)
      },
      calculateForecast() {
          let totalIncome = this.calcTotalIncome()
          let socialSecurityTax = 0.0
          let taxThreshold = 0.0
          let medicareTax = 0.0
          let incomeTax = 0.0
          let totalAssetDeduction = 0.0

          if (totalIncome > 142800) {
              socialSecurityTax = 142800 * 0.124
          } else {
              socialSecurityTax = totalIncome * 0.124
          }

          if (this.user.maritalStatus === 'Married (Filed Jointly)') {
              taxThreshold = 250000
          } else if (this.user.maritalStatus === 'Married (Filed Separate)') {
              taxThreshold = 125000
          } else if (this.user.maritalStatus === 'Single, Widowed, Other') {
              taxThreshold = 200000
          }

          if (taxThreshold > totalIncome) {
              medicareTax = totalIncome * 0.029
          } else {
              medicareTax = (taxThreshold * 0.029) + ((totalIncome - taxThreshold) * 0.009)
          }

          if (totalIncome <= 9950) {
              incomeTax = totalIncome * 0.10
          } else if (totalIncome <= 40525) {
              incomeTax = totalIncome * 0.12
          } else if (totalIncome <= 86375) {
              incomeTax = totalIncome * 0.22
          } else if (totalIncome <= 164925) {
              incomeTax = totalIncome * 0.24
          } else if (totalIncome <= 209425) {
              incomeTax = totalIncome * 0.32
          } else if (totalIncome <= 523600) {
              incomeTax = totalIncome * 0.35
          } else {
              incomeTax = totalIncome * 0.37
          }

          if (this.user.occupation === 'Driver') {
              for (const deduction of this.user.deductions) {
                totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.miles) * 0.56)
              }
          } else if (this.user.occupation === 'Freelancer') {
              for (const deduction of this.user.deductions) {
                if (deduction.state === 'Alaska' || deduction.state === 'Delaware' || deduction.state === 'Montana' || deduction.state === 'New Hampshire' || deduction.state === 'Oregon') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0))
                } else if (deduction.state === 'Colorado') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.029))
                } else if (deduction.state === 'Alabama' || deduction.state === 'Georgia' || deduction.state === 'Hawaii' || deduction.state === 'New York' || deduction.state === 'Wyoming') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.04))
                } else if (deduction.state === 'Missouri') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.0423))
                } else if (deduction.state === 'Louisiana') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.0445))
                } else if (deduction.state === 'Oklahoma' || deduction.state === 'South Dakota') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.045))
                } else if (deduction.state === 'North Carolina') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.0475))
                } else if (deduction.state === 'North Dakota' || deduction.state === 'Wisconsin') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.05))
                } else if (deduction.state === 'New Mexico') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.0513))
                } else if (deduction.state === 'Virginia') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.053))
                } else if (deduction.state === 'Maine' || deduction.state === 'Nebraska') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.055))
                } else if (deduction.state === 'Arizona') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.056))
                } else if (deduction.state === 'Ohio') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.0575))
                } else if (deduction.state === 'Utah') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.0595))
                } else if (deduction.state === 'Florida' || deduction.state === 'Idaho' || deduction.state === 'Iowa' || deduction.state === 'Kentucky' || deduction.state === 'Maryland' || deduction.state === 'Michigan' || deduction.state === 'Pennsylvania' || deduction.state === 'South Carolina' || deduction.state === 'Vermont' || deduction.state === 'West Virginia') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.06))
                } else if (deduction.state === 'Illinois' || deduction.state === 'Massachusetts' || deduction.state === 'Texas') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.0625))
                } else if (deduction.state === 'Connecticut') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.0635))
                } else if (deduction.state === 'Arkansas' || deduction.state === 'Kansas' || deduction.state === 'Washington') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.0650))
                } else if (deduction.state === 'New Jersey') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.0663))
                } else if (deduction.state === 'Nevada') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.0685))
                } else if (deduction.state === 'Minnesota') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.0688))
                } else if (deduction.state === 'Indiana' || deduction.state === 'Mississippi' || deduction.state === 'Rhode Island' || deduction.state === 'Tennessee') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.07))
                } else if (deduction.state === 'California') {
                  totalAssetDeduction = totalAssetDeduction + (parseFloat(deduction.amount) * (1 - 0.0725))
                }
              }
          }

          if (totalAssetDeduction >= 500000) {
            totalAssetDeduction = 500000
          }

          this.socialSecurityTax = socialSecurityTax.toFixed(2)
          this.incomeTax = incomeTax.toFixed(2)
          this.medicareTax = medicareTax.toFixed(2)
          this.totalAssetDeduction = totalAssetDeduction.toFixed(2)
          this.totalIncome = totalIncome
          this.taxForecast = ((socialSecurityTax + medicareTax + incomeTax) - totalAssetDeduction).toFixed(2)
      }
  },
  created() {
      this.loadUser()
  }
}
</script>

<style scoped>
.dash-text {
  font-size: 22px;
}
</style>