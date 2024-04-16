import React, { useEffect, useState } from 'react';
import TeamService from '../services/TeamService';
import Header from '../components/Header';
import Footer from '../components/Footer';


const TeamList: React.FC = () => {

    const [allTeams, setAllTeams] = useState<any>([])

    useEffect(()=>{
        GetAllTeams();
    },[])

    const GetAllTeams = () =>{
        TeamService().getAllTeams().then((response:any)=>{
            setAllTeams(response?.data)
        })
    }

    return(
        <div>
            <Header/>
            <div style={playerListContainer}>
                {allTeams && allTeams.map((team:any, index:number) => (
                    <>
                    <div style={cardStyle} key={index}>
                        <div style={{display:'flex',marginTop:'10px'}}>
                            <img src={team.team_logo} alt='logo' style={imageStyle} />
                            <div >
                                <h4>{team.team_name}</h4>
                            </div>
                        </div>
                        
                            
                        
                    </div>
                    
                </>
                ))}
            </div>
        <Footer/>
        </div>
        
    )
}

const inputContainerStyle : React.CSSProperties = {
    flexBasis: "75%",
    height: "2rem",
    border: "2px solid #ccc",
    borderRadius: "8px",
    margin: "5px",
    width: "30%",
  
}

const playerListContainer: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))',
    gap: '2rem',
    maxWidth: '120rem',
    margin: '0 auto',
    padding: '2rem',
}

const cardStyle: React.CSSProperties = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '5px',
    margin: '10px',
    width: '15rem',
    textAlign: 'center',
  };



const imageStyle : React.CSSProperties = {
    height : '6rem',
    width: '6rem',
    padding:'10px',
}

export default TeamList;