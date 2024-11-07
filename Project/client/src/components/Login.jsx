import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [enteredEmail, setEnteredEmail] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    //let admin = false;
    // const [message, setMessage] = useState("");

    function handleInputChange(identifier, value) {
        if (identifier === "Email") {
            setEnteredEmail(value);
        } else {
            setEnteredPassword(value);
        }
    }

    const handleLogin = async () => {
        setSubmitted(true);

        const formBody = JSON.stringify({
            Email: enteredEmail,
            Password: enteredPassword
        })

        // user.login command to backend
        const result= await fetch(import.meta.env.VITE_API_KEY + '/user/login',{
            method:"POST",
            body:formBody,
            headers:{
                'content-type':'application/json'
            }
        });
        if(result.ok){
            const data=result.json();
            console.log(data)
            console.log(result);
            fetch(import.meta.env.VITE_API_KEY + '/user/send/email', {
                method: "POST",
                body:formBody,
                headers:{
                    'content-type':'application/json'
                }
            });
            localStorage.setItem("Email",enteredEmail);
            navigate('/emailvalidation')
        }
        else{
            alert("Invalid credentials!");
        }
    };


    const emailNotValid = submitted && !enteredEmail.includes("@");
    const passwordNotValid = submitted && enteredPassword.trim().length < 6;

    return (
        <div>
            <div>
                <h1>Login</h1>
            </div>
            <form>
                <label>Email</label>
                <input
                    type="Email"
                    className={emailNotValid ? "invalid" : undefined}
                    onChange={(event) => handleInputChange("Email", event.target.value)}
                />

                <label>Password</label>
                <input
                    type="Password"
                    className={passwordNotValid ? "invalid" : undefined}
                    onChange={(event) => handleInputChange("Password", event.target.value)}
                />
            </form>
            <div>
                <button className="button" onClick={handleLogin}>
                    Sign In
                </button>
            </div>
            <div>
                <button className="text-button" onClick={() => navigate('/createaccount')}>
                    Create a new account
                </button>
            </div>
            <div>
                <button className="text-button" onClick={() => navigate('/emailrecovery')}>
                    Forgot Password?
                </button>
            </div>
        </div>

        
    );
}
