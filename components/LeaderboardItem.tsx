import {auth} from "../firebase";
import {Item} from "../public/user";

export const LeaderboardItem = ({item,rank}: {item : Item,rank: number}) => {
    return (
        <div className={`cursor-pointer flex flex-row w-[100%] p-[20px] items-center ${auth.currentUser?.uid === item.user.uid ? "bg-amber-50" : ""} hover:shadow-lg duration-500`}
            >
            <div className="text-[20px] mr-[10px] sm:text-[30px]">
                {rank}
            </div>
            <img src={item.user?.photoUrl || ""} alt="" className=" sm:w-[50px] sm:h-[50px] w-[40px] h-[40px] rounded-[50%] mx-[10px]"/>
            <div className="flex-auto sm:text-[25px] text-[15px] mx-[10px] font-bold">
                {item.user.displayName} <div className="sm:inline text-[15px] font-normal">{item.user.username}</div>
            </div>
            <div className="sm:text-[30px] mx-[10px] text-[20px]">
                {item.pullRequests.length}
            </div>
        </div>
    )
}