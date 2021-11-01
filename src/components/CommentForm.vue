<template>
  <div>
    <div v-if="user">
      <form @submit.prevent="submit">
        <!-- <div class="mb-2">
          <input v-model="form.author_name" type="text" placeholder="Name" class="input" required>
        </div>
        <div class="mb-2">
          <input v-model="form.author_email" type="email" placeholder="E-Mail" class="input" required>
        </div> -->
        <div class="mb-2">
          <textarea v-model="form.content" placeholder="Your comment" class="input" required></textarea>
        </div>
        <!-- <div class="mb-2">
          <vue-hcaptcha @verify="verify" :sitekey="siteKey" language="de" theme="dark" size="small"></vue-hcaptcha>
        </div> -->
        <div>
          <div v-if="errMsg" class="mb-2">
            <p class="text-red-600">{{ errMsg }}</p>
          </div>
          <div v-if="statusMsg" class="mb-2">
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

      const user = computed(() => store.authToken !== null)

      const form = reactive({
        parent: null,
        post: postId.value,
        content: 'ok prefill it'
      })

      // const verify = (token: string) => {
      //   console.log('got captcha token')
      //   form.value['h-captcha-response'] = token
      // }

      const errMsg: Ref<string | null> = ref(null)
      const statusMsg: Ref<string | null> = ref(null)
      const submit = async () => {
        try {
          // await store.validateToken()

          errMsg.value = null

          store.postComment(postId.value, form).catch(({ response }) => {
            if (response?.data) {
              errMsg.value = response.data.message
            }
            console.log(response.data.message)
          })
        } catch (err) {
          errMsg.value = err.toString()
        }
      }

      const siteKey = import.meta.env.VITE_CAPTCHA_KEY as string

      return { postId, user, form, errMsg, statusMsg, submit, siteKey }
    },
    components: { LoginSignup }
  })
</script>
