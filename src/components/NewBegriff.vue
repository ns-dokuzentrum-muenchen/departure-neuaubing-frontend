<template>
  <div>
    <div class="px-2 p2-1 md:px-4 pb-3 md:pb-4">
      <button @click="form.open = !form.open" class="btn-outline text-sm">Begriff einreichen</button>
    </div>

    <transition @enter="slideOpen" @leave="slideClose">
      <div v-if="form.open" data-overflow="hidden" class="p-2 md:p-4 border-t">
        <div v-if="!user" class="max-w-3xl">
          <login-signup/>
        </div>

        <div v-else-if="formComplete">
          <div>
            <p class="text-highlight text-lg">Dein Beitrag wurde erfolgreich eingereicht und wird nach der Freigabe durch Franz Wanner und das Team des NS-Dokumentationszentrums veröffentlicht..</p>
          </div>
        </div>

        <div v-else class="max-w-prose-1">
          <div class="mb-4">
            <p class="text-xl mb-4">Beitrag einreichen</p>
            <p class="text-lg mb-4">Wir freuen uns über Vorschläge für neue Begriffe</p>

            <p class="text-sm">Bitte folgendes beachten:</p>
            <p class="text-sm">- Kopiere keine Texte</p>
            <p class="text-sm">- Berücksichtige vor der Einreichung die bisherigen Beiträge</p>
          </div>
          <form @submit.prevent="create">
            <div class="mb-2">
              <input v-model="form.title" type="text" placeholder="Titel" class="input" required/>
            </div>
            <div class="mb-2">
              <textarea v-model="form.content" type="text" placeholder="Beschreibung" class="input" required></textarea>
            </div>

            <div>
              <div class="">
                <label class="flex-auto block text-small mb-2 cursor-pointer">
                  <input type="checkbox" required class="checkbox">
                  Ich akzeptiere die Nutzungsbedingungen
                </label>
                <div class="mt-4">
                  <button class="btn" :disabled="uploading">{{ uploading ? 'lädt...' : 'beitragen' }}</button>
                </div>
              </div>
              <div v-if="formErr" class="mt-2 leading-tight">
                <p class="text-red-600">{{ formErr }}</p>
              </div>
              <div else class="my-4">
                <p>Hinweis: Ihr / dein Beitrag wird von unserem Team gesichtet und erscheint erst nach der Freigabe auf der Webseite.</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import type { AxiosError } from 'axios'
  import { defineComponent, reactive, computed, ref } from 'vue'
  import { slideOpen, slideClose } from '../utils'
  import { useStore } from '../store'
  import LoginSignup from './LoginSignup.vue'

  export default defineComponent({
    setup () {
      const form = reactive({
        open: false,
        title: '',
        content: ''
      })

      const store = useStore()
      const user = computed(() => store.user) // || { name: 'nope', slug: 'nope' })
      const uploading = ref(false)
      const formErr = ref(false)
      const formComplete = ref(false)

      const create = async () => {
        try {
          uploading.value = true

          const newBegriff = {
            title: form.title,
            status: 'pending',
            fields: {
              description: form.content
            }
          }

          await store.createBegriff(newBegriff) // sent to store.myMarkers

          uploading.value = false
          formComplete.value = true
        } catch (err) {
          const data = (err as AxiosError).response?.data
          // console.log(data)
          uploading.value = false
          formErr.value = data?.message
        }
      }

      return { form, user, uploading, formErr, formComplete, create, slideOpen, slideClose }
    },
    components: { LoginSignup }
  })
</script>
