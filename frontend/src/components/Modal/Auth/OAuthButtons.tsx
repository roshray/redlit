import React from 'react';
import { useSignInWithGoogle} from "react-firebase-hooks/auth"
import { Flex,Button,Image,Text } from '@chakra-ui/react';
import { auth} from "../../../firebase/clientApp"
import {FIREBASE_ERRORS} from "../../../firebase/errors"

const OAuthButtons:React.FC = () => {
    const [signInWithGoogle,user,loading,error] = useSignInWithGoogle(auth)
    return (
        <Flex direction="column" mb={4} width="100%">
            <Button 
                variant="oauth" 
                mb={2} 
                isLoading={loading} 
                onClick={() => signInWithGoogle()}
            >
                <Image 
                    src="/images/googlelogo.png"
                    height="20px"
                    mr={4}
                />
                Continue with Google
            </Button>
            {error && <Text textAlign="center" color="red" fontSize="10pt">{FIREBASE_ERRORS[error.message as keyof typeof FIREBASE_ERRORS]}
            </Text>}
        </Flex>
    )    
}
export default OAuthButtons;