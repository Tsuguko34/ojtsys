import React, { useState } from 'react'
import BulSUBG from '../images/BulSUBG.png'
import BulSUBG2 from '../images/BulSUBG2.png'
import BulSULogo from '../images/BulSULogo.png'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Form, InputGroup, Button, Carousel } from 'react-bootstrap';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { Typewriter } from 'react-simple-typewriter'
import { v4 as uuid } from "uuid";
import Swal from 'sweetalert2'
import axios from 'axios'
import { useNavigate } from 'react-router'

function RegistrationPage() {
    const navigate = useNavigate();
    const port = "http://localhost:8800"
    axios.defaults.withCredentials = true

    //States
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirm_Password] = useState('');
    const [username, setUsername] = useState('');
    const [first_Name, setFirst_Name] = useState('');
    const [last_Name, setLast_Name] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const uniqueID = uuid()


    //Password Visibility
    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    //Handle Registration
    const registerUser = async(e) => {
        e.preventDefault()
        //Check Password Match
        if(password !== confirm_password){
            Swal.fire({icon: "error", text: "Passwords do not match.", confirmButtonColor: "#C41E3A"})
        }else{
            try{
                //Check if Email Exists
                const emailResponse = await axios.get(`${port}/searchEmail?email=${email}`)
                if(emailResponse.data.success == false){
                    Swal.fire({icon: "error", text: "An unexpected error has occured.", confirmButtonColor: "#C41E3A"})
                }
                else if(emailResponse.data.success == true){
                    if(emailResponse.data.email == true){
                        Swal.fire({icon: "error", text: "Email has been already registered.", confirmButtonColor: "#C41E3A"})
                    }
                    else if(emailResponse.data.email == false){
                        //Check if Username Exists
                        const usernameResponse = await axios.get(`${port}/searchUsername?username=${username}`)
                        if(usernameResponse.data.success == false){
                            console.log(true, 2);
                            Swal.fire({icon: "error", text: "An unexpected error has occured.", confirmButtonColor: "#C41E3A"})
                        }
                        else if(usernameResponse.data.success == true){
                            if(usernameResponse.data.username == true){
                                Swal.fire({icon: "error", text: "Username has been already registered.", confirmButtonColor: "#C41E3A"})
                            }
                            else if(usernameResponse.data.username == false){
                                const values = {
                                    UID : uniqueID,
                                    fName : first_Name,
                                    lName : last_Name,
                                    password : password,
                                    username : username,
                                    email : email
                                }
                                //Register query
                                await axios.post(`${port}/register`, values).then(async(register_data) => {
                                    if(register_data.data.success == false){
                                        Swal.fire({icon: "error", text: "An unexpected error has occured.", confirmButtonColor: "#C41E3A"})
                                    }
                                    else if(register_data.data.success == true){
                                        Swal.fire({icon: "success", text: "Successfully registered. A verification link has been sent on your email.", confirmButtonColor: "#C41E3A"}).then(() => {
                                            navigate('/Login')
                                        })
                                    }
                                })
                            }
                        }
                    }
                }
            }catch(e){
                console.log(e.message);
                Swal.fire({icon: "error", text: "An unexpected error has occured.", confirmButtonColor: "#C41E3A"})
            }
        }
    }

  return (
    <div className='LoginBody'>
        <Container fluid style={{margin: "0"}}>
            <Row>
                <Col sm={12} lg={8} className='image-container'>
                    <Carousel interval={3000} controls={false} indicators={false}>
                        <Carousel.Item >
                            <img src={BulSUBG} className="image-box" alt="" />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src={BulSUBG2} className="image-box" alt="" />
                        </Carousel.Item>
                    </Carousel>
                    
                </Col>
                <Col sm={12} lg={4}>
                    <div className='form-box'>
                        <img src={BulSULogo} width={'85px'} alt="" />
                        <span className='title signup'>B<small>ulacan</small> S<small>tate</small> U<small>niversity</small></span>
                        <span className='title-signUp'>Sign Up</span>
                        <form id='signUp' onSubmit={registerUser} className='form-inputs'>
                            <Form.Group controlId="formPassword" className='form-inputs'>
                                <Container style={{margin: "0"}}>
                                    <Row>
                                        <Col sm={12} md={6} className='fname-input'>
                                            <Form.Label className='form-labels'>First Name</Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                        type='text'
                                                        value={first_Name}
                                                        onChange={(e) => setFirst_Name(e.target.value)}
                                                        placeholder="Enter first name"
                                                        className='form-main-inputs'
                                                        maxLength={50}
                                                        required
                                                    />
                                            </InputGroup>
                                        </Col>
                                        <Col sm={12} md={6} className='lname-input'>
                                            <Form.Label className='form-labels'>Last Name</Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                        type='text'
                                                        value={last_Name}
                                                        onChange={(e) => setLast_Name(e.target.value)}
                                                        placeholder="Enter last name"
                                                        className='form-main-inputs'
                                                        maxLength={50}
                                                        required
                                                    />
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Container>
                            </Form.Group>
                            <Form.Group controlId="formPassword" className='form-inputs'>
                                <Form.Label className='form-labels'>Username</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type='text'
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter username"
                                        className='form-main-inputs'
                                        maxLength={30}
                                        required
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group controlId="formPassword" className='form-inputs'>
                                <Form.Label className='form-labels'>Email</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter email"
                                        className='form-main-inputs'
                                        required
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group controlId="formPassword" className='form-inputs'>
                                <Form.Label className='form-labels'>Password</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        required
                                    />
                                        <Button
                                            variant="outline-secondary"
                                            onClick={handleTogglePasswordVisibility}
                                        >
                                            {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                                        </Button>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group controlId="formPassword" className='form-inputs'>
                                <Form.Label className='form-labels'>Confirm Password</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirm_password}
                                        onChange={(e) => setConfirm_Password(e.target.value)}
                                        placeholder="Enter password"
                                        required
                                    />
                                        <Button
                                            variant="outline-secondary"
                                            onClick={handleTogglePasswordVisibility}
                                        >
                                            {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                                        </Button>
                                </InputGroup>
                            </Form.Group>
                            <Button type='submit' className='form-submit signup'>Sign Up</Button>
                        </form>
                        <span className='link'>Don't have an account? <a href="./Login">Click here.</a></span>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default RegistrationPage