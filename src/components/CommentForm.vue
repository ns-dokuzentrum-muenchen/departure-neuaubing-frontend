<template>
  <div>
    <div v-if="user">
      <p>
        Angemeldet als: <strong>{{ user.name }} </strong>
        (<a @click="logout" class="underline cursor-pointer">abmelden</a>)
      </p>

      <form @submit.prevent="submit" class="mt-2">
        <div class="mb-2">
          <textarea v-model="form.content" placeholder="Your comment" class="input" required></textarea>
        </div>

        <div>
          <div v-if="errMsg" class="mb-3">
            <p class="text-red-600">{{ errMsg }}</p>
          </div>
          <div v-if="statusMsg" class="mb-3">
            <p class="text-green-600">{{ statusMsg }}</p>
          </div>
          <button type="submit" class="btn">Post comment</button>
        </div>
      </form>
    </div>
    <div v-else>
      <login-signup/>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, toRefs, reactive, ref, Ref, computed } from 'vue'
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
        content: 'ok prefill it'
      })

      const errMsg: Ref<string | null> = ref(null)
      const statusMsg: Ref<string | null> = ref(null)
      const submit = async () => {
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
