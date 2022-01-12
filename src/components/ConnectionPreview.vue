<template>
  <div ref="el" class="scroll-mt-3 md:scroll-mt-12 lg:scroll-mt-16">
    <div :class="{ 'text-lg font-medium py-1': expanded, 'html': !expanded }" class="transition-all">
      <router-link :to="link" class="flex justify-between items-center">
        <span>{{ title }}</span>
        <span v-if="expanded">
          <chevron-up/>
        </span>
      </router-link>
    </div>
    <transition @enter="slideOpen" @leave="slideClose">
      <div v-if="expanded" class="overflow-hidden">
        <div class="py-3 border-t border-b">
          <div v-html="post.acf?.description" class="html max-w-prose-1"></div>

          <figure v-if="post.acf?.thumbnail" class="mt-2 max-w-prose-1">
            <router-link :to="target">
              <app-image :image="post.acf.thumbnail"/>
            </router-link>
          </figure>

          <div v-if="post.acf?.link_text" class="mt-2 html max-w-prose-1">
            <router-link :to="target">{{ post.acf.link_text }}</router-link>
          </div>

          <template v-if="canComment">
            <!-- <div class="my-4">
              <router-link :to="target" class="btn-outline text-sm inline-block">diskutieren</router-link>
            </div> -->

            <div class="max-w-3xl mt-8">
              <comments-preview :id="post.ID || post.id" :title="title" :path="target"/>
            </div>
          </template>
        </div>
        <div class="h-2"></div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import type { Post } from '../store/types'
  import { defineComponent, inject, ref, computed, watch, ComputedRef } from 'vue'
  import { useRoute } from 'vue-router'
  import { slideOpen, slideClose } from '../utils'
  import CommentsPreview from './CommentsPreview.vue'
  import AppImage from './AppImage.vue'
  import ChevronUp from './svg/ChevronUp.vue'

  const base = import.meta.env.VITE_API_ENDPOINT as string

  export default defineComponent({
    props: {
      post: Object,
      base: String
    },
    setup (props) {
      const el = ref<HTMLElement|null>(null)
      const post = props.post as Post
      const title = post.post_title || post.title?.rendered
      const metaBase = computed(() => {
        return props.base ? `#${props.base}` : false
      })

      const ctx = inject<ComputedRef<string>>('ctx')
      const target = computed<string>(() => {
        const self = post.permalink || post.link || ''
        return self.replace(base, '')
      })

      const expanded = computed(() => {
        if (!target.value || !ctx) return false
        return target.value === ctx.value
      })

      const canComment = computed(() => {
        return post?.comment_status === 'open'
      })

      const route = useRoute()
      const routes: any = ['projekt', 'page', 'uber']
      const link = computed(() => {
        const base = metaBase.value || (routes.includes(route.name) ? '#kontext' : '#view')
        const open = `${base}=${target.value}`
        return expanded.value ? base : open
      })

      watch(expanded, (newVal) => {
        if (newVal && el.value) {
          // console.log('scroll to me', target.value, el.value)
          setTimeout(() => {
            el.value?.scrollIntoView?.({
              block: 'start',
              behavior: 'smooth'
            })
          }, 250)
        }
      })

      return { el, post, title, target, expanded, canComment, slideOpen, slideClose, link }
    },
    components: { CommentsPreview, AppImage, ChevronUp }
  })
</script>
