module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  collectCoverage: true,
  collectCoverageFrom: ["**/*.{js,vue}", "!**/*.config.js", "!**/node_modules/**", "!**/dist/**", "!**/coverage/**", '!**/main.js'],
  transform: {
    "^.+\\.js$": "babel-jest",
    ".*\\.(vue)$": "@vue/vue3-jest"
  },
  coverageProvider: "v8",
  moduleFileExtensions: ["js", "vue"],
}
