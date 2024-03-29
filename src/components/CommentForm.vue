<template>
  <div>
    <div v-if="user">
      <p>
        Angemeldet als: <strong class="font-medium"><router-link to="/konto">{{ user.name }}</router-link> </strong>
      </p>

      <form @submit.prevent="submit" class="mt-2">
        <div class="mb-3">
          <textarea v-model="form.content" placeholder="Text Eingabe" class="input" required></textarea>
        </div>
        <div class="mb-3">
          <label>
            <input v-model="form.eula" type="checkbox" required class="checkbox"/>
            Ich habe die <router-link to="/pages/respektiquette" class="underline">Respektiquette</router-link> beachtet.
          </label>
        </div>
        <div v-if="statusMsg" class="mb-3">
          <p class="text-green-600">{{ statusMsg }}</p>
        </div>
        <div class="flex mb-3 items-center">
          <div class="flex-none mr-4">
            <button :disabled="posting" type="submit" class="btn-outline">beitragen</button>
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
  import { useRoute, useRouter } from 'vue-router'
  import LoginSignup from './LoginSignup.vue'

  export default defineComponent({
    name: 'CommentForm',
    props: {
      postId: [String, Number],
      replyTo: {
        type: Number,
        default: 0
      }
    },
    setup (props) {
      const { postId, replyTo } = toRefs(props)
      const store = useStore()

      const route = useRoute()
      const router = useRouter()

      const user = computed(() => store.user)

      const form = reactive({
        parent: replyTo.value,
        post: postId.value,
        eula: false,
        content: ''
      })

      const posting = ref(false)
      const errMsg = ref<string | null>(null)
      const statusMsg = ref<string | null>(null)
      const submit = async () => {
        if (!form.eula) return

        try {
          await store.validateToken()

          errMsg.value = null
          posting.value = true

          await store.postComment(postId.value, form).catch(({ response }) => {
            if (response?.data) {
              errMsg.value = response.data.message
            }
          })
          posting.value = false
          if (!errMsg.value) {
            form.content = ''
          }

          if (route.query.replyto) {
            const query = { ...route.query, replyto: undefined }
            router.replace({
              ...route,
              query
            })
          }
        } catch (err) {
          errMsg.value = (err as any).toString()
          posting.value = false
        }
      }

      return { postId, user, form, errMsg, statusMsg, submit, posting }
    },
    components: { LoginSignup }
  })
</script>
