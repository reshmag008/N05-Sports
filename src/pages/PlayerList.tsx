import React, { useEffect, useState } from 'react';
import PlayerService from '../services/PlayerService';
import pallorImage from '../assets/pallor.jpeg'
import playerSvg from '../assets/account-icon.png'
import battingSvg from '../assets/batter.png'
import ballingSvg from '../assets/tennisBall.jpg'
import logo from "../assets/ppl.png"; 
// import { usePDF } from 'react-to-pdf';
import generatePDF, { usePDF,Resolution, Margin } from 'react-to-pdf';
import Header from '../components/Header';
import Footer from '../components/Footer';


 const getTargetElement = () => document.getElementById('content-id');

 let options :any = {
    // default is `save`
    method: 'save',
    // default is Resolution.MEDIUM = 3, which should be enough, higher values
    // increases the image quality but also the size of the PDF, so be careful
    // using values higher than 10 when having multiple pages generated, it
    // might cause the page to crash or hang.
    resolution: Resolution.HIGH,
    page: {
       // margin is in MM, default is Margin.NONE = 0
       margin: Margin.SMALL,
       // default is 'A4'
       format: 'A4',
       // default is 'portrait'
    //    orientation: 'landscape',
    },
    canvas: {
       // default is 'image/jpeg' for better size performance
       mimeType: 'image/png',
       qualityRatio: 1
    },
    // Customize any value passed to the jsPDF instance and html2canvas
    // function. You probably will not need this and things can break, 
    // so use with caution.
    overrides: {
       // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
       pdf: {
          compress: true
       },
       // see https://html2canvas.hertzen.com/configuration for more options
       canvas: {
          useCORS: true
       }
    },
 };



const PlayerList: React.FC = () => {
    const [players, setPlayers] = useState<any>([]);
    const [soldCount, setSoldCount] = useState(0);
    const [unSoldCount, setUnSoldCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const { toPDF, targetRef } = usePDF({filename: 'ppl_players.pdf'});

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(()=>{
        setPlayers([]);
        GetAllPlayers();
    },[])
   
    const GetAllPlayers = () => {
        try {
            PlayerService().getAllPlayers().then((response:any)=>{
                setPlayers(response?.data?.players);
                setSoldCount(response?.data?.soldPlayerCount);
                setUnSoldCount(response?.data?.unSoldPlayerCount);
                setPendingCount(response?.data?.pendingPlayerCount);
                console.log("player== ", players)
            })
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    };

    return (
        <>
        <Header/>
        <div style={playerCountStyle}>
            Total Players : {players.length} | Unsold : {unSoldCount} | Sold : {soldCount} | Pending : {pendingCount} 
            <button style={{marginLeft:'20px'}} onClick={() => toPDF()}>Download PDF</button>
             {/* <button onClick={() => generatePDF(getTargetElement, options)}>Generate PDF</button> */}
            </div>
        
       
        <div id='content-id' ref={targetRef}  style={playerListContainer}>
            {players && players.map((player:any, index:number) => (
                <>
                <div style={players__card__wrap} key={index}>
                    <div style={cardHeader}>
                        <img src={pallorImage} alt='logo' style={imageStyle} />
                        <div style={cardHeaderTextStyle}>   
                            <h2 style={{fontSize: '32px',fontFamily: 'auto',marginTop:'8px',textAlign: 'center'}}>Palloor</h2>
                            <h2 style={{fontSize: '25px',fontFamily: 'monospace',fontStyle: 'italic',marginTop: '-26px',textAlign: 'center'}}>Premier League</h2>
                        </div>
                        <img src={logo} alt='logo' style={imageStyle1} /> 
                    </div>

                    <div style={cardHeader}>
                        <img src={player.profile_image} alt='logo' style={profileImageStyle} /> 
                        <div style={cardBodyTextStyle}> 
                            
                            <div style={{display:'flex'}}>
                                <span style={fullNameText}>{player.fullname.toUpperCase()}</span>
                            </div>

                            <div style={{display:'flex'}}>
                                <span style={spanText}> Reg#:{player.id}</span>
                            </div>

                            <div style={{display:'flex'}}>
                                <span style={spanText}> {player.location}</span>
                            </div>

                            <div style={{display:'flex'}}>
                                {/* <img src={playerSvg} alt='logo' style={svgStyle} /> */}
                                <span style={spanText
                                    // {marginTop: '10px', 
                                    // fontWeight: 'bold', 
                                    // fontSize: '13px',}
                                    }>Role : {player.player_role}</span>
                            </div>

                            <div style={{display:'flex'}}>
                                {/* <img src={battingSvg} alt='logo' style={svgStyle} /> */}
                                <span style={spanText}>Batting : {player.batting_style}</span>
                            </div>

                            <div style={{display:'flex'}}>
                                {/* <img src={ballingSvg} alt='logo' style={svgStyle} /> */}
                                <span style={spanText}>Bowling : {player.bowling_style}</span>
                            </div>

                            <div style={{display:'flex'}}>
                                <span style={spanText}>Contact : {player.contact_no}</span>
                            </div>

                            <div style={{display:'flex'}}>
                                <span style={spanText}> Jersey No : {player.jersey_no}</span>
                            </div>

                            <div style={{display:'flex'}}>
                                <span style={spanText}>Jersey Size: {player.jersey_size}</span>
                            </div>
                        
                        </div>
                    </div>
                    <div style={cardFooter}>

                    </div>
                </div>
                </>
            ))}
        </div>
        <Footer/>
        </>
    )
}

const playerListContainer: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(26rem, 1fr))',
    gap: '2rem',
    maxWidth: '120rem',
    margin: '0 auto',
    padding: '2rem',
}

const cardHeaderTextStyle: React.CSSProperties = {
    gap: '2rem',
    cursor: 'pointer',
    color: 'white',
    textAlign: 'left',
    fontSize: '23px',
    textShadow: '1px 1px 0 #999, 2px 2px 0 #999, 3px 3px 0 #999',
  };

  const cardBodyTextStyle: React.CSSProperties = {
    color: 'white',
    textAlign: 'left',
    fontSize: '23px',
  };

const imageStyle : React.CSSProperties = {
    height : '6rem',
    width: '6rem',
    padding:'10px',
}

const imageStyle1 : React.CSSProperties = {
    height : '6rem',
    width: '6rem',
    padding:'10px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: 'none'
}

const spanText :  React.CSSProperties = {
    marginTop: '8px', 
    fontWeight: 'bold', 
    fontSize: '13px',
    paddingLeft : '10px',
    paddingTop : '8px'
}

const fullNameText :  React.CSSProperties = {
    marginTop: '10px', 
    fontWeight: 'bold', 
    fontSize: '17px',
    paddingLeft : '10px'
}

const svgStyle :React.CSSProperties = {
    height : '1rem',
    width: '1rem',
    objectFit:'cover',
    padding:'10px',
    filter: 'invert(85%) sepia(20%) saturate(150%) hue-rotate(200deg) brightness(120%) contrast(120%)'

}

const profileImageStyle : React.CSSProperties = {
    height: '17rem',
    width: '12rem',
    padding: '5px',
    alignItems: 'flex-start',
    display: 'grid',
    marginTop: '-10px',
    objectFit:'cover',
}

const players__card__wrap :  React.CSSProperties = {
    gap: '2rem',
    backgroundImage: 'linear-gradient(to top,  #000033 , #800080)',
    border: '1px solid #ccc', 
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
    borderRadius: '8px', 
    margin: '0 auto',
    marginTop:'25px'
  }





const cardHeader :  React.CSSProperties = {
    display: 'flex'
}

const cardFooter :  React.CSSProperties = {
    display: 'flex',
    backgroundColor : 'purple',
    marginBottom:'10px'
}

const playerCountStyle : React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}

const isMobile = window.matchMedia("(max-width: 600px)").matches;
    if (isMobile) {
        playerCountStyle.fontSize = '12px'; // Adjust font size for mobile view
        playerCountStyle.padding = '10px'

        playerListContainer.gridTemplateColumns =  'repeat(auto-fit, minmax(18rem, 1fr))'
        playerListContainer.padding =  '0rem'

        players__card__wrap.margin = '10px'
    }


export default PlayerList;