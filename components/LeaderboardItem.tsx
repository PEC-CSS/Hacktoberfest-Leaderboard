import {Item} from "../pages";
import {auth} from "../firebase";

export const LeaderboardItem = ({item}: {item : Item}) => {
    return (
        <div className={`flex flex-row w-[100%] p-[20px] items-center justify-evenly ${auth.currentUser?.uid === item.user.uid ? "bg-amber-50" : ""}`}>
            <img src={item.user?.photoUrl || ""} className="w-[50px] h-[50px] rounded-[50%]"/>
            <div>
                {item.user.displayName}
            </div>
            <div>
                {item.pullRequests.length}
            </div>
        </div>
    )
}