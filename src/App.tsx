import React, { useEffect, useState } from 'react';
import './App.css';
import AppRouter from './AppRouter';
import Header from './components/Header';
import Footer from './components/Footer';

import { Provider } from 'react-redux'


function App() {

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

  
  return (
    // <div className="App">
      <div style={isMobileView? {} : divStyle} >
        <AppRouter/>
      </div>
      
    // </div>
  );
}

const divStyle : React.CSSProperties = {
  marginTop : '10rem',
  marginBottom: '5rem',
}


export default App;
