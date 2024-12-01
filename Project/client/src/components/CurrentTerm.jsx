import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CurrentTerm() {
  const value = localStorage.getItem("Email");
  const termValue = localStorage.getItem("Term");
  const [prerequisites, setPrerequisites] = useState([]);
  const [coursePlans, setCoursePlans] = useState([]);
  const [prerequisiteDropdowns, setPrerequisiteDropdowns] = useState([""]);
  const [coursePlanDropdowns, setCoursePlanDropdowns] = useState([""]);
  const [lastTerm, setLastTerm] = useState("");
  const [lastGPA, setLastGPA] = useState("");
  const [termStatus, setTermStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getTermData = async () => {
      const response = await fetch(import.meta.env.VITE_API_KEY + `/advisinghistory/${value}/${termValue}`);
      const result = await response.json();
      // Parse JSON data to string
      if (result.data) {
        setLastTerm(result.data[0].Last_Term);
        setLastGPA(result.data[0].Last_GPA);
        setTermStatus(result.data[0].Term_Status);
      }
    }
    getTermData();
  }, [value, termValue]);

  useEffect(() => {
    const loadPrerequisites = async () => {
      const response = await fetch(
        import.meta.env.VITE_API_KEY + "/Classes/loadPrereq"
      );
      const result = await response.json();
      setPrerequisites(Array.isArray(result.data) ? result.data : []);
    };

    const loadCoursePlans = async () => {
      const response = await fetch(
        import.meta.env.VITE_API_KEY + "/Classes/loadNonPrereq"
      );
      const result = await response.json();
      setCoursePlans(Array.isArray(result.data) ? result.data : []);
    };

    loadPrerequisites();
    loadCoursePlans();
  }, []);

  useEffect(() => {
    const loadStudentChosenPrereq = async () => {
      const response = await fetch(
        import.meta.env.VITE_API_KEY + "/classes/prereqData",
        {
          method: "POST",
          body: JSON.stringify({ Email: value, Current_Term: termValue }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await response.json();
      if (Array.isArray(result.data)) {
        setPrerequisiteDropdowns(result.data.map((item) => item.Course_Name));
      }
    };

    const loadStudentChosenCoursePlan = async () => {
      const response = await fetch(
        import.meta.env.VITE_API_KEY + "/classes/coursePlanData",
        {
          method: "POST",
          body: JSON.stringify({ Email: value, Current_Term: termValue }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await response.json();
      if (Array.isArray(result.data)) {
        setCoursePlanDropdowns(result.data.map((item) => item.Course_Name));
      }
    };

    loadStudentChosenPrereq();
    loadStudentChosenCoursePlan();
  }, [value, termValue]);

  const addPrerequisiteDropdown = () => {
    setPrerequisiteDropdowns([...prerequisiteDropdowns, ""]);
  };

  const addCoursePlanDropdown = () => {
    setCoursePlanDropdowns([...coursePlanDropdowns, ""]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Implement submission logic here
  };

  const returnToDash = async () => {
    const adminValue = await fetch(
      import.meta.env.VITE_API_KEY + `/user/adminCheck/${value}`
    );
    if (adminValue.ok) navigate("/admindashboard");
    else navigate("/dashboard");
  };

  const isDisabled = termStatus === "Approved" || termStatus === "Denied";

  return (
    <div>
      <h1>Course History</h1>
      <div className="cp-container">
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <div>
            <label>Last Term</label>
            <input type="text" value={lastTerm} readOnly />
          </div>
          <div>
            <label>Last GPA</label>
            <input type="text" value={lastGPA} readOnly />
          </div>
          <div>
            <label>Current Term</label>
            <input type="text" value={termValue} readOnly />
          </div>
        </div>

        <h3>Prerequisites</h3>
        {prerequisiteDropdowns.map((selectedValue, index) => (
          <div key={index}>
            <select
              id={`prerequisite-${index}`}
              value={selectedValue}
              onChange={(e) => {
                const updated = [...prerequisiteDropdowns];
                updated[index] = e.target.value;
                setPrerequisiteDropdowns(updated);
              }}
              disabled={isDisabled}
            >
              <option value="">Select a course</option>
              {prerequisites.map((course) => (
                <option key={course.Course_Name} value={course.Course_Name}>
                  {course.Course_Name}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button onClick={addPrerequisiteDropdown} disabled={isDisabled}>Add Row</button>

        <h3>Course Plan</h3>
        {coursePlanDropdowns.map((selectedValue, index) => (
          <div key={index}>
            <select
              id={`coursePlan-${index}`}
              value={selectedValue}
              onChange={(e) => {
                const updated = [...coursePlanDropdowns];
                updated[index] = e.target.value;
                setCoursePlanDropdowns(updated);
              }}
              disabled={isDisabled}
            >
              <option value="">Select a course</option>
              {coursePlans.map((plan) => (
                <option key={plan.Course_Name} value={plan.Course_Name}>
                  {plan.Course_Name}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button onClick={addCoursePlanDropdown} disabled={isDisabled}>Add Row</button>

        <div>
          <button onClick={handleSubmit} disabled={isDisabled}>Submit</button>
        </div>
      </div>
      <div>
        <button className="button" onClick={returnToDash}>
          Return
        </button>
      </div>
    </div>
  );
}

export default CurrentTerm;
