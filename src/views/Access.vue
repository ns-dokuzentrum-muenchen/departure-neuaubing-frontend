<template>
  <div class="bg-gray-200 dark:bg-gray-800 h-screen grid place-items-center p-4">
    <form v-if="!formOK" @submit.prevent="submit" class="w-full max-w-96">
      <p class="mb-2 text-lg">Passwort erforderlich</p>
      <div>
        <input v-model="form.password" type="password" placeholder="Password" class="input">
      </div>
      <div v-if="formErr" class="mt-2">
        <p class="text-red-600">{{ formErr }}</p>
      </div>
      <div class="mt-2">
        <button class="btn">Anmelden</button>
      </div>
    </form>

    <div v-else>
      <div class="bg-green-400 text-white leading-none p-6 rounded-full text-4xl">
        ✔️
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import type { AxiosError } from 'axios'
  import { defineComponent, reactive, ref } from 'vue'
  import { useStore } from '../store'
  import { useRouter } from 'vue-router'
  import axios from 'axios'

  export default defineComponent({
    setup () {
      const form = reactive({
        password: ''
      })

      const formOK = ref(false)
      const formErr = ref<string|null>(null)

      const store = useStore()
      const router = useRouter()

      const submit = async () => {
        formErr.value = null

        const check = await axios.post('/.netlify/functions/unlock', {
          ...form
        }).catch((err: Error | AxiosError) => {
          formErr.value = axios.isAxiosError(err) ? err.message : 'Unknown error, please try again'
        })

        if (check) {
          const { data } = check
          if (data.ok) {
            formOK.value = true
            store.unlocked = true
            window.localStorage?.setItem('unlocked', 'true')

            setTimeout(() => {
              console.log('go home')
              router.replace('/')
            }, 1000)
          } else {
            formErr.value = 'Unknown error, please try again'
          }
        }
      }

      return { form, submit, formOK, formErr }
    }
  })
</script>
