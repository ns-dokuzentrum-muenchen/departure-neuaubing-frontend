<template>
  <div @click="close" class="fixed inset-0 flex items-center justify-center">
    <div @click.stop class="bg-black text-white rounded-md z-20 max-w-lg w-full">
      <div class="px-8 py-4">
        <p class="mb-2 text-lg">Neue Markierung</p>

        <div v-if="!user" class="">
          <login-signup/>
        </div>
        <div v-else-if="formComplete">
          <div>
            <p class="text-highlight">Markierung erfolgreich erstellt!</p>
          </div>
        </div>
        <div v-else class="">
          <form @submit.prevent="upload">
            <div class="mb-2">
              <input v-model="form.title" type="text" placeholder="Titel" class="input" required/>
            </div>
            <div class="mb-2">
              <textarea v-model="form.content" type="text" placeholder="Description" class="input" required></textarea>
            </div>
            <div class="my-2">
              <div>File</div>
              <input @change="addFile" type="file" required>
            </div>
            <div v-if="imgPreview" class="mb-2">
              <div>
                <img :src="imgPreview"/>
              </div>
            </div>
            <div>
              <div class="flex items-center">
                <label class="flex-auto pr-4">
                  <input type="checkbox" required>
                  Ich akzeptiere die AGBs
                </label>
                <div>
                  <button class="btn" :disabled="uploading">{{ uploading ? 'Lädt...' : 'Hochladen' }}</button>
                </div>
              </div>
              <div v-if="formErr" class="mt-2 leading-tight">
                <p class="text-red-600">{{ formErr }}</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, reactive, ref } from 'vue'
  import { useStore } from '../store'
  import { LatLng } from 'leaflet'
  import LoginSignup from './LoginSignup.vue'
  import { AxiosError } from 'axios'

  export default defineComponent({
    name: 'MediaUpload',
    props: {
      latlng: Object
    },
    setup (props, { emit }) {
      const store = useStore()
      const user = computed(() => store.user)

      const latlng = computed(() => props.latlng as LatLng)

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
          console.log(reader)
        }
        reader.readAsDataURL(file.value)
      }
      const upload = async () => {
        if (!file.value) return

        try {
          uploading.value = true
          const fileData = await store.uploadFile(file.value)

          const newMarker = {
            ...form,
            featured_media: fileData.id,
            // status: 'pending', // or blank for draft. `publish` = 403
            fields: {
              location: {
                lat: latlng.value.lat,
                lng: latlng.value.lng
              }
            }
          }

          await store.createMarker(newMarker) // sent to store.myMarkers

          uploading.value = false
          formComplete.value = true
        } catch (err) {
          const data = (err as AxiosError).response?.data
          console.log(data)
          uploading.value = false
          formErr.value = data?.message
        }
      }

      const close = () => {
        emit('close')
      }

      return {
        user,
        latlng,
        form,
        uploading,
        formErr,
        formComplete,
        addFile,
        upload,
        close,
        imgPreview
      }
    },
    components: { LoginSignup }
  })
</script>
