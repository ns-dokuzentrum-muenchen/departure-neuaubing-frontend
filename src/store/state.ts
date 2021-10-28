interface State {
  title: string
  pretitle?: string
  description?: string
  projects: Post[] | null
  settings: object | null
  glossar: { [index: string]: Post }
  comments: { [index: number]: Comment[] }
  darkMode: boolean
  theme: Theme,
  menuOpen: boolean
  // metaLayer: number
  analytics: boolean
}

export default function state (): State {
  return {
    title: 'Departure Neuaubing',
    pretitle: 'Europäische Geschichten über Zwangsarbeit',
    description: 'Diese Webseite erzählt mit Kunst die Geschichte der nationalsozialistischen Zwangsarbeit als eine europäisch-vernetzte Geschichte.',

    projects: null,
    settings: null,

    glossar: {},
    comments: {},

    darkMode: getCssMode(),
    theme: getTheme(),
    menuOpen: false,

    // metaLayer: 0,

    analytics: true
  }
}

function getCssMode () {
  const saved = window.localStorage?.getItem('cssMode')
  const darkMode = saved === 'dark'
  if (darkMode) {
    document.documentElement.classList?.add('dark')
  }
  return darkMode
}

function getTheme () {
  const saved = window.localStorage?.getItem('theme')
  const theme = (saved || 'theme-blau') as Theme
  document.documentElement.classList?.add(theme)
  return theme
}

type Theme = 'theme-blau' | 'theme-gelb' | 'theme-rosa' | 'theme-gruen'

export type Post = {
  ID?: number
  id?: number
  slug: string
  title: RenderedString
  post_title: string
  acf: ACF

  comment_status: string
  author: number
  date: string
  modifed: string
  tags: string[]
  template: string
  type?: PostType
  post_type?: PostType
}

type RenderedString = { rendered: string }
type PostType = 'projekt' | 'int-projekt' | 'kuenstler' | 'glossar' | 'markierung' | 'post' | 'page'

type ACF = {
  title?: string
  html_title?: string
  description?: string
  image?: Image
  biographie?: string
  person?: any[]
  tags?: object[]
  versions?: Post[]
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

export interface Comment {
  id: number
  post: number
  parent: number
  author: number
  author_name: string
  author_url: string
  date: string
  content: RenderedString
  link: string
  status: string
  type: string
  author_avatar_urls: { 24: string, 48: string, 96: string }
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

export interface VideoData {
  uri: string
  name: string
  description: string | null
  link: string
  duration: number
  width: number
  height: number
  created_time: string
  modified_time: string
  pictures: { sizes: any[] }
  files: any[]
}
