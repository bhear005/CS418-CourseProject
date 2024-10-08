import { useState } from "react";

export default function Recover(){
    const [enteredEmail, setEnteredEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    //const navigate = useNavigate();

    function handleInputChange(value){
        setEnteredEmail(value);
    }

    const handleReset = async () => {
        setSubmitted(true);

        const formBody = JSON.stringify({
            Email: enteredEmail
        })

        const result = await fetch('http://localhost:8080/user/reset/password', {
            method: "POST",
            body: formBody,
            headers:{
                'content-type': 'application/json'
            }
        });
        if(result.ok) {
            const data = result.json();
            console.log(data)
        }
        localStorage.setItem("Email",enteredEmail);
    };

    const emailNotValid = submitted && !enteredEmail.includes("@");

    return(
        <div>
            <h1>Forgot your Password</h1>
            <form>
                <label>Enter Email Address</label>
            <input
                type="Email"
                className={emailNotValid ? "invalid" : undefined}
                onChange={(event) => handleInputChange(event.target.value)}
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