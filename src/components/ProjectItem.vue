<template>
  <div v-if="project" ref="el" :style="itemStyle" :class="reverse" class="flex w-max max-w-[72vw]">
    <figure ref="img" @click="move" class="w-max cursor-pointer">
      <img :src="image.sizes.large" :width="image.width" :height="image.height" :alt="image.caption || image.filename" loading="lazy"/>
    </figure>

    <div :class="[textAlign, textClass]" class="px-4 max-w-96 transition-opacity duration-500">
      <h2 v-html="title" class="uppercase text-4xl lg:text-5xl styled-text"></h2>
      <div class="font-bold text-xl my-3">
        <p v-for="artist in artists" :key="artist.id">{{ artist.post_title }}</p>
      </div>
      <div v-if="description" v-html="description" class="font-medium my-3 line-clamp-3 xl:line-clamp-4"></div>
      <div class="my-4">
        <router-link :to="link" class="btn inline-block">Eintreten</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from '../store'
  import StyledText from './StyledText.vue'

  const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min

  export default defineComponent({
    name: 'ProjectItem',
    props: {
      project: Object,
      col: Number,
      pos: Number
    },
    setup (props, { emit }) {
      const store = useStore()

      const data = props.project
      const id = data?.projekt

      const domLoaded = ref(false)
      const el = ref(null)
      const img = ref(null)
      const column = computed(() => props.col as number)
      const position = computed(() => props.pos as number)

      const project = computed(() => store.idToProject(id as number))

      const artists = computed(() => project.value?.acf?.person)
      const title = computed(() => project.value?.acf?.html_title || project.value?.title?.rendered || '')
      const description = computed(() => project.value?.acf?.description)
      const link = computed(() => project.value ? `/projekte/${project.value.slug}` : '')
      const image = computed(() => data?.image)

      const calcOffset = (step: number) => {
        if (!img.value || !el.value) return 0

        const p = el.value as HTMLElement
        const pw = p.offsetWidth
        const iw = (img.value as HTMLElement).offsetWidth

        const rev = data?.position === 'left'
        const pad = (step < 0 && !rev) || (step > 0 && rev)
        const padAmount = pad ? pw - iw : 0

        const space = step > 0 ? window.innerWidth - pw - p.offsetLeft : p.offsetLeft
        const showWidth = random(-80, 90)

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
          y = random(-25, 26)
        }

        return {
          transform: `translate(${x}%, ${y}%)`
        }
      })
      const reverse = computed(() => {
        const classes: string[] = []
        if (domLoaded.value) {
          classes.push('transition-all', 'duration-500')
        }
        if (data?.position === 'left') {
          classes.push('flex-row-reverse')
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
        return column.value !== position.value ? 'opacity-0 pointer-events-none' : ''
      })

      const router = useRouter()
      const move = () => {
        if (column.value === position.value) {
          router.push(link.value)
        } else {
          emit('move', column.value)
        }
      }

      onMounted(() => {
        setTimeout(() => {
          domLoaded.value = true
        }, 500)
      })

      return {
        domLoaded,
        el,
        img,
        project,
        artists,
        title,
        description,
        link,
        image,
        itemStyle,
        reverse,
        textAlign,
        textClass,
        move
      }
    },
    components: { StyledText }
  })
</script>
