import React from 'react';
import { Flex, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';
import { SearchIcon, CheckIcon } from '@chakra-ui/icons';

type SearchInputProps = {
    
};

const SearchInput:React.FC<SearchInputProps> = () => {
    
    return (
        <Flex flexGrow={1} mr={2} align="center">
            <InputGroup>
                <InputLeftElement
                    pointerEvents='none'
                    children={<SearchIcon color='gray.400' mb={1}/>}
                />
                <Input 
                    placeholder='search reddit' 
                    fontSize='10pt'
                    _placeholder={{ color: 'gray.500'}}
                    _hover={{
                        bg: 'white',
                        border: '1px solid',
                        borderColor: 'blue.500',
                    }}
                    _focus={{
                        outline: 'none',
                        border: '1px solid',
                        borderColor: 'blue.500',
                    }}
                    height="34px"
                    bg="gray.50"
                />
            </InputGroup>    
        </Flex>
    )
}
export default SearchInput;