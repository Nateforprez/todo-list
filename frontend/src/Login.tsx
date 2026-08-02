import './Login.css'

function Login() {

    return (
        <>
            <div id="login-box">
                <form action="/api/submit-login" method="POST" style={{width: '500px', height: '300px'}}>
                    <h1>Login</h1>
                    <div id="form-elements-box" style={{border: '1px solid blue'}}>
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