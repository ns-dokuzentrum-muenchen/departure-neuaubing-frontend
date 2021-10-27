<template>
  <div>
    <form @submit.prevent="submit">
      <div class="mb-2">
        <input v-model="form.author_name" type="text" placeholder="Name" class="input" required>
      </div>
      <div class="mb-2">
        <input v-model="form.author_email" type="email" placeholder="E-Mail" class="input" required>
      </div>
      <div class="mb-2">
        <textarea v-model="form.content" placeholder="Your comment" class="input" required></textarea>
      </div>
      <div>
        <vue-hcaptcha @verify="verify" :sitekey="siteKey" language="de" theme="dark" size="small"></vue-hcaptcha>
      </div>
      <div>
        <button type="submit" class="btn">Post comment</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
  import { defineComponent, toRefs, ref } from 'vue'
  import { useStore } from '../store'
  import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'

  export default defineComponent({
    name: 'CommentForm',
    props: {
      postId: [String, Number]
    },
    setup (props) {
      const { postId } = toRefs(props)
      const store = useStore()

      const form = ref({
        parent: null,
        post: postId.value,
        content: 'ok prefill it',
        author_email: 'nics@limnerstudio.co.uk',
        author_name: 'nics',
        author_url: 'https://n-kort.net',
        meta: <object | null> null,
        'h-captcha-response': <string | null> null,
        'hcaptcha_comment_form_nonce': <string | null> null
      })

      const getNonce = async () => {
        form.value['hcaptcha_comment_form_nonce'] = await store.getCommentNonce()
      }
      const verify = (token: string) => {
        console.log('got captcha token')
        form.value['h-captcha-response'] = token
      }

      const submit = () => {
        console.log(form.value)
        store.postComment(postId.value, form.value)
      }

      const siteKey = import.meta.env.VITE_CAPTCHA_KEY as string

      getNonce() // try it out

      return { postId, form, verify, submit, siteKey }
    },
    components: { VueHcaptcha }
  })
</script>
