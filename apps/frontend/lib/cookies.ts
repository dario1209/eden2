import { cookies } from 'next/headers'

export interface TypedCookies {
    get(name: string): string | undefined
    getAll(): Record<string, string>
    has(name: string): boolean
}

export async function getCookies(): Promise<TypedCookies> {
    const cookieStore = await cookies()
    return {
        get: (name: string) => cookieStore.get(name)?.value,
        getAll: () => Object.fromEntries(
            Array.from(cookieStore.getAll().map(c => [c.name, c.value]))
        ),
        has: (name: string) => cookieStore.has(name),
    }
}

export async function getWalletAddress() {
    const cookies = await getCookies()
    return cookies.get('wallet') || null
}
