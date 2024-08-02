import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import './index.css'
const Register = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const token = Cookies.get("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (token != undefined || token != null) {
            navigate('/');
        }

    })

    const register = async (event) => {
        event.preventDefault();
        const url = 'https://task1-todo.onrender.com/api/auth/register';
        const options = {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({ userName, password })
        }
        //console.log(options);
        try {
            const res = await fetch(url, options);
            console.log(res);
            if (res.ok) {
                const data = await res.json();
                Cookies.set("token", data.token, {
                    expires: 30,
                    path: '/',
                });
                setPassword("");
                setUserName("");
                navigate('/');
                console.log("User registered Successfully");
            }

        }
        catch {
            console.log("Error");
        }
    }

    return (
        <div className="container">
            <div className="container2 mt-3 col-sm-6 ">
                <form id="addUserForm" className="form m-auto">
                    <h3 className="textHead">Sign Up</h3>
                    <label htmlFor="name" className="label-data ">User Name</label><br />
                    <input type="text" name="" id="name" value={userName} className="form-control input" placeholder="Email " onChange={(e) => { setUserName(e.target.value) }} />
                    <p id="nameErrMsg"></p>
                    <label htmlFor="PWD" className="label-data">Password</label><br />
                    <input type="password" name="" id="PWD" value={password} className="form-control input" placeholder="Password" onChange={(e) => { setPassword(e.target.value) }} />
                    
                    <div className='remember-container'>
                        <input type="checkbox" name="" id="save" className="label-check" />
                        <label htmlFor="save" className="label-data">Remember me</label><br />
                    </div>
                    <div className="btn">
                        <button type="button" className="button " onClick={(e) => { register(e) }}>submit</button>
                    </div>
                </form>
                <br />
                <p className=" acc">I have an account?
                    <Link to="/login" className="signup">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}
export default Register;