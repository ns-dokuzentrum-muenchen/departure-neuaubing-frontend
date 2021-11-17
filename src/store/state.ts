interface State {
  title: string
  pretitle?: string
  description?: string
  indexPos: number
  projects: Post[] | null
  settings: Settings | null
  visitorDistance: any
  glossar: { [index: string]: Post }
  comments: { [index: number]: Comment[] }
  markers: Post[]
  myMarkers: Post[]
  darkMode: boolean
  theme: Theme,
  menuOpen: boolean
  searchResults: Post[]
  analytics: boolean
  user: any
  nonce: string | null
  authToken: string | null
}

export default function state (): State {
  return {
    title: 'Departure Neuaubing',
    pretitle: 'Europäische Geschichten über Zwangsarbeit',
    description: 'Diese Webseite erzählt mit Kunst die Geschichte der nationalsozialistischen Zwangsarbeit als eine europäisch-vernetzte Geschichte.',
    indexPos: 1,

    projects: null,
    settings: null,
    visitorDistance: {
      city: '...',
      distance: '...'
    },

    glossar: {},
    comments: {},

    markers: [],
    myMarkers: [], // TODO: save these in localStorage? remove when no longer `pending`

    darkMode: getCssMode(),
    theme: getTheme(),
    menuOpen: false,

    searchResults: [],

    analytics: true,

    user: null,
    nonce: null,
    authToken: getToken()
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

function getToken () {
  const saved = window.localStorage?.getItem('token')
  return saved
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
  post_name?: string

  title_highlighted?: string
  content_highlighted?: string
}

type RenderedString = { rendered: string }
export type PostType = 'projekt' | 'int-projekt' | 'kuenstler' | 'glossar' | 'markierung' | 'post' | 'page'

type ACF = {
  title?: string
  html_title?: string
  description?: string
  image?: Image
  biographie?: string
  person?: any[]
  tags?: object[]
  versions?: Post[]
  content?: AcfRow[]
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

interface AcfRow {
  acf_fc_layout: string
  position?: string
  size?: string
  text?: string
  group?: string
  gallery?: Image[]
}

interface Settings {
  cover?: Image
  video?: any
  projekte?: any[]
}
