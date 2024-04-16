import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { BACKEND_URL } from "../constants";
import pallorImage from "../assets/pallor.jpeg";
import playerSvg from "../assets/account-icon.png";
import battingSvg from "../assets/batter.png";
import ballingSvg from "../assets/tennisBall.jpg";
import logo from "../assets/ppl.png";
import no5 from '../assets/n05-icon.jpeg'
import PlayerService from "../services/PlayerService";
import bellGif from '../assets/bell.gif';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const PlayerDisplay: React.FC = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState<any>(null);
  const [currentBidPlayer, setCurrentPlayer] = useState<any>({});
  const [currentCall, setCurrentCall] = useState<any>({});
  const [soldPlayer, setSoldPlayer] = useState<any>({});
  const [allSoldPlayers, setAllSoldPlayer] = useState<any>([])

  useEffect(() => {
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);
    getSoldPlayers();
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("current_player", (message: any) => {
        console.log("current_player ---- ", message);
        setCurrentPlayer(JSON.parse(message));
      });
      socket.on("team_call", (message: any) => {
        console.log("team_call ---- ", message);
        setCurrentCall(JSON.parse(message));
      });
      socket.on("player_sold", (message: any) => {
        console.log("player_sold ---- ", message);
        let player = JSON.parse(message)
        setSoldPlayer(player);
        setCurrentCall({})
        toast.success(`${player.player_name} sold to ${player.team_name} for ${player.bid_amount}`)
        getSoldPlayers();
      });
      
      
    }
  }, [socket]);


  const getSoldPlayers = () =>{

    PlayerService().getSoldPlayers().then((response:any)=>{
        setAllSoldPlayer(response?.data?.players);
    })
  }

  return (
    
    <div style={displayMargin}>

<ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark" />

        
        <div style={{display:'flex', justifyContent:'flex-end', padding:'10px'}}>
            <span style={{
                marginTop: '10px',
                padding: '10px',
                fontFamily: 'cursive',
                fontStyle: 'italic',
                fontSize: 'larger'
            }}>Auction Powered By : </span>
            <img src={no5} alt="logo" style={{width: "8rem",height: "4rem",borderRadius: "50px"}} />
        </div>
        
        
        <div style={soldPlayersStyle}>

        <div >
                { currentCall && Object.keys(currentCall).length>0 && (
                    <div style={teamCallStyle}>
                        <div style={{border: "1px solid purple",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 1.1)",
                                borderRadius: "8px",color:'green',paddingLeft:'10px', paddingRight:'10px',display:'flex',height:'100px'}}>
                            
                            <img
                                src={bellGif}
                                alt="logo"
                                style={profileImageStyle1}
                            />
                            <h2> Current Bid {currentCall.amount} by {currentCall.team_name} </h2>
                        </div>
                    
                    </div>
                )}
                {currentBidPlayer && currentBidPlayer.id && (
                    <div style={players__card__wrap}>
                    <div style={cardHeader}>
                        <img src={pallorImage} alt="logo" style={imageStyle} />
                        <div style={cardHeaderTextStyle}>
                        <h2 style={playCardHeading} >
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
                )}
            </div>



          {allSoldPlayers && allSoldPlayers.length>0 &&
              <div style={soldPlayerListStyle}>
                  
                  { allSoldPlayers.map((element:any, index:number) => (
                      <div key={index} style={{display:'flex', padding:'10px'}} >
                          {/* <div > */}
                              <img
                                  src={element.profile_image}
                                  alt="logo"
                                  style={profileImageStyle1}
                              />
                              <div style={{color:'purple'}}>
                                  <div >
                                      <span style={fullNameText}>{element.fullname.toUpperCase()}</span>
                                  </div>
                                  <div >
                                      <span style={fullNameText}>{element.player_role}</span>
                                  </div>
                                  <div >
                                      <span style={fullNameText}>Team : {element.team_id}</span>
                                  </div>
                                  <div >
                                      <span style={fullNameText}>Points : {element.bid_amount}</span>
                                  </div>
                              </div>

                          {/* </div> */}

                      </div>
                  ))}
              </div>
          }
           
        </div>




    </div>
  );
};


const teamCallStyle : React.CSSProperties = {
    display:'flex',
    justifyContent:'center',
    // marginLeft:'65px',
    padding:'10px'

}

const imageStyle: React.CSSProperties = {
  height: "7rem",
  width: "7rem",
//   objectFit: "cover",
padding:'10px'
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

const imageStyle1: React.CSSProperties = {
  height: "7rem",
  width: "7rem",
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
  marginLeft: "7px",
  filter: "grayscale(50%)",
  //   border: "5px solid transparent",
};

const profileImageStyle1: React.CSSProperties = {
    height: "4rem",
    width: "4rem",
    padding: "5px",
    alignItems: "flex-start",
    display: "grid",
    // marginTop: "-10px",
    objectFit: "cover",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    borderRadius: "50px",
    marginTop: "7px",
    filter: "grayscale(50%)",
    //   border: "5px solid transparent",
  };


const players__card__wrap: React.CSSProperties = {
  width: "57%",
  gap: "2rem",
  backgroundImage: "linear-gradient(to top,  #000033 , #800080)",
  border: "1px solid #ccc",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
//   margin: "0/ auto",
  marginLeft: "235px",
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

const displayMargin : React.CSSProperties = {
    marginTop : '-150px',
    padding:'10px'
}

const soldPlayersStyle : React.CSSProperties = {
  display:'grid',
  gridTemplateColumns: '70% 30%',
  gap: '2rem'
}

const playCardHeading : React.CSSProperties = {
    fontSize: "30px",
    fontFamily: "auto",
    marginTop: "20px",
    textAlign: "center",
    padding:'10px'
}

const soldPlayerListStyle : React.CSSProperties = {
  border: "1px solid purple",
 boxShadow: "0 2px 4px rgba(0, 0, 0, 1.1)",
  borderRadius: "8px",
  width:'92%'
}

const isMobile = window.matchMedia("(max-width: 600px)").matches;
if (isMobile) {
  playerCountStyle.fontSize = "12px"; // Adjust font size for mobile view
  playerCountStyle.padding = "10px";

  playerListContainer.gridTemplateColumns =
    "repeat(auto-fit, minmax(18rem, 1fr))";
  playerListContainer.padding = "0rem";
  displayMargin.marginTop = '0px';

  soldPlayersStyle.gridTemplateColumns = '1fr';
  imageStyle.height = "6rem";
  imageStyle.width = "6rem";

  playCardHeading.padding = '0px';
  playCardHeading.marginTop = '5px';

  profileImageStyle.height = "8rem";
  profileImageStyle.width = "7rem";

  players__card__wrap.marginLeft = 'max-content'
  players__card__wrap.width = "100%"

  teamCallStyle.width = '75%';

  soldPlayerListStyle.width = '100%'



}

export default PlayerDisplay;
