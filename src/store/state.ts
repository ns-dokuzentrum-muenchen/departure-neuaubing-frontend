interface State {
  title: string
  pretitle?: string
  description?: string
  projects: Post[] | null
  settings: object | null
  darkMode: boolean
  theme: 'blau' | 'gelb' | 'rosa' | 'grün',
  menuOpen: boolean
  analytics: boolean
}

export default function state (): State {
  return {
    title: 'Departure Neuaubing',
    pretitle: 'Europäische Geschichten über Zwangsarbeit',
    description: 'Diese Webseite erzählt mit Kunst die Geschichte der nationalsozialistischen Zwangsarbeit als eine europäisch-vernetzte Geschichte.',

    projects: null,
    settings: null,

    darkMode: getCssMode(),
    theme: 'blau',
    menuOpen: false,

    analytics: true
  }
}

function getCssMode () {
  const saved = window.localStorage?.getItem('cssMode')
  return saved === 'dark'
}

type Post = {
  acf: ACF
  author: number
  content: RenderedString
  date: string
  date_gmt: string
  guid: RenderedString
  id: number
  link: string
  modifed: string
  modified_gmt: string
  slug: string
  status: string
  tags: string[]
  template: string
  title: RenderedString
  type: 'projekt' | 'kuenstler' | 'glossar' | 'markierung' | 'post' | 'page'
}

type RenderedString = string | { rendered: string }

type ACF = {
  title?: string
  description?: string
  image?: Image
}

interface Image extends Post {
  ID: number
  filename: string
  filesize: number
  url: string
  link: string
  alt: string
  caption: string
  name: string
  uploaded_to: number
  mime_type: string
  subtype: string
  icon: string
  width: number
  height: number
  sizes: ImageSizes
}

type ImageSizes = {
  thumbnail: string
  'thumbnail-width': number
  'thumbnail-height': number
  medium: string
  'medium-width': number
  'medium-height': number
  medium_large: string
  'medium_large-width': number
  'medium_large-height': number
  large: string
  'large-width': number
  'large-height': number
  '1536x1536': string
  '1536x1536-width': number
  '1536x1536-height': number
  '2048x2048': string
  '2048x2048-width': number
  '2048x2048-height': number
}
