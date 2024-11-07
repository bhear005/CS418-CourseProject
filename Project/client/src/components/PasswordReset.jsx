import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Reset(){
    const [enteredEmail, setEnteredEmail] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const Navigate = useNavigate();

    function handleInputChange(identifier, value){
        if (identifier === "Email"){
            setEnteredEmail(value);
        }
        else{
            setEnteredPassword(value);
        }
    }

    const handleReset = async () => {
        setSubmitted(true);

        const formBody = JSON.stringify({
            Password: enteredPassword,
            Email: enteredEmail   
        })

        const result = await fetch(import.meta.env.VITE_API_KEY + '/user/change/password', {
            method: "PUT",
            body: formBody,
            headers: {
                'content-type': 'application/json'
            }
        });
        Navigate('/');
    };


    const emailNotValid = submitted && !enteredEmail.includes("@");
    const passwordNotValid = submitted && enteredPassword.trim().length < 6;

    return(
        <div>
            <h1>Change your Password</h1>
            <form>
                <label>Enter Email Address</label>
                <input
                    type="Email"
                    className={emailNotValid ? "invalid" : undefined}
                    onChange={(event) => handleInputChange("Email", event.target.value)}
                />
                <label>Enter New Password</label>
                <input type="Password" className={passwordNotValid ? "invalid" : undefined}
                    onChange={(event) => handleInputChange("Password", event.target.value)}
                />
            </form>
            <div>
                <button className="button" onClick={handleReset}>
                    Submit
                </button>
            </div>
        </div>
    );
}