import { Flex, Icon } from "@chakra-ui/react"
import { BsLink45Deg, BsMic} from "react-icons/bs"
import { IoDocumentText, IoImageOutline } from "react-icons/io5"
import { AiFillCloseCircle} from "react-icons/ai"
import { BiPoll} from "react-icons/bi" 
import TabItem from "./TabItem"
import { useState } from "react"


type NewPostFormProps = {}

const formTabs = [
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
    return (
        <Flex
            direction="column"
            bg="white"
            borderRadius={4}
            mt={2}
        >
            <Flex width="100%">
                {formTabs.map((item)=> (
                    <TabItem item={item} selected={item.title === selectedTab} setSelectedTab={setSelectedTab}  />
                ))}
            </Flex>
        </Flex>
    )
}
export default NewPostForm