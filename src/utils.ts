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

export const imgSize = (img: any, viewSize: number) => {
  const { width } = img

  if (viewSize >= width || !img.sizes) return img.url

  const opts = {
    'medium': 300,
    'medium_large': 768,
    'large': 1024,
    '1536x1536': 1536,
    '2048x2048': 2048
  }

  let match = '2048x2048' // default to full

  for (const size of Object.entries(opts)) {
    if (size[1] >= viewSize) {
      match = size[0]
      break
    }
  }

  return img.sizes[match]
}
