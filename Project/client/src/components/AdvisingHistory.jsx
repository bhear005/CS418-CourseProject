import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

function AdvisingHistory() {
  const value = localStorage.getItem("Email");
  const [data, setData] = useState([]);
  const [enteredEmail, setEnteredEmail] = useState("");
  const navigate = useNavigate();

  localStorage.setItem("Email", value);

  function handleInputChange(e) {
    setEnteredEmail(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formBody = JSON.stringify({
      Email: enteredEmail,
    });

    const response = await fetch(
      `http://localhost:8080/advisinghistory/${enteredEmail}`
    );
    if (!response.ok) throw new Error("Failed to fetch data");
    const result = await response.json();

    const coursesArray = Array.isArray(result.data) ? result.data : [];
    const dataWithEnabled = coursesArray.map((item) => ({
      ...item,
    }));
    setData(dataWithEnabled);
  };

  const returnToDash = async () => {
    const adminValue = await fetch(
      `http://localhost:8080/user/adminCheck/${value}`
    );
    if (adminValue.ok) {
      navigate("/admindashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div>
      <form>
        <label>
          Email:
          <input
            type="email"
            value={enteredEmail}
            onChange={handleInputChange}
            required
          />
        </label>
        <button className="button" onClick={handleSubmit}>
          Submit
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Term</th>
            <th>Term Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.Submission_Date}</td>
              <td>{item.Term}</td>
              <td>{item.Term_Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button className="button" onClick={returnToDash}>
          Return
        </button>
      </div>
    </div>
  );
}

export default AdvisingHistory;
