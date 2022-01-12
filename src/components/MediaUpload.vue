<template>
  <div class="py-4">
    <transition @enter="slideOpen" @leave="slideClose" mode="out-in">
      <div v-if="!user" class="">
        <login-signup/>
      </div>

      <div v-else-if="formComplete">
        <div>
          <p class="text-highlight text-lg">Dein Beitrag wurde erfolgreich erstellt und wird nach der Freigabe durch das Team des NS-Dokumentationszentrums veröffentlicht.</p>
        </div>
      </div>
      <div v-else class="">
        <div class="mb-4">
          <p class="text-xl mb-4">Foto beitragen</p>
          <p class="text-lg mb-4">Wir freuen uns über Bilder von Orten ehemaliger Lager … Beschreibung</p>

          <p class="text-sm">Bitte beachten Sie/du folgendes:</p>
          <p class="text-sm">- Es können nur Bilder veröffentlicht werden welche keine erkennbaren Einzelpersonen zeigen</p>
          <p class="text-sm">- Weiteres</p>
        </div>
        <form @submit.prevent="upload">
          <div class="mb-2">
            <input v-model="form.title" type="text" placeholder="Titel" class="input" required/>
          </div>
          <div class="mb-2">
            <textarea v-model="form.content" type="text" placeholder="Beschreibung" class="input" required></textarea>
          </div>
          <div class="my-2 flex items-center">
            <div v-if="imgPreview" class="mb-2 mr-4">
              <div class="">
                <img :src="imgPreview" class="max-h-24 rounded-md"/>
              </div>
            </div>
            <div>
              <label class="sr-only">File</label>
              <input @change="addFile" type="file" required class="file:mr-4 file:py-1 file:px-8 file:rounded-full file:border-2 file:border-white file:border-solid dark:file:text-white file:bg-transparent hover:file:bg-gray-400 file:cursor-pointer cursor-pointer">
            </div>
          </div>

          <div>
            <div class="">
              <label class="flex-auto block text-small mb-2 cursor-pointer">
                <input type="checkbox" required class="checkbox">
                Ich besitze die Bildrechte und stimme der Veröffentlichung zu
              </label>
              <label class="flex-auto block text-small mb-2 cursor-pointer">
                <input type="checkbox" required class="checkbox">
                Ich akzeptiere die Nutzungsbedingungen
              </label>
              <div class="mt-4">
                <button class="btn" :disabled="uploading">{{ uploading ? 'Lädt...' : 'Beitragen' }}</button>
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
    </transition>
  </div>
</template>

<script lang="ts">
  import type { AxiosError } from 'axios'
  import { defineComponent, computed, reactive, ref } from 'vue'
  import { useStore } from '../store'
  import { slideOpen, slideClose } from '../utils'
  import LoginSignup from './LoginSignup.vue'

  export default defineComponent({
    name: 'MediaUpload',
    props: {
      parent: Number
    },
    setup (props, { emit }) {
      const store = useStore()
      const user = computed(() => store.user)

      const parentId = props.parent || 0

      const file = ref<File | null>(null)
      const form = reactive({
        title: '',
        content: ''
      })
      const uploading = ref(false)
      const formErr = ref(false)
      const formComplete = ref(false)

      const imgPreview = ref()

      const addFile = (event: Event) => {
        const files = (event.target as HTMLInputElement).files
        if (!files?.length) return

        file.value = files[0]

        // display image data
        const reader = new FileReader()
        reader.onload = (e: any) => {
          imgPreview.value = e.target?.result
          // console.log(reader)
        }
        reader.readAsDataURL(file.value)
      }
      const upload = async () => {
        if (!file.value) return

        try {
          uploading.value = true
          const fileData = await store.uploadFile(file.value)

          // console.log({ fileData })

          const newMarker = {
            ...form,
            // featured_media: fileData.id,
            status: 'pending', // or blank for draft. `publish` = 403
            fields: {
              parent: parentId,
              thumbnail: fileData.id
            }
          }

          await store.createMarker(newMarker) // sent to store.myMarkers

          uploading.value = false
          formComplete.value = true
        } catch (err) {
          const data = (err as AxiosError).response?.data
          // console.log(data)
          uploading.value = false
          formErr.value = data?.message
        }
      }

      const close = () => {
        emit('close')
      }

      return {
        user,
        form,
        uploading,
        formErr,
        formComplete,
        addFile,
        upload,
        close,
        imgPreview,
        slideOpen,
        slideClose
      }
    },
    components: { LoginSignup }
  })
</script>
