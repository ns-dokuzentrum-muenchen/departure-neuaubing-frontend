<template>
  <div ref="el" :class="{ 'bg-gray-200 p-2': expanded && guestPost }" class="scroll-mt-16 rounded-lg">
    <div :class="{ 'text-xl font-medium py-1': expanded, 'html': !expanded }" class="transition-all">
      <router-link :to="link" class="flex justify-between items-center">
        <span v-html="title"></span>
        <span v-if="guestPost && expanded" class="ml-1">(Gastbeitrag)</span>
        <span class="flex-auto"></span>
        <span v-if="expanded">
          <chevron-up/>
        </span>
      </router-link>
    </div>
    <transition @enter="slideOpen" @leave="slideClose">
      <div v-if="expanded" class="overflow-hidden">
        <div :class="{ 'border-b border-t': !guestPost }" class="py-3">
          <div v-if="guests" class="text-sm -mt-1 mb-3">{{ post.author_name }}</div>
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
            <div :class="{ 'max-w-3xl': !guestPost }" class="mt-4">
              <comments-preview :count="post.comment_count" :id="post.ID || post.id" :title="!guestPost && title" :path="target" :padding="true"/>
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
  import { slideOpen, slideClose, fixLink } from '../utils'
  import CommentsPreview from './CommentsPreview.vue'
  import AppImage from './AppImage.vue'
  import ChevronUp from './svg/ChevronUp.vue'

  const base = import.meta.env.VITE_API_ENDPOINT as string

  export default defineComponent({
    props: {
      post: Object,
      base: String,
      guests: Boolean
    },
    setup (props) {
      const el = ref<HTMLElement|null>(null)
      const post = props.post as Post
      const guestPost = computed(() => {
        return props.guests && post.author_name !== 'Franz Wanner'
      })
      const title = computed(() => {
        const t = post.post_title || post.title?.rendered
        // if (guestPost.value) {
        //   return `Gastbeitrag: ${t}`
        // }
        return t
      })
      const metaBase = computed(() => {
        return props.base ? `#${props.base}` : false
      })

      const ctx = inject<ComputedRef<string>>('ctx')
      const target = computed<string>(() => {
        const self = post.permalink || post.link || ''
        return fixLink(self)
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

      return {
        el,
        post,
        guestPost,
        title,
        target,
        expanded,
        canComment,
        slideOpen,
        slideClose,
        link,
        guests: props.guests
      }
    },
    components: { CommentsPreview, AppImage, ChevronUp }
  })
</script>
