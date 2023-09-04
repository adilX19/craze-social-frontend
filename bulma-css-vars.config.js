const { hsl } = require('bulma-css-vars')

const appColors = {
  white: '#fff',
  primary: hsl(220, 97, 51), // '#0959FB',
  dark: hsl(201, 83, 67), // '#65C0F1',
  link: hsl(220, 97, 66), // '#548cfc',
  info: hsl(200, 97, 45), // '#039be5',
  success: hsl(164, 95, 43), // '#06d6a0',
  warning: hsl(35, 95, 62), // '#faae42',
  danger: hsl(341, 79, 53), // '#e62965',
}

module.exports = {
  jsOutputFile: 'src/scss/bulma-generated/bulma-colors.ts',
  sassOutputFile: 'src/scss/bulma-generated/generated-vars.sass',
  cssFallbackOutputFile: 'src/scss/bulma-generated/generated-fallback.css',
  colorDefs: appColors,
  sassEntryFile: 'src/scss/main.scss',
  transition: null,
}
