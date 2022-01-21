import type State from './types'
import type { Theme } from './types'

export default function state (): State {
  return {
    title: 'Departure Neuaubing',
    pretitle: 'Europäische Geschichten der Zwangsarbeit',
    indexPos: 2,

    projects: null,
    intProjects: [],
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
    userContent: [],
    nonce: null,
    authToken: getToken(),

    metaHidden: false,
    metaPeek: false,

    locale: /^(\/en|\/en\/.+)$/.test(window.location.pathname) ? 'en' : 'de',

    pwRequired: true,
    unlocked: getUnlocked(),

    meta: undefined
  }
}

function getCssMode () {
  let saved = undefined
  try {
    saved = window.localStorage?.getItem('cssMode')
  } catch (err) {
    console.log('could not access storage for dark mode preference')
  }
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
  let saved = undefined
  try {
    saved = window.localStorage?.getItem('theme')
  } catch (err) {
    console.log('could not access storage for theme colour preference')
  }
  const theme = (saved || 'theme-blau') as Theme
  document.documentElement.classList?.add(theme)
  return theme
}

function getToken () {
  try {
    const saved = window.localStorage?.getItem('token')
    return saved
  } catch (err) {
    return null
  }
}

function getUnlocked () {
  try {
    const saved = window.localStorage?.getItem('unlocked')
    return !!saved
  } catch (err) {
    return true
  }
}
