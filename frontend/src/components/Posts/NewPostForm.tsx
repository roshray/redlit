import { Alert, AlertDescription, AlertIcon, Text, Flex, Icon } from "@chakra-ui/react"
import { BsLink45Deg, BsMic} from "react-icons/bs"
import { IoDocumentText, IoImageOutline } from "react-icons/io5"
import { AiFillCloseCircle} from "react-icons/ai"
import { BiPoll} from "react-icons/bi" 
import TabItem from "./TabItem"
import { useState } from "react"
import TextInputs from "./PostForm/TextInputs"
import ImageUpload from "./PostForm/ImageUpload"
import { Post } from "../../atoms/postsAtom"
import { User } from "firebase/auth"
import { useRouter } from "next/router"
import { addDoc, collection, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadString } from "firebase/storage"

import { firestore, storage } from "../../firebase/clientApp"
import useSelectFile from "../../hooks/useSelectFile"

type NewPostFormProps = {
    user: User;
    communityImageURL?: string;
}

const formTabs: TabItems[] = [
    {
        title: "Post",
        icon: IoDocumentText,
    },
    {
        title: "Images & Videos",
        icon: IoImageOutline,
    },
    {
        title: "Link",
        icon: BsLink45Deg,
    },
    {
        title: "Poll",
        icon: BiPoll,
    },
    {
        title: "Talk",
        icon: BsMic,
    },
]

export type TabItems = {
    title: string;
    icon: typeof Icon.arguments;
}
const NewPostForm:React.FC<NewPostFormProps> = ({ user, communityImageURL}) => {
    const router = useRouter()
    const [selectedTab, setSelectedTab] = useState(formTabs[0].title)
    const [textInputs, setTextInputs] = useState({
        title: "",
        body: "",
    })    

    //const [selectedFile, setSelectedFile] = useState<string>()
    const { selectedFile, setSelectedFile, onSelectFile} = useSelectFile()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const handleCreatePost = async () => {
        const { communityId} = router.query
        // create new post object => Type Post
        const newPost:Post = {
            communityId: communityId as string,
            communityImageURL: communityImageURL || "",
            creatorId: user.uid,
            creatorDisplayName: user.email!.split("@")[0],
            title: textInputs.title,
            body: textInputs.body,
            numberOfComments: 0,
            voteStatus: 0,
            createdAt: serverTimestamp() as Timestamp,
            id: "",
            imageURL: "",
        }
        setLoading(true)
        try {
         // store the post in db    
         const postDocRef = await addDoc(collection(firestore,"posts"), newPost)
        // check for selectedFile
        if (selectedFile) {
          // store in storage => getDownloadURL (return imageURL)
            const imageRef = ref(storage, `posts/${postDocRef.id}/image`)
            await uploadString(imageRef, selectedFile, "data_url")
            const downloadURL = await getDownloadURL(imageRef)
             // update post doc by adding imageURL

            await updateDoc(postDocRef, {
                imageURL: downloadURL,
            })
        }

        // redirect the user back to the communityPage using the router
        router.back()

        } catch (error: any) {
            console.log("handleCreatePost", error.message)
            setError(true) 
        }
        setLoading(false)
    }
    
    /* const onSelectImage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const reader =  new FileReader();

        if (event.target.files?.[0]) {
            reader.readAsDataURL(event.target.files[0])
        }

        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                setSelectedFile(readerEvent.target.result as string)
            }
        }
    } */
    
    const onTextChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {
            target: { name,value},
        } = event;
        setTextInputs((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    return (
        <Flex
            direction="column"
            bg="white"
            borderRadius={4}
            mt={2}
        >
            <Flex width="100%">
                {formTabs.map((item)=> (
                    <TabItem
                        key={item.title} 
                        item={item} 
                        selected={item.title === selectedTab} 
                        setSelectedTab={setSelectedTab}  
                    />
                ))}
            </Flex>
            <Flex p={4}>
                {selectedTab === "Post" && (
                    <TextInputs 
                        textInputs={textInputs}
                        handleCreatePost={handleCreatePost}
                        onChange={onTextChange}
                        loading={loading}
                    />
                )}
                {selectedTab === "Images & Videos" && 
                    <ImageUpload 
                        selectedFile={selectedFile}
                        onSelectImage={onSelectFile}
                        setSelectedTab={setSelectedTab}
                        setSelectedFile={setSelectedFile}   
                    />
                }
            </Flex>
            {error && (
                <Alert status="error">
                    <AlertIcon />
                    <Text>Error creating post!</Text>
                </Alert>
            )}
        </Flex>
    )
}
export default NewPostForm