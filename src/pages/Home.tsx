import React from 'react';
import banner from '../assets/ppl-poster.jpeg'
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';


const Home: React.FC = () => {
    const navigate = useNavigate();
    return (
        <>
         <Header />
            <div style={{padding:'10px'}}>
                <img style={imageStyle} src={banner} alt="Logo"  onClick={() => navigate("/player-list")} />
            </div>
         <Footer/>
        </>
    )
}

const imageStyle : React.CSSProperties = {
    objectFit:'cover',
    width : '100%'
}



export default Home;
