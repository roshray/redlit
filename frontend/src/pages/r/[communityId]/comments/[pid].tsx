import PageContent from '../../../../components/Layout/PageContent';
import React from 'react';
import PostItem from '../../../../components/Posts/PostItem';
import usePosts from '../../../../hooks/usePosts'
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth} from "../../../../firebase/clientApp"

const PostPage = () => {
    const [user] = useAuthState(auth)
    const { postStateValue, setPostStateValue,onDeletePost,onVote} = usePosts()
    
    return (
        <PageContent>
            <>
                {/* SelectedPost */}
                {postStateValue.selectedPost && <PostItem 
                    post={postStateValue.selectedPost}
                    onVote={onVote}
                    onDeletePost={onDeletePost}
                    userVoteValue={postStateValue.postVotes.find(
                        (item) => item.postId === postStateValue.selectedPost?.id)?.voteValue
                    }
                    userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
                />}
               {/*  Comments */}
            
            </>
            <>
                {/* About */}
            </>
        </PageContent>
    )
}
export default PostPage;