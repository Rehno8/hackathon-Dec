import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios' // Import Axios

export default function Register() {

    // Navigate
    let Navigate = useNavigate()

    // Show Hide Password
    const [showPassword, setShowPassword] = useState(false)
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    // Email Format
    let emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // Form state
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // Handle Registration
    const handleRegister = async (e) => {
        e.preventDefault()

        if (!fullName) {
            alert("Please type your Full Name")
            return
        }
        if (!emailFormat.test(email)) {
            alert("Please type your email properly")
            return
        }
        if (password.length < 6) {
            alert("Password must be at least six characters")
            return
        }

        // Create user object
        const user = {
            name: fullName,
            email,
            password
        }

        try {
            // Send POST request to your backend
            const response = await axios.post('http://localhost:5006/register', user)

            if (response.data.status === 'ok') {
                alert("A new user has been successfully added")
                Navigate("/login")
            } else {
                alert(response.data.message || "Something went wrong")
            }

        } catch (error) {
            console.error(error)
            alert("Error registering user")
        }
    }

    return (
        <main>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="card p-4 text-center">
                            <form onSubmit={handleRegister}>
                                <h2 className='mb-4'>Register</h2>
                                <div>
                                    <input type="text" placeholder='Type Your Full Name' className='form-control my-4' name='fullName' value={fullName}
                                        onChange={(e) => setFullName(e.target.value)} autoComplete='newfullName' />
                                </div>
                                <div>
                                    <input type="email" placeholder='Type Your Email' className='form-control my-4' name='email' value={email}
                                        onChange={(e) => setEmail(e.target.value)} autoComplete='newemail' />
                                </div>
                                <div className='icon'>
                                    <input type={showPassword ? "text" : "password"} placeholder='Type Your Password' id='pass' className='form-control my-4' name='password' value={password}
                                        onChange={(e) => setPassword(e.target.value)} autoComplete='newpassword'/>
                                    <i onClick={togglePasswordVisibility} className='iconimg ' style={{ fontSize: 25 }}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </i>
                                </div>
                                <p>Already have an account? <Link to="/login">Login here</Link></p>
                                <button className='btn btn-success my-1'>Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
