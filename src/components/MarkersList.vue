<template>
  <div class="max-w-6xl mx-auto my-8 md:my-12">
    <p class="text-2xl mb-2">Liste bekannter Lager in München</p>
    <div class="max-w-prose-1">
      <p>Beschreibung: Das ehemalige Zwangsarbeiterlager Neuaubing (auch: Kriegsgefangenenlager Neuaubing, Barackenlager Neuaubing) wurde von der Deutschen Reichsbahn während des Zweiten Weltkriegs Ende 1942 im Münchner Stadtteil Aubing als Lager zur Unterbringung von Zwangsarbeitern des Reichsbahn-Ausbesserungswerks Neuaubing errichtet. Seit 2015 befindet sich das Gelände an der Ehrenbürgstraße 9 im Eigentum der Stadt München.</p>
    </div>

    <div id="pagelist" class="mt-12">
      <div class="grid grid-cols-12 gap-4 border-b font-medium py-2">
        <div class="col-span-3">Name</div>
        <div class="col-span-4">Beschreibung</div>
        <div class="col-span-1">Personen</div>
        <div class="col-span-3">Adresse</div>
        <div class="col-span-1">Nummer</div>
      </div>

      <markers-list-item v-for="item in paging" :key="item.post_id" :item="item"/>
    </div>

    <div class="mt-4 md:mt-8">
      <ul class="flex items-center max-w-prose mx-auto">
        <li class="mr-auto">
          <button @click="prevPage" :disabled="page === 1" class="page-dot">
            <chevron-left class="h-4 w-auto"/>
          </button>
        </li>

        <li v-for="pp in pageNumbers" :key="pp" class="font-light">
          <router-link v-if="pp !== '...'" :to="{ query: { page: pp }}" :class="{ active: pp === page }" class="page-dot">{{ pp }}</router-link>
          <span v-else class="page-dot">{{ pp }}</span>
        </li>

        <li class="ml-auto">
          <button @click="nextPage" :disabled="page === totalPages" class="page-dot">
            <chevron-right class="h-4 w-auto translate-x-0.5 translate-y-px"/>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useStore } from '../store'
  import { useRoute, useRouter } from 'vue-router'
  import MarkersListItem from './MarkersListItem.vue'
  import ChevronLeft from './svg/ChevronLeft.vue'
  import ChevronRight from './svg/ChevronRight.vue'

  export default defineComponent({
    setup () {
      const store = useStore()
      const route = useRoute()
      const router = useRouter()

      const markers = computed(() => store.markers)

      const page = computed({
        get: () => Number(route.query?.page || 1),
        set: (val) => {
          console.log('trying to change it page number...', val)
          router.push({ ...route, query: { page: val } })
        }
      })
      const perPage = 24
      const paging = computed(() => {
        const start = (page.value - 1) * perPage
        return markers.value.slice(start, start + perPage)
      })

      const totalPages = computed(() => Math.floor(markers.value?.length / perPage))

      const pageNumbers = computed(() => {
        const currentPage = page.value
        const l: any[] = [1]
        const p: any[] = []
        const b = currentPage - 1
        const f = currentPage + 1
        if (b > 0 && !l.includes(b)) {
          p.push(b)
        }
        if (!l.includes(currentPage)) {
          p.push(currentPage)
        }
        if (f < totalPages.value && !l.includes(f)) {
          p.push(f)
        }

        if (p[0] - l[0] > 1) {
          l.push('...')
        }

        if (totalPages.value - p[p.length - 1] > 1) {
          p.push('...')
        }

        l.push(...p)
        !l.includes(totalPages.value) && l.push(totalPages.value)

        return l
      })

      const prevPage = () => {
        if (page.value <= 1) return
        page.value--
      }
      const nextPage = () => {
        if (page.value >= totalPages.value) return
        page.value++
      }

      return { page, paging, totalPages, pageNumbers, prevPage, nextPage }
    },
    components: { MarkersListItem, ChevronLeft, ChevronRight }
  })
</script>
