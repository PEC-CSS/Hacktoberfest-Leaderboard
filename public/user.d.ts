export type UserInfo = {
    uid: string,
    displayName: string,
    email: string,
    photoUrl?: string,
    username: string
}

export type Item = {
    user: UserInfo,
    pullRequests : PullRequest[]
}

export type PullRequestResponse = {
    total_count: number,
    incomplete_results: boolean,
    items: PullRequest[]
}

export type PullRequest = {
    repository_url: string,
    html_url: string,
    id: number,
    number: number,
    title: string,
    user: {
        login: string
    }
    labels: any[],
    state: string,
    locked: boolean,
    comments: number,
    created_at: string,
    updated_at: string,
    closed_at: string,
    draft: boolean,
    pull_request: {
        merged_at: string
    },
    body: string,
    reactions: any,
    score: number
}