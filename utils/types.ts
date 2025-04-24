export interface Incident {
    id: number
    created_at: string
    type: string
    description: string
    location: string
    status: string
    worker_id: number
}