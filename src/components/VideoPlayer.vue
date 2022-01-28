<template>
  <div ref="el" class="text-white relative w-full h-full">
    <div class="w-full h-full">
      <video ref="vid" :data-poster="poster" disablePictureInPicture :playsinline="inline" :width="video.width" :height="video.height" crossorigin="true" class="lazyload w-full h-full object-contain">
        <source v-for="src in srcs" :key="src.md5" :src="proxy(src.link)" :type="src.type">
        <template v-if="closedCaptions">
          <track v-for="track in closedCaptions.data" :key="track.id" :src="track.link" :srclang="track.language" :label="track.label" kind="captions"/>
        </template>
      </video>
    </div>
  </div>
</template>

<script lang="ts">
  import type { VideoData } from '../store/types'
  import { defineComponent, ref, computed, onMounted, nextTick } from 'vue'
  import axios from 'axios'
  import Plyr from 'plyr'
  import 'plyr/src/sass/plyr.scss' // dist not working?

  export default defineComponent({
    name: 'VideoPlayer',
    props: {
      video: Object,
      auto: Boolean,
      first: Boolean
    },
    setup (props) {
      const video = computed(() => props.video as VideoData)

      const minSize = ref(360)
      const plyr = ref<Plyr | null>(null)

      const el = ref<HTMLElement|null>(null)
      const vid = ref<HTMLElement|null>(null)

      const closedCaptions = ref<any>(null)

      const id = computed(() => {
        if (!video.value) return 'plyr'

        const id = Number(video.value.uri.split('/').pop())
        return id
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
      const inline = computed(() => props.first)

      onMounted(async () => {
        if (!el.value || !vid.value) return

        const langs: { [key: string]: string } = {
          en: 'English',
          de: 'Deutsch'
        }

        await axios.get('/.netlify/functions/video-captions', {
          params: { id: id.value }
        }).then(({ data }) => {
          if (data?.total && data.total > 0) {
            data.data = data.data.map((track: any) => {
              track.label = langs[(track.language as string)]
              return track
            })
            closedCaptions.value = data
          }
        })

        const $el = el.value as HTMLElement

        minSize.value = Math.max($el.clientWidth, $el.clientHeight)

        await nextTick()

        plyr.value = new Plyr(vid.value, {
          muted: false,
          controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'fullscreen']
        })

        // maybe auto play...
        if (!props.auto) return

        plyr.value.play()
        // this.listeners()
      })

      const proxy = (link: string) => {
        return link
        // if (!link.includes('player.vimeo.com')) return link
        // const url = link.replace('https://player.vimeo.com/external/', '')
        // return `https://dn-videos.deno.dev/?v=${encodeURIComponent(url)}`
      }

      return { el, vid, video, closedCaptions, poster, srcs, plyr, inline, proxy }
    }
  })
</script>
