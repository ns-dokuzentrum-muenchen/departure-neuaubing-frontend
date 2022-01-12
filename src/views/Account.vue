<template>
  <div class="dark:bg-gray-800 md:pl-20 lg:pl-32">
    <div class="relative bg-black text-white pt-14 pr-4 md:pr-20 lg:pr-32">
      <div class="hidden md:flex justify-end py-1 -mr-12">
        <!-- <div class="mr-4">
          <router-link to="/forum" class="btn text-lg block">Forum</router-link>
        </div> -->
        <!-- <div class="mr-4">
          <router-link to="/glossar" class="btn text-lg block">Glossar</router-link>
        </div> -->
      </div>

      <div class="pl-4 md:px-8 pb-px">
        <div class="max-w-3xl mx-auto mt-8 md:mt-12 min-h-screen">
          <div class="mb-8 md:mb-0 flex items-center md:absolute top-14">
            <div class="xl:hidden">
              <button @click="goBack" class="btn round mr-2">
                <chevron-left class="w-4.5 h-4.5 md:w-5 md:h-5"/>
              </button>
            </div>
            <h1 class="text-2xl lg:text-4xl font-medium">Konto</h1>
          </div>

          <div class="mb-8">
            <p class="">
              <a @click="logout" class="underline cursor-pointer">abmelden</a>
            </p>
          </div>
        </div>
      </div>

      <div class="hidden xl:block fixed top-0 p-1 left-0 mt-12 ml-1 md:mt-14 md:ml-14 transition-all duration-300">
        <button @click="goBack" class="btn text-lg shadow-lg">
          <span>Zurück</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from '../store'
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

      return { user, goBack, logout: store.logout }
    },
    beforeRouteEnter (_to, _from, next) {
      const store = useStore()
      store.getUser().then(() => {
        next()
      })
    },
    components: { CloseIcon, ChevronLeft }
  })
</script>