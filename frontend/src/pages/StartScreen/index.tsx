import BookUnopen from '../../components/BookClosed/BookUnopen'
import Login from '../../components/LoginPopup/Login' 
import './style.css'
import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 

function StartScreen() {
    //const [username, setUsername] = useState<string>("");
    const [username, setUsername] = useState(""); 
    return (
        <>
            <div id="start-screen-wrapper">
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