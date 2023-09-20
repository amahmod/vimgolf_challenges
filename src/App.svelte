<script lang="ts">
    import challenges from './challenges.json'

    const completed_challenge_count = 0
</script>

<div
    class="container mx-auto my-10 border rounded overflow-x-auto shadow-md sm:rounded-lg">
    <div class="flex justify-between p-4">
        <div>
            <p>
                Total Challenges :
                <span class="font-bold">
                    {completed_challenge_count}
                </span>
                /
                <span class="font-bold">
                    {challenges.length}
                </span>
            </p>
        </div>
        <div>
            <input
                type="text"
                placeholder="Search..."
                class="px-2 py-0.5 rounded border outline-none hover:border-gray-400 transition duration-200" />
        </div>
    </div>
    <table class="w-full text-sm etxt-left text-gray-500 mt-4">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr class="text-left">
                <th class="px-6 py-2">Title</th>
                <th class="px-6 py-2">Active Golfers</th>
                <th class="px-6 py-2">Total Entries</th>
                <th class="px-6 py-2">Best Score</th>
                <th class="px-6 py-2">Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each challenges as item}
                <tr class="bg-white border-b">
                    <td class="px-6 py-4 font-bold">{item.title}</td>
                    <td class="px-6 py4">{item.active_golfers}</td>
                    <td class="px-6 py4">{item.total_entries}</td>
                    <td class="px-6 py4">{item.lowest_score}</td>
                    <td class="px-6 py4">
                        <div class="flex gap-2">
                            <button title="Mark as completed">
                                <svg
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
                            <a
                                href="https://www.vimgolf.com/challenges/{item.id}"
                                target="_blank"
                                class="inline-block">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 256 256"
                                    fill="currentColor"
                                    class="w-5 h-5 text-blue-500">
                                    <rect
                                        width="256"
                                        height="256"
                                        fill="none" /><path
                                        d="M131.88,192l-9.94,9.94a48,48,0,0,1-67.88-67.88L78.17,110A48,48,0,0,1,144,108"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="16" /><path
                                        d="M124.12,64l9.94-9.94a48,48,0,0,1,67.88,67.88l-24.11,24.11A48,48,0,0,1,112,148"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="16" />
                                </svg>
                            </a>
                        </div>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
