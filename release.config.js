module.exports = {
  branches: [
    'main',
    {
      name: 'beta',
      prerelease: true, // Marks this as a prerelease channel
    },
  ],
  plugins: [
    '@semantic-release/commit-analyzer', // Analyzes commits for version bumping
    [
      '@semantic-release/release-notes-generator', // Generates release notes
      {
        // Every commit type is listed so a release never gets empty notes
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'feat', section: 'Features' },
            { type: 'fix', section: 'Bug Fixes' },
            { type: 'perf', section: 'Performance Improvements' },
            { type: 'revert', section: 'Reverts' },
            { type: 'docs', section: 'Documentation' },
            { type: 'refactor', section: 'Code Refactoring' },
            { type: 'build', section: 'Build System' },
            { type: 'chore', section: 'Miscellaneous Chores' },
            { type: 'ci', section: 'Continuous Integration' },
            { type: 'test', section: 'Tests' },
            { type: 'style', section: 'Styles' },
          ],
        },
      },
    ],
    '@semantic-release/changelog', // Generates the changelog
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
      },
    ],
    '@semantic-release/github', // Handles GitHub releases
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'yarn.lock', 'CHANGELOG.md'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
