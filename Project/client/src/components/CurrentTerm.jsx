import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function CurrentTerm() {
    const value = localStorage.getItem("Email");
    const termValue = localStorage.getItem("Term");
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    localStorage.setItem("Email", value);
    localStorage.setItem("Term", termValue);

    return(<>
    
    </>);
}
export default CurrentTerm;