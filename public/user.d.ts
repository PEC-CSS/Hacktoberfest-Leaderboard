export type UserInfo = {
    uid: string,
    displayName: string,
    email: string,
    photoUrl?: string,
    username: string
}

export type Item = {
    user: UserInfo,
    pullRequests : any[]
}

export type PullRequestResponse = {
    total_count: number,
    incomplete_results: boolean,
    items: any[]
}