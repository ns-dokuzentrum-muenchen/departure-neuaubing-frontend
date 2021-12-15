<template>
  <div>
    <div v-if="user">
      <p>
        Angemeldet als: <strong>{{ user.name }} </strong>
        (<a @click="logout" class="underline cursor-pointer">abmelden</a>)
      </p>

      <form @submit.prevent="submit" class="mt-2">
        <div class="mb-3">
          <textarea v-model="form.content" placeholder="Text Eingabe" class="input" required></textarea>
        </div>
        <div class="mb-3">
          <label>
            <input v-model="form.eula" type="checkbox"/>
            Ich akzeptiere die Nutzungsbedingungen
          </label>
        </div>
        <div v-if="statusMsg" class="mb-3">
          <p class="text-green-600">{{ statusMsg }}</p>
        </div>
        <div class="flex mb-3 items-center">
          <div class="flex-none mr-4">
            <button type="submit" class="btn-outline">beitragen</button>
          </div>
          <transition name="fade">
            <div v-if="errMsg" class="flex-auto">
              <p class="text-red-600 leading-none">{{ errMsg }}</p>
            </div>
          </transition>
        </div>
      </form>
    </div>
    <div v-else>
      <login-signup/>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, toRefs, reactive, ref, computed } from 'vue'
  import { useStore } from '../store'
  // import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'
  import LoginSignup from './LoginSignup.vue'

  export default defineComponent({
    name: 'CommentForm',
    props: {
      postId: [String, Number]
    },
    setup (props) {
      const { postId } = toRefs(props)
      const store = useStore()

      const user = computed(() => store.user)

      const form = reactive({
        parent: null,
        post: postId.value,
        eula: false,
        content: ''
      })

      const errMsg = ref<string | null>(null)
      const statusMsg = ref<string | null>(null)
      const submit = async () => {
        if (!form.eula) return

        try {
          await store.validateToken()

          errMsg.value = null

          store.postComment(postId.value, form).catch(({ response }) => {
            if (response?.data) {
              errMsg.value = response.data.message
            }
            console.log(response.data.message)
          })
        } catch (err) {
          errMsg.value = (err as any).toString()
        }
      }

      const siteKey = import.meta.env.VITE_CAPTCHA_KEY as string

      const logout = () => {
        store.logout()
      }

      return { postId, user, form, errMsg, statusMsg, submit, siteKey, logout }
    },
    components: { LoginSignup }
  })
</script>
