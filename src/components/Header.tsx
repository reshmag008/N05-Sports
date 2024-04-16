import React, { useEffect, useState } from "react";
import logo from "../assets/ppl-icon.jpeg"; // Import your logo file
import { useNavigate } from "react-router-dom";
import sidebarButton from '../assets/ham1.png'

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();

  const [isMobileView, setIsMobileView] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.matchMedia("(max-width: 600px)").matches);
    }
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const openSideBar = () =>{
    console.log("isDrawerOpen== ", isDrawerOpen);
    setIsDrawerOpen(!isDrawerOpen)
  }



  
  return (
    <>
      
      {isMobileView && (
        <>
        <div style={{display: 'grid',height:'50px'}}>
          <img src={sidebarButton} alt='logo' style={imageStyle} onClick={openSideBar}/>
        </div>
        {isDrawerOpen && 
        <div style={sidebarStyle}>
            <aside >

            <div style={{display:'flex',padding:'10px',
                 backgroundColor:'green', color:'white'}} >
                  <div>
                    <span style={{marginRight:'30px'}} ><strong>Palloor Premier Leauge</strong></span>
                    <span  onClick={openSideBar}><strong>X</strong></span>
                  </div>
              </div>

            <nav style={{marginTop:'10px'}}>
              
               
              <ul style={ulStyle}>
                <li style={liStyle} onClick={()=>{navigate('/');setIsDrawerOpen(!isDrawerOpen)}}>
                      Home
                </li>
                <li style={liStyle} onClick={()=>{navigate('/player-list');setIsDrawerOpen(!isDrawerOpen)}}>
                      Player List
                </li>

                <li style={liStyle} onClick={()=>{navigate('/player-registration');setIsDrawerOpen(!isDrawerOpen)}}>
                      Player Registration
                </li>

                <li style={liStyle} onClick={()=>{navigate('/team-list');setIsDrawerOpen(!isDrawerOpen)}} >
                      Teams
                </li>

                <li style={{ ...liStyle, marginRight: '15px' }} onClick={()=>{navigate('/team-registration');setIsDrawerOpen(!isDrawerOpen)}}>
                      Teams Registration
                </li>
            </ul>
            </nav>
          </aside>
          </div>
        }
        </>
      )}
    
      
      {!isMobileView && (
      <header style={headerStyle}>
      <div style={logoContainerStyle}>
        <img src={logo} alt="Logo" style={logoStyle} onClick={() => {
              navigate("/");
            }}/>
      </div>
      <nav>
        <ul style={ulStyle}>
          <li style={liStyle}>
            <button style={buttonStyle} onClick={()=>navigate('/player-list')}>
                Player List
            </button>
          </li>

          <li style={liStyle}>
            <button style={buttonStyle} onClick={()=>navigate('/player-registration')}>
                Player Registration
            </button>
          </li>

          <li style={liStyle}>
            <button style={buttonStyle} onClick={()=>navigate('/team-list')}>
                Teams
            </button>
          </li>

          <li style={{ ...liStyle, marginRight: '15px' }}>
            <button style={buttonStyle} onClick={()=>navigate('/team-registration')}>
                Teams Registration
            </button>
          </li>
        </ul>
      </nav>
      </header>
      )}
    </>
  );
};


// CSS styles

const imageStyle : React.CSSProperties = {
  height : '3rem',
  width: '3rem',
  // margin:'-10px',
}

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "white",
  color: "#fff",
  position: 'fixed',
  top: 0,
  width: '100%',
  marginLeft : '-20px'
};

const sidebarStyle : React.CSSProperties = {
  position: 'fixed',
    top: 0,
    left: 0 ,
    width: '250px',
    height: '100%',
    backgroundColor: '#fff',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.5)',
    transition: 'left 0.3s ease'
}

const logoContainerStyle: React.CSSProperties = {
  marginRight: "auto", // Pushes the logo to the left
};

const logoStyle: React.CSSProperties = {
  height: "80px", // Adjust according to your logo size
  cursor:'pointer',
  padding:'10px'
};

const ulStyle: React.CSSProperties = {
  listStyleType: "none",
  margin: 0,
  padding: 0,
  display: "flex",
};

const liStyle: React.CSSProperties = {
  padding: "5px",
  marginLeft:'10px',
  color: 'green',
};

const buttonStyle : React.CSSProperties = {
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
}

const isMobile = window.matchMedia("(max-width: 600px)").matches;
    if (isMobile) {
        ulStyle.display = 'grid';
        ulStyle.textAlign = 'left';
   
    }



export default Header;
