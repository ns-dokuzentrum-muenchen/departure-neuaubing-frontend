<template>
  <div>
    <form @submit.prevent="submit">
      <p class="text-xl mb-3">
        {{ noUser ? lt('createAccount') : lt('login') }}
      </p>
      <div v-if="!sentLogin && !sentSignup" class="mb-3">
        <input v-model="form.username" :placeholder="`${lt('username')}${ !noUser ? ' ' + lt('orEmail') : '' }`" type="text" class="input" minlength="3" autocapitalize="false" autocomplete="false" required/>
      </div>
      <div v-if="noUser && !sentSignup" class="mb-3">
        <input v-model="form.email" type="email" placeholder="E-Mail" class="input"/>
      </div>
      <div v-if="statusMsg" class="mb-3">
        <p class="text-green-600">{{ statusMsg }}</p>
      </div>
      <div class="flex items-center mb-3">
        <div class="flex-none mr-4">
          <button v-if="!sentLogin && !sentSignup" type="submit" class="btn">{{ noUser ? lt('register') : lt('login') }}</button>
          <button v-else @click="reset" type="button" class="btn">{{ lt('noEmail') }}</button>
        </div>
        <transition name="fade">
          <div v-if="noUser" class="mr-4">
            <button @click="reset" type="button" class="text-2xl px-2 font-light leading-none" title="abbrechen">&times;</button>
          </div>
        </transition>
        <transition name="fade">
          <div v-if="errMsg" class="flex-auto mt-0">
            <p class="text-red-600 leading-tight">{{ errMsg }}</p>
          </div>
        </transition>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, reactive, ref, onMounted } from 'vue'
  import { useStore } from '../store'

  export default defineComponent({
    name: 'LoginSignup',
    setup () {
      const store = useStore()
      // const user = computed(() => store.user)
      const nonce = computed(() => store.nonce)

      const errMsg = ref('')
      const statusMsg = ref('')
      const noUser = ref(false)
      const sentLogin = ref(false)
      const sentSignup = ref(false)

      const form = reactive({
        username: '',
        email: ''
      })

      const submit = () => {
        if (!form.username?.length || form.username.length < 3) {
          errMsg.value = 'Der Benutzername muss aus mindestens 4 Zeichen bestehen.'
          return
        }

        errMsg.value = ''

        if (noUser.value === false) {
          store.login(form.username, nonce.value || '').then(({ data }) => {
            statusMsg.value = data.msg
            sentLogin.value = true
          }).catch((res) => {
            const msg = res.response?.data?.msg
            const code = res.response?.status

            if (code === 404) {
              form.username = ''
              noUser.value = true
              errMsg.value = msg
            } else {
              errMsg.value = msg
            }
          })
        } else {
          store.register(form.username, form.email, nonce.value || '').then(({ data }) => {
            statusMsg.value = data.msg
            sentSignup.value = true
          }).catch((res) => {
            const msg = res.response?.data?.msg
            errMsg.value = msg
          })
        }
      }

      const reset = () => {
        noUser.value = false
        errMsg.value = ''
        statusMsg.value = ''
        sentLogin.value = false
        sentSignup.value = false
      }

      onMounted(() => {
        store.loginNonce()
      })

      return { form, submit, noUser, errMsg, statusMsg, sentLogin, sentSignup, reset, lt: store.lt }
    }
  })
</script>
