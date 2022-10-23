import type { NextPage } from 'next'
import Head from 'next/head'
import {auth, db, githubProvider} from "../firebase";
import {useEffect, useState} from "react";
import {Button} from "@mui/material";
import {FaGithub} from "react-icons/fa";
import {signInWithPopup, signOut, User} from "@firebase/auth";
import {collection, doc, query, setDoc} from "@firebase/firestore";
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import {useRouter} from "next/router";
import Lottie from "react-lottie-player";
import loadingAnimation from '../public/loadinganimation.json'
import {LeaderboardItem} from "../components/LeaderboardItem";
import {useAuthState} from "react-firebase-hooks/auth";
import {Octokit} from "octokit";
import {Item, PullRequestResponse, UserInfo} from "../public/user";

const Home: NextPage = () => {
    const router = useRouter()
    const [user] = useAuthState(auth);
    // @ts-ignore
    const [users] = useCollectionData<UserInfo>(query(collection(db,"Users")))
    const [itemList,setItemList] = useState<Item[]>([])
    const [loading,setLoading] = useState(false)
    // @ts-ignore
    const [currentUser] = useDocumentData<UserInfo>(doc(db,"Users",auth.currentUser?.uid || "lol"))

    const addUser = (user : User)=> {
        setDoc(doc(db,"Users",user.uid),{
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
            // @ts-ignore
            username: user.reloadUserInfo.screenName
        }).catch(error=> console.error(error))
    }

    const getPullRequests = async (users: UserInfo[])=> {
        console.log("boom boom")
        const octokit = new Octokit({auth: process.env.access_token})

        let leaderboard: Item[] = []
        let request = "GET /search/issues?per_page=100&q=type%3Apr+created:2022-10-01..2022-10-31"
        let repoNames = new Set<string>()
        let pullRequests = new Map<string,any[]>()

        for(let i = 0; i<users.length; i++) {
            request += `+author%3A${users[i].username}`
            // @ts-ignore
            pullRequests.set(users[i].username,[])
        }

        let response = await octokit.request(request)
        let prResponse: PullRequestResponse = response.data
        console.log(prResponse)

        prResponse.items.forEach((pr: any,i: number)=> {
            repoNames.add(pr.repository_url.replace("https://api.github.com/repos/",""))
        })

        // @ts-ignore
        let repoRequests = [...repoNames].map((value: string)=>{
            const [owner,repo] = value.split("/")
            return octokit.rest.repos.getAllTopics({owner, repo})
                .then(res => ({repoName: value, topics: res.data.names}))
        })

        let repoTopics = await Promise.all(repoRequests)
        let validRepos = new Set<string>()
        console.log(repoTopics)

        repoTopics.forEach((repo)=> {
            if(repo.topics.find((topic)=>{
                return topic.toLowerCase() === "hacktoberfest"
            })) {
                validRepos.add(repo.repoName)
            }
        })

        console.log(validRepos)

        prResponse.items.forEach((pr: any,i: number)=> {
            let username: string = pr.user.login
            let repo = pr.repository_url.replace("https://api.github.com/repos/","")

            if(validRepos.has(repo) && ((pr.state === "closed" && pr.pull_request.merged_at) || pr.labels.find((label: any)=> {
                return label.name.toLowerCase() === "hacktoberfest-accepted"
            })) ) {
                pullRequests.get(username)?.push(pr)
            }
        })

        pullRequests.forEach((prs,username) => {
            console.log(username,prs)
            leaderboard.push({
                // @ts-ignore
                user: users.find((user)=> {
                    return user.username === username
                }),
                pullRequests: prs
            })
        })

        console.log(leaderboard)
        leaderboard.sort((i1,i2)=> {
            return i2.pullRequests.length - i1.pullRequests.length
        })
        return leaderboard
    }

    useEffect(()=> {
        if(!users)
            return
        setLoading(true)
        getPullRequests(users)
            .then(leaderboard => setItemList(leaderboard))
            .catch(error=> {
                console.log('ono getting prs failed')
                console.error(error)
            })
            .finally(()=> setLoading(false))
    },[users])

    return (
        <div>
            <Head>
                <title>Leaderboard</title>
                <meta name="description" content="Let's do some stuff hehehehehehe" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ul className="flex justify-between p-3 bg-gray-100">
                        <li className="m-0">
                            <a className="inline-block text-2xl" href="#">Hacktoberfest Leaderboard</a>
                        </li>
                        <li className="mr-3">
                        {
                user ? (
                    <Button
                        className=''
                        onClick={()=> {
                            signOut(auth)
                                .catch(error => console.error(error))
                        }}>
                        {currentUser?.username || "Sadge"}
                    </Button>
                ) : (
                    <Button
                    className='bg-transparent text-xl hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
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
                        <span className='hidden sm:inline px-3'>Sign in</span>
                    </Button>
                )
            }
                        </li>
                </ul>

            <div className="w-[100%] text-center font-bold sm:text-[50px] text-[35px]">
                Leaderboard
            </div>
            {
                !loading ? (
                    <div>
                        {
                            itemList.length > 0 && itemList.map((item,i)=> {
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
