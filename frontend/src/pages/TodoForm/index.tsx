import './style.css'
import BookHalfOpen from '../../components/BookHalfOpen/BookHalfOpen' 
import { useEffect, useState } from 'react';
import xMark from '../../assets/x-solid-full.svg'; 
import returnArrow from '../../assets/arrow-return.svg'; 
import ascendingArrow from '../../assets/arrow-up-ascending-order-solid-full.svg'; 
import descendingArrow from '../../assets/arrow-down-descending-order-solid-full.svg'; 

function TodoForm() {

    const [ username, setUsername ] = useState(""); 
    const [ userId, setUserId ] = useState(""); 
    const [ updateVisuals, setUpdateVisuals ] = useState<boolean>(false); 
    const [updateTaskPopup, setTaskPopup] = useState<boolean>(false); 
    const filterGreen = 'invert(88%) sepia(21%) saturate(1915%) hue-rotate(105deg) brightness(97%) contrast(93%)'; 
    const filterRed = 'invert(21%) sepia(100%) saturate(7414%) hue-rotate(359deg) brightness(94%) contrast(117%)'; 

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user'); 
        if (storedUser) {
            const user = JSON.parse(storedUser); 
            setUsername(user.username); 
            setUserId(user.userId); 
        }
    }, []);  


    const handleTaskBtn = (event) => {
        
        document.querySelectorAll('.task-btn').forEach(btn => {
            btn.style.display = 'none'; 
        }); 
        event.currentTarget.closest('#task-btn-selection').style.display = 'none'; 

        switch(event.currentTarget.id) {
            case 'add-task-btn': 
                const todoForm = document.getElementById('todo-form'); 
                todoForm.style.display = 'block'; 
                break; 
            case 'delete-task-btn': 
                const container = document.getElementById('delete-task-container'); 
                container.style.display = "flex"; 
                setTaskPopup(true);   
                break; 
            case 'filter-task-btn': 
                const filterContainer = document.getElementById('filter-task-container'); 
                filterContainer.style.display = 'flex'; 
                console.log("clicked"); 
                break; 
            default: 
                break; 
        }

    }

    const handleReturnClick = (e) => {
        const parent = e.currentTarget.closest(".pop-up"); 
        parent.style.display = "none"; 
        document.getElementById('task-btn-selection').style.display = 'flex'; 
        document.querySelectorAll('.task-btn').forEach(btn => {
            btn.style.display = 'block'; 
        }); 
        setTaskPopup(false);
    }
    
    const handleFormSubmission = async(event) => {
        event.preventDefault(); 
        const formData = Object.fromEntries(new FormData(event.target)); //turns the task data into an object 
        const { taskHeading, taskDescription, fromDate, toDate, urgencyLevel } = formData; 

        if (formData.fromDate && !handleFromDateCheck(formData.fromDate)) //check if dates are valid 
            return;         
        if (formData.toDate && !handleToDateChange(formData.fromDate, formData.toDate))
            return; 
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
                console.log(data.taskId); 
                sessionStorage.setItem('todoInfo', JSON.stringify({
                    taskId: data.taskId, 
                    taskHeading: taskHeading.toString(), 
                    taskDescription: taskDescription.toString(), 
                    fromDate: fromDate.toString(), 
                    toDate: toDate.toString(), 
                    urgencyLevel: urgencyLevel.toString(), 
                    completed: false 
                }));    
                //console.log("HELLO I EXIST"); 
                setUpdateVisuals(!updateVisuals); 
                handleFormUpdate(data); 
                event.target.reset();
            } else {
                const error = new Error(data.error); 
                throw error; 
            }
        } catch(err) {
            console.log("Form submission failed", err); 
            console.log("The error name is: " + err.name); 
            if (err instanceof TypeError) {
                if (!taskHeading)  
                    handleFormUpdate("Please fill in the Task Name section."); 
                else if (!taskDescription)
                    handleFormUpdate("Please fill in the Task Description."); 
                else if (!toDate) 
                    handleFormUpdate("Please fill in the To Date."); 
                else if (!urgencyLevel) 
                    handleFormUpdate("Please check off an urgency."); 
            } else {
                handleFormUpdate(err.message); 
            }
            console.log(err.message); 
        }
        //const userId = event.target.elements[].value; 
    } 

    const handleTaskDeletion = async (ids) => {
        try {
            const response = await fetch(`/api/delete/todo-info?userId=${userId}`, {
                method: 'DELETE', 
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({ 
                    taskIds: ids 
                }) 
            }); 
            const data = await response.json(); 

            if (response.ok) {
                console.log(data.success); 
                setUpdateVisuals(!updateVisuals); 
                handleDeletionUpdated(data, ids.length); 
            }
        } catch (err) {
            handleDeletionUpdated("Error: Tasks not deleted " + err); 
            console.log(err); 
        }
        
    }
    const handleDeletionUpdated = (msg, taskNum) => {
        const updateContainer = document.getElementById('deletion-update-container'); 
        console.log("updateContainer: " + updateContainer); 
        const updateText = updateContainer.querySelector('#delete-update-text'); 
        if (msg.success) { 
            updateContainer.style.backgroundColor = 'green'; 
            updateText.textContent = taskNum + " task(s) " + msg.success; 
            updateContainer.style.display = 'flex'; 
        } else {
            updateContainer.style.backgroundColor = 'red'; 
            updateText.textContent = msg; 
            updateContainer.style.display = 'flex'; 
        }
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
    const handleCloseUpdateClick = (e) => {
        const container = e.currentTarget.parentElement; 
        container.style.display = 'none'; 
    }

    const handleCheckClick = (event) => {
        const currCheckbox = event.target; 
        console.log(currCheckbox.checked); 
        if (currCheckbox.checked) { 
            const allCheckboxes = document.getElementsByName('urgencyLevel'); 
            allCheckboxes.forEach(element => element.checked = false);
            currCheckbox.checked = true;  
        } else {
            currCheckbox.checked = false; 
        }
    }

    const handleFilterCheck = (event) => {
        const currCheckbox = event.target; 
        const parent = currCheckbox.closest('.filter-attributes'); 
        if (currCheckbox.checked) { 
            parent.querySelector('h2').style.color = 'green'; 

        } else {
            parent.querySelector('h2').style.color = "rgb(64, 56, 43)";
            currCheckbox.checked = false; 
        }
    }

    const handleFromDateCheck = (date) => {
        const currentDate = new Date(); 
        currentDate.setHours(0, 0, 0, 0); 
        const selectedDate = new Date(date + "T00:00:00"); 
        selectedDate.setHours(0, 0, 0, 0); 

        console.log(selectedDate, currentDate, selectedDate < currentDate); 
        if (selectedDate < currentDate) {
            handleFormUpdate("Please select a valid From Date"); 
            return false; 
        }
        return true; 
    }
    const handleToDateChange = (fromDate, toDate) => {
        const currentDate = new Date(); 
        currentDate.setHours(0, 0, 0, 0); 
        const userToDate = new Date(toDate + "T00:00:00"); 
        userToDate.setHours(0, 0, 0, 0); 
        
        if (fromDate) { 
            const userFromDate = new Date(fromDate + "T00:00:00"); 
            userFromDate.setHours(0, 0, 0, 0); 

            if (userToDate < userFromDate) {
                handleFormUpdate("Please select a valid date range"); 
                return false; 
            }
        }

        if (userToDate < currentDate) {
            handleFormUpdate("Please select a valid To Date"); 
            return false; 
        } 
        return true; 
    }
    
    const confirmDeleteTask = (e) => {
        const taskContainer = document.querySelectorAll(".task-description-layout"); 
        const ids = []; 
        taskContainer.forEach(container => {
            const parent = container.parentElement; 
            if (parent.querySelector('#task-checkbox').checked) {
                const id = container.getAttribute('data-id'); 
                ids.push(id); 
            } 
        }); 
        console.log(ids); 
        if (ids.length > 0)
            handleTaskDeletion(ids); 
        else 
            handleDeletionUpdated("Please select task(s) to delete."); 
    }

    const handleFilterOrderClick = (e) => {
        console.log('Clicked!');
        if (e.currentTarget.classList.contains('filter-btn-asce')) {
            if (!e.currentTarget.classList.contains('green-filter')) 
                e.currentTarget.classList.add('green-filter'); 
            else
                e.currentTarget.classList.remove('green-filter'); 
        }
        else if (e.currentTarget.classList.contains('filter-btn-desc')) {
            if (!e.currentTarget.classList.contains('red-filter')) 
                e.currentTarget.classList.add('red-filter'); 
            else
                e.currentTarget.classList.remove('red-filter'); 
        }
    }

    return (
        <>
            <div id="todo-form-parent-container">
                <div id="save-update-container" className="update-container" style={{display: 'none'}}>
                    <h2 id="save-update-text" className="update-text"></h2>
                    <button className="close-update-banner-btn" onClick={handleCloseUpdateClick}>
                        <img id="x-mark" className="x-icon" src={xMark} aria-hidden="true"></img>
                    </button>
                </div>
                <div id="deletion-update-container" className="update-container" style={{display: 'none'}}>
                    <h2 id="delete-update-text" className="update-text"></h2>
                    <button className="close-update-banner-btn" onClick={handleCloseUpdateClick}>
                        <img id="x-mark" className="x-icon" src={xMark} aria-hidden="true"></img>
                    </button>
                </div>
                <h1 style={{textAlign: "center"}}>Hello {username}</h1>
                <div id="todo-list-form">
                    <BookHalfOpen updateBook={updateVisuals} userId={userId} showTaskPopup={updateTaskPopup}/> 
                    <div id="task-btn-selection">
                        <button className="task-btn" id="add-task-btn" onClick={handleTaskBtn}>add task...</button>
                        <button className="task-btn" id="filter-task-btn" onClick={handleTaskBtn}>filter tasks...</button>
                        <button className="task-btn" id="delete-task-btn" onClick={handleTaskBtn}>delete task...</button>
                    </div>
                    <form action="/api/submit/todo-info" method="POST" id="todo-form" className="pop-up" style={{display: 'none'}} onSubmit={handleFormSubmission}>
                        <div id="todo-form-container">
                            <button id="return-btn" type="button" onClick={handleReturnClick}>
                                <img id="return-arrow-img" src={returnArrow} aria-hidden={true} alt="return" draggable="false"></img>
                            </button>
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
                                    <input type="checkbox" className="urgent-check-box" id="low-urgent" name="urgencyLevel" value="low" onClick={handleCheckClick}></input>
                                    <input type="checkbox" className="urgent-check-box" id="middle-urgent" name="urgencyLevel" value="middle" onClick={handleCheckClick}></input>
                                    <input type="checkbox" className="urgent-check-box" id="high-urgent" name="urgencyLevel" value="high" onClick={handleCheckClick}></input>
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
                    <div id="filter-task-container" className="pop-up pop-up-container" style={{display: 'none'}}>
                        <button id="return-btn" type="button" onClick={handleReturnClick}>
                            <img id="return-arrow-img" src={returnArrow} aria-hidden={true} alt="return" draggable="false"></img>
                        </button>
                        <div id="filter-selection-container">
                            <div id="filter-by-text"><h2>Filter By: </h2></div>
                            <div className="filter-attributes">
                                <div className="filter-label-container">
                                    <h2>Status</h2>
                                    <button className="filter-btn filter-btn-desc" id="filter-btn-descending" type="button" onClick={handleFilterOrderClick}>
                                        <img id="filter-img" src={descendingArrow} aria-hidden={true} alt="ascending-arrow" draggable="false"></img>
                                    </button>
                                    <button className="filter-btn filter-btn-asce" id="filter-btn-ascending"type="button" onClick={handleFilterOrderClick}>
                                        <img id="filter-img" src={ascendingArrow} aria-hidden={true} alt="ascending-arrow" draggable="false"></img>
                                    </button>
                                </div>
                                <input type="checkbox" className="filter-check-box" id="status-checkbox" name="filter" value="high" onClick={handleFilterCheck}></input>
                            </div>
                            <div className="filter-attributes">
                                <div className="filter-label-container">
                                    <h2>Due Date</h2>
                                    <button className="filter-btn filter-btn-desc" id="filter-btn-descending" type="button" onClick={handleFilterOrderClick}>
                                        <img id="filter-img" src={descendingArrow} aria-hidden={true} alt="ascending-arrow" draggable="false"></img>
                                    </button>
                                    <button className="filter-btn filter-btn-asce" id="filter-btn-ascending"type="button" onClick={handleFilterOrderClick}>
                                        <img id="filter-img" src={ascendingArrow} aria-hidden={true} alt="ascending-arrow" draggable="false"></img>
                                    </button>
                                </div>
                                <input type="checkbox" className="filter-check-box" id="status-checkbox" name="filter" value="high" onClick={handleFilterCheck}></input>
                            </div>
                            <div className="filter-attributes">
                                <div className="filter-label-container">
                                    <h2>Urgency</h2>
                                    <button className="filter-btn filter-btn-desc" id="filter-btn-descending" type="button" onClick={handleFilterOrderClick}>
                                        <img id="filter-img" src={descendingArrow} aria-hidden={true} alt="ascending-arrow" draggable="false"></img>
                                    </button>
                                    <button className="filter-btn filter-btn-asce" id="filter-btn-ascending"type="button" onClick={handleFilterOrderClick}>
                                        <img id="filter-img" src={ascendingArrow} aria-hidden={true} alt="ascending-arrow" draggable="false"></img>
                                    </button>
                                </div>
                                <input type="checkbox" className="filter-check-box" id="status-checkbox" name="filter" value="high" onClick={handleFilterCheck}></input>
                            </div>
                        </div>
                    </div>
                    <div id="delete-task-container" className="pop-up pop-up-container" style={{display: 'none'}}>
                        <button id="return-btn" type="button" onClick={handleReturnClick}>
                            <img id="return-arrow-img" src={returnArrow} aria-hidden={true} alt="return" draggable="false"></img>
                        </button>
                        <h2>Check off the tasks you want to delete: </h2>
                        <button className="delete-btn" id="confirm-delete-task-btn" onClick={confirmDeleteTask}>delete</button>
                    </div>
                </div>
            </div>
        </>
    ); 
}

export default TodoForm 