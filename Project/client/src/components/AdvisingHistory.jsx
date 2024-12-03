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

    localStorage.setItem("studentEmail", enteredEmail);

    const formBody = JSON.stringify({
      Email: enteredEmail,
    });

    const response = await fetch(
      import.meta.env.VITE_API_KEY + `/advisinghistory/${enteredEmail}`
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
      import.meta.env.VITE_API_KEY + `/user/adminCheck/${value}`
    );
    if (adminValue.ok) {
      navigate("/admindashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const handleRowClick = (term) => {
    const termValue = term;
    localStorage.setItem("Term", termValue);
    navigate(`/advisorview`, { state: { term } });
  };

  return (
    <div>
      <h1>Student Advising History</h1>
      <div className="container">
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
              <th>Student</th>
              <th>UIN</th>
              <th>Term</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} onClick={() => handleRowClick(item.Term)} style={{ cursor: "pointer" }}>
                <td>{item.Name}</td>
                <td>{item.UIN}</td>
                <td>{item.Term}</td>
                <td>{item.Term_Status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <button className="button" onClick={returnToDash}>
          Return
        </button>
      </div>
    </div>
  );
}

export default AdvisingHistory;
