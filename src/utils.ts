export const slideOpen = (el: Element, done: () => void) => {
  const duration = 250
  const h = el.getBoundingClientRect().height
  const height = `${h}px`

  const fade = el.getAttribute('data-fade') !== 'false'

  const hideOverflow = el.getAttribute('data-overflow')
  if (hideOverflow) {
    el.classList.add('overflow-hidden')
  }

  const animation = el.animate({
    height: ['0px', height],
    opacity: [fade ? 0 : 1, 1]
  }, { duration,  easing: 'ease-out' })

  animation.onfinish = () => {
    if (hideOverflow) {
      el.classList.remove('overflow-hidden')
    }
    done()
  }
}
export const slideClose = (el: Element, done: () => void) => {
  const duration = 250
  const h = el.getBoundingClientRect().height
  const height = `${h}px`

  const fade = el.getAttribute('data-fade') !== 'false'
  const hideOverflow = el.getAttribute('data-overflow')
  if (hideOverflow) {
    el.classList.add('overflow-hidden')
  }

  const animation = el.animate({
    height: [height, '0px'],
    opacity: [1, fade ? 0 : 1]
  }, { duration, easing: 'ease-out' })

  animation.onfinish = () => {
    if (hideOverflow) {
      el.classList.remove('overflow-hidden')
    }
    done()
  }
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

export function sleep (delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

export function fixLink (path: string | undefined): string {
  if (!path) return ''
  if (path.charAt(0) === '/') return path

  return path
    .replace('https://dn-api.nsdoku.de', '')
    .replace('https://dn-api-en.nsdoku.de', '')
    .replace('https://departure-neuaubing-stage.netlify.app', '')
    .replace('http://localhost:8080', '')
}
export function sideBarLink (path: string): boolean {
  const match = RegExp(/^\/(en\/)?(glossar|orte|personen|kuenstlerinnen|begriffe)\//).test(path)
  return match
}
