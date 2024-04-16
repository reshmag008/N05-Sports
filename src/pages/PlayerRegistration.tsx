import React, { useEffect, useState } from "react";
import PlayerService from "../services/PlayerService";
import accountLogo from '../assets/account.png';
import locationLogo from '../assets/location1.png';
import jerseyLogo from '../assets/jersey.jpeg';
import linkLogo from '../assets/link.png';
import phoneLogo from '../assets/phone1.png';
import whatsappLogo from '../assets/whatsapp.png';
import playerRoleLogo from '../assets/hat.jpeg';
import ballingLogo from '../assets/ball.jpeg';
import S3Service from "../services/s3Service";
import Header from "../components/Header";
import Footer from "../components/Footer";
import 'react-image-crop/dist/ReactCrop.css'
import Loader from "react-js-loader";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const PlayerRegistration: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File|null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const [formData, setFormData] = useState({
    fullname: "",
    location: "",
    jersey_name: "",
    jersey_size: "",
    jersey_no: "",
    profile_link: "",
    contact_no: "",
    whatsapp_no: "",
    player_role: "",
    batting_style: "",
    bowling_style: "",
    profile_image: "",
    un_sold:false
  });

  const [errors, setErrors] = useState({
    fullname: "",
    location: "",
    jersey_name: "",
    jersey_size: "",
    jersey_no: "",
    contact_no: "",
    whatsapp_no: "",
    player_role: "",
    batting_style: "",
    bowling_style: "",
    selectedImage:''
  });

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


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("name== ", name)
    console.log("value== ", value)
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' })
    
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted successfully:', formData);
      formData.profile_image = formData.fullname + "_" + formData.contact_no + ".jpeg";
      PlayerService().addPlayer(formData).then((response:any)=>{
        console.log("response== ", response);
        if(response.data){
          toast.success('Player Registered Succesfully', { autoClose: 2000 })
          getPresignedUrl();
        }else{
          setIsLoading(false);
          toast.error('Registration Failed',{ autoClose: 2000 })
        }
      })

      // Perform form submission here
    }else{
      setIsLoading(false);
    }
  };


  const getPresignedUrl = () => {
    let file = selectedImage;
    console.log("selectedImage== ", selectedImage);
    console.log("file== ", file);
      let params = {
        key: formData.fullname + "_" + formData.contact_no + ".jpeg",
        contentType: selectedImage?.type,
        bucket: "palloor-players",
      };

      S3Service().GetPresignedUrl(params).then((response:any)=>{
        console.log("upload url for  Player response== ", response);
        resetData();
        setIsLoading(false);
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", response.data, true);
          if(file!==null)xhr.setRequestHeader("Content-Type", file.type);
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                return "success";
              } else {
                console.error("Error occurred while uploading file.");
                return "failed";
              }
            }
          };
          let res = xhr.send(file);
          console.log("res== ", res);
      })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };
  
  const resetData = () => {
    setFormData({
      fullname: "",
      location: "",
      jersey_name: "",
      jersey_size: "",
      jersey_no: "",
      profile_link: "",
      contact_no: "",
      whatsapp_no: "",
      player_role: "",
      batting_style: "",
      bowling_style: "",
      profile_image: "",
      un_sold:false
    })
    setSelectedImage(null);
  }


    const validateForm = (): boolean => {
      let valid = true;
      const { fullname, location,jersey_name,jersey_size,jersey_no,contact_no,whatsapp_no,player_role,batting_style,
        bowling_style} = formData;
      const newErrors = {
        fullname:'',
        location: '',
        jersey_name: "",
        jersey_size: "",
        jersey_no: "",
        contact_no: "",
        whatsapp_no: "",
        player_role: "",
        batting_style: "",
        bowling_style: "",
        selectedImage: "",
      };

      if (!fullname.trim()) {
        newErrors.fullname = 'Fullname is required';
        valid = false;
      }

      if (!location.trim()) {
        newErrors.location = 'Location is required';
        valid = false;
      }

      if (!jersey_name.trim()) {
        newErrors.jersey_name = 'Jersey Name is required';
        valid = false;
      }

      if (!jersey_size.trim()) {
        newErrors.jersey_size = 'Jersey Size is required';
        valid = false;
      }
      if (!jersey_no.trim()) {
        newErrors.jersey_no = 'Jersey No is required';
        valid = false;
      }
      if (!contact_no.trim()) {
        newErrors.contact_no = 'Contact Number is required';
        valid = false;
      }
      if (!whatsapp_no.trim()) {
        newErrors.whatsapp_no = 'Whatsapp Number is required';
        valid = false;
      }
      if (!player_role.trim()) {
        newErrors.player_role = 'Player Role is required';
        valid = false;
      }
      if (!batting_style.trim()) {
        newErrors.batting_style = 'Batting Style is required';
        valid = false;
      }
      if (!bowling_style.trim()) {
        newErrors.bowling_style = 'Bowling Style is required';
        valid = false;
      }
      if (!selectedImage) {
        newErrors.selectedImage = 'Profile Image is required';
        valid = false;
      }

      setErrors(newErrors);
      return valid;
    };

  return (
    <>
    <Header/>
    
    <div style={formContainerStyle}>

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



      <form onSubmit={handleSubmit} style={{margin:'20px'}}>

        <h3 style={{color:'green',padding:'10px'}}>Player Registration</h3>

        <div style={{gridTemplateColumns :  'repeat(auto-fit, minmax(25rem, 1fr))', display:"grid"}}>
          
            <div style={formColumnStyle}>

              <div style={{display:"flex"}}>
                <img src={accountLogo} alt='logo' style={svgStyle} />
                <span style={labelTextStyle}>Full Name</span>
              </div>
              
              <input
                style={inputContainerStyle}
                placeholder="Fullname"
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
              />
              <span style={errorStyle}>{errors.fullname}</span>
            </div>

            <div style={formColumnStyle}>
            
            <div style={{display:"flex"}}>
                <img src={locationLogo} alt='logo' style={svgStyle} />
                <span style={labelTextStyle}>Location</span>
              </div>


            <input
              style={inputContainerStyle}
              placeholder="Location"
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
            <span style={errorStyle}>{errors.location}</span>

            </div>

            <div style={formColumnStyle}>

              <div style={{display:"flex"}}>
                <img src={jerseyLogo} alt='logo' style={svgStyle} />
                <span style={labelTextStyle}>Jersey Name</span>
              </div>

            
                <input
                  style={inputContainerStyle}
                  placeholder="Jersey Name"
                  type="text"
                  id="jersey_name"
                  name="jersey_name"
                  value={formData.jersey_name}
                  onChange={handleChange}
                />
                <span style={errorStyle}>{errors.jersey_name}</span>

                </div>
                <div style={formColumnStyle}>
              
                <div style={{display:"flex"}}>
                <img src={jerseyLogo} alt='logo' style={svgStyle} />
                <span style={labelTextStyle}>Jersey No</span>
              </div>

                <input
                  style={inputContainerStyle}
                  placeholder="Jersey No"
                  type="text"
                  id="jersey_no"
                  name="jersey_no"
                  value={formData.jersey_no}
                  onChange={handleChange}
                />
                <span style={errorStyle}>{errors.jersey_no}</span>

            </div>

            <div style={formColumnStyle}>

              <div style={{display:"flex"}}>
                <img src={jerseyLogo} alt='logo' style={svgStyle} />
                <span style={labelTextStyle}>Jersey Size</span>
              </div>

                <input
                  style={inputContainerStyle}
                  placeholder="Jersey Size"
                  type="text"
                  id="jersey_size"
                  name="jersey_size"
                  value={formData.jersey_size}
                  onChange={handleChange}
                />
                <span style={errorStyle}>{errors.jersey_size}</span>

                </div>
                <div style={formColumnStyle}>

                <div style={{display:"flex"}}>
                  <img src={linkLogo} alt='logo' style={svgStyle} />
                  <span style={labelTextStyle}>Profile Link</span>
                </div>

                
                <input
                  style={inputContainerStyle}
                  placeholder="Profile Link"
                  type="text"
                  id="profile_link"
                  name="profile_link"
                  value={formData.profile_link}
                  onChange={handleChange}
                />
                {/* <span style={errorStyle}>{errors.profile_link}</span> */}

            </div>

            <div style={formColumnStyle}>

            
                <div style={{display:"flex"}}>
                  <img src={phoneLogo} alt='logo' style={svgStyle} />
                  <span style={labelTextStyle}>Contact No</span>
                </div>

            <input
              style={inputContainerStyle}
              placeholder="Contact No"
              type="text"
              id="contact_no"
              name="contact_no"
              value={formData.contact_no}
              onChange={handleChange}
              maxLength={10}
            />
            <span style={errorStyle}>{errors.contact_no}</span>

            </div>
            <div style={formColumnStyle}>

            

            <div style={{display:"flex"}}>
                <img src={whatsappLogo} alt='logo' style={svgStyle} />
                <span style={labelTextStyle}>WhatsApp No</span>
            </div>


            <input
              style={inputContainerStyle}
              placeholder="WhatsApp No"
              type="text"
              id="whatsapp_no"
              name="whatsapp_no"
              value={formData.whatsapp_no}
              onChange={handleChange}
              maxLength={10}
            />
            <span style={errorStyle}>{errors.whatsapp_no}</span>

            </div>


            <div style={formColumnStyle}>

            
            <div style={{display:"flex"}}>
                <img src={playerRoleLogo} alt='logo' style={svgStyle} />
                <span style={labelTextStyle}>Player Role</span>
            </div>


                <select style={inputContainerStyle}
                    id="player_role"
                    name="player_role"
                    value={formData.player_role}
                    onChange={handleChange}
                >
                    <option value="">--Select Role--</option>
                    <option value="Batter">Batter</option>
                    <option value="Bowler">Bowler</option>
                    <option value="All Rounder">All Rounder</option>
                    <option value="Wicket Keeper">Wicket Keeper</option>
                </select>
                <span style={errorStyle}>{errors.player_role}</span>

                </div>
                <div style={formColumnStyle}>

                

                <div style={{display:"flex"}}>
                    <img src={playerRoleLogo} alt='logo' style={svgStyle} />
                    <span style={labelTextStyle}>Batting Style</span>
                </div>

                <select style={inputContainerStyle}
                    id="batting_style"
                    name="batting_style"
                    value={formData.batting_style}
                    onChange={handleChange}
                >
                    <option value="">--Select Batting Style--</option>
                    <option value="Right Hand">Right Hand</option>
                    <option value="Left Hand">Left Hand</option>
                </select>
                <span style={errorStyle}>{errors.batting_style}</span>

            </div>

            <div style={formColumnStyle}>

            <div style={{display:"flex"}}>
                  <img src={ballingLogo} alt='logo' style={svgStyle} />
                    <span style={labelTextStyle}>Bowling Style</span>
                </div>

            
              <select style={inputContainerStyle}
                  id="bowling_style"
                  name="bowling_style"
                  value={formData.bowling_style}
                  onChange={handleChange}
              >
                  <option value="">--Select Bowling Style--</option>
                  <option value="Nil">Nil</option>
                  <option value="Right Hand">Right Hand</option>
                  <option value="Left Hand">Left Hand</option>
              </select>
              <span style={errorStyle}>{errors.bowling_style}</span>

              </div>

              <div style={formColumnStyle}>

              
              <div style={{display:"flex"}}>
                  <img src={accountLogo} alt='logo' style={svgStyle} />
                    <span style={labelTextStyle}>Profile Image</span>
                </div>


              <input style={inputContainerStyle} 
              placeholder="Select Image"
              id="profile_image"
              name="profile_image"
              type="file" accept="image/*" onChange={handleImageChange} />
            <span style={errorStyle}>{errors.selectedImage}</span>

            </div>

            <div style={formColumnStyle}>
            

            {selectedImage && (
                <div >
                {/* <h3>Preview:</h3> */}
                <img src={URL.createObjectURL(selectedImage)} alt="Selected" style={profileImageStyle} />
                </div>
            )}

            </div>

          
          </div>
          {!isLoading && <button style={buttonStyle} type="submit">Register</button> }
          {isLoading && <Loader type="spinner-cub" bgColor={'green'} color={'green'} title={"Registering Player..."} size={50} /> }
      </form>
    </div>
    <Footer/>
    </>
  );
};

const svgStyle :React.CSSProperties = {
  height : '1.5rem',
  width: '1.5rem',
  marginTop:'7px',
  marginLeft:'20px'

}

const formContainerStyle: React.CSSProperties = {
  // width: "100%",
  border: '1px solid green', 
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
  borderRadius: '8px', 
  textAlign:'center',
  // display:'grid',
  margin:'100px',
};

const formColumnStyle: React.CSSProperties = {
    display:'grid',
    // justifyContent:'center',
    padding:'10px'
    // 
};

const inputContainerStyle: React.CSSProperties = {
  flexBasis: "48%",
  height: "2rem",
  border: "2px solid #ccc",
  borderRadius: "8px",
  margin:'5px',
  // width : '80%'
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

const errorStyle: React.CSSProperties = {
  color: "red",
  display:'flex',
  marginLeft:'5px'
};

const profileImageStyle : React.CSSProperties = {
  height: '17rem',
  width: '12rem',
  padding: '5px',
  alignItems: 'flex-start',
  display: 'grid',
  marginTop: '-10px',
  objectFit:'cover',
}

const labelTextStyle : React.CSSProperties = {
  padding:'10px',
  color:'green',
  fontWeight:'600'
}

const isMobile = window.matchMedia("(max-width: 600px)").matches;
    if (isMobile) {
        formContainerStyle.margin = '20px'
        formContainerStyle.marginBottom = '80px'
        formContainerStyle.width = '88%';

        inputContainerStyle.width = '70%'
    }

export default PlayerRegistration;
