import { useEffect, useState } from 'react';
import './BookHalfOpen.css'
import chevronDown from '../../assets/chevron-down-solid-full.svg';
import leftPoint from '../../assets/hand-point-left-solid-full.svg'; 
import rightPoint from '../../assets/hand-point-right-solid-full.svg'; 
import pageFlipAudio from '../../assets/page-flip-sound.mp3'; 

interface BookHalfOpenProps {
    updateBook: boolean, 
    userId: String; 
}


function BookHalfOpen({updateBook, userId} : BookHalfOpenProps) {
    
    const [ lineNumber, setLineNumber ] = useState<number>(1); 
    const [ page, setPage ] = useState<number>(1); 
    const [ taskNum, setTaskNum ] = useState<number>(0); 

    useEffect(() => {
        const itemsLeft = document.querySelectorAll<HTMLElement>('.page-break-left');  
        itemsLeft.forEach((item, index) => {
            const baseHeight = 97; 
            const increase = index; 
            item.style.height = `${baseHeight + increase}%`; 
        }); 

        const itemsRight = document.querySelectorAll<HTMLElement>('.page-break-right');  
        itemsRight.forEach((item, index) => {
            const baseHeight = 97; 
            const increase = index; 
            item.style.height = `${baseHeight + increase}%`; 
        }); 
        
        const horizontalItemsLeft = document.querySelectorAll<HTMLElement>('.horizontal-page-breaks-left'); 
        horizontalItemsLeft.forEach((item, index) => {
            const baseWidth = 100; 
            const increase = index; 
            item.style.width = `${baseWidth + increase}%`; 
        }); 
        const horizontalItemsRight = document.querySelectorAll<HTMLElement>('.horizontal-page-breaks-right'); 
        horizontalItemsRight.forEach((item, index) => {
            const baseWidth = 100; 
            const increase = index; 
            item.style.width = `${baseWidth + increase}%`; 
        }); 

        if (updateBook || !updateBook) {
            //console.log("Handling update..."); 
            handleUpdateBookChange();
        }

    }, [updateBook]); 


    useEffect(() => {
        if (userId) { 
            fetchTasks(); 
        }
    }, [userId]); 

    useEffect(() => {
        if (lineNumber === 11) {  
            const pageLeft = document.getElementById("page-3"); 
            const pageRight = document.getElementById("page-4"); 
            pageLeft.style.display = "block"; 
            pageRight.style.display = "block"; 
            //console.log("line number is 11"); 
        }
        else if (lineNumber === 21) {
            const pageLeft = document.getElementById("page-5"); 
            const pageRight = document.getElementById("page-6"); 
            pageLeft.style.display = "block"; 
            pageRight.style.display = "block"; 
            //console.log("line number is 21"); 
        }
        else if (lineNumber === 31) {
            console.log("max tasks reached"); 
        }
    }, [lineNumber]); 

    useEffect(() => {

        const pages = document.querySelectorAll(".page"); 
        //console.log(pages);
        for (const page of pages) {
            page.style.display = "none"; 
        }

        if (page === 1) {
            const pageLeft = document.getElementById("page-1"); 
            const pageRight = document.getElementById("page-2"); 
            pageLeft.style.display = "flex"; 
            pageRight.style.display = "flex"; 
        } else if (page === 2) {
            const pageLeft = document.getElementById("page-3"); 
            const pageRight = document.getElementById("page-4"); 
            pageLeft.style.display = "flex"; 
            pageRight.style.display = "flex"; 
        } else if (page === 3) {
            const pageLeft = document.getElementById("page-5"); 
            const pageRight = document.getElementById("page-6"); 
            pageLeft.style.display = "flex"; 
            pageRight.style.display = "flex"; 
        }
    }, [page]); 

    const fetchTasks = async() => {
        //console.log("The userId is: " + userId); 
        const response = await fetch(`/api/get/todo-info?userId=${userId}`); 
        const data = await response.json(); //used specifically for fetch, waits for the fully donwloaded stream and then converts it into a obj
        if (response.ok) { 
            //console.log("The data: " + data.taskInfo); 
            updateTasks(data.taskInfo);  
        } else {
            //console.log("Didn't retrieve data"); 
        }
    }

    const handleUpdateBookChange = () => {
        //console.log(`page-line-break-${lineNumber}`); 
        const storedToDoInfo = sessionStorage.getItem('todoInfo'); 
        const info = JSON.parse(storedToDoInfo); 

        if (storedToDoInfo) {
            updateToDoList(info.taskHeading, info.fromDate, info.toDate, info.urgencyLevel, lineNumber);
            setLineNumber(prev => prev + 1);  //CHECK HERE IF BUG LOADING the tasks 
        }
        sessionStorage.removeItem('todoInfo'); 
        //use querySelector to grab all line elements 
        //grab info out from session storage
        //grab the innerHTML and add the necessary elements with db info
        //document.querySelectorAll
    }

    const updateToDoList = (taskName, fromDate, toDate, urgencyLevel, lineNumber) => {
        console.log(taskName); 
        const calculateDays = !fromDate; 
        let dayDiff; 
        let dayMsg; 
        let textColour = "rgb(113, 113, 113)"; 
        if (calculateDays) {
            const currentDate = new Date(); 
            currentDate.setHours(0, 0, 0, 0); 

            const userToDate = new Date(toDate + "T00:00:00"); 
            userToDate.setHours(0, 0, 0, 0); 

            const msDayDiff = Math.abs(userToDate - currentDate); 
            const toDateBehind = ((userToDate - currentDate) < 0) ? true : false; 
            textColour = toDateBehind ? "red" : "rgb(113, 113, 113)"; 
            //console.log(toDateBehind); 
            dayDiff = Math.floor(msDayDiff / (1000 * 60 * 60 * 24)); 

            
            switch (dayDiff) {
                case 0: 
                    dayMsg = "Due Today"; 
                    textColour = "red"; 
                    break; 
                case 1: 
                    dayMsg = toDateBehind ? dayDiff + " day(s) overdue" : dayDiff + " day left"; 
                    break; 
                default: 
                    dayMsg = toDateBehind ? dayDiff + " day(s) overdue" : dayDiff + " days left"; 
            }
        }
        const lineRows = document.getElementById(`page-line-break-${lineNumber}`); 
        if (lineRows) { 
            let urgencyBackgroundColour = ""; 
            if (urgencyLevel === "low") 
                urgencyBackgroundColour = "rgba(182, 218, 228, 0.43)"; 
            else if (urgencyLevel === "middle")
                urgencyBackgroundColour = "rgba(192, 249, 177, 0.534)"; 
            else if (urgencyLevel === "high")
                urgencyBackgroundColour = "rgba(210, 170, 161, 0.58)"; 

            lineRows.style.backgroundColor = urgencyBackgroundColour; 

            const checkbox = document.createElement('input'); 
            checkbox.type = 'checkbox'; 
            checkbox.id="task-checkbox"; 
            checkbox.addEventListener('click', handleCheckClick); 

            lineRows.innerHTML = `
                <div class="task-description-layout">
                    <div class="task-heading">
                        <h1>${taskName}</h1>
                    </div>
                    <img src=${chevronDown} id="chevron-down-icon" aria-hidden="true"></img>
                    <button id="edit-task-btn">Edit</button>
                    <h3 class="visual-task-date" style="color: ${textColour};">${calculateDays ? `${dayMsg}` : `${fromDate} to ${toDate}`} </h3>  
                </div>
                
            `; 
            lineRows.appendChild(checkbox); 
        }
    }

    const updateTasks = (data) => {
        //console.log("The data retrieved: " + data); 
        let currLineNumber = lineNumber; 
        for (const task of data) {
            console.log(task); 
            const { taskName, description, fromDate, toDate, urgency, completed } = task; 
            updateToDoList(taskName, fromDate, toDate, urgency, currLineNumber); 
            currLineNumber += 1; 
        }
        setLineNumber(currLineNumber); 
    }

    const handleLeftBtnClick = (e) => {
        //console.log("Left btn clicked!"); 
        const pageFlip = new Audio(pageFlipAudio); 
        pageFlip.volume = 0.5; 
        if (pageFlip.paused) { 
            pageFlip.play();
            console.log("Sound played"); 
        }

        setPage(prev => prev === 1 ? 1 : prev - 1); 
    }

    const handleRightBtnClick = (e) => {
        //console.log("Right btn clicked!"); 
        const pageFlip = new Audio(pageFlipAudio); 
        pageFlip.volume = 0.5; 
        if (pageFlip.paused) { 
            pageFlip.play();
            console.log("Sound played"); 
        }
        setPage(prev => prev === 3 ? 3 : prev + 1); 
    }

    const handleCheckClick = (e) => {
        if (e.target.checked)
            setTaskNum(prev => prev + 1); 
        else 
            setTaskNum(prev => prev - 1); 
        console.log("RUNNING!"); 
    }

    useEffect(() => {
        if (taskNum >= 1)
            handleFormUpdate(); 
        else if (taskNum === 0) {
            const updateContainer = document.getElementById('save-update-container'); 
            updateContainer.style.display = 'none'; 
        }
            
            
    }, [taskNum]); 

    const handleFormUpdate = () => {
        const updateContainer = document.getElementById('save-update-container'); 
        const updateText = document.getElementById('save-update-text'); 
        updateContainer.style.backgroundColor = 'orange'; 
        updateContainer.style.display = 'flex'; 
        updateText.innerHTML = `Are you sure you want to check off <span id="task-number" style="color: black">${taskNum}</span> task(s)?`; 
    }
    return (
        <>
            <div id="book-parent-container">

                <div id="whole-book-wrapper">
                    
                    <div className="book-wrapper" id="book-wrapper-left">
                        <div className="page-peak" id="page-peak-left">
                            <div className="page-break-left" style={{borderRight: '1px solid white'}}></div>
                            <div className="page-break-left"></div>
                            <div className="page-break-left"></div>
                            <div className="page-break-left" style={{borderLeft: '5px solid rgb(107, 82, 49)'}}></div>
                        </div>

                        <div className="book-content">
                            <div className="horizontal-page-breaks" id="horizontal-left">
                                <div className="horizontal-page-breaks-left"/>
                                <div className="horizontal-page-breaks-left"/>
                                <div className="horizontal-page-breaks-left"/> 
                            </div>
                            <div className="page" id="page-1">
                                <div className="page-line-break page-top" id="page-line-break-1"></div>
                                <div className="page-line-break" id="page-line-break-2"></div>
                                <div className="page-line-break" id="page-line-break-3"></div>
                                <div className="page-line-break" id="page-line-break-4"></div>
                                <div className="page-line-break" id="page-line-break-5"></div>
                            </div>
                            <div className="page" id="page-3" style={{display: 'none'}}>
                                <div className="page-line-break page-top" id="page-line-break-11"></div>
                                <div className="page-line-break" id="page-line-break-12"></div>
                                <div className="page-line-break" id="page-line-break-13"></div>
                                <div className="page-line-break" id="page-line-break-14"></div>
                                <div className="page-line-break" id="page-line-break-15"></div>
                            </div>
                            <div className="page" id="page-5" style={{display: 'none'}}>
                                <div className="page-line-break page-top" id="page-line-break-21"></div>
                                <div className="page-line-break" id="page-line-break-22"></div>
                                <div className="page-line-break" id="page-line-break-23"></div>
                                <div className="page-line-break" id="page-line-break-24"></div>
                                <div className="page-line-break" id="page-line-break-25"></div>
                            </div>
                        </div>
                    </div>

                    <div id="book-column-seperator"></div>

                    <div className="book-wrapper" id="book-wrapper-right">
                        <div className="page-peak" id="page-peak-right">
                            <div className="page-break-right" style={{borderRight: '1px solid white'}}></div>
                            <div className="page-break-right"></div>
                            <div className="page-break-right"></div>
                            <div className="page-break-right" style={{borderRight: '5px solid rgb(107, 82, 49)'}}></div>
                        </div>

                        <div className="book-content">
                            <div className="horizontal-page-breaks" id="horizontal-right">
                                <div className="horizontal-page-breaks-right"/>
                                <div className="horizontal-page-breaks-right"/>
                                <div className="horizontal-page-breaks-right"/> 
                            </div>
                            <div className="page" id="page-2">
                                <div className="page-line-break page-top" id="page-line-break-6">
                                    {/*
                                    <div className="task-description-layout">
                                        <div className="task-heading">
                                            <h1>Task Name</h1>
                                            <h3 className="visual-task-date">Date here...</h3>
                                        </div>
                                        <img src={chevronDown} id="chevron-down-icon" aria-hidden="true"></img>
                                        <button id="edit-task-btn">Edit</button>
                                    </div>
                                    <input type="checkbox" id="task-checkbox" onClick={handleCheckClick}></input> 
                                    */}
                                </div> 
                                <div className="page-line-break" id="page-line-break-7"></div>
                                <div className="page-line-break" id="page-line-break-8"></div>
                                <div className="page-line-break" id="page-line-break-9"></div>
                                <div className="page-line-break" id="page-line-break-10"></div>
                            </div>
                            <div className="page" id="page-4" style={{display: 'none'}}>
                                <div className="page-line-break page-top" id="page-line-break-16"></div> 
                                <div className="page-line-break" id="page-line-break-17"></div>
                                <div className="page-line-break" id="page-line-break-18"></div>
                                <div className="page-line-break" id="page-line-break-19"></div>
                                <div className="page-line-break" id="page-line-break-20"></div>
                            </div>
                            <div className="page" id="page-6" style={{display: 'none'}}>
                                <div className="page-line-break page-top" id="page-line-break-26"></div> 
                                <div className="page-line-break" id="page-line-break-27"></div>
                                <div className="page-line-break" id="page-line-break-28"></div>
                                <div className="page-line-break" id="page-line-break-29"></div>
                                <div className="page-line-break" id="page-line-break-30"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="navigate-pages">
                    <button className="nav-btn" id="nav-left-btn" onClick={handleLeftBtnClick}>
                        <img src={leftPoint} aria-hidden={true} className="point-icon"></img>
                    </button>
                    <button className="nav-btn" id="nav-right-btn" onClick={handleRightBtnClick}>
                        <img src={rightPoint} aria-hidden={true} className="point-icon"></img>
                    </button>
                </div>

            </div>


        </>
    ); 
}


export default BookHalfOpen 