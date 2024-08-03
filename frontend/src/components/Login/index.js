import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import './index.css';


const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const token = Cookies.get("token");
    const url = 'https://task1-todo.onrender.com/api/auth/login';

    useEffect(() => {
        if (token != undefined || token != null) {
            navigate('/');
        }

    })

    const login = async (event) => {
        event.preventDefault();

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
            //console.log(res);
            if (res.ok) {
                const data = await res.json();
                Cookies.set("token", data.token, {
                    expires: 30,
                    path: '/',
                });
                
                await new Promise((resolve) => {
                    toast.success('User Login Successfully', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        onClose: resolve // Resolve promise when the toast is closed
                    });
                });
                
                
                setTimeout(() => {
                    navigate('/');
                }, 1000);

                
            }
            else {
                const data = await res.json();
                toast.error(`${data.msg}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",

                });
                //console.log(data);
            }
            setPassword("");
            setUserName("");

        }
        catch {
            toast.error('An error occurred', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }
    return (
        <div className="container">
            <div className="container2  ">
                <form id="addUserForm" className="form">
                    <h3 className="textHead">Login</h3>
                    <label htmlFor="name" className="label-data ">User Name</label><br />
                    <input type="text" name="" id="name" value={userName} className="form-control input" placeholder="Email" onChange={(e) => { setUserName(e.target.value) }} />
                    <p id="nameErrMsg"></p>
                    <label htmlFor="PWD" className="label-data">Password</label><br />
                    <input type="password" name="" id="PWD" value={password} className="form-control input" placeholder="Password" onChange={(e) => { setPassword(e.target.value) }} />

                    <div className='remember-container'>
                        <input type="checkbox" name="" id="save" className="label-check" />
                        <label htmlFor="save" className="label-data">Remember me</label><br />
                    </div>
                    <div className="btn">
                        <button type="button" className="button " onClick={(e) => { login(e) }}>submit</button>
                    </div>
                </form>
                <br />
                <p className=" acc">Don't have an account?
                    <Link to="/signup" className="signup">
                        Sign Up
                    </Link>
                </p>

            </div>
            <ToastContainer />
        </div>
    )
}
export default Login;