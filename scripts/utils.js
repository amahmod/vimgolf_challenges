import fs from 'fs'

export async function get_local_json(path) {
    const data = await fs.promises.readFile(path, 'utf8')
    return JSON.parse(data)
}

export async function set_local_json(path, data) {
    await fs.promises.writeFile(path, JSON.stringify(data), 'utf8')
}
