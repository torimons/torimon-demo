module.exports = {
    preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
    moduleNameMapper: {
        "\\.(css|scss)$": "<rootDir>/node_modules/jest-css-modules"
    },
    setupFilesAfterEnv: ['./tests/setup.ts']
}
