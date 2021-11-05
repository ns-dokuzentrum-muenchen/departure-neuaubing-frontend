<template>
  <div @click="close" class="fixed inset-0 flex items-center justify-center">
    <div @click.stop class="bg-black text-white rounded-md z-20 max-w-lg w-full">
      <div class="px-8 py-4">
        <p class="mb-2 text-lg">Create a new Marker</p>

        <div v-if="!user" class="">
          <login-signup/>
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
            <div class="mb-2">
              <label>
                <input type="checkbox" required>
                Ich akzeptiere die AGBs
              </label>
            </div>
            <div>
              <div v-if="uploading">
                Laden...
              </div>
              <div v-else>
                <button class="btn">Upload</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, reactive, ref, Ref } from 'vue'
  import { useStore } from '../store'
  import { LatLng } from 'leaflet'
  import LoginSignup from './LoginSignup.vue'

  export default defineComponent({
    name: 'MediaUpload',
    props: {
      latlng: Object
    },
    setup (props, { emit }) {
      const store = useStore()
      const user = computed(() => store.user)

      const latlng = computed(() => props.latlng as LatLng)

      const file: Ref<File | null> = ref(null)
      const form = reactive({
        title: '',
        content: ''
      })
      const uploading = ref(false)
      const formErr = ref(false)
      const formComplete = ref(false)

      const addFile = (event: Event) => {
        const files = (event.target as HTMLInputElement).files
        if (!files?.length) return

        file.value = files[0]
      }
      const upload = async () => {
        if (!file.value) return

        try {
          uploading.value = true
          const fileData = await store.uploadFile(file.value)

          const newMarker = {
            ...form,
            featured_media: fileData.id,
            fields: {
              location: {
                lat: latlng.value.lat,
                lng: latlng.value.lng
              }
            }
          }

          const postData = await store.createMarkierung(newMarker)

          uploading.value = false

          console.log(postData)
          formComplete.value = true
        } catch (err) {
          console.log(err)
          uploading.value = false
          formErr.value = true
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
        close
      }
    },
    components: { LoginSignup }
  })
</script>
