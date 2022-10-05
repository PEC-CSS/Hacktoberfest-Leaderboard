import {Item} from "../pages";
import {auth} from "../firebase";

export const LeaderboardItem = ({item,rank}: {item : Item,rank: number}) => {
    return (
        <div className={`cursor-pointer flex flex-row w-[100%] p-[20px] items-center ${auth.currentUser?.uid === item.user.uid ? "bg-amber-50" : ""} hover:shadow-lg duration-500`}
            >
            <div className="text-[30px] mr-[10px]">
                {rank}
            </div>
            <img src={item.user?.photoUrl || ""} alt="" className="w-[50px] h-[50px] rounded-[50%] mx-[10px]"/>
            <div className="flex-auto text-[25px] mx-[10px] font-bold">
                {item.user.displayName} <span className="text-[15px] font-normal">{item.user.username}</span>
            </div>
            <div className="mx-[10px] text-[30px]">
                {item.pullRequests.length}
            </div>
        </div>
    )
}