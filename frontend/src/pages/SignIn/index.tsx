import './style.css'; 
import { useNavigate } from 'react-router-dom';

function SignIn() {

    let navigate = useNavigate(); 

    const handleSubmit = async(event) => {
        event.preventDefault();
        const username = event.target.elements['username'].value; //target the element with this name property 
        const password = event.target.elements['password'].value; 
        try {
            const response = await fetch('/api/submit/sign-in', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',  
                }, 
                body: new URLSearchParams({
                    'name-field': username, 
                    'password': password 
                })
            }); 
            const data = await response.json();
            console.log("HELLO I EXECUTED: " + data.error + " " + response.status); 
            if (!response.ok) {
                showError(data.error); 
            } else {
                navigate("/login"); 
                console.log("Success!"); 
            }
        } catch (error) {
            console.log("Failed", error); 
        }
    }
    const showError = (message) => {
        const errorSpan = document.getElementById('username-error'); 
        errorSpan.textContent = message;
        errorSpan.style.display = 'block'; 
    }
    return (
        <>
            <div id="sign-up-box">
                <form onSubmit={handleSubmit} method="POST" style={{width: '500px', height: '200px'}}>
                    <h1>Sign Up</h1>
                    <div id="form-elements-box" style={{border: '1px solid blue'}}>
                        <label htmlFor="username"></label>
                        <span id="username-error" style={{color: 'red', display: 'none'}}></span>
                        <input type="text" id="username" name="username" placeholder="Enter your username..."></input>

                        <label htmlFor="password"></label>
                        <input type="text" id="password" name="password" placeholder="Enter your password..."></input>

                        <button type="submit" style={{color: 'black'}}>Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default SignIn 