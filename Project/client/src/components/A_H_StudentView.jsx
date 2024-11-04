import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function A_H_StudentView() {
  const value = localStorage.getItem("Email");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  localStorage.setItem("Email", value);


  useEffect(() => {
    (async () => {
      const response = await fetch(
        `http://localhost:8080/advisinghistory/${value}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();

      const coursesArray = Array.isArray(result.data) ? result.data : [];
      const dataWithEnabled = coursesArray.map((item) => ({
        ...item,
      }));
      setData(dataWithEnabled);
    })();
  }, []);


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

export default A_H_StudentView;
