<template>
  <div class="h-96 flex items-center justify-center">
    <p class="text-4xl">{{ loginError ? 'Login-Fehler' : 'Einloggen...' }}</p>
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

      onMounted(() => {
        const { uid, token, nonce, return_to } = route.query
        if (uid && token && nonce) {
          store.verifyLogin(uid as string, token as string, nonce as string).then(() => {
            router.replace(return_to as string || '/')
          }).catch((err) => {
            console.log(err)
            loginError.value = true
            router.replace('')
          })
        } else {
          loginError.value = true
        }
      })

      return { loginError }
    }
  })
</script>
