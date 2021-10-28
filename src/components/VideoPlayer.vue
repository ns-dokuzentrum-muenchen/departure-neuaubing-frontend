<template>
  <div ref="el" class="text-white relative w-full h-full">
    <div class="w-full h-full">
      <video :id="id" ref="vid" :data-poster="poster" @lazybeforeunveil="view" @loadeddata="canplay" disablePictureInPicture :playsinline="inline" class="lazyload w-full h-full object-contain">
        <source v-for="src in srcs" :key="src.md5" :src="src.link" :type="src.type">
      </video>
    </div>

    <!-- <transition name="fade">
      <div v-if="videoPlaying && first" class="absolute top-0 right-0 z-20">
        <button @click="close" class="p-4 rounded-full active:opacity-75 focus:outline-none group">
          <img src="../assets/x-icon.svg" class="w-5 h-5" alt="Exit video player"/>
        </button>
      </div>
    </transition> -->
  </div>
</template>

<script lang="ts">
  import { defineComponent, Ref, ref, computed, onMounted, nextTick } from 'vue'
  import { VideoData } from '../store/state'
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
      const plyr: Ref<null | Plyr> = ref(null)

      const el = ref(null)
      const vid = ref(null)

      const id = computed(() => {
        if (!video.value) return 'plyr'

        const id = video.value.uri.split('/').pop()
        return `plyr-${id}`
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
        if (!el.value) return

        const $el = el.value as HTMLElement

        minSize.value = Math.max($el.clientWidth, $el.clientHeight)

        await nextTick()

        plyr.value = new Plyr(`#${id.value}`, {
          muted: false,
          disableContextMenu: true,
          controls: ['play', 'progress', 'current-time', 'mute', 'fullscreen']
        })

        // maybe auto play...
      })

      return { el, vid, video, id, poster, srcs, plyr, minSize, inline }
    }
  })
</script>
