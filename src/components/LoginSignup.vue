<template>
  <div>
    <form @submit.prevent="submit">
      <div class="mb-2">
        <input v-model="form.username" :placeholder="`Benutzername${ !noUser ? ' oder die E-Mail-Adresse' : '' }`" type="text" class="input" required/>
      </div>
      <div v-if="noUser" class="mb-2">
        <input v-model="form.email" type="email" placeholder="E-Mail" class="input"/>
      </div>
      <div v-if="errMsg" class="mb-2">
        <p class="text-red-600">{{ errMsg }}</p>
      </div>
      <div v-if="statusMsg" class="mb-2">
        <p class="text-green-600">{{ statusMsg }}</p>
      </div>
      <button v-if="!sentLogin" type="submit" class="btn">{{ noUser ? 'Registrieren' : 'Anmelden' }}</button>
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
      const user = computed(() => store.user)
      const nonce = computed(() => store.nonce)

      const errMsg = ref('')
      const statusMsg = ref('')
      const noUser = ref(false)
      const sentLogin = ref(false)

      const form = reactive({
        username: '',
        email: ''
      })

      const submit = () => {
        if (!form.username?.length) return
        if (!nonce.value) return

        errMsg.value = ''

        if (noUser.value === false) {
          store.login(form.username, nonce.value).then(({ data }) => {
            console.log(data)
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
          store.register(form.username, form.email, nonce.value)
        }
      }

      onMounted(() => {
        store.loginNonce()
      })

      return { user, form, submit, noUser, errMsg, statusMsg, sentLogin }
    }
  })
</script>
