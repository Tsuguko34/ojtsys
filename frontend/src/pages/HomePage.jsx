import React, { useEffect, useState } from 'react'
import BulSUBG from '../images/BulSUBG.png'
import BulSUBG2 from '../images/BulSUBG2.png'
import BulSULogo from '../images/BulSULogo.png'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Form, InputGroup, Button, Carousel } from 'react-bootstrap';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { Typewriter } from 'react-simple-typewriter'
import { useNavigate } from 'react-router'
import { v4 as uuid } from "uuid";
import Swal from 'sweetalert2'
import axios from 'axios'

function HomePage() {
    const navigate = useNavigate();
    const port = "http://localhost:8800"
    axios.defaults.withCredentials = true

    const [user, setUser] = useState('')

    useEffect(() => {
        const getUser = async() => {
          try{
            await axios.get(`${port}/getUser`).then((data) => {
              setUser(data.data[0])
            })
          }catch(e){
            console.log(e.message);
          }
        }
        getUser()
      }, []);

    
    const handleLogout = async() => {
        try{
            const logoutResponse = await axios.post(`${port}/logout`)
            if(logoutResponse.data.success == true){
                navigate('/Login')
            }
        }catch(e){
            console.log(e.message);
        }
    }

    return (
        <div style={{width: "100%", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <p>Welcome, {user.first_Name} {user.last_Name}</p>
            <Button variant='dark' onClick={handleLogout}>Logout</Button>
        </div>
    )
}

export default HomePage