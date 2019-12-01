module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatters: ['dist'],
    collectCoverageFrom: [
        "**/*.{ts}",
        "!**/node_modules/**",
        "!**/vendor/**"
    ]
}
