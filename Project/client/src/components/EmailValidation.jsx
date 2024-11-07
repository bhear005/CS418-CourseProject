import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmailValidation(){
    const value = localStorage.getItem("Email");
    const [enteredCode, setEnteredCode] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    function handleInputChange(value){
        setEnteredCode(value);
    }

    const handleValidation = async () => {
        setSubmitted(true);

        const formBody = JSON.stringify({
            Email: value,
            Validation_Code: enteredCode
        })

        const result = await fetch(import.meta.env.VITE_API_KEY + '/user/email/validation', {
            method: "POST",
            body: formBody,
            headers: {
                'content-type': 'application/json'
            }
        })

        if (result.ok){
            const adminValue = await fetch(import.meta.env.VITE_API_KEY + `/user/adminCheck/${value}`)

            if (adminValue.ok){
                navigate('/admindashboard')
            }
            else{
                navigate('/dashboard')
            }
        }
        else{
            alert("Invalid Code");
        }
    };

    const codeNotValid = submitted && enteredCode.trim().length < 6;

    return(
        <div>
            <div>
                <h1>Email Verification</h1>
            </div>
            <form>
                <label>Enter code</label>
                <input type="text" className={codeNotValid ? "invalid" : undefined}
                onChange={(event) => handleInputChange(event.target.value)} />

            </form>
            <div>
                <button className="button" onClick={handleValidation}>
                    Submit
                </button>
            </div>
        </div>
    );
}