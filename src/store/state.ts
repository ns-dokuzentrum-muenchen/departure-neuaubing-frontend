interface State {
  title: string
  settings?: object
}

export default function state (): State {
  return {
    title: 'Departure Neuaubing'
  }
}
