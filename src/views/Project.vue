<template>
  <div>
    <article class="">
      <div :class="{ leftopen }">
        <component v-for="(block, i) in contentBlocks" :is="block.acf_fc_layout" :block="block" :slug="slug" :key="i"></component>
      </div>

      <div v-if="mitBegriffe">
        <div @click="back" :class="{ '-translate-x-full': !leftopen }" class="fixed top-0 left-0 bottom-0 right-0 transition-transform overflow-hidden">
          <div class="overflow-auto p-12 h-full overscroll-containX">
            <div class="w-kontext">
              <div v-if="werkzeug" @click.stop class="bg-white dark:bg-black m-20 px-2 py-1 md:px-4 md:py-2 text-black dark:text-white">
                <div class="text-xl font-medium my-2">{{ werkzeug.title }}</div>
                <div v-html="werkzeug.content" class="html"></div>
              </div>

              <div @click.stop class="bg-gray-400 text-black">
                <div class="border-b-2 flex justify-between items-center">
                  <p class="text-xl font-medium px-2 py-1 md:px-4 md:py-2">Beiträge (?)</p>
                  <div class="px-2 md:px-4 translate-x-10">
                    <button @click="back" class="btn-sm">zurück <chevron-right class="inline-block w-2 ml-1"/></button>
                  </div>
                </div>
                <div class="px-2 py-1 md:px-4 md:py-2">
                  <ul>
                    <li v-for="term in links" :key="term.id" class="my-2">
                      <connection-preview :post="term" base="begriff"/>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, provide } from 'vue'
  import { useStore } from '../store'
  import { useRoute, useRouter } from 'vue-router'
  import ConnectionPreview from '../components/ConnectionPreview.vue'
  import ChevronRight from '../components/svg/ChevronRight.vue'

  // auto-load the content Blocks
  const glob = import.meta.globEager('../components/blocks/*.vue')

  const components: { [key: string]: any } = {}

  Object.entries(glob).forEach(([path, definition]) => {
    const componentName = (path.split('/').pop() as string).replace(/\.\w+$/, '')
    components[componentName] = definition.default
  })

  export default defineComponent({
    name: 'Project',
    setup () {
      const store = useStore()
      const route = useRoute()

      const slug = computed(() => route.params.slug)
      const project = computed(() => {
        return store.projects?.find(p => p?.slug === slug.value)
      })

      const metaContext = computed(() => {
        const pos = route.hash.indexOf('=')
        if (pos >= 0) {
          const path = route.hash.slice(pos + 1)
          return path.slice(0, path.length - (path.slice(-1) === '/' ? 1 : 0))
        }
        return
      })

      provide('ctx', metaContext)

      const contentBlocks = computed(() => {
        return project.value?.acf?.content || []
      })

      const werkzeug = computed(() => {
        return project.value?.acf?.werkzeug
      })
      const leftopen = computed(() => {
        return route.hash.startsWith('#begriff') && mitBegriffe.value
      })
      const mitBegriffe = computed(() => {
        return contentBlocks.value.some((row) => row.acf_fc_layout === 'DiscussionBlock')
      })
      const links = computed(() => {
        if (!mitBegriffe.value) return []
        return project.value?.acf.connections || []
      })

      const router = useRouter()
      const back = () => {
        router.replace({ hash: '' })
      }
      return { slug, contentBlocks, mitBegriffe, links, werkzeug, leftopen, back }
    },
    components: { ...components, ConnectionPreview, ChevronRight }
  })
</script>
