<template>
  <div class="md:flex md:space-x-12 items-start">
    <div v-if="block?.video" class="md:w-2/3 md:sticky top-1/4">
      <!-- <video-player :video="block.video"/> -->
      <video ref="vid" disablePictureInPicture playsinline="true" :width="block.video.width" :height="block.video.height" class="lazyload w-full h-full object-cover">
        <source v-for="src in srcs" :key="src.md5" :src="src.link" :type="src.type">
      </video>
    </div>
    <div class="md:w-1/3 m-6 md:m-0">
      <div v-for="(frame, i) in frames" :key="i" class="h-block">
        <div :ref="setItem" class="text-lg md:text-xl lg:text-2xl max-w-full md:max-w-xl md:mt-48">
          <div v-html="frame.content" class="html theme-bold break-words"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { VideoData } from '../../store/types'
  import { defineComponent, ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
  import { useStore } from '../../store'
  import VideoPlayer from '../VideoPlayer.vue'
  import TWEEN from '@tweenjs/tween.js'

  export default defineComponent({
    props: {
      block: Object
    },
    setup (props) {
      const vid = ref<HTMLVideoElement|null>(null)

      const block = computed(() => props.block)
      const video = computed(() => props.block?.video as VideoData)

      const minSize = ref(360)

      const store = useStore()
      const location = computed(() => store.visitorDistance)

      const frames = computed<any[]>(() => {
        return block.value?.frames.map((f: any) => {
          return {
            content: f.content.replace('[location]', location.value.city)
              .replace('[distance]', location.value.distance)
          }
        }) || []
      })

      const height = computed(() => (frames.value.length + 1) * (window.innerHeight * 0.6))

      const srcs = computed(() => {
        if (!video.value?.files) return []

        const srt = video.value?.files.filter(f => !!f.width).sort((a, b) => a.width - b.width)

        const bigger = srt.filter((f) => f.height > minSize.value)
        const smaller = srt.filter((f) => f.height && f.height <= minSize.value)

        if (bigger?.length) return bigger.slice(0, 1)
        return [smaller.pop()]
      })

      const inView = ref(0)
      let items: HTMLElement[] = []
      const setItem = (el: HTMLElement) => {
        if (el) {
          items.push(el)
        }
      }

      watch(inView, (newVal, oldVal) => {
        const duration = vid.value?.duration
        if (!vid.value || !duration) return

        const steps = duration / (items.length + 1)
        const from = oldVal * steps
        const to = newVal * steps

        // console.log(to, from, duration)
        // if (to < from) return // only forwards?

        playback(to, from)
        // vid.value.currentTime = seek
      })

      function playback (to: number, from: number) {
        let val = { time: from }
        new TWEEN.Tween(val).to({ time: to }, 1000)
          .onUpdate(() => {
            if (!vid.value) return
            vid.value.currentTime = val.time
            // console.log(val.time)
          }).start()
      }

      function animate(time?: number) {
        requestAnimationFrame(animate)
        TWEEN.update(time)
      }
      animate()
      // function animate (time: number) {
      //   requestAnimationFrame(animate)
      //   TWEEN.update(time)
      // }
      // const playPos = computed(() => {
      //   const duration = vid.value?.duration
      //   if (!duration) return 0

      //   const steps = duration / (items.length + 1)

      //   return inView.value * steps
      // })

      onMounted(async () => {
        store.getVisitorDistance()
        await nextTick()

        window.addEventListener('scroll', observe)
      })
      onUnmounted(() => {
        window.removeEventListener('scroll', observe)
      })

      function observe () {
        const st = window.innerHeight / 3
        const en = st * 2

        for (let i = 0; i < items.length; i++) {
          const r = items[i].getBoundingClientRect()
          const mid = r.top + (r.height / 2)

          if (mid > st && mid < en) {
            if (i !== inView.value) {
              inView.value = i
            }
          }
        }
      }

      return { vid, block, frames, height, srcs, setItem }
    },
    components: { VideoPlayer }
  })
</script>
