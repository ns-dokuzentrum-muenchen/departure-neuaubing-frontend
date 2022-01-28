<template>
  <div ref="el" class="text-white relative w-full h-full">
    <video :id="id" ref="vid" :poster="poster" :width="video.width" :height="video.height" playsinline="true" loop="true" muted="true" disablePictureInPicture class="lazyload w-full h-full object-contain">
      <source v-for="src in srcs" :key="src.md5" :src="proxy(src.link)" :type="src.type">
    </video>
  </div>
</template>

<script lang="ts">
  import type { VideoData } from '../store/types'
  import { defineComponent, ref, computed, onMounted, nextTick } from 'vue'

  export default defineComponent({
    props: {
      video: Object
    },
    setup (props) {
      const video = computed(() => props.video as VideoData)

      const minSize = ref(360)

      const el = ref<HTMLElement | null>(null)
      const vid = ref<HTMLVideoElement | null>(null)

      const id = computed(() => {
        if (!video.value) return 'vid'

        const id = video.value.uri.split('/').pop()
        return `vid-${id}`
      })
      const poster = computed(() => {
        const img = video.value.pictures.sizes.slice(-1)
        return img.length ? img[0].link : null
      })
      const srcs = computed(() => {
        if (!video.value.files) return []

        const srt = video.value.files.filter(f => !!f.width).sort((a, b) => a.width - b.width)

        const bigger = srt.filter((f) => f.height > minSize.value)
        const smaller = srt.filter((f) => f.height && f.height <= minSize.value)

        if (bigger?.length) return bigger.slice(0, 1)
        return [smaller.pop()]
      })

      onMounted(async () => {
        const $el = el.value
        if (!$el) return

        minSize.value = Math.max($el.clientWidth, $el.clientHeight)

        await nextTick()

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              play()
            } else {
              pause()
            }
          })
        }, {
          threshold: [0.5, 1]
        })

        observer.observe($el)
      })

      function play () {
        if (!vid.value) return

        if (vid.value.paused) {
          vid.value.play()
        }
      }
      function pause () {
        if (!vid.value) return

        if (!vid.value.paused) {
          vid.value.pause()
        }
      }

      const proxy = (link: string) => {
        return link
        // if (!link.includes('player.vimeo.com')) return link
        // const url = link.replace('https://player.vimeo.com/external/', '')
        // return `https://dn-videos.deno.dev/?v=${encodeURIComponent(url)}`
      }

      return { el, vid, video, id, poster, srcs, minSize, proxy }
    }
  })
</script>
