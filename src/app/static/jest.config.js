module.exports = {
    preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
    transform: {
        "^.+\\.vue$": "vue-jest"
    },
    collectCoverage: true,
    testMatch: [
        "**/?(*.)(spec|test).(js|ts)"
    ]
};
