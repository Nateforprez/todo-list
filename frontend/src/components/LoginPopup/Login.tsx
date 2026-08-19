import './Login.css'
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate(); 

    const handleSubmit = async(event) => {
        event.preventDefault();
        const username = event.target.elements['username'].value; //target the element with this name property 
        const password = event.target.elements['password'].value; 
        try {
            const response = await fetch('/api/submit/login', {
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
            if (response.ok) { 
                console.log(data.user.username); 
                sessionStorage.setItem('username', data.user.username); 
                navigate('/todo-list');
            }
            else 
                loginWarning(data.error); 

        } catch (err) {
            console.log("Failed", err.error); 
        }
    }

    const loginWarning = (msg) => {
        const warningBox = document.getElementById("login-warning-container"); 
        warningBox.textContent = msg; 
        warningBox.style.display = 'block'; 
    }

    return (
        <>
            <div id="login-box">
                <form onSubmit={handleSubmit} method="POST" style={{width: '500px', height: '200px'}}>
                    <h1>Login</h1>
                    <div id="form-elements-box">
                        <span id="login-warning-container" style={{display: 'none', color: 'red', width: '320px'}}></span>
                        <label htmlFor="username"></label>
                        <input type="text" id="username" name="username" placeholder="Enter your username..."></input>

                        <label htmlFor="password"></label>
                        <input type="text" id="password" name="password" placeholder="Enter your password..."></input>

                        <button type="submit" style={{color: 'black'}}>Submit</button>
                    </div>
                </form>
            </div>
        </>
    ); 
}

export default Login 