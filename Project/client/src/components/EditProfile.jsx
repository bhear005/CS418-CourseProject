import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
    const [enteredFirstName, setEnteredFirstName] = useState("");
    const [enteredLastName, setEnteredLastName] = useState("");
    const [enteredEmail, setEnteredEmail] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
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
        else if (identifier === "Email") {
            setEnteredEmail(value);
        }
    }

    const handleEditProfile = async () => {
        setSubmitted(true);

        const formBody = JSON.stringify({
            First_Name: enteredFirstName,
            Last_Name: enteredLastName,
            Password: enteredPassword
        })

        const result = await fetch(`http://localhost:8080/user/${enteredEmail}`, {
            method: "PUT",
            body: formBody,
            headers: {
                'content-type': 'application/json'
            }
        });

        if (result.ok) {
            const data = result.json();
            console.log(data)
            navigate('/dashboard')
        }
        else {
            alert("Incorrect Email");
        }
    }

    const firstNameNotValid = submitted && enteredFirstName.trim().length < 6;
    const lastNameNotValid = submitted && enteredLastName.trim().length < 6;
    const emailNotValid = submitted && !enteredEmail.includes("@");
    const passwordNotValid = submitted && enteredPassword.trim().length < 6;

    return (
        <div>
            <div>
                <h1>Edit Profile</h1>
            </div>
            <form>
                <label>Email (Cannot be edited)</label>
                <input type="Email" className={emailNotValid ? "invalid" : undefined}
                    onChange={(event) => handleInputChange("Email", event.target.value)}
                />

                <label>First Name</label>
                <input type="text" className={firstNameNotValid ? "invalid" : undefined}
                    onChange={(event) => handleInputChange("First_Name", event.target.value)}
                />

                <label>Last Name</label>
                <input type="text" className={lastNameNotValid ? "invalid" : undefined}
                    onChange={(event) => handleInputChange("Last_Name", event.target.value)}
                />

                <label>Password</label>
                <input type="Password" className={passwordNotValid ? "invalid" : undefined}
                    onChange={(event) => handleInputChange("Password", event.target.value)}
                />
            </form>
            <div>
                <button className="button" onClick={handleEditProfile}>
                    Create Account
                </button>
            </div>
        </div>
    );
}