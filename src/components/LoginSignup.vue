<template>
  <div>
    <form @submit.prevent="submit">
      <div class="mb-2">
        <input v-model="form.username" type="text" placeholder="Benutzername oder die E-Mail-Adresse" class="input"/>
      </div>
      <div v-if="noUser" class="mb-2">
        <input v-model="form.email" type="email" placeholder="E-Mail" class="input"/>
      </div>
      <div v-if="errMsg" class="mb-2">
        <p class="text-red-600">{{ errMsg }}</p>
      </div>
      <button type="submit" class="btn">{{ noUser ? 'Registrieren' : 'Anmelden' }}</button>
    </form>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, reactive, ref } from 'vue'
  import { useStore } from '../store'

  export default defineComponent({
    name: 'LoginSignup',
    setup () {
      const store = useStore()
      const user = computed(() => store.user)

      const errMsg = ref('')
      const noUser = ref(false)

      const form = reactive({
        username: '',
        email: ''
      })

      const submit = () => {
        // if (!form.username?.length) return
        // console.log(form)
        store.login(form.username).catch((res) => {
          const msg = res.response?.data?.msg
          const code = res.response?.status

          if (code === 404) {
            noUser.value = true
            errMsg.value = msg
          } else {
            errMsg.value = msg
          }
        })
      }

      return { user, form, submit, noUser, errMsg }
    }
  })
</script>
