import { Flex, Icon } from "@chakra-ui/react"
import { BsLink45Deg, BsMic} from "react-icons/bs"
import { IoDocumentText, IoImageOutline } from "react-icons/io5"
import { AiFillCloseCircle} from "react-icons/ai"
import { BiPoll} from "react-icons/bi" 
import TabItem from "./TabItem"
import { useState } from "react"
import TextInputs from "./PostForm/TextInputs"
import ImageUpload from "./PostForm/ImageUpload"


type NewPostFormProps = {}

const formTabs: TabItem[] = [
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

export type TabItem = {
    title: string;
    icon: typeof Icon.arguments;
}
const NewPostForm:React.FC = () => {
    const [selectedTab, setSelectedTab] = useState(formTabs[0].title)
    const [textInputs, setTextInputs] = useState({
        title: "",
        body: "",
    })    

    const [selectedFile, setSelectedFile] = useState<string>()
    const [loading, setLoading] = useState(false)
    const handleCreatePost = async () => {}
    
    const onSelectedImage= () => {}
    
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
                {selectedTab === "Images & Videos" && <ImageUpload/>}
            </Flex>
        </Flex>
    )
}
export default NewPostForm