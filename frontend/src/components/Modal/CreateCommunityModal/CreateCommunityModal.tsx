import { 
    Button, 
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalCloseButton, 
    ModalBody, 
    ModalFooter,
    Text,
    Input,
    Box,
    Divider,
    Stack,
    Checkbox,
    Flex,
    Icon,
} from "@chakra-ui/react"

import { auth, firestore } from "../../../firebase/clientApp"
import { useState } from "react"
import { BsFillEaselFill, BsFillEyeFill, BsFillPersonFill } from "react-icons/bs"
import { HiLockClosed} from "react-icons/hi"
import { doc, getDoc, serverTimestamp, setDoc } from "@firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { runTransaction } from "firebase/firestore"
import { useRouter } from "next/router"
import useDirectory from "@/hooks/useDirectory"

type CreateCommunityModalProps = {
    open: boolean   
    handleClose: () => void
}

const CreateCommunityModal:React.FC<CreateCommunityModalProps> = ({open,handleClose}) => {
    const [user] = useAuthState(auth)
    
    const [communityName,setCommunityName] = useState("")
    const [charsRemaining,setCharsRemaining]  = useState(21)
    const [communityType,setCommunityType] = useState("public")
    const [error,setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router  = useRouter()
    const { toggleMenuOpen} = useDirectory()

    const handleChange= (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.value.length > 21) return
        setCommunityName(event.target.value)
        // recalculate how many chars left in the name
        setCharsRemaining(21 - event.target.value.length)
    }

    const onCommunityTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCommunityType(event.target.name)
    }

    const handleCreateCommunity = async () => {
        if (error) setError("")
        // validate the Community
       const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
       if (format.test(communityName) || communityName.length < 3) {
        setError("community names must be between 3-21 characters, and can only contain letters, numbers or underscore")
        return;
       }

       setLoading(true);
       try {        
        const communityDocRef = doc(firestore, "communities", communityName)

        await runTransaction(firestore, async (transaction) => {
                // check if community exits in db
            const communityDoc = await transaction.get(communityDocRef)

            if (communityDoc.exists()) {
                throw new Error(`Sorry, r/${communityName} is already taken.Try another.`)
            }
            // create a community!
            transaction.set(communityDocRef, {
                creatorId: user?.uid,
                createdAt: serverTimestamp(), 
                numberOfMembers: 1,
                privacyType: communityType, 
            })

            // create a communitySnippet on User!
            transaction.set(doc(firestore, `users/${user?.uid}/communitySnippet`,communityName), {
                communityId: communityName,
                isModerator: true,
            }
            )
        })
        handleClose() 
        toggleMenuOpen()
        router.push(`r/${communityName}`)
                
       } catch (error: any) {
        console.log("Handle community create error", error)
        setError(error.message) 
       }
    setLoading(false)
    }

    return (
        <>
            <Modal isOpen={open} onClose={handleClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                <ModalHeader 
                    display="flex" 
                    flexDirection="column" 
                    fontSize={15}
                    padding={3}
                >
                    Create a Community
                </ModalHeader>
                <Box pl={3} pr={3}>
                    <Divider />
                    <ModalCloseButton />
                    <ModalBody
                        display="flex" 
                        flexDirection="column"
                        padding="10px 0px"
                    >
                        <Text fontWeight={600} fontSize={15}>Name</Text>
                        <Text fontSize={11} color="gray.500">
                            Community names including capitalization cannot be changed
                        </Text>
                        <Text 
                            position="relative" 
                            top="28px" 
                            left="10px" 
                            width="20px" 
                            color="gray.400"
                        >
                            r/
                        </Text>
                        <Input
                            position="relative" 
                            value={communityName} 
                            size="sm" 
                            pl="22px" 
                            onChange={handleChange}
                        />
                        <Text fontSize="9pt" color={charsRemaining === 0 ? "red" : "gray.500"}
                        >
                            {charsRemaining} Characters remaining
                        </Text>
                        <Text fontSize="9pt" color="red" pt={1}>{error}</Text>
                        <Box mt={4} mb={4}>
                            <Text fontWeight={600} fontSize={12} mb={1}>
                                Community Type
                            </Text>
                            <Stack spacing={2}>
                                <Checkbox 
                                    name="public" 
                                    isChecked={communityType === "public"}
                                    onChange={onCommunityTypeChange}
                                >
                                   <Flex align="center">
                                        <Icon 
                                            as={BsFillPersonFill}
                                            color="gray.500"
                                            mr={2}
                                        />
                                        <Text fontSize="10pt" mr={1}>public</Text>
                                        <Text 
                                            fontSize="8pt" 
                                            color="gray.500" 
                                            pt={1}
                                        >
                                            Anyone can view, post, and comment to this community
                                        </Text>
                                    </Flex> 
                                </Checkbox>
                                <Checkbox 
                                    name="restricted"
                                    isChecked={communityType === "restricted"}
                                    onChange={onCommunityTypeChange}
                                >
                                   <Flex align="center">
                                        <Icon 
                                            as={BsFillEyeFill} 
                                            color="gray.500"
                                            mr={2}
                                        />
                                        <Text fontSize="10pt" mr={1}>restricted</Text>
                                        <Text 
                                            fontSize="8pt" 
                                            color="gray.500" 
                                            pt={1}
                                        >
                                            Anyone can view, but only approved users can post this community
                                        </Text>
                                    </Flex>
                                    
                                </Checkbox>
                                <Checkbox 
                                    name="private"
                                    isChecked={communityType === "private"}
                                    onChange={onCommunityTypeChange}
                                >
                                   <Flex align="center"> 
                                        <Icon 
                                            as={HiLockClosed} 
                                            color="gray.500"
                                            mr={2}
                                        />
                                        <Text fontSize="10pt" mr={1}>private</Text>
                                        <Text 
                                            fontSize="8pt" 
                                            color="gray.500" 
                                            pt={1}
                                        >
                                            Only approved user can view and submit to this community
                                        </Text>
                                    </Flex>
                                </Checkbox>
                            </Stack>
                        </Box>
                    </ModalBody>
                </Box>
                <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
                    <Button
                        variant="outline"
                        height="30px" 
                        mr={3} 
                        onClick={handleClose}
                    >
                        Cancel 
                    </Button>
                    <Button 
                        height="30px"
                        onClick={handleCreateCommunity}
                        isLoading={loading}
                    >
                        Create Community
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
  )    
}
export default CreateCommunityModal