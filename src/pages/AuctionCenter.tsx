import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlayerService from "../services/PlayerService";
import { io, Socket } from "socket.io-client";
import { BACKEND_URL, TOTAL_PLAYER } from "../constants";
import pallorImage from "../assets/pallor.jpeg";
import playerSvg from '../assets/account-icon.png'
import battingSvg from '../assets/batter.png'
import ballingSvg from '../assets/tennisBall.jpg'
import logo from "../assets/ppl.png";
import 'reactjs-popup/dist/index.css';
import congratsJif from '../assets/congratulations.gif';
import clapJif from '../assets/clap.gif'
import no5 from '../assets/n05-icon.jpeg'
import Loader from "react-js-loader";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const AuctionCenter: React.FC = () => {
  
  const navigate = useNavigate();
  const baseAmount = 500;
  const [allTeams, setAllTeams] = useState<any>([]);
  const [bidFlow, setBidFlow] = useState<any>([]);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [currentBidTeam, setCurrentBidTeam] = useState<any>({});
  const [players, setPlayers] = useState<any>([]);
  const [currentBidPlayer, setCurrentBidPlayer] = useState<any>({});
  const [searchText, setSearchText] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [popUpContent, setPopUpContent] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setBidFlow([]);
    setBidAmount(0);
    setCurrentBidTeam({})
    GetAllTeams();
    GetPlayer();
  }, []);

  const GetPlayer = () => {
    console.log("searchText== ", searchText);
    setCurrentBidPlayer({});
    setPlayers([]);
    setBidFlow([]);
    setCurrentBidTeam({})
    setBidAmount(0)
    setIsLoading(true)
    PlayerService()
      .GetNonBidPlayers(searchText)
      .then((response: any) => {
        let players = response?.data;
        if(players.length === 1){
          setCurrentBidPlayer(players[0]);
          setIsLoading(false);
        }else{
          setPlayers(players);
          selectRandomPlayer();
        }
      });
  };

  const selectRandomPlayer = () => {
    const random = Math.floor(Math.random() * players.length);
    console.log(random, players[random]);
    setCurrentBidPlayer(players[random]);
    console.log("currentBidPlayer== ", players[random]);
    PlayerService().displayPlayer(players[random]).then((response:any) => {
      console.log("response== ", response);
    })
    setIsLoading(false);
  };

  const GetAllTeams = () => {
    try {
      PlayerService()
        .getAllTeams()
        .then((response: any) => {
          setAllTeams(response?.data);
        });
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("value=== ", value);
    setSearchText(value);
  };

  const cardClick = (team: any, index: number) => {
    // setCurrentBidTeam(team);
    console.log("bidFlow.value== ", bidFlow);
    if (bidFlow.length === 0) {
      let flow = [];
      let amount = bidAmount + baseAmount;
      if(amount > team.max_bid_amount){
        toast.error('Bid amount larger than max amount')
      }else{
        setCurrentBidTeam(team);
        console.log("amount== ", amount);
        setBidAmount(amount);
        flow.push({ id: team.id, team_name: team.team_name, amount: amount });
        console.log("flow== ", flow);
        InvokeTeamCall(flow[flow.length-1])
        setBidFlow(flow);
        console.log("bidFlow== ", bidFlow);
      }
    }
    if (bidFlow && bidFlow.length && bidFlow.length > 0) {
      if (bidFlow[bidFlow.length - 1].id !== team.id) {
        let amount = bidAmount + baseAmount;
        if(amount > team.max_bid_amount){
          toast.error('Bid amount larger than max amount')
        }else{
          setCurrentBidTeam(team);
          setBidAmount(amount);
          let flow = bidFlow;
          flow.push({
            id: team.id,
            team_name: team.team_name,
            amount: amount,
          });
          InvokeTeamCall(flow[flow.length-1])
          setBidFlow(flow);
          console.log("bidFlow== ", bidFlow);
        }
      }
    }
    
  };


  const InvokeTeamCall = (teamcallData:any) =>{
    PlayerService().teamCall(teamcallData).then((response:any)=>{

    })
  }

  const handleBidBack = () =>{
    let flow = bidFlow;
    flow.pop();
    console.log("flow=== ", flow);
    setBidFlow(flow);
    console.log("bidfloww== ", bidFlow);
    if(bidFlow && bidFlow.length>0){
      let currentTeam = bidFlow[bidFlow.length-1];
      console.log("currentTeam== ", currentTeam);
      setCurrentBidTeam(currentTeam);
      setBidAmount(currentTeam.amount)
    }
    if(bidFlow.length === 0){
      let currentTeam = {};
      setCurrentBidTeam(currentTeam);
      setBidAmount(0);
    }
  }

  const setUnsoldPlayer = () =>{
    setIsLoading(true);
    let params = {
      id: currentBidPlayer.id,
      un_sold : true
    }

    PlayerService().setUnsoldPlayer(params).then((response:any)=>{
      console.log("response== ", response.data);
      GetPlayer();
    })
  }

  const sellPlayer = () => {
    setIsLoading(true);
    if(currentBidTeam && currentBidTeam.id){
      let params = {
        id: currentBidPlayer.id,
        team_id: currentBidTeam.id,
        bid_amount: bidAmount,
        team_name:currentBidTeam.team_name,
        player_name: currentBidPlayer.fullname
      };
      console.log("params== ", params);


      PlayerService().sellPlayer(params).then((response:any)=>{
          console.log("response.data==",response.data);
          GetPlayer();
          GetAllTeams();
          setBidFlow([]);
          setBidAmount(0);
          setCurrentBidTeam({})
          if(response.data && response.data.player_count === TOTAL_PLAYER){
              setOpenPopUp(true);
              setPopUpContent(response.data)
          }
      })
    }else{
      toast.warning("Please select a team and amount.");
    }
   
  }



  return (
    <div >
      <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark" />
        {openPopUp && 
        <div style={overlay}>
            <div style={popUpStyle} >
                <div style={{textAlign:'right',marginTop:'-25px', marginRight:'-30px'}}>
                    <button style={closeButtonStyle} onClick={()=>setOpenPopUp(!openPopUp) }>X</button>
                </div>

                <div>
                    <img src={congratsJif} alt="logo" style={jifStyle} />
                </div>

                <div style={{display:'flex',justifyContent:'center'}}>
                    <img src={popUpContent.team_logo} alt="logo" style={{width: "6rem",
                        height: "6rem",
                        borderRadius: "8px",}} />
                    <span style={{ padding: "10px", 
                        fontWeight:'bold',
                        fontSize:'38px',
                        fontFamily: 'Georgia, serif' 
                    }}>{popUpContent.team_name}</span>
                    
                </div>
                <div style={{display:'flex',justifyContent:'center'}}>
                  <span>Completed Auction</span>
                </div>
                <div style={{display:'flex',justifyContent:'center'}}>
                  <img src={clapJif} alt="logo" style={{  height: "8rem",width: "8rem",padding: "10px",}} />
                </div>

            </div>
            </div>
        }

      <div style={players__card__wrap1}>
        <span style={{
              marginTop: '10px',
              padding: '10px',
              fontFamily: 'cursive',
              fontStyle: 'italic',
              fontSize: 'larger'
        }}>Auction Powered By : </span>
          <img src={no5} alt="logo" style={{width: "8rem",
                          height: "4rem",
                          borderRadius: "50px",}} />
      
        </div>
        {isLoading && <Loader type="spinner-cub" bgColor={'green'} color={'green'} title={"Selecting Player..."} size={100} /> }
      {!isLoading && currentBidPlayer && currentBidPlayer.id && (
        <>
        <div style={players__card__wrap}>
          <div style={cardHeader}>
            <img src={pallorImage} alt="logo" style={imageStyle} />
            <div style={cardHeaderTextStyle}>
              <h2
                style={{
                  fontSize: "32px",
                  fontFamily: "auto",
                  marginTop: "20px",
                  textAlign: "center",
                }}
              >
                Palloor Premier League
              </h2>
              {/* <h2 style={{fontSize: '25px',fontFamily: 'monospace',fontStyle: 'italic',marginTop: '-26px',textAlign: 'center'}}>Premier League</h2> */}
            </div>
            <img src={logo} alt="logo" style={imageStyle1} />
          </div>

          <div style={cardHeader}>
            <img
              src={currentBidPlayer.profile_image}
              alt="logo"
              style={profileImageStyle}
            />
            <div style={cardBodyTextStyle}>
              <div style={{ display: "flex" }}>
                <span style={fullNameText}>{currentBidPlayer.fullname}</span>
              </div>

              <div style={{ display: "flex" }}>
                <span style={spanText}> Reg#:{currentBidPlayer.id}</span>
              </div>

              <div style={{ display: "flex" }}>
                <span style={spanText}> {currentBidPlayer.location}</span>
              </div>

              <div style={{ display: "flex" }}>
                <img src={playerSvg} alt="logo" style={svgStyle} />
                <span
                  style={{
                    marginTop: "10px",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {currentBidPlayer.player_role}
                </span>
              </div>

              <div style={{ display: "flex" }}>
                <img src={battingSvg} alt="logo" style={svgStyle} />
                <span
                  style={{
                    marginTop: "10px",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {currentBidPlayer.batting_style}
                </span>
              </div>

              <div style={{ display: "flex" }}>
                <img src={ballingSvg} alt="logo" style={svgStyle} />
                <span
                  style={{
                    marginTop: "10px",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {currentBidPlayer.bowling_style}
                </span>
              </div>

              <div style={{ display: "flex" }}>
                <span style={spanText}>
                  Contact : {currentBidPlayer.contact_no}
                </span>
              </div>

              <div style={{ display: "flex" }}>
                <span style={spanText}>
                  Jersey No : {currentBidPlayer.jersey_no}
                </span>
              </div>

              <div style={{ display: "flex" }}>
                <span style={spanText}>
                  Jersey Size: {currentBidPlayer.jersey_size}
                </span>
              </div>
            </div>
          </div>
          <div style={cardFooter}></div>
        </div>
        </>
      )}

      <div style={playerControlStyle}>
        <input
          type="text"
          value={searchText}
          placeholder="Search ID"
          onChange={handleInputChange}
          style={searchStyle}
          
        />
        <button style={searchuttonStyle} color="primary" onClick={GetPlayer}>
          Search Player
        </button>
        <button style={searchuttonStyle} onClick={sellPlayer} >Sell</button>
        <button style={unSoldButtonStyle} onClick={setUnsoldPlayer} >Un Sold</button>
        <button style={bidBackButtonStyle} onClick={handleBidBack}>Back</button>
      </div>

      <div style={teamListContainer}>
        {allTeams &&
            allTeams.map((team: any, index: number) => (
              <>
              { team.player_count !== TOTAL_PLAYER && (
                <div
                    style={currentBidTeam.id === team.id ?  hightlightCardContainer: teamCardContainer}
                    onClick={() => cardClick(team, index)}
                    key={index}
                >
                    <div style={teamStyle}>
                    <img src={team.team_logo} alt="logo" style={teamLogoStyle} />
                    <h4 style={{ padding: "10px" }}>{team.team_name}</h4>
                    </div>
                    {currentBidTeam && currentBidTeam.id === team.id && (
                    <input type="text" value={bidAmount} style={inputStyle} />
                    )}
                    <hr/>
                    Max Bid Amount : {team.max_bid_amount}
                    <hr/>
                    Players : {team.player_count}/ { TOTAL_PLAYER }
                </div>
              )}
                </>
            ))}
        </div>
    </div>
  );
};

const teamListContainer : React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
    // gap: "2rem",
    maxWidth: "120rem",
    margin: "0 auto",
    padding: "1rem",
  };
  

const playerListContainer: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(26rem, 1fr))",
  gap: "2rem",
  maxWidth: "120rem",
  margin: "0 auto",
  padding: "2rem",
};

const cardHeaderTextStyle: React.CSSProperties = {
  gap: "2rem",
  cursor: "pointer",
  color: "white",
  textAlign: "left",
  fontSize: "30px",
  textShadow: "1px 1px 0 #999, 2px 2px 0 #999, 3px 3px 0 #999",
};

const cardBodyTextStyle: React.CSSProperties = {
  color: "white",
  textAlign: "left",
  fontSize: "26px",
};

const imageStyle: React.CSSProperties = {
  height: "6rem",
  width: "6rem",
  padding: "10px",
};

const imageStyle1: React.CSSProperties = {
  height: "6rem",
  width: "6rem",
  padding: "10px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "none",
};

const spanText: React.CSSProperties = {
  marginTop: "8px",
  fontWeight: "bold",
  fontSize: "16px",
  paddingLeft: "10px",
};

const fullNameText: React.CSSProperties = {
  marginTop: "10px",
  fontWeight: "bold",
  fontSize: "20px",
  paddingLeft: "10px",
};

const svgStyle: React.CSSProperties = {
  height: "1rem",
  width: "1rem",
  objectFit: "cover",
  padding: "10px",
  filter:
    "invert(85%) sepia(20%) saturate(150%) hue-rotate(200deg) brightness(120%) contrast(120%)",
};

const profileImageStyle: React.CSSProperties = {
  height: "19rem",
  width: "15rem",
  padding: "5px",
  alignItems: "flex-start",
  display: "grid",
  marginTop: "-10px",
  objectFit: "cover",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  borderRadius: "15px",
  marginLeft : '7px',
  filter: 'grayscale(50%)'
//   border: "5px solid transparent",
  
};

const players__card__wrap: React.CSSProperties = {
  width: "40%",
  gap: "2rem",
  backgroundImage: "linear-gradient(to top,  #000033 , #800080)",
  border: "1px solid #ccc",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  margin: "0 auto",
  marginTop: "20px",
};

const players__card__wrap1: React.CSSProperties = {
  
  marginTop: "-150px",
  display: 'flex',
  justifyContent: 'flex-end',
  padding:'10px'
};


const cardHeader: React.CSSProperties = {
  display: "flex",
};

const cardFooter: React.CSSProperties = {
  display: "flex",
  backgroundColor: "purple",
  marginBottom: "10px",
};

const playerCountStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const isMobile = window.matchMedia("(max-width: 600px)").matches;
if (isMobile) {
  playerCountStyle.fontSize = "12px"; // Adjust font size for mobile view
  playerCountStyle.padding = "10px";

  playerListContainer.gridTemplateColumns =
    "repeat(auto-fit, minmax(18rem, 1fr))";
  playerListContainer.padding = "0rem";
}

const teamCardContainer: React.CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "8px",
  width: "230px",
  margin: "20px auto",
  cursor: "pointer",
  borderBlockColor:'green'
};

const hightlightCardContainer: React.CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "8px",
  width: "230px",
  margin: "20px auto",
  cursor: "pointer",
  backgroundColor:'lightgreen'
};

const teamStyle: React.CSSProperties = {
  display: "flex",
};
const teamLogoStyle: React.CSSProperties = {
  width: "5rem",
  height: "5rem",
  borderRadius: "8px",
  objectFit: "cover"

};

const inputStyle: React.CSSProperties = {
  width: "80%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const playerControlStyle: React.CSSProperties = {
  margin: "10px",
  display:'flex',
  justifyContent:'center'
};

const searchStyle : React.CSSProperties = {
    width: "20%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };

const searchuttonStyle : React.CSSProperties = {
    backgroundColor: 'green' ,
    color: 'white',
    padding: '5px 15px',
    borderRadius: '5px',
    outline: '0',
    border: '0',
    textTransform: 'uppercase',
    margin: '10px 0px',
    cursor: 'pointer',
    boxShadow: '0px 2px 2px lightgray',
    transition: 'background-color 250ms ease',
    opacity:  1,
    marginLeft : '10px'
}

const unSoldButtonStyle : React.CSSProperties = {
    backgroundColor: 'red' ,
    color: 'white',
    padding: '5px 15px',
    borderRadius: '5px',
    outline: '0',
    border: '0',
    textTransform: 'uppercase',
    margin: '10px 0px',
    cursor: 'pointer',
    boxShadow: '0px 2px 2px lightgray',
    transition: 'background-color 250ms ease',
    opacity:  1,
    marginLeft : '10px'
}

const bidBackButtonStyle : React.CSSProperties = {
    backgroundColor: 'orange' ,
    color: 'white',
    padding: '5px 15px',
    borderRadius: '5px',
    outline: '0',
    border: '0',
    textTransform: 'uppercase',
    margin: '10px 0px',
    cursor: 'pointer',
    boxShadow: '0px 2px 2px lightgray',
    transition: 'background-color 250ms ease',
    opacity:  1,
    marginLeft : '10px'
}


const popUpStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
  };

const closeButtonStyle :  React.CSSProperties = {
    backgroundColor: 'red' ,
    color: 'white',
    padding: '5px 15px',
    borderRadius: '60%',
    outline: '0',
    border: '0',
    textTransform: 'uppercase',
    cursor: 'pointer'
}


const overlay : React.CSSProperties={
    position: 'fixed',
  top: '0',
  left: "0",
  width: "100%",
  height:" 100%",
  backgroundColor: 'rgba(18, 15, 17, 0.85)', /* Semi-transparent black */
  zIndex: '1000'
}

const jifStyle : React.CSSProperties = {
  height: "8rem",
  width: "20rem",
  padding: "10px",

}

export default AuctionCenter;






