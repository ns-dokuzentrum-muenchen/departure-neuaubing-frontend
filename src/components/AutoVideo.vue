<template>
  <div ref="el" class="text-white relative w-full h-full">
    <div class="w-full h-full">
      <video :id="id" ref="vid" :poster="poster" :width="video.width" :height="video.height" playsinline="true" autoplay="true" loop="true" muted="true" disablePictureInPicture class="lazyload w-full h-full object-contain">
        <source v-for="src in srcs" :key="src.md5" :src="src.link" :type="src.type">
      </video>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, Ref, ref, computed, onMounted, nextTick } from 'vue'
  import { VideoData } from '../store/state'

  export default defineComponent({
    name: 'VideoPlayer',
    props: {
      video: Object
    },
    setup (props) {
      const video = computed(() => props.video as VideoData)

      const minSize = ref(360)

      const el = ref(null)
      const vid = ref(null)

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
        if (!el.value) return

        const $el = el.value as HTMLElement

        minSize.value = Math.max($el.clientWidth, $el.clientHeight)

        await nextTick()

        // plyr.value = new Plyr(`#${id.value}`, {
        //   muted: false,
        //   disableContextMenu: true,
        //   controls: ['play', 'progress', 'current-time', 'mute', 'fullscreen']
        // })

        // // maybe auto play...
        // if (!props.auto) return

        // plyr.value.play()
        // // this.listeners()
      })

      return { el, vid, video, id, poster, srcs, minSize }
    }
  })
</script>