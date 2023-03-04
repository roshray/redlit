import { Community } from "../../atoms/communitiesAtom";
import React, { useEffect, useState } from 'react';
import { firestore } from "../../firebase/clientApp";
import { query, collection, where, orderBy, getDocs } from "firebase/firestore";
import usePosts from "../../hooks/usePosts"
import { Post } from "../../atoms/postsAtom";

type PostsProps = {
    communityData: Community;
};

const Posts:React.FC<PostsProps> = ({ communityData}) => {

    const [loading, setLoading] = useState(false)
    const { postStateValue, setPostStateValue} = usePosts()

    const getPosts = async () => {
        try {
            // get post for this community
            const postQuery = query(collection(firestore, "posts"), 
            where("communityId", "==", communityData.id),
            orderBy("createdAt", "desc")
            )
            const postDocs = await getDocs(postQuery)
            const posts = postDocs.docs.map(doc => ({ id: doc.id, ...doc.data()}))
            setPostStateValue((prev) => ({
                ...prev,
                posts: posts as Post[],
            }))

            console.log("posts", posts)

        } catch (error: any) {
            console.log("getPosts error", error.message)
            
        }
    }

    useEffect(() => {
        getPosts()
    }, [])
    
    return <div>Posts</div>
}
export default Posts;