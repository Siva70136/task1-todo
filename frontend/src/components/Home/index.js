import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDeleteOutline } from "react-icons/md";
import Cookies from 'js-cookie';
import './index.css'

const Home = () => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [todos, setTodos] = useState([]);
    const navigate = useNavigate('');
    const url = 'https://task1-todo.onrender.com/api/todos';
    const token = Cookies.get("token");

    
    useEffect(() => {
        //console.log(token===undefined);
        if (token === undefined || token === null) {
            navigate('/login');
        }else{
            getData();
        }
        
    }, [])

    const getData = async () => {
        const options = {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                'token': token,
            },
        }
        try {
            const res = await fetch(url, options);
            if (res.ok) {
                const data = await res.json();
                //console.log(data);
                setTodos(data);
            }
        }
        catch {
            console.log("error");
        }
    }

    const update = async (item, status) => {

        const options = {
            method: "PUT",
            headers: {
                'Content-Type': "application/json",
                'token': token,
            },
            body: JSON.stringify({
                title: item.title,
                status,
                description: item.description,
            })
        }
        //console.log(options);
        try {
            const res = await fetch(`${url}\\${item._id}`, options);
            if (res.ok) {
                const data = await res.json();
                //console.log(data);
                getData();
            }
        }
        catch {
            console.log("error");
        }
    }

    const add = async (event) => {
        event.preventDefault();

        const options = {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'token': token,
            },
            body: JSON.stringify({
                title,
                status: false,
                description: desc,
            })
        }

        //console.log(options);

        try {
            const res = await fetch(url, options);
            //console.log(res);
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("token", data.token);
                setTitle("");
                setDesc("");
                getData();
                console.log("User Login Successfully");
            }

        }
        catch {
            console.log("Error");
        }
    }

    const remove = async (id) => {

        const options = {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json",
                'token': token,
            }
        }
        //console.log(options);
        try {
            const res = await fetch(`${url}\\${id}`, options);
            if (res.ok) {
                const data = await res.json();
                getData();
            }
        }
        catch {
            console.log("error");
        }
    }

    return (
        <div className="todos-bg-container">
            <div className="main-container">
                <div className="row">
                    <div className="col-12">
                        <h1 className="todos-heading">Todos</h1>
                        <h1 className="create-task-heading">
                            Create <span className="create-task-heading-subpart">Task</span>
                        </h1>
                        <input type="text" id="todoUserInput" className="todo-user-input" value={title} placeholder="What needs to be done?" onChange={(e) => { setTitle(e.target.value) }} />
                        <input type="textarea"  className="todo-user-input" value={desc} placeholder="Description" onChange={(e) => { setDesc(e.target.value) }} />
                        <div>
                            <button className="button1" id="addTodoButton" onClick={add}>Add</button>
                        </div>
                        <h1 className="todo-items-heading">
                            My <span className="todo-items-heading-subpart">Tasks</span>
                        </h1>
                        <ul className="todo-items-container" id="todoItemsContainer">
                            {todos.map(each => {
                                return (
                                    <li className='todo-item-container' key={each._id}>
                                        <input type='checkbox' className='checkbox-input' checked={each.status === 'false' ? false : true} onChange={(e) => { update(each, e.target.checked) }} />
                                        <div className='label-container'>
                                            <span className='checkbox-data'>
                                                <label className='checkbox-label' >{each.title}</label>
                                                <label className='checkbox-label-desc' >{each.description}</label>
                                            </span>
                                            <div className='delete-icon-container'>
                                                <MdDeleteOutline className='delete-icon' onClick={() => { remove(each._id) }} />
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Home;