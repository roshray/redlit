import { Flex, Icon, MenuItem } from "@chakra-ui/react";
import CreateCommunityModal from "../../Modal/CreateCommunityModal/CreateCommunityModal"
import {GrAdd} from "react-icons/gr"
import { useState } from "react";

type CommunitiesProps = {
    
}

const Communities:React.FC<CommunitiesProps> = () => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <CreateCommunityModal open={open} handleClose={() => setOpen(false)}/>
            <MenuItem 
                width="100%" 
                fontSize="10pt"
                _hover={{ bg:"gray.100"}}
                onClick={() => setOpen(true)}
            >
                <Flex align="center">
                    <Icon  fontSize={20} mr={2} as={GrAdd}/>
                    Create a Community
                </Flex>
            </MenuItem>
        </>
    )
}
export default Communities;