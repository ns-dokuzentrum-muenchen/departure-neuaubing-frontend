module.exports = {
  plugins: [
    require('tailwindcss/nesting')(require('postcss-nesting')),
    require('postcss-preset-env')({ stage: 0 }),
    require('tailwindcss'),
    require('autoprefixer')
  ]
}
