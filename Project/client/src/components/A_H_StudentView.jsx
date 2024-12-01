import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function A_H_StudentView() {
  const value = localStorage.getItem("Email");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  localStorage.setItem("Email", value);

  // API call to get advising history
  useEffect(() => {
    (async () => {
      const response = await fetch(
        import.meta.env.VITE_API_KEY + `/advisinghistory/${value}`
        // `https://localhost:8080/advisinghistory/${value}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();

      const coursesArray = Array.isArray(result.data) ? result.data : [];
      setData(coursesArray);
    })();
  }, []);

  const returnToDash = async () => {
    const adminValue = await fetch(
      import.meta.env.VITE_API_KEY + `/user/adminCheck/${value}`
      // `https://localhost:8080/user/adminCheck/${value}`
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
    navigate(`/currentterm`, { state: { term } });
  };

  return (
    <div>
      <div>
        <h2>{value} Advising History</h2>
      </div>
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
            <tr key={index} onClick={() => handleRowClick(item.Term)} style={{ cursor: "pointer" }}>
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

export default A_H_StudentView;

