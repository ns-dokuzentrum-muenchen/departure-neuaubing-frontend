<template>
  <div v-if="project" ref="el" :style="itemStyle" :class="reverse" :aria-hidden="!visible" class="md:flex w-max max-w-project-item">
    <figure ref="img" @click="move" @keyup.enter="move" :style="imgStyle" :class="imgClasses" :tabindex="column === position ? 0 : -1" class="md:w-3/5 cursor-pointer pointer-events-auto">
      <template v-if="mediaType === 'video'">
        <auto-video :video="mediaData" :auto="true"></auto-video>
      </template>
      <template v-else-if="mediaType === 'image'">
        <img :src="mediaData.sizes.large" :width="mediaData.width" :height="mediaData.height" :alt="project.acf?.title" loading="lazy"/>
      </template>
      <template v-else>
        <div class="max-w-md text-xl md:text-2xl">
          <p>{{ mediaData }}</p>
        </div>
      </template>
    </figure>

    <div :class="[textAlign, textClass]" class="mt-4 md:mt-0 px-4 md:w-2/5 transition-opacity duration-500">
      <h2 v-html="title" class="uppercase text-4xl lg:text-5xl styled-text leading-none"></h2>
      <div class="font-bold text-xl my-3 flex flex-wrap">
        <p v-for="artist in artists" :key="artist.id" class="commas">{{ artist.post_title }}</p>
      </div>
      <div v-if="description" v-html="description" class="font-medium my-3 line-clamp-3 xl:line-clamp-4"></div>
      <div class="my-4">
        <router-link :to="link" :tabindex="column === position ?0 : -1" class="btn inline-block">{{ lt('enter') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, onMounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from '../store'
  import { fixLink } from '../utils'
  import StyledText from './StyledText.vue'
  import AutoVideo from './AutoVideo.vue'

  const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min

  export default defineComponent({
    name: 'ProjectItem',
    props: {
      project: Object,
      col: Number,
      pos: Number,
      idx: Number
    },
    setup (props, { emit }) {
      const store = useStore()

      const data = props.project
      const id = data?.projekt
      const idx = props.idx || 0

      const domLoaded = ref(false)
      const el = ref<HTMLElement | null>(null)
      const img = ref<HTMLElement | null>(null)
      const column = computed(() => props.col as number)
      const position = computed(() => props.pos as number)

      const project = computed(() => store.idToProject(id as number))

      const artists = computed(() => project.value?.acf?.person)
      const title = computed(() => {
        return project.value?.acf?.html_title || project.value?.title?.rendered || ''
      })
      const description = computed(() => data?.description)
      const link = computed(() => fixLink(project.value?.link))

      const mediaType = computed(() => data?.type || 'text')
      const mediaData = computed(() => {
        const t = data?.type
        if (!t) return ''
        if (t === 'video') return data.video
        if (t === 'image') return data.image
        return data.text
      })
      const visible = computed(() => column.value === position.value)

      const middleOffset = ref(0)

      const calcOffset = (step: number) => {
        if (!img.value || !el.value) return 0

        const p = el.value as HTMLElement // parent el
        const pw = p.offsetWidth // parent el width
        const iw = (img.value as HTMLElement).offsetWidth // img width

        const rev = data?.position === 'left' // acf
        const pad = (step < 0 && !rev) || (step > 0 && rev)
        const padAmount = pad ? pw - iw : 0 // ignore title area

        const space = step > 0 ? window.innerWidth - pw - p.offsetLeft : p.offsetLeft
        const overlap = window.innerWidth >= 768 ? Math.round(window.innerWidth / 20) : -10
        const stagger = column.value % 3
        const showWidth = (idx + stagger) % 2 === 0 ? overlap : -10

        const d = ((pw + space - showWidth - padAmount) / pw) * 100

        return d * step
      }
      const itemStyle = computed(() => {
        let x = 0
        let y = 0

        if (!img.value || column.value === position.value) {
          // centered, a bit random
          x = random(-4, 5)
          y = random(-4, 5)
        } else {
          // off to left or right
          x = calcOffset(column.value - position.value)
          y = random(-10, 10)
        }

        return {
          transform: `translate(${x}%, ${y}%)`
        }
      })
      const imgStyle = computed(() => {
        const rev = position.value > column.value
        // const val = middleOffset.value * (rev ? -1 : 1)

        let y = 0

        if (el.value && column.value !== position.value) {
          const p = el.value as HTMLElement
          const ph = p.getBoundingClientRect().top
          y = (ph - (window.innerHeight / 2)) / 10
        }

        y = Math.min(y, window.innerHeight / 15)

        return {
          transform: `translate(0px, ${y * -1}px)`
        }
      })
      const imgClasses = ref('')
      const reverse = computed(() => {
        const classes: string[] = []
        if (!visible.value) {
          classes.push('pointer-events-none')
        }
        if (domLoaded.value) {
          classes.push('transition-all', 'duration-500')
        }
        if (data?.position === 'left') {
          classes.push('md:flex-row-reverse')
        }
        return classes
      })
      const textAlign = computed(() => {
        const opts = {
          top: 'self-start',
          center: 'self-center',
          bottom: 'self-end'
        }
        const k: 'top' | 'center' | 'bottom' = data?.alignment
        return opts[k]
      })
      const textClass = computed(() => {
        return !visible.value ? 'opacity-0' : ''
      })

      const router = useRouter()
      const move = () => {
        if (column.value === position.value) {
          router.push(link.value)
        } else {
          emit('move', column.value)
        }
      }

      const scrollListener = () => {
        if (column.value === position.value) {
          middleOffset.value = 0
          return
        }
        if (Math.abs(column.value - position.value) !== 1) {
          middleOffset.value = 0
          return
        }

        const pos = el.value?.getBoundingClientRect()
        if (!pos) return

        const vc = window.innerHeight / 2
        const st = (pos.height / 2) * -1 // vc / 2
        const en = vc * 2 + (pos.height / 2) // st * 3

        const middle = pos.top + (pos.height / 2) // img center, on screen

        if (st < middle && middle < en) {
          const move = en - vc
          const v = Math.abs(middle - vc) - move

          middleOffset.value = Math.asinh(v * v * v)
        } else {
          middleOffset.value = 0
        }
      }

      onMounted(() => {
        setTimeout(() => {
          domLoaded.value = true
          window.addEventListener('scroll', scrollListener)
        }, 500)
      })

      watch(position, (newVal, oldVal) => {
        if (newVal === position.value || oldVal === position.value) {
          imgClasses.value = 'transition-transform duration-500'
          scrollListener()
          setTimeout(() => {
            imgClasses.value = ''
          }, 500)
        }
      })

      return {
        lt: store.lt,
        column,
        position,
        domLoaded,
        el,
        img,
        project,
        artists,
        title,
        description,
        link,
        mediaType,
        mediaData,
        visible,
        itemStyle,
        imgStyle,
        imgClasses,
        reverse,
        textAlign,
        textClass,
        move
      }
    },
    components: { StyledText, AutoVideo }
  })

  // function easeInOutQuad(x: number) {
  //   return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
  // }
</script>
