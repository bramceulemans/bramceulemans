const pages = require('gh-pages')

const deploy = async (dir, config) => new Promise(resolve => pages.publish(dir, config, resolve))

const run = async () => {
    let message = 'Development build'
    if (process.env.CI) {
        const commit = process.env.GITHUB_SHA.substr(0, 7);
        message = `Build for commit ${commit}`
    }
    await deploy('build', {
        branch: 'gh-pages',
        message: message,
        history: false,
        push: true,
    })
}

run()
    .then(() => console.info('Deploy successful.'))
    .catch(e => console.error(e))
