<template>
  <div class="flex justify-center items-center">
    <button @click="handler" :title="action" class="btn">{{ text }}</button>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { useRouter } from 'vue-router'

  export default defineComponent({
    props: {
      block: Object,
      slug: String
    },
    setup (props) {
      const text: string = props.block?.text || ''
      const action: string = props.block?.action || ''

      const router = useRouter()
      const handler = () => {
        const char = action.charAt(0)
        if (char === '#') {
          const targetEl = document.getElementById(action.slice(1))
          if (targetEl) {
            targetEl.scrollIntoView({ block: 'start', behavior: 'smooth' })
          }
        } else if (char === '/') {
          router.push(action)
        } else {
          if (/^https?/.test(action)) {
            window.location.href = action
          } else {
            const targetEl = document.getElementById('top')
            if (targetEl) {
              targetEl.scrollIntoView({ block: 'start', behavior: 'smooth' })
            }
          }
        }
      }

      return { text, handler, action }
    }
  })
</script>
