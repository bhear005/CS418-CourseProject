import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
    const value = localStorage.getItem("Email");
    const [enteredFirstName, setEnteredFirstName] = useState("");
    const [enteredLastName, setEnteredLastName] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    function handleInputChange(identifier, value) {
        if (identifier === "First_Name") {
            setEnteredFirstName(value);
        }
        else if (identifier === "Last_Name") {
            setEnteredLastName(value);
        }
        else if (identifier === "Password") {
            setEnteredPassword(value);
        }
    }

    const handleEditFirstName = async () => {
        setSubmitted(true);

        const formBody = JSON.stringify({
            Email: value,
            First_Name: enteredFirstName
        })

        const result = await fetch(
            import.meta.env.VITE_API_KEY + '/user/First_Name', 
            // `https://localhost:8080/user/First_Name`,
            {
            method: "PUT",
            body: formBody,
            headers: {
                'content-type': 'application/json'
            }
        });

        if (result.ok) {
            const data = result.json();
            console.log(data)
            alert("Account Updated");
        }
    }

    const handleEditLastName = async () => {
        setSubmitted(true);

        const formBody = JSON.stringify({
            Email: value,
            Last_Name: enteredLastName
        })

        const result = await fetch(
            import.meta.env.VITE_API_KEY + '/user/Last_Name', 
            // `https://localhost:8080/user/Last_Name`,
            {
            method: "PUT",
            body: formBody,
            headers: {
                'content-type': 'application/json'
            }
        });

        if (result.ok) {
            const data = result.json();
            console.log(data)
            alert("Account Updated");
        }
    }

    const returnToDash = async () => {
    const adminValue = await fetch(
        import.meta.env.VITE_API_KEY + `/user/adminCheck/${value}`
        // `https://localhost:8080/user/adminCheck/${value}`
    )
        if (adminValue.ok){
            navigate('/admindashboard');
        }
        else{
            navigate('/dashboard');
        }
    }

    const handleEditPassword = async () => {
        setSubmitted(true);


        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(enteredPassword)) {
            setPasswordError("Ensure the password entered is at least 8 characters in length, includes lowercase and uppercase letters, and has at least 1 number and special character.");
            return;
        } else {
            setPasswordError("");
        }
        const formBody = JSON.stringify({
            Email: value,
            Password: enteredPassword
        })

        const result = await fetch(
            import.meta.env.VITE_API_KEY + '/user/Password', 
            // `https://localhost:8080/user/Password`,
            {
            method: "PUT",
            body: formBody,
            headers: {
                'content-type': 'application/json'
            }
        });

        if (result.ok) {
            const data = result.json();
            console.log(data)
            alert("Account Updated");
        }
    }



    const firstNameNotValid = submitted && enteredFirstName.trim().length < 6;
    const lastNameNotValid = submitted && enteredLastName.trim().length < 6;
    const passwordNotValid = submitted && enteredPassword.trim().length < 6;

    return (
        <div>
            <div>
                <h1>Edit Profile</h1>
            </div>
            <div class="container">
            <form>
                <label>First Name</label>
                <input type="text" className={firstNameNotValid ? "invalid" : undefined}
                    onChange={(event) => handleInputChange("First_Name", event.target.value)}
                />
                <button className="button" onClick={handleEditFirstName}>
                    Sumbit
                </button>

                <label>Last Name</label>
                <input type="text" className={lastNameNotValid ? "invalid" : undefined}
                    onChange={(event) => handleInputChange("Last_Name", event.target.value)}
                />
                <button className="button" onClick={handleEditLastName}>
                    Submit
                </button>

                <label>Password</label>
                <input type="Password" className={passwordNotValid ? "invalid" : undefined}
                    onChange={(event) => handleInputChange("Password", event.target.value)}
                />
                {passwordError && <p className="error">{passwordError}</p>}
                <div>
                <button className="button" onClick={handleEditPassword}>
                    Submit
                </button>
                </div>
            </form>
            </div>
            <div>
            <button className="button" onClick={returnToDash}>
                    Return
                </button>                
            </div>
        </div>
    );
}