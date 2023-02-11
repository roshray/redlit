import React from 'react';

import { Flex,Button,Image } from '@chakra-ui/react';

const OAuthButtons:React.FC = () => {
    return (
        <Flex direction="column" mb={4} width="100%">
            <Button variant="oauth" mb={2}>
                <Image 
                    src="/images/googlelogo.png"
                    height="20px"
                    mr={4}
                />
                Continue with Google
            </Button>
        </Flex>
    )    
}
export default OAuthButtons;