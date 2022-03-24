<template>
  <div class="bg-gray-200 text-black rounded-xl p-4">
    <div class="mb-4">
      <p v-if="showType" class="mb-1 opacity-60">{{ type }}</p>
      <h2 class="text-lg md:text-xl lg:text-2xl">
        <router-link :to="url" class="hover:opacity-60 transition-opacity">{{ post?.title.rendered }}</router-link>
      </h2>
      <div class="flex -mx-2 divide-x mt-2">
        <div class="px-2">
          <span :class="{ 'bg-yellow-400 bg-opacity-50': myPost }">{{ post?.author_name }}</span>
        </div>
        <div class="px-2">{{ time }}</div>
        <div class="px-2">{{ date }}</div>
      </div>
    </div>
    <div :class="{ 'line-clamp-3': !expand }">
      <div v-html="post?.acf.description" class="md:text-lg contents html"></div>
      <div v-if="post.type === 'upload'">
        <figure>
          <app-image :image="post.acf.thumbnail" class="rounded-md"/>
          <figcaption>
            <div v-html="post.content?.rendered" class="html mt-4 whitespace-pre-line"></div>
          </figcaption>
        </figure>
      </div>
    </div>
    <div v-if="replies.length" class="bg-gray-300 p-4 rounded-md space-y-4">
      <div v-for="comment in replies" :key="comment.id" class="">
        <comment-row :comment="comment" :no-reply="true"/>
      </div>
    </div>
    <div v-if="post?.comment_status === 'open'" class="flex items-center mt-4">
      <div class="flex-auto">
        <div class="flex items-center space-x-2">
          <img src="../assets/chat-icon-dark.svg"/>
          <p>{{ post?.comment_count || 0 }}</p>
        </div>
      </div>
      <div class="mr-2">
        <router-link :to="url" class="btn-outline text-sm inline-block">{{ lt('comment') }}</router-link>
      </div>
      <div>
        <router-link :to="url" class="btn-outline text-sm inline-block">{{ lt('view') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import type { Post } from '../store/types'
  import { defineComponent, computed } from 'vue'
  import { format } from 'fecha'
  import { useStore } from '../store'
  import AppImage from '../components/AppImage.vue'
  import CommentRow from '../components/CommentRow.vue'

  export default defineComponent({
    props: {
      post: Object,
      showType: Boolean,
      expand: Boolean
    },
    setup (props) {
      const post = props.post as Post

      const store = useStore()

      const dateObj = new Date(post.date?.replace(' ', 'T'))
      const time = format(dateObj, 'H:mm')
      const date = format(dateObj, 'DD.MM.YYYY')

      const replies = computed(() => {
        const list = post._embedded?.replies?.[0] || []
        return list.slice(0, 3)
      })

      const url = computed(() => {
        const lang = store.locale === 'en' ? '/en' : ''
        if (post.type === 'begriff') {
          return `${lang}/projekte/mind-the-memory-gap#begriff=/begriffe/${post.slug}`
        } else if (post.type === 'upload') {
          return `${lang}/projekte/memory-practice?marker=${post.acf?.parent}`
        }
        return `${lang}/forum/${post?.slug}`
      })

      const type = computed(() => {
        if (post.type === 'begriff') return 'Mind the Memory Gap, Begriff'
        else if (post.type === 'upload') return 'Memory in Practice, Foto Beitrag'
        else return 'Forum'
      })

      const myPost = computed(() => {
        if (!store.user) return false
        return Number(post.author) === store.user.id
      })

      const expand = props.expand

      return { post, replies, time, date, url, type, myPost, expand, lt: store.lt }
    },
    components: { AppImage, CommentRow }
  })
</script>
