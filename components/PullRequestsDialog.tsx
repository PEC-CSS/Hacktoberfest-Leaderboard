import {PullRequest} from "../public/user";
import {Dialog, DialogContent, DialogTitle} from "@mui/material";

type PrDialogItem = {
    pullRequests: PullRequest[],
    open: boolean,
    onClose: ()=> void
}

export const PullRequestsDialog = ({pullRequests, open, onClose}: PrDialogItem) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Pull Requests
            </DialogTitle>
            <DialogContent>
                {
                    pullRequests.map((pr: PullRequest, i: number)=> {
                        return (
                            <div key={i}>{pr.title}</div>
                        )
                    })
                }
            </DialogContent>
        </Dialog>
    )
}