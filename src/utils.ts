export const slideOpen = (el: Element, done: () => void) => {
  const duration = 250
  const h = el.getBoundingClientRect().height
  const height = `${h}px`

  const fade = el.getAttribute('data-fade') !== 'false'

  const animation = el.animate({
    height: ['0px', height],
    opacity: [fade ? 0 : 1, 1]
  }, { duration,  easing: 'ease-out' })

  animation.onfinish = done
}
export const slideClose = (el: Element, done: () => void) => {
  const duration = 250
  const h = el.getBoundingClientRect().height
  const height = `${h}px`

  const fade = el.getAttribute('data-fade') !== 'false'

  const animation = el.animate({
    height: [height, '0px'],
    opacity: [1, fade ? 0 : 1]
  }, { duration, easing: 'ease-out' })

  animation.onfinish = done
}
