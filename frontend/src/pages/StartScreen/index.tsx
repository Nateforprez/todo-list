import BookUnopen from '../../components/BookClosed/BookUnopen'
import Login from '../../components/LoginPopup/Login' 
import xMark from '../../assets/x-solid-full.svg'; 
import './style.css'
import { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom'; 

function StartScreen() {
    //const [username, setUsername] = useState<string>("");
    const [username, setUsername] = useState(""); 

    const handleCloseUpdateClick = () => {
        const updateContainer = document.getElementById('save-update-container'); 
        updateContainer.style.display = 'none'; 
    }

    useEffect(() => {
        console.log("UseEffect is active!"); 
        const successText = sessionStorage.getItem('signInSuccessText'); 
        if (successText) {
            const updateContainer = document.getElementById('save-update-container'); 
            const updateText = document.getElementById('save-update-text'); 
            updateContainer.style.display = 'flex'; 
            updateContainer.style.backgroundColor = 'green'; 
            updateText.textContent = successText; 
            sessionStorage.removeItem('signInSuccessText'); 
        }
    }); 

    return (
        <>
            <div id="start-screen-wrapper">
                <div id="save-update-container" style={{display: 'none'}}>
                    <h2 id="save-update-text"></h2>
                    <button id="close-update-banner-btn" onClick={handleCloseUpdateClick}>
                        <img id="x-mark" src={xMark} aria-hidden="true"></img>
                    </button>
                </div>
                <BookUnopen user={username}/> 
                <div id="start-menu">
                    <Login/>
                    <div>
                        <h2>Name: </h2>
                        <label htmlFor='name-field'></label>
                        <input id="name-field" type="text" placeholder="Enter your name here..." name="name-field" onChange={(event) => setUsername(event.target.value)}></input>
                    </div>
                    <button id="start-btn">Start</button>
                    <Link to="/sign-up" style={{marginBottom: '20px'}}>Don't have an account yet?</Link>
                </div>
            </div>
        </>
    ); 
}

export default StartScreen 