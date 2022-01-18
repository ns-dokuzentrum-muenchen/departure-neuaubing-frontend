<template>
  <div class="h-96 flex items-center justify-center">
    <div class="text-center">
      <p class="text-4xl">{{ loginError ? 'Login-Fehler' : 'Einloggen...' }}</p>
      <p v-if="loginError" class="text-red-600">{{ errMsg }}</p>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from '../store'

  export default defineComponent({
    name: 'Verify',
    setup () {
      const route = useRoute()
      const router = useRouter()
      const store = useStore()

      const loginError = ref(false)
      const errMsg = ref('')

      onMounted(() => {
        const { uid, token, nonce, return_to } = route.query

        if (uid && token && nonce) {
          store.verifyLogin(uid as string, token as string, nonce as string).then(() => {
            router.replace(return_to as string || '/')
          }).catch((res) => {
            console.log(res.response?.data?.msg)
            loginError.value = true
            errMsg.value = res.response?.data?.msg
            router.replace('')
          })
        } else {
          loginError.value = true
        }
      })

      return { loginError, errMsg }
    }
  })
</script>
