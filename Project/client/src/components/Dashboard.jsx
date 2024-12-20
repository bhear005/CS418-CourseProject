import { useNavigate } from "react-router-dom";

export default function Dashboard(){
    const navigate = useNavigate();
    const value = localStorage.getItem("Email");

    localStorage.setItem("Email",value);

    return (<>
    <div id="login">
        <h1>Welcome {value}!</h1>
        <div class="container">
        <div>
            <button className="text-button" onClick={() => navigate('/editprofile')}>
                Edit account info
            </button>
        </div>
        <div>
            <button className="text-button" onClick={() => navigate('/studentcourseentry')}>
                Course Sign Up
            </button>
        </div>
        <div>
            <button className="text-button" onClick={() => navigate('/a_h_studentview')}>
                Advising History
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
