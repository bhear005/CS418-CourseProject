import { useNavigate } from "react-router-dom";

export default function Dashboard(){
    const navigate = useNavigate();


    return (<>
    <div id="login">
        <h1>Welcome! </h1>
        <div>
            <button className="text-button" onClick={() => navigate('/editprofile')}>
                Edit account info
            </button>
        </div>
    </div>
    </>);
}
