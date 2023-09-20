export function debounce<T extends (...args: unknown[]) => void>(
    callback: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null

    return (...args: Parameters<T>): void => {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        timeoutId = setTimeout(() => {
            callback(...args)
            timeoutId = null
        }, delay)
    }
}

export async function get_local_data<T>(key: string) {
    return localStorage.getItem(key) as unknown as T
}

export async function set_local_data(key: string, value: unknown) {
    return localStorage.setItem(key, JSON.stringify(value))
}
