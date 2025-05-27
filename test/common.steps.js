import { Given, When, Then, defineParameterType } from 'quickpickle'

defineParameterType({
  name: 'anchor',
  regexp: /(top|bottom|left|right|center|top[- ]left|top[- ]right|bottom[- ]left|bottom[- ]right)/,
  transformer: (s) => s.toLowerCase().replace(/ /g, '-'),
})