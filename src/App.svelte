<script lang="ts">
    import { onMount } from 'svelte'

    import challenges from './challenges.json'
    import { debounce, get_local_data, set_local_data } from './lib/util'

    type CompletedChallengeItem = {
        id: string
        completed_at?: number
    }

    type Challenge = (typeof challenges)[number] & CompletedChallengeItem

    let completed_challenge_count = 0
    let search_term = ''
    let sort_direction = 'asc' // asc, desc
    let sorted_column = ''

    let filtered_challenges = challenges as Challenge[]

    let completed_challenge_items: CompletedChallengeItem[] = []

    function filter_challenges() {
        let temp = challenges

        if (search_term?.trim()?.length) {
            temp = temp.filter(challenge =>
                challenge.title
                    .toLowerCase()
                    .includes(search_term.toLowerCase())
            )
        }

        if (sorted_column) {
            temp.sort((a, b) => {
                const val_a = a[sorted_column as keyof typeof a] as number
                const val_b = b[sorted_column as keyof typeof b] as number

                if (val_a < val_b) return sort_direction === 'asc' ? -1 : 1
                if (val_a > val_b) return sort_direction === 'asc' ? 1 : -1

                return 0
            })
        }

        filtered_challenges = temp
    }

    function sort_challenges(column: string) {
        if (sorted_column === column) {
            sort_direction = sort_direction === 'asc' ? 'desc' : 'asc'
        } else {
            sorted_column = column
            sort_direction = 'asc'
        }

        filter_challenges()
    }

    const search_challenges = debounce(filter_challenges, 500)

    async function toggle_complete_status(
        challenge_id: string,
        is_completed: boolean
    ) {
        const index = completed_challenge_items.findIndex(
            item => item.id === challenge_id
        )

        // update completed list
        if (!is_completed) {
            completed_challenge_items.splice(index, 1)
            completed_challenge_count -= 1
        } else {
            completed_challenge_items = [
                ...completed_challenge_items,
                {
                    id: challenge_id,
                    completed_at: Date.now()
                }
            ]
            completed_challenge_count += 1
        }

        // update filtered list
        filtered_challenges = filtered_challenges.map(challenge => {
            const item = challenge

            if (item.id === challenge_id) {
                item.completed_at = is_completed ? Date.now() : undefined
            }

            return item
        })

        await set_local_data('completed_challenges', completed_challenge_items)
    }

    onMount(async () => {
        try {
            completed_challenge_items = JSON.parse(
                await get_local_data('completed_challenges')
            ) as CompletedChallengeItem[]
        } catch (e) {
            completed_challenge_items = []
        }

        completed_challenge_count = completed_challenge_items.length

        filtered_challenges = filtered_challenges.map(challenge => {
            const completed_at = completed_challenge_items.find(
                item => item.id === challenge.id
            )?.completed_at
            return completed_at ? { ...challenge, completed_at } : challenge
        })
    })
</script>

<div
    class="container mx-auto my-10 border rounded overflow-x-auto shadow-md sm:rounded-lg">
    <div class="flex justify-between p-4">
        <div>
            <p>
                Total Challenges :
                <span class="font-bold text-green-500">
                    {completed_challenge_count}
                </span>
                /
                <span class="font-bold text-gray-600">
                    {challenges.length}
                </span>
            </p>
        </div>
        <div>
            <input
                bind:value={search_term}
                on:input={search_challenges}
                type="text"
                placeholder="Search..."
                class="px-2 py-0.5 rounded border outline-none hover:border-gray-400 transition duration-200" />
        </div>
    </div>
    <table class="w-full text-sm etxt-left text-gray-500 mt-4">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b-2">
            <tr class="text-left">
                <th class="px-6 py-2">Title</th>
                <th class="px-6 py-2">
                    <div class="flex items-center">
                        Active Golfers
                        <a
                            href="#/"
                            on:click|preventDefault={() =>
                                sort_challenges('active_golfers')}>
                            <svg
                                class="w-3 h-3 ml-1.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                            </svg>
                        </a>
                    </div>
                </th>
                <th class="px-6 py-2">
                    <div class="flex items-center">
                        Total Entries
                        <a
                            href="#/"
                            on:click|preventDefault={() =>
                                sort_challenges('total_entries')}>
                            <svg
                                class="w-3 h-3 ml-1.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                            </svg>
                        </a>
                    </div>
                </th>
                <th class="px-6 py-2">
                    <div class="flex items-center">
                        Best Score

                        <a
                            href="#/"
                            on:click|preventDefault={() =>
                                sort_challenges('lowest_score')}>
                            <svg
                                class="w-3 h-3 ml-1.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                            </svg>
                        </a>
                    </div>
                </th>
                <th class="px-6 py-2">Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each filtered_challenges as item}
                <tr
                    class="bg-white border-b"
                    class:completed={item.completed_at}>
                    <td class="px-6 py-4 font-bold">
                        <a
                            class="hover:underline hover:underline-offset-2 decoration-wavy decoration-blue-400"
                            href="https://www.vimgolf.com/challenges/{item.id}"
                            target="_blank">
                            {item.title}
                        </a>
                    </td>
                    <td class="px-6 py4">{item.active_golfers}</td>
                    <td class="px-6 py4">{item.total_entries}</td>
                    <td class="px-6 py4">{item.lowest_score}</td>
                    <td class="px-6 py4">
                        <div class="flex gap-2">
                            <button
                                title="Toggle complete status"
                                on:click={() =>
                                    toggle_complete_status(
                                        item.id,
                                        !item.completed_at
                                    )}>
                                <svg
                                    class:completed={item?.completed_at}
                                    class="w-5 h-5"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 256 256"
                                    ><rect
                                        width="256"
                                        height="256"
                                        fill="none" /><path
                                        d="M54.46,201.54c-9.2-9.2-3.1-28.53-7.78-39.85C41.82,150,24,140.5,24,128s17.82-22,22.68-33.69C51.36,83,45.26,63.66,54.46,54.46S83,51.36,94.31,46.68C106.05,41.82,115.5,24,128,24S150,41.82,161.69,46.68c11.32,4.68,30.65-1.42,39.85,7.78s3.1,28.53,7.78,39.85C214.18,106.05,232,115.5,232,128S214.18,150,209.32,161.69c-4.68,11.32,1.42,30.65-7.78,39.85s-28.53,3.1-39.85,7.78C150,214.18,140.5,232,128,232s-22-17.82-33.69-22.68C83,204.64,63.66,210.74,54.46,201.54Z"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="16" /><polyline
                                        points="88 136 112 160 168 104"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="16" /></svg>
                            </button>
                            <button title="vimgolf put {item.id}">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 256 256"
                                    fill="currentColor"
                                    class="w-5 h-5"
                                    ><rect
                                        width="256"
                                        height="256"
                                        fill="none" /><polyline
                                        points="168 168 216 168 216 40 88 40 88 88"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="16" /><rect
                                        x="40"
                                        y="88"
                                        width="128"
                                        height="128"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="16" /></svg>
                            </button>
                        </div>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style lang="postcss">
    button .completed {
        @apply text-green-900;
    }
    tr.completed {
        @apply bg-green-50;
    }
</style>
