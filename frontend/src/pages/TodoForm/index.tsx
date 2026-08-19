import './style.css'
import BookHalfOpen from '../../components/BookHalfOpen/BookHalfOpen' 
import { useEffect, useState } from 'react';

function TodoForm() {

    const [username, setUsername ] = useState(""); 

    useEffect(() => {
        const storedUser = sessionStorage.getItem('username'); 
        if (storedUser)
            setUsername(storedUser); 
    }, []);  

    return (
        <>
            <div id="todo-form-container">
                <h1>Hello {username}!</h1>
                <BookHalfOpen/> 
                <form action="/api/submit/todo-info" method="POST">
                    <h1>Heading</h1>
                    <label htmlFor="task-heading"/>
                    <input type="text" id="task-heading" name="task-heading"  placeholder="Type your task heading here..."></input>
                    <h2>Description</h2>
                    <label htmlFor=""/>
                    <input></input>
                </form>
            </div>
        </>
    ); 
}

export default TodoForm 