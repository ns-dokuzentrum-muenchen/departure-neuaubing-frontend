interface State {
  title: string
  pretitle?: string
  description?: string
  settings?: object
  darkMode: boolean
}

export default function state (): State {
  return {
    title: 'Departure Neuaubing',
    pretitle: 'Europäische Geschichten über Zwangsarbeit',
    description: 'Diese Webseite erzählt mit Kunst die Geschichte der nationalsozialistischen Zwangsarbeit als eine europäisch-vernetzte Geschichte.',

    darkMode: getCssMode()
  }
}

function getCssMode () {
  const saved = window.localStorage?.getItem('cssMode')
  return saved === 'dark'
}
