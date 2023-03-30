import { Community, CommunitySnippet, communityState } from "../atoms/communitiesAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useEffect, useState} from "react"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore} from "../firebase/clientApp"
import { collection, doc, getDoc, getDocs, increment, writeBatch } from "firebase/firestore";
import { authModalState } from "@/atoms/authModalAtom";
import { useRouter } from "next/router";

const useCommunityData = () => {
    const [user] = useAuthState(auth)
    const router = useRouter()

    const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState)

    const setAuthModalState =  useSetRecoilState(authModalState)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const onJoinOrLeaveCommunity = (communityData: Community, isJoined:boolean) => {
        // is user signed in ?
        if(!user) {
            // open the auth model
            setAuthModalState({open: true, view: "login"})
            return
        }

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

        } catch (error: any) {
            console.log("getMySnippets", error)
            setError(error.message)
        }
        setLoading(false)
    }

    const joinCommunity  = async (communityData: Community) => {
        
        try {
            // batch write
            const batch =  writeBatch(firestore)

            // creating a new community snippet
            const newSnippet: CommunitySnippet = {
                communityId: communityData.id,
                imageURL: communityData.imageURL || "",
                isModerator: user?.uid === communityData.creatorId,
            }

            batch.set(doc(firestore, `users/${user?.uid}/communitySnippet`, communityData.id), newSnippet)
             // updating the numberOfMembers (1)
            batch.update(doc(firestore, "communities", communityData.id), {
                numberOfMembers: increment(1),
            })

             await batch.commit()

            // update recoil state communityState.mySnippets
            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: [...prev.mySnippets, newSnippet],
            }))

        } catch (error: any) {
            console.log("joinCommunity error", error)
            setError(error.message)
        }

        setLoading(false)
    }
    const leaveCommunity = async (communityId: string) => {
        
        // batch write
            // deleting the community snippet from user
        
        try {
            const batch = writeBatch(firestore)
            // delete the community snippet from user
            batch.delete(doc(firestore, `users/${user?.uid}/communitySnippet`, communityId))

            // updating the numberOfMembers (-1)
            batch.update(doc(firestore, "communities", communityId), {
                numberOfMembers: increment(-1),
            })

            await batch.commit()
             // update recoil state - communityState.mySnippet
            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: prev.mySnippets.filter(
                    (item) => item.communityId !== communityId)
            }))

        } catch (error: any) {
            console.log("leavecommunity error", error.message)            
            setError(error.message)
        }
        setLoading(false)
    }

    const getCommunityData =  async (communityId: string) => {
        try {
           const communityDocRef = doc(firestore,"communities", communityId)
           const communityDoc = await getDoc(communityDocRef)
           
           setCommunityStateValue((prev) => ({
            ...prev,
            currentCommunity: { 
                id: communityDoc.id, 
                ...communityDoc.data()
            } as Community,
           }))
        } catch (error) {
            console.log("getCommunityData", error);
        }
    }

    useEffect(() => {
        if(!user) {
            setCommunityStateValue((prev) => ({
                ...prev,
                mySnippets: [],
            }))
            return
        }
        getMySnippets()
    }, [user])

    useEffect(() => {
        const { communityId} = router.query

        if(communityId && !communityStateValue.currentCommunity) {
            getCommunityData(communityId as string)
        }

    }, [router.query, communityStateValue.currentCommunity])

    return {
        // data and functions
        communityStateValue,
        onJoinOrLeaveCommunity,
        loading,
    }
}

export default useCommunityData;