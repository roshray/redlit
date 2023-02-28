import { Community, CommunitySnippet, communityState } from "../atoms/communitiesAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useEffect, useState} from "react"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore} from "../firebase/clientApp"
import { collection, doc, getDocs, increment, writeBatch } from "firebase/firestore";
import { authModalState } from "@/atoms/authModalAtom";

const useCommunityData = () => {
    const [user] = useAuthState(auth)

    const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState)

    const setAuthModalState =  useSetRecoilState(authModalState)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const onJoinOrLeaveCommunity = (communityData: Community, isJoined:boolean) => {
        if(!user) {
            // open the model
            setAuthModalState({open: true, view: "login"})
            return
        }


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

        } catch (error: any) {
            console.log("getMySnippets", error)
            setError(error.message)
        }
        setLoading(false)
    }

    const joinCommunity  = async (communityData: Community) => {
        
        try {
            const batch =  writeBatch(firestore)

            const newSnippet: CommunitySnippet = {
                communityId: communityData.id,
                imageURL: communityData.imageURL || "",
            }

            batch.set(doc(firestore, `users/${user?.uid}/communitySnippet`, communityData.id), newSnippet)
            
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

        // batch write
            // creating a new community snippet
            // updating the numberOfMembers (1)

        // update recoil state - communityState.mySnippet
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