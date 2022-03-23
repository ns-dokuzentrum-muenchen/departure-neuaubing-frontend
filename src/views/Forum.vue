<template>
  <div class="dark:bg-gray-800 md:pl-20 lg:pl-32">
    <div class="relative bg-black text-white pt-14 pr-4 md:pr-20 lg:pr-32">
      <div class="hidden md:flex justify-end py-1 -mr-12">
        <div class="mr-4">
          <router-link to="/suchen" class="btn text-lg whitespace-nowrap block">
            <search-icon class="inline-block w-5 h-5 mr-2"/>
            <span>{{ lt('search') }}</span>
          </router-link>
        </div>
      </div>

      <div class="pl-4 md:px-8 pb-px">
        <div class="max-w-3xl mx-auto mt-8 md:mt-12 min-h-screen">
          <div class="mb-8 md:mb-0 flex items-center md:absolute top-14">
            <div class="xl:hidden">
              <button @click="goBack" class="btn round mr-2">
                <chevron-left class="w-4.5 h-4.5 md:w-5 md:h-5"/>
              </button>
            </div>
            <h1 class="text-2xl lg:text-4xl font-medium">Forum</h1>
          </div>

          <div class="mb-8">
            <p class="text-sm underline">{{ lt('overview') }}</p>
          </div>

          <div v-if="posts?.length" class="mb-4 lg:mb-8">
            <ul>
              <li v-for="post in posts" :key="post.id" class="mb-4">
                <forum-line-item :post="post"/>
              </li>
            </ul>
          </div>
          <div v-else>{{ lt('noResults') }}</div>

          <div v-if="locale === 'de'" class="mb-12 lg:mb-24">
            <div class="pb-3 md:pb-4">
              <button @click="form.open = !form.open" class="btn-outline text-sm">Begriff einreichen</button>
            </div>

            <transition @enter="slideOpen" @leave="slideClose">
              <div v-if="form.open" data-overflow="hidden">
                <div class="py-2 md:py-4">
                  <div v-if="!user" class="max-w-3xl">
                    <login-signup/>
                  </div>

                  <div v-else-if="formComplete">
                    <div>
                      <p class="text-lg">Dein Beitrag wurde erfolgreich eingereicht und wird nach der Freigabe durch Franz Wanner und das Team des NS-Dokumentationszentrums veröffentlicht..</p>
                    </div>
                  </div>

                  <div v-else class="max-w-prose-1">
                    <div class="mb-4 html">
                      <p class="text-xl">Beitrag einreichen</p>
                      <p class="text-lg">Wir freuen uns über Vorschläge für weitere zu verhandelnde Begriffe.</p>
                      <p>Bitte beachte Folgendes:</p>
                      <ul class="text-sm">
                        <li>Kopiere keine Texte</li>
                        <li>Berücksichtige vor der Einreichung die bisherigen Beiträge</li>
                        <li>Dein Beitrag wird von unserem Team und Franz Wanner gesichtet und erscheint erst nach der Freigabe auf der Webseite</li>
                      </ul>
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
                          <label class="hidden flex-auto xblock text-small mb-2 cursor-pointer">
                            <input type="checkbox" class="checkbox">
                            Ich akzeptiere die Nutzungsbedingungen
                          </label>
                          <div class="mt-4">
                            <button class="btn" :disabled="uploading">{{ uploading ? 'lädt...' : 'beitragen' }}</button>
                          </div>
                        </div>
                        <div v-if="formErr" class="mt-2 leading-tight">
                          <p class="text-red-600">{{ formErr }}</p>
                        </div>
                        <div else class="my-4"></div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <div class="hidden xl:block fixed top-0 p-1 left-0 mt-12 ml-1 md:mt-14 md:ml-16 transition-all duration-300">
        <button @click="goBack" class="btn text-lg shadow-lg">
          <span>{{ lt('back') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import type { AxiosError } from 'axios'
  import { defineComponent, computed, reactive, ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from '../store'
  import { slideOpen, slideClose } from '../utils'
  import SearchIcon from '../components/svg/SearchIcon.vue'
  import CloseIcon from '../components/svg/CloseIcon.vue'
  import ChevronLeft from '../components/svg/ChevronLeft.vue'
  import ForumLineItem from '../components/ForumLineItem.vue'
  import LoginSignup from '../components/LoginSignup.vue'

  export default defineComponent({
    setup () {
      const router = useRouter()

      const goBack = () => {
        if (!window.history?.state?.back) {
          router.push('/')
        } else {
          router.go(-1)
        }
      }

      const store = useStore()
      const posts = computed(() => store.forum)

      const user = computed(() => store.user)

      const form = reactive({
        open: false,
        title: '',
        content: ''
      })

      const uploading = ref(false)
      const formErr = ref(false)
      const formComplete = ref(false)

      const create = async () => {
        try {
          uploading.value = true

          const forumPost = {
            title: form.title,
            status: 'pending',
            fields: {
              description: form.content
            }
          }

          await store.createForumPost(forumPost)

          uploading.value = false
          formComplete.value = true
        } catch (err) {
          const data = (err as AxiosError).response?.data
          uploading.value = false
          formErr.value = data?.message
        }
      }

      onMounted(() => {
        store.setBlankMeta('Forum')
      })

      return {
        locale: store.locale,
        lt: store.lt,
        goBack,
        posts,
        user,
        form,
        slideOpen,
        slideClose,
        uploading,
        formErr,
        formComplete,
        create
      }
    },
    beforeRouteEnter (to, _, next) {
      const store = useStore()
      const page = Number(to.query.page) || 1
      return store.getForum(page).then(next)
    },
    components: { SearchIcon, CloseIcon, ChevronLeft, ForumLineItem, LoginSignup }
  })
</script>
