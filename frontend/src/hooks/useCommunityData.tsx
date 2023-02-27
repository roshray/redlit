import { Community, CommunitySnippet, communityState } from "../atoms/communitiesAtom";
import { useRecoilState } from "recoil";
import {useEffect, useState} from "react"
import { useAuthState } from "react-firebase-hooks/auth";
import {auth, firestore} from "../firebase/clientApp"
import { collection, getDocs } from "firebase/firestore";

const useCommunityData = () => {
    const [user] = useAuthState(auth)

    const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const onJoinOrLeaveCommunity = (communityData: Community, isJoined:boolean) => {
        // is user signed in ?
            // if not => open auth modal
        if(isJoined){
            leaveCommunity(communityData.id)
            return
        }
        joinCommunity(communityData)
    }

    const getMySnippets = async () => {
        setLoading(true)
        try {
            // get user snippets            
            const snippetDocs = await getDocs(
                collection(firestore, `users/${user?.uid}/communitySnippet`)
            )
            const snippets = snippetDocs.docs.map(doc => ({...doc.data()}))
            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: snippets as CommunitySnippet[],
            }))
            console.log("here are the snippets", snippets)

        } catch (error) {
            console.log("getMySnippets", error)
        }
        setLoading(false)
    }

    const joinCommunity  = (communityData: Community) => {}
    const leaveCommunity = (communityId: string) => {}

    useEffect(() => {
        if(!user) return
        getMySnippets()
    }, [user])

    return {
        // data and functions
        communityStateValue,
        onJoinOrLeaveCommunity,
        loading,
    }
}

export default useCommunityData;