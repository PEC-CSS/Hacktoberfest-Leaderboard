import type { NextPage } from 'next'
import Head from 'next/head'
import {app, auth, db, githubProvider} from "../firebase";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Button} from "@mui/material";
import {FaGithub} from "react-icons/fa";
import {signInWithPopup, signOut, User} from "@firebase/auth";
import {collection, doc, getDoc, query, setDoc} from "@firebase/firestore";
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import {useRouter} from "next/router";
import axios from "axios";
import Lottie from "react-lottie-player";
import loadingAnimation from '../public/loadinganimation.json'
import {LeaderboardItem} from "../components/LeaderboardItem";
import {useAuthState} from "react-firebase-hooks/auth";

export type UserInfo = {
    uid: string,
    displayName: string,
    email: string,
    photoUrl?: string,
    username?: string
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

const Home: NextPage = () => {
    const router = useRouter()
    const [user] = useAuthState(auth);
    // @ts-ignore
    const [users] : [UserInfo[] | undefined] = useCollectionData(query(collection(db,"Users")))
    const [itemList,setItemList] : [Item[],any] = useState([])
    // @ts-ignore
    const [currentUser] : [UserInfo | undefined] = useDocumentData(doc(db,"Users",auth.currentUser?.uid || "lol"))

    const addUser = (user : User)=> {
        setDoc(doc(db,"Users",user.uid),{
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
            // @ts-ignore
            username: user.reloadUserInfo?.screenName
        }).catch(error=> console.error(error))
    }

    const getPullRequests = async (users: UserInfo[])=> {
        let leaderboard: Item[] = []
        for(let i = 0; i<users.length; i++) {
            let response = await axios({
                method : "GET",
                url: `https://api.github.com/search/issues?per_page=100&q=author:${users[i].username}+type:pr`,
                headers: {
                    "Authorization" : `token ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
                }
            })
            let prResponse: PullRequestResponse = response.data
            leaderboard.push({
                user: users[i],
                pullRequests: prResponse.items
            })
        }
        console.log(leaderboard)
        leaderboard.sort((i1,i2)=> {
            return i2.pullRequests.length - i1.pullRequests.length
        })
        return leaderboard
    }

    // useEffect(()=>{
    //     if(auth.currentUser)
    //         addUser(auth.currentUser!)
    // },[])

    useEffect(()=> {
        if(!users)
            return
        getPullRequests(users)
            .then(leaderboard => setItemList(leaderboard))
            .catch(error=> console.error(error))
    },[users])

    return (
        <div>
            <Head>
                <title>Leaderboard</title>
                <meta name="description" content="Let's do some stuff hehehehehehe" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {
                user ? (
                    <Button
                        onClick={()=> {
                            signOut(auth)
                                .catch(error => console.error(error))
                        }}>
                        {currentUser?.username || "Sadge"}
                    </Button>
                ) : (
                    <Button
                        onClick={()=>{
                            signInWithPopup(auth,githubProvider)
                                .then(result => {
                                    addUser(result.user)
                                })
                                .catch(error=> {
                                    console.error(error)
                                    console.log("sad")
                                })
                        }}>
                        <FaGithub/>
                        <span>Sign in</span>
                    </Button>
                )
            }
            <div className="w-[100%] text-center font-bold text-[50px]">
                Leaderboard
            </div>
            {
                itemList.length > 0 ? (
                    <div>
                        {
                            itemList.map((item,i)=> {
                                return <LeaderboardItem item={item} rank={i+1} key={i} />
                            })
                        }
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-[60px] m-auto h-[60vh]">
                        <Lottie
                            animationData = {loadingAnimation}
                            play
                            loop
                            className="h-[140px]"
                        />
                        <div className="font-bold text-[28px]">
                            Loading
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Home
