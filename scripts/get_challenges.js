import { DOMParser } from 'linkedom'
import path from 'path'

import { get_local_json, set_local_json } from './utils.js'

const json_dir = path.resolve('src/challenges.json')
const root_url = 'https://www.vimgolf.com'

const parser = new DOMParser()

/**
 * @typedef {Object} ChallengeItem
 * @property {string} id - The unique identifier for the challenge.
 * @property {string} title - The title of the challenge.
 * @property {number} active_golfers - The number of active golfers participating in the challenge.
 * @property {number} total_entries - The total number of entries in the challenge.
 * @property {number} lowest_score - The lowest score achieved in the challenge.
 * @property {string} author - The author or creator of the challenge.
 * @property {string} url - The URL associated with the challenge.
 */

/**
 * Get list of challenge ids from Vimgolf pages
 *
 * @async
 * @param {number} [page_number] - The page number
 * @returns {Promise<array<string>>} The list of challenge ids
 */
async function get_challenge_ids_by_page(page_number = 1) {
    const url = `${root_url}/?page=${page_number}`
    console.log('url', url)
    const response = await fetch(url).then(res => res.text())

    const dom = parser.parseFromString(response, 'text/html')

    const challenges = dom.querySelectorAll('h5.challenge a')

    // Return empty array instead of NodeList[]
    if (!challenges.length) return []

    return challenges.map(item => {
        return item.getAttribute('href')?.split('/').pop() || ''
    })
}

/**
 * Get a challenge details
 *
 * @async
 * @param {string} challenge_id - The challenge id
 * @returns {Promise<ChallengeItem>} The challenge details
 */
async function get_challenge(challenge_id) {
    const url = `${root_url}/challenges/${challenge_id}`
    const response = await fetch(url, {
        headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
        }
    }).then(res => res.text())

    const dom = parser.parseFromString(response, 'text/html')

    const title = dom.querySelector('#content h3 b')?.textContent?.trim() || ''
    const active_golfers = parseInt(
        dom.querySelectorAll('b.stat')[0].textContent?.trim(),
        10
    )
    const total_entries = parseInt(
        dom.querySelectorAll('b.stat')[1]?.textContent?.trim(),
        10
    )
    const lowest_score = parseInt(
        dom.querySelector('.notice b a')?.textContent,
        10
    )
    const author = dom?.querySelector('h5 a')?.textContent || ''

    return {
        active_golfers,
        author,
        id: challenge_id,
        lowest_score,
        title,
        total_entries
    }
}

async function get_challenges(challenge_ids = []) {
    if (!challenge_ids.length) return []
    return await Promise.all(challenge_ids.map(id => get_challenge(id)))
}

let current_page_number = 1
let new_challenges_count = 0

/**
 * @type {array<ChallengeItem>}
 **/

let all_challenges = []

async function recursive_get_challenges(page_number = 1) {
    const challenge_ids = await get_challenge_ids_by_page(page_number)

    // filter out existing challenges
    const filtered_challenge_ids = challenge_ids.filter(
        id => !all_challenges.find(challenge => challenge.id === id)
    )

    if (!filtered_challenge_ids.length) {
        console.log(`Found ${new_challenges_count} new challenges`)
        console.log('Completed')
        return
    }
    console.log(`Found ${filtered_challenge_ids.length} new challenges`)

    const new_challenges = await get_challenges(filtered_challenge_ids)
    new_challenges_count += new_challenges.length
    all_challenges = [...new_challenges, ...all_challenges]
    await set_local_json(json_dir, all_challenges)

    if (challenge_ids?.length !== filtered_challenge_ids?.length) {
        console.log(`Fetched ${new_challenges_count} new challenges`)
        console.log(challenge_ids)
        return
    }

    current_page_number += 1
    console.log(`Fetching page ${current_page_number}`)
    await recursive_get_challenges(current_page_number)
}

async function init() {
    all_challenges = await get_local_json(json_dir)
    console.log(`Found ${all_challenges.length} local challenges`)
    console.log('Fetching new challenges')
    await recursive_get_challenges()
}

init().then(console.log).catch(console.error)
