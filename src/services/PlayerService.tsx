import { BACKEND_URL } from "../constants";
import axios from 'axios'


export const PlayerService = () => ({

    getAllPlayers: () => {
        return(axios.get(BACKEND_URL + "/players/" ))
    },

    getAllTeams: () => {
        return(axios.get(BACKEND_URL + "/teams/" ))
    },

    GetNonBidPlayers : (searchText:string) => {
        let url = '';
        if(searchText){
            url = BACKEND_URL + "/non_bid_players/" + searchText
        }else{
            url = BACKEND_URL + "/non_bid_players"
        }
        return(axios.get(url))
    },

    addPlayer : (params:any) => {
        return(axios.post(BACKEND_URL + "/players", params))
    },

    sellPlayer : (params:any)=>{
        return(axios.put(BACKEND_URL + "/players", params))
    },

    setUnsoldPlayer : (params:any)=>{
        return (axios.put(BACKEND_URL + "/players", params))
    },

    displayPlayer : (player:any)=>{
        return(axios.post(BACKEND_URL + "/player_display", player))
    },

    teamCall : (bidCallData :any)=>{
        return(axios.post(BACKEND_URL + "/team_call", bidCallData))
    },

    getSoldPlayers : () =>{
        return(axios.get(BACKEND_URL + "/sold_players"))
    }


});

export default PlayerService;