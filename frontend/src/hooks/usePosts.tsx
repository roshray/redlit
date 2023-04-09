import { Post, postState, PostVote } from "../atoms/postsAtom";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { deleteObject, ref } from "firebase/storage";
import { firestore, storage } from "../firebase/clientApp";
import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/clientApp";
import { communityState } from "../atoms/communitiesAtom";
import { authModalState } from "../atoms/authModalAtom";
import { useRouter } from "next/router";

const usePosts = () => {
    const [user] = useAuthState(auth)
    const router = useRouter()
    const [postStateValue, setPostStateValue] = useRecoilState(postState)
    const currentCommunity = useRecoilValue(communityState).currentCommunity
    const setAuthModalState = useSetRecoilState(authModalState)
    
    const onVote = async (
        event: React.MouseEvent<SVGElement, MouseEvent>,
        post: Post, 
        vote: number, 
        communityId: string
    ) => {
        event.stopPropagation()
     // check for a user =>  if no user => open auth modal
     if(!user?.uid) {
        setAuthModalState({ open: true, view: "login"})
        return
     } 
        try {
            const { voteStatus} = post
            const existingVote = postStateValue.postVotes.find(
                (vote) => vote.postId === post.id
            )
  
        const batch = writeBatch(firestore)
        const updatedPost = {...post}
        const updatedPosts = [...postStateValue.posts]
        let updatedPostVotes = [...postStateValue.postVotes]
        let voteChange = vote
        
        // new Vote
        if(!existingVote) {
           
           // create a new postVote document
           const postVoteRef = doc(
            collection(firestore, 'users', `${user?.uid}/postVotes`)
            )

            const newVote: PostVote = {
                id: postVoteRef.id,
                postId: post.id!,
                communityId,
                voteValue: vote, // 1 or -1
            }

            batch.set(postVoteRef, newVote) 
            // add/substract 1 to/from post.votesStatus
            updatedPost.voteStatus = voteStatus + vote
            updatedPostVotes = [...updatedPostVotes, newVote]
        }
        // Existing Vote - they have voted post before
        else {
            const postVoteRef = doc(
                firestore,
                "users",  
                `${user?.uid}/postVotes/${existingVote.id}`
                )
            // removing the Vote (upvote => neutral or downvote => neutral)
            if(existingVote.voteValue === vote){
                // add/substract to/from post.voteStatus
                updatedPost.voteStatus = voteStatus - vote
                updatedPostVotes = updatedPostVotes.filter(
                    (vote) => vote.id !== existingVote.id
                    )

                // delete the postVote Document
                batch.delete(postVoteRef)
                voteChange += -1

            }
            // Flipping the Vote (up => down or down => up)

            else {
                // add/substract 2 to/from post.voteStatus why 2 ?
                updatedPost.voteStatus = voteStatus + 2 + vote

                const voteIdx = postStateValue.postVotes.findIndex(
                    (vote) => vote.id === existingVote.id
                )

                updatedPostVotes[voteIdx] = {
                    ...existingVote,
                    voteValue: vote,
                }

               // updating the existing postVotes document 
               batch.update(postVoteRef, {
                voteValue: vote,
               })
               voteChange = 2 + vote
            }
        }

        // update state with updated values
        const postIdx = postStateValue.posts.findIndex(
            (item) => item.id === post.id
        )
        updatedPosts[postIdx] = updatedPost
        setPostStateValue((prev) => ({
            ...prev,
            posts: updatedPosts,
            postVotes: updatedPostVotes,
        }))

        if(postStateValue.selectedPost) {
            setPostStateValue((prev) => ({
                ...prev,
                selectedPost: updatedPost,
            }))
        }

        // update our post documents
        const postRef = doc(firestore, "posts", post.id)
        batch.update(postRef,{
            voteStatus: voteStatus + voteChange
        })
        await batch.commit()
   
        } catch (error) {
            console.log("onVote error", error)
    }  
}      
    const onSelectPost = (post: Post) => {
        setPostStateValue((prev) => ({
            ...prev,
            selectedPost: post,
        }))
        router.push(`/r/${post.communityId}/comments/${post.id}`)          
    }

    const onDeletePost = async (post: Post): Promise<boolean> => {        
        console.log("Deleting Post", post.id);
        
        try {
            // check if there is Image,delete if it exists
            if(post.imageURL) {
                const imageRef = ref(storage, `posts/${post.id}/image`)
                await deleteObject(imageRef)
            }

            // delete the post documents from the firestore
            const postDocRef = doc(firestore, "posts", post.id)
            await deleteDoc(postDocRef)
            
            console.log(deleteDoc)
            
            // update recoil state
            setPostStateValue((prev) => ({
                ...prev,
                posts: prev.posts.filter(
                    (item) => item.id !== post.id),
                }))
            return true
        } catch (error) {

         return false   
        }
    }

    const getCommunityPostVotes = async (communityId: string) => {
        const postVotesQuery = query(collection(firestore, "users", `${user?.uid}/postVotes`), where("communityId", "==",communityId)
        )

        const postVoteDocs = await getDocs(postVotesQuery)
        const postVotes = postVoteDocs.docs.map( (doc) => ({ 
            id: doc.id, 
            ...doc.data(),
        }))
        setPostStateValue(prev => ({
            ...prev,
            postVotes: postVotes as PostVote[],
        }))
    }

    useEffect(() => {
        if(!user || !currentCommunity?.id) return
        getCommunityPostVotes(currentCommunity?.id)

    }, [user,currentCommunity]);

    useEffect(() => {
        if(!user){
            // clear users post votes
            setPostStateValue((prev) => ({
                ...prev,
                postVotes: [],
            }))
        }
    }, [!user])
    
    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost,
        onDeletePost,
    }
}
export default usePosts;


