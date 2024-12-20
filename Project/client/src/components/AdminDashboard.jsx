import { useNavigate } from "react-router-dom";

export default function AdminDashboard(){
    const navigate = useNavigate();
    const value = localStorage.getItem("Email");

    localStorage.setItem("Email",value);

    return (<>
    <div id="login">
        <h1>Welcome Admin {value}!</h1>
        <div class="container">
        <div>
            <button className="text-button" onClick={() => navigate('/prerequisite')}>
                Edit Student Prerequisite Courses
            </button>
        </div>
        <div>
            <button className="text-button" onClick={() => navigate('/advisinghistory')}>
                Advising History
            </button>
        </div>
        <div>
            <button className="text-button" onClick={() => navigate('/editprofile')}>
                Edit account info
            </button>
        </div>
        <div>
            <button className="button" onClick={() => navigate('/')}>
                Sign Out 
            </button>
        </div>
        </div>
    </div>
    </>);
}