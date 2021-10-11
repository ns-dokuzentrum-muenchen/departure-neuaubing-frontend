interface State {
  title: string
  pretitle?: string
  description?: string
  projects: object[] | null
  settings: object | null
  darkMode: boolean
  theme: 'blau' | 'gelb' | 'rosa' | 'grün'
}

export default function state (): State {
  return {
    title: 'Departure Neuaubing',
    pretitle: 'Europäische Geschichten über Zwangsarbeit',
    description: 'Diese Webseite erzählt mit Kunst die Geschichte der nationalsozialistischen Zwangsarbeit als eine europäisch-vernetzte Geschichte.',

    projects: null,
    settings: null,

    darkMode: getCssMode(),
    theme: 'blau'
  }
}

function getCssMode () {
  const saved = window.localStorage?.getItem('cssMode')
  return saved === 'dark'
}
