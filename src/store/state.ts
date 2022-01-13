import type State from './types'
import type { Theme } from './types'

export default function state (): State {
  return {
    title: 'Departure Neuaubing',
    pretitle: 'Europäische Geschichten der Zwangsarbeit',
    indexPos: 2,

    projects: null,
    settings: null,
    visitorDistance: {
      city: '...',
      distance: '...'
    },

    glossar: {},
    comments: {}, // by post id

    pages: {},

    markers: [],
    myMarkers: [], // TODO: save these in localStorage? remove when no longer `pending`

    forum: [],

    darkMode: getCssMode(),
    theme: getTheme(),
    menuOpen: false,

    searchResults: [],

    analytics: true,

    user: null,
    nonce: null,
    authToken: getToken(),

    metaHidden: false,
    metaPeek: false
  }
}

function getCssMode () {
  let saved = window.localStorage?.getItem('cssMode')
  if (!saved && window.matchMedia) {
    saved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
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
