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
import { useNavigate } from 'react-router'
import { v4 as uuid } from "uuid";
import Swal from 'sweetalert2'
import axios from 'axios'

function LoginPage() {
    const navigate = useNavigate();
    const port = "http://localhost:8800"
    axios.defaults.withCredentials = true

    //States
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    //Password Visibility
    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    //Handle Login
    const loginUser = async(e) => {
        e.preventDefault()
        try{
            const values = {
                username : username,
                password : password
            }
            const loginResponse = await axios.post(`${port}/login`, values)
            if(loginResponse.data.success == false){
                Swal.fire({icon: "error", text: "An unexpected error has occured.", confirmButtonColor: "#C41E3A"})
            }
            else{
                if(loginResponse.data.userExist == false){
                    Swal.fire({icon: "error", text: "User does not exist.", confirmButtonColor: "#C41E3A"})
                }
                else if(loginResponse.data.userExist == true){
                    if(loginResponse.data.pass == false){
                        Swal.fire({icon: "error", text: "Wrong Password.", confirmButtonColor: "#C41E3A"})
                    }
                    else if(loginResponse.data.pass == true){
                        if(loginResponse.data.verified == true){
                            Swal.fire({icon: "success", text: "Successfully Logged In.", showConfirmButton: false, timer: 2000}).then(() => {
                                navigate('/Home')
                            })
                        }
                        else if(loginResponse.data.verified == false){
                            Swal.fire({icon: "error", text: "Account is not verified. Please check your email for the link.", confirmButtonColor: "#C41E3A"})
                        }
                        
                    }
                }
            }
        }catch(e){
            console.log(e.message);
            Swal.fire({icon: "error", text: "An unexpected error has occured.", confirmButtonColor: "#C41E3A"})
        }
        
    }

  return (
    <div className='LoginBody'>
        <Container fluid style={{margin: "0", maxWidth: "1920px"}}>
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
                        <span className='title'>B<small>ulacan</small> S<small>tate</small> U<small>niversity</small></span>
                        <span className='typewriter'><Typewriter words={['Welcome back!', 'Maligayang pagbabalik!']} typeSpeed={30} deleteSpeed={30} cursor cursorStyle='|' loop/></span>
                        <form onSubmit={loginUser} className='form-inputs'>
                            <Form.Group controlId="formPassword" className='form-inputs'>
                                <Form.Label className='form-labels'>Username</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type='text'
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter username"
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
                            <Button type='submit' className='form-submit'>Login</Button>
                        </form>
                        <span className='link'>Don't have an account? <a href="./Registration">Click here.</a></span>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default LoginPage