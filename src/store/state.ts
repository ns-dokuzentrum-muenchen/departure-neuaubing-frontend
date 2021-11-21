import State, { Theme } from './types'

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
    comments: {}, // by post id

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
