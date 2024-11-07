import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

function CourseTable() {
  const value = localStorage.getItem("Email");
  const [data, setData] = useState([]);
  const [dataTwo, setDataTwo] = useState([]);
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(true);

  localStorage.setItem("Email",value);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch("http://localhost:8080/classes/");
    const result = await response.json();

    const coursesArray = Array.isArray(result.data) ? result.data : [];
    const dataWithEnabled = coursesArray.map((item) => ({
      ...item,
    }));
    setData(dataWithEnabled);

    const responseTwo = await fetch("http://localhost:8080/classes/loadPrereq");
    const resultTwo = await responseTwo.json();

    const coursesArrayTwo = Array.isArray(resultTwo.data) ? resultTwo.data : [];
    const dataWithEnabledTwo = coursesArrayTwo.map((itemTwo) => ({
      ...itemTwo,
    }));
    setDataTwo(dataWithEnabledTwo);
  };

  const handleCheckboxChange = async (index) => {
    const updatedData = [...data];
    updatedData[index].enabled = !updatedData[index].enabled;
    setData(updatedData);

    const courseName = updatedData[index].Course_Name;

    const response = await fetch(`http://localhost:8080/classes/enablePrereq`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Course_Name: courseName,
      }),
    });

    if (!response.ok) {
      throw new Error("Unable to change Prerequisite status");
    }

    // Repopulate chosen prereq list
    const responseTwo = await fetch("http://localhost:8080/classes/loadPrereq");
    const resultTwo = await responseTwo.json();

    const coursesArrayTwo = Array.isArray(resultTwo.data) ? resultTwo.data : [];
    const dataWithEnabledTwo = coursesArrayTwo.map((itemTwo) => ({
      ...itemTwo,
    }));
    setDataTwo(dataWithEnabledTwo);
    
};


    const returnToDash = async () => {
    const adminValue = await fetch(`http://localhost:8080/user/adminCheck/${value}`)
        if (adminValue.ok){
            navigate('/admindashboard');
        }
        else{
            navigate('/dashboard');
        }
    }

  return (
    <div>
      <div>
        <button className="button" onClick={returnToDash}>
          Return
        </button>
      </div>
      <h2>Pre-requisite Courses</h2>
      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>Courses</th>
            <th>Enable/Disable</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.Course_Level}</td>
              <td>{item.Course_Name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <div>
          <button className="button" onClick={returnToDash}>
            Return
          </button>
        </div>
        <div>
          <h2>Chosen Pre-requisite Courses</h2>
        </div>
        <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>Courses</th>
          </tr>
        </thead>
        <tbody>
          {dataTwo.map((itemTwo, index) => (
            <tr key={index}>
              <td>{itemTwo.Course_Level}</td>
              <td>{itemTwo.Course_Name}</td>
              <td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default CourseTable;
