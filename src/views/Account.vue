<template>
  <div class="dark:bg-gray-800 md:pl-20 lg:pl-32">
    <div class="relative bg-black text-white pt-14 pr-4 md:pr-20 lg:pr-32 min-h-screen">
      <div class="pl-4 md:px-8 pb-px">
        <div class="max-w-3xl mx-auto mt-8 md:mt-16">
          <div class="mb-8 md:mb-0 flex items-center md:absolute top-14">
            <div class="xl:hidden">
              <button @click="goBack" class="btn round mr-2">
                <chevron-left class="w-4.5 h-4.5 md:w-5 md:h-5"/>
              </button>
            </div>
            <h1 class="text-2xl lg:text-4xl font-medium">{{ lt('konto') }}</h1>
          </div>

          <div v-if="user" class="mb-8">
            <div class="bg-gray-200 text-black p-4 rounded-md flex items-center">
              <div class="mr-4">
                <img :src="user.avatar_urls?.[24]" class="w-12 md:w-16 h-12 md:h-16 rounded-full" />
              </div>
              <div>
                <p class="text-lg lg:text-xl font-medium">
                  {{ user?.name }}
                </p>
                <div class="flex space-x-4">
                  <button @click="logout" class="underline cursor-pointer active:opacity-50">{{ lt('logout') }}</button>
                  <button @click="deleteAccount" class="underline cursor-pointer active:opacity-50 text-red-500">Kontolöschung beantragen</button>
                </div>
              </div>
            </div>

            <div v-if="userContent?.length" class="mt-8">
              <h2 class="text-xl lg:text-2xl font-medium">Beiträge/Kommentare</h2>

              <div class="mt-2">
                <div v-for="post in userContent" :key="post.id" class="my-4">
                  <forum-line-item :post="post" :show-type="true" :expand="true"/>
                </div>
              </div>
            </div>
            <div v-else class="mt-8">
              <p class="text-xl lg:text-2xl font-medium">noch keine Beiträge/Kommentare</p>
            </div>
          </div>

          <div v-else class="mb-8">
            <login-signup/>
          </div>
        </div>
      </div>

      <div class="hidden xl:block fixed top-0 p-1 left-0 mt-12 ml-1 md:mt-14 md:ml-14 transition-all duration-300">
        <button @click="goBack" class="btn text-lg shadow-lg">
          <span>{{ lt('back') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from '../store'
  import LoginSignup from '../components/LoginSignup.vue'
  import ForumLineItem from '../components/ForumLineItem.vue'
  import CloseIcon from '../components/svg/CloseIcon.vue'
  import ChevronLeft from '../components/svg/ChevronLeft.vue'

  export default defineComponent({
    setup () {
      const store = useStore()
      const user = computed(() => store.user)

      const router = useRouter()
      const goBack = () => {
        if (!window.history?.state?.back) {
          router.push('/')
        } else {
          router.go(-1)
        }
      }

      const deleteAccount = () => {
        alert('Please email...')
      }

      const userContent = computed(() => store.userContent)
      onMounted(() => {
        store.getUserContent()
      })

      return { user, goBack, userContent, deleteAccount, logout: store.logout, lt: store.lt }
    },
    beforeRouteEnter (_to, _from, next) {
      const store = useStore()
      store.getUser()
      next()
    },
    components: { LoginSignup, ForumLineItem, CloseIcon, ChevronLeft }
  })
</script>
