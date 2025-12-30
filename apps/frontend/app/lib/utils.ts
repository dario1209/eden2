import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCRO(amount: number) {
    return `$${amount.toFixed(2)} CRO`
}

export function reconnectWS(url: string) {
    let ws: WebSocket | null = null
    let reconnectAttempts = 0
    const maxReconnects = 5

    const connect = () => {
        ws = new WebSocket(url)

        ws.onopen = () => {
            reconnectAttempts = 0
            console.log('WebSocket connected')
        }

        ws.onclose = () => {
            if (reconnectAttempts < maxReconnects) {
                setTimeout(connect, 1000 * Math.pow(2, reconnectAttempts))
                reconnectAttempts++
            }
        }

        ws.onerror = (err) => console.error('WebSocket error:', err)
    }

    connect()

    return ws
}
