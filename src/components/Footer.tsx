import React from "react";

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
    return(
        <footer style={footerStyle}>
            <p style={copyRightStyle}>&copy; {new Date().getFullYear()}
            </p>
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


export default Footer;