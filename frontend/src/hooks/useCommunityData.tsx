import { Community, communityState } from "../atoms/communitiesAtom";
import { useRecoilState } from "recoil";

const useCommunityData = () => {
    const [communityStateValue, setCommunityValue] = useRecoilState(communityState)

    const onJoinOrLeaveCommunity = (communityData: Community, isJoined:boolean) => {
        // is user signed in ?
            // if not => open auth modal
        if(isJoined){
            leaveCommunity(communityData.id)
            return
        }
        joinCommunity(communityData)
    }

    const joinCommunity  = (communityData: Community) => {}
    const leaveCommunity = (communityId: string) => {}

    return {
        // data and functions
        communityStateValue,
        onJoinOrLeaveCommunity,
    }
}

export default useCommunityData;