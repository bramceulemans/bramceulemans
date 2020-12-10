const fs = require('fs').promises
const {dirname, join} = require('path')
const MarkdownIt = require('markdown-it')
const MarkdownItEmoji = require('markdown-it-emoji')
const markdown = new MarkdownIt()
    .use(MarkdownItEmoji)
const mustache = require('mustache')

/**
 * Get the content of a file.
 * @param file
 * @returns {Promise<string>}
 */
const read = async (file) => (await fs.readFile(file)).toString()

const run = async () => {
    const root = dirname(__dirname)
    const src = join(root, 'src')
    const build = join(root, 'build')

    const template = await read(join(src, 'template.mustache'))
    const emoji = await read(join(src, 'emoji.mustache'))
    const readme = await read(join(root, 'README.md'))

    const html = markdown.render(readme)
        .replace(/:([a-z0-9]*):/g, (name, slug) => {
            const data = {name: name, slug: slug}
            console.debug(`Replaced emoji ${data.name}`)
            return mustache.render(emoji, data)
        })

    const output = mustache.render(template, {
        content: html
    })

    await fs.mkdir(build, {recursive: true})
    await fs.writeFile(
        join(build, 'index.html'),
        output
    )
    await fs.copyFile(
        join(src, 'app.css'),
        join(build, 'app.css')
    )
}

run()
    .then(() => console.info('Build successful.'))
    .catch(e => console.error(e))
