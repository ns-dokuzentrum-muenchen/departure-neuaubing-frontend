<template>
  <div>
    <article id="top">
      <div :class="{ leftopen }">
        <component v-for="(block, i) in contentBlocks" :is="block.acf_fc_layout" :block="block" :slug="slug" :key="i"></component>
      </div>

      <aside v-if="mitBegriffe">
        <div @click="back" :class="{ '-translate-x-full': !leftopen }" class="fixed inset-0 transition-transform overflow-hidden bg-bg bg-opacity-60">
          <div class="overflow-y-auto p-4 md:p-8 lg:p-12 h-full pb-48 overscroll-contain">
            <div class="w-full md:max-w-kontext md:pr-4 lg:pr-12">
              <div v-if="werkzeug" @click.stop class="bg-white dark:bg-black my-12 md:my-12 lg:my-20 px-2 py-1 md:px-4 md:py-2 text-black dark:text-white max-w-2xl mx-auto">
                <div class="text-xl font-medium my-2">{{ werkzeug.title }}</div>
                <div v-html="werkzeug.content" class="html"></div>
              </div>

              <div @click.stop class="bg-gray-400 text-black max-w-4xl mx-auto">
                <div class="border-b-2 flex justify-between items-center">
                  <p class="text-xl font-medium px-2 py-1 md:px-4 md:py-2">Beiträge</p>
                  <div class="px-1 md:translate-x-6">
                    <button @click="back" class="btn-sm">
                      <span class="hidden md:inline">zurück</span> <chevron-right class="inline-block w-2 ml-1"/>
                    </button>
                  </div>
                </div>
                <div class="px-2 py-1 md:px-4 md:py-2">
                  <ul>
                    <li v-for="term in links" :key="term.id" class="my-2">
                      <connection-preview :post="term" base="begriff"/>
                    </li>
                  </ul>
                </div>

                <new-begriff/>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </article>
  </div>
</template>

<script lang="ts">
  import type { Post } from '../store/types'
  import { defineComponent, computed, provide, watch } from 'vue'
  import { useStore } from '../store'
  import { useRoute, useRouter } from 'vue-router'
  import ConnectionPreview from '../components/ConnectionPreview.vue'
  import ChevronRight from '../components/svg/ChevronRight.vue'
  import NewBegriff from '../components/NewBegriff.vue'

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

      const mitBegriffe = computed(() => {
        return contentBlocks.value.some((row) => row.acf_fc_layout === 'DiscussionBlock')
      })
      const allLinks = computed(() => {
        if (!mitBegriffe.value || !project.value?.acf) return []
        return project.value.acf.connections?.concat?.(
          ...project.value.acf.links || []
        ) || []
      })
      const werkzeug = computed(() => {
        return project.value?.acf?.werkzeug
      })
      const leftopen = computed(() => {
        return route.hash.startsWith('#begriff') && mitBegriffe.value
      })
      const links = computed(() => {
        return allLinks.value.filter(p => p.post_type === 'begriff').sort(linkSort)
      })

      function linkSort (a: Post, b: Post) {
        return a.post_title.localeCompare(b.post_title)
      }

      watch(leftopen, (val) => {
        store.metaHidden = val
      })

      const router = useRouter()
      const back = () => {
        router.replace({ hash: '' })
      }

      return { slug, contentBlocks, mitBegriffe, links, werkzeug, leftopen, back }
    },
    components: { ...components, ConnectionPreview, ChevronRight, NewBegriff }
  })
</script>
