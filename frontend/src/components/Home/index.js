import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import Cookies from 'js-cookie';
import './index.css'

const Home = () => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [stat, setStat] = useState('');
    const [id, setId] = useState('');
    const [todos, setTodos] = useState([]);
    const navigate = useNavigate('');
    const url = 'https://task1-todo.onrender.com/api/todos';
    const token = Cookies.get("token");


    useEffect(() => {
        //console.log(token===undefined);
        if (token === undefined || token === null) {
            navigate('/login');
        } else {
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

    const update = async (item) => {

        const options = {
            method: "PUT",
            headers: {
                'Content-Type': "application/json",
                'token': token,
            },
            body: JSON.stringify(item)
        }
        //console.log(options);
        try {
            const res = await fetch(`${url}\\${item._id}`, options);
            if (res.ok) {
                const data = await res.json();
                //console.log(data);
                setTitle('');
                setDesc('');
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

    const logout = () => {
        Cookies.remove('token');
        navigate('/login');
    }

    const statusChange = (item, status) => {
        update({
            _id: item._id,
            title: item.title,
            status,
            description: item.description,
        })
    }
    const onEdit = (todo) => {
        //console.log(todo);
        setId(todo._id);
        setTitle(todo.title);
        setStat(todo.setStat);
        setDesc(todo.description);
    }
    const onUpdate = () => {
        update({
            _id: id,
            title,
            status: stat,
            description: desc,
        })
    }

    return (
        <div className="todos-bg-container">
            <div className="main-container">
                <div className="row">
                    <div className="col-12">
                        <h1 className="todos-heading">Todos</h1>
                        <div className="create-task-heading">
                            <h1 className="create-task-heading-subpart">Create Task</h1>
                            <LuLogOut className='delete-icon logout' onClick={logout}/>
                           

                        </div>
                        <input type="text" id="todoUserInput" className="todo-user-input" value={title} placeholder="What needs to be done?" onChange={(e) => { setTitle(e.target.value) }} />
                        <input type="textarea" className="todo-user-input" value={desc} placeholder="Description" onChange={(e) => { setDesc(e.target.value) }} />
                        <div>
                            <button className="button1" id="addTodoButton" onClick={add}>Add</button>
                            <button className="button1 update" onClick={onUpdate}>Update</button>

                        </div>
                        <h1 className="todo-items-heading">
                            My <span className="todo-items-heading-subpart">Tasks</span>
                        </h1>
                        <ul className="todo-items-container" id="todoItemsContainer">
                            {todos.map(each => {
                                return (
                                    <li className='todo-item-container' key={each._id}>
                                        <input type='checkbox' className='checkbox-input' checked={each.status === 'false' ? false : true} onChange={(e) => { statusChange(each, e.target.checked) }} />
                                        <div className='label-container'>
                                            <span className='checkbox-data'>
                                                <label className='checkbox-label' >{each.title}</label>
                                                <label className='checkbox-label-desc' >{each.description}</label>
                                            </span>
                                            <div className='delete-icon-container'>
                                                <MdOutlineEdit className='delete-icon edit' onClick={() => { onEdit(each) }} />
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