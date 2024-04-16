import React from "react";
import logo from "../assets/n05-icon.jpeg"; // Import your logo file
import { Link, useNavigate } from "react-router-dom";

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
    const navigate = useNavigate();
    return(
        <footer style={footerStyle}>
            <p style={copyRightStyle}>&copy; {new Date().getFullYear()}
                {/* <img src={logo} alt="Logo" style={logoStyle} onClick={() => navigate("/")} /> */}
            </p>
            {/* <div style={footerLogoStyle}> */}
                
            {/* </div> */}
        </footer>
    )
}

const footerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    display: 'grid', 
    backgroundColor : 'green',
  };

const copyRightStyle : React.CSSProperties = {
    color: 'black',
    fontWeight : 'bolder',
    marginLeft: '10px',
    alignItems: 'left'
}

const footerLogoStyle : React.CSSProperties = {
    padding: '5px',
    textAlign: 'right',
    // marginRight: '10px'
}
const logoStyle: React.CSSProperties = {
    height: "40px", // Adjust according to your logo size
    cursor:'pointer',
    width: '40px'
  };
export default Footer;