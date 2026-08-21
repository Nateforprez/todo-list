import './style.css'
import BookHalfOpen from '../../components/BookHalfOpen/BookHalfOpen' 
import { useEffect, useState } from 'react';
import xMark from '../../assets/x-solid-full.svg'; 

function TodoForm() {

    const [ username, setUsername ] = useState(""); 
    const [ userId, setUserId ] = useState(""); 

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user'); 
        if (storedUser) {
            const user = JSON.parse(storedUser); 
            setUsername(user.username); 
            setUserId(user.userId); 
        }
    }, []);  

    function handleAddTaskBtn(event) {
        if (event.currentTarget.id === "add-task-btn") {
            event.currentTarget.style.display = 'none'; 
            const todoForm = document.getElementById('todo-form'); 
            todoForm.style.display = 'block'; 
        }
    }
    
    const handleFormSubmission = async(event) => {
        event.preventDefault(); 
        const formData = Object.fromEntries(new FormData(event.target)); //turns the task data into an object 
        const { taskHeading, taskDescription, fromDate, toDate, urgencyLevel } = formData; 
        try {
            const response = await fetch('/api/submit/todo-info', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',  
                }, 
                body: new URLSearchParams({
                    username: username, 
                    id: userId, 
                    taskHeading: taskHeading.toString(), 
                    taskDescription: taskDescription.toString(), 
                    fromDate: fromDate.toString(), 
                    toDate: toDate.toString(), 
                    urgencyLevel: urgencyLevel.toString()
                })
            })

            const data = await response.json(); 
            if (response.ok) {
                console.log(data.success); 
                sessionStorage.setItem('todoInfo', JSON.stringify({
                    taskHeading: taskHeading.toString(), 
                    taskDescription: taskDescription.toString(), 
                    fromDate: fromDate.toString(), 
                    toDate: toDate.toString(), 
                    urgencyLevel: urgencyLevel.toString(), 
                    completed: false 
                }));    
                handleFormUpdate(data); 
            } else {
                const error = new Error(data.error); 
                throw error; 
            }
        } catch(err) {
            console.log("Form submission failed", err); 
            console.log(err.message); 
            handleFormUpdate(err.message); 
        }
        //const userId = event.target.elements[].value; 
    } 

    const handleFormUpdate = (msg) => {
        const updateContainer = document.getElementById('save-update-container'); 
        const updateText = document.getElementById('save-update-text'); 
        const xMarkIcon = document.getElementById('x-mark'); 
        if (msg.success) {
            updateContainer.style.backgroundColor = 'green'; 
            updateText.textContent = msg.success; 
            updateContainer.style.display = 'flex'; 
        } else {
            updateContainer.style.backgroundColor = 'red'; 
            updateText.textContent = msg; 
            updateContainer.style.display = 'flex'; 
        }
    }
    const handleCloseUpdateClick = () => {
        const updateContainer = document.getElementById('save-update-container'); 
        updateContainer.style.display = 'none'; 
    }
    return (
        <>
            <div id="todo-form-parent-container">
                <div id="save-update-container" style={{display: 'none'}}>
                    <h2 id="save-update-text"></h2>
                    <button id="close-update-banner-btn" onClick={handleCloseUpdateClick}>
                        <img id="x-mark" src={xMark} aria-hidden="true"></img>
                    </button>
                </div>
                <h1 style={{textAlign: "center"}}>Hello {username}!</h1>
                <div id="todo-list-form">
                    <BookHalfOpen/> 
                    <button id="add-task-btn" onClick={handleAddTaskBtn}>add task...</button>
                    <form action="/api/submit/todo-info" method="POST" id="todo-form" style={{display: 'none'}} onSubmit={handleFormSubmission}>
                        <div id="todo-form-container">
                            <h2>Task Name</h2>
                            <label htmlFor="taskHeading"/>
                            <input type="text" id="task-heading" name="taskHeading"  placeholder="Type your task heading here..."></input>
                            <h2>Description</h2>
                            <label htmlFor="taskDescription"/>
                            <textarea rows={5} cols={60} name="taskDescription"></textarea>
                            <h2>Date Due</h2>
                            <div id="from-to-date-container">
                                <label htmlFor="fromDate"></label>
                                <h3>From: </h3>
                                <input type="date" id="from-date" name="fromDate"></input>
                                <label htmlFor='toDate'></label>
                                <h3>To: </h3>
                                <input type="date" id="to-date" name="toDate"></input>
                            </div>
                            <h2>Urgency</h2>
                            <div id="urgency-container">
                                <div className="urgency-label-container">
                                    <label htmlFor="urgencyLevel"></label>
                                    <input type="checkbox" className="urgent-check-box" id="low-urgent" name="urgencyLevel" value="low"></input>
                                    <input type="checkbox" className="urgent-check-box" id="middle-urgent" name="urgencyLevel" value="middle"></input>
                                    <input type="checkbox" className="urgent-check-box" id="high-urgent" name="urgencyLevel" value="high"></input>
                                </div>
                                <div className="urgency-label-container">
                                    <h3>low</h3>
                                    <h3>middle</h3>
                                    <h3>high</h3>
                                </div>
                            </div>
                            <button type="submit" id="submit-form-btn">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    ); 
}

export default TodoForm 