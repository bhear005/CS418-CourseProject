import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import CreateAccount from "./components/CreateAccount";
import EmailValidation from "./components/EmailValidation";
import EmailRecovery from "./components/EmailRecovery";
import PasswordReset from "./components/PasswordReset";
import EditProfile from "./components/EditProfile";
import AdminDashboard from "./components/AdminDashboard";
function App() {

  return (
    <Routes>
    <Route path="/" element={<Login/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/createaccount" element={<CreateAccount/>}/>
    <Route path="/emailvalidation" element={<EmailValidation/>}/>
    <Route path="/emailrecovery" element={<EmailRecovery/>}/>
    <Route path="/passwordreset" element={<PasswordReset/>}/>
    <Route path="/editprofile" element={<EditProfile/>}/>
    <Route path="/admindashboard" element={<AdminDashboard/>}/>
    </Routes>
  );
}

export default App;


