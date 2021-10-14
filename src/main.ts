import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'

const store = createPinia().use(() => {{ router }})
const app = createApp(App)

app.mixin({
  methods: {
    slideOpen (el: HTMLElement, done: () => void) {
      const duration = this.slideDuration || 250
      const height = `${el.offsetHeight}px`

      const fade = el.getAttribute('data-fade') !== 'false'

      const animation = el.animate({
        height: ['0px', height],
        opacity: [fade ? 0 : 1, 1]
      }, { duration,  easing: 'ease-out' })

      animation.onfinish = done
    },
    slideClose (el: HTMLElement, done: () => void) {
      const duration = this.slideDuration || 250
      const height = `${el.offsetHeight}px`

      const fade = el.getAttribute('data-fade') !== 'false'

      const animation = el.animate({
        height: [height, '0px'],
        opacity: [1, fade ? 0 : 1]
      }, { duration, easing: 'ease-out' })

      animation.onfinish = done
    }
  }
})

app.use(store).use(router).mount('#app')
