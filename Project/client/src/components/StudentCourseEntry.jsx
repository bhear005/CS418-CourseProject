import React, { useEffect, useState } from "react";

function StudentCourseEntry() {
  const value = localStorage.getItem("Email");
  const [prerequisites, setPrerequisites] = useState([]);
  const [coursePlans, setCoursePlans] = useState([]);
  const [prerequisiteDropdowns, setPrerequisiteDropdowns] = useState([{}]);
  const [coursePlanDropdowns, setCoursePlanDropdowns] = useState([{}]);
  const [lastTerm, setLastTerm] = useState("");
  const [lastGPA, setLastGPA] = useState("");
  const [currentTerm, setCurrentTerm] = useState("");

  localStorage.setItem("Email",value);

  // Load dropdown menus with courses from database
  useEffect(() => {
    const loadPrerequisites = async () => {
        const response = await fetch(import.meta.env.VITE_API_KEY + "/Classes/loadPrereq");
        const result = await response.json();
        setPrerequisites(Array.isArray(result.data) ? result.data : []);
    };

    const loadCoursePlans = async () => {
        const response = await fetch(import.meta.env.VITE_API_KEY + "/Classes/loadNonPrereq");
        const result = await response.json();
        setCoursePlans(Array.isArray(result.data) ? result.data : []);
    };

    loadPrerequisites();
    loadCoursePlans();
  }, []);

  // Add prerequisite courses to dropdown
  const addPrerequisiteDropdown = () => {
    setPrerequisiteDropdowns([...prerequisiteDropdowns, {}]);
  };
  // Add general courses to dropdown
  const addCoursePlanDropdown = () => {
    setCoursePlanDropdowns([...coursePlanDropdowns, {}]);
  };

  // Send user entered data to database upon submission
  const submitHeaderFields = async () => {
    const formBody = JSON.stringify({
      Email: value,
      Last_Term: lastTerm,
      Current_Term: currentTerm,
      Last_GPA: lastGPA
    })

      const response = await fetch(import.meta.env.VITE_API_KEY + "/studentadvising/headerEntry", { 
        method: "POST",
        body: formBody,
        headers: {
          "Content-Type": "application/json",
        }
      });
  };

  // Send prerequisite courses to database upon submission
  const submitPrerequisites = async (selectedPrerequisites) => {

      await Promise.all(
        selectedPrerequisites.map(async (prerequisite) => {
          const formBody = JSON.stringify({
            Email: value,
            Current_Term: currentTerm,
            Course_Name: prerequisite
          });

          const response = await fetch(import.meta.env.VITE_API_KEY + "/studentadvising/prerequisiteEntry", {
            method: "POST",
            body: formBody,
            headers: {
              "Content-Type": "application/json",
            }
          });

          
        })
      );
 
  };

  // Send general course data to database upon submission
  const submitCoursePlans = async (selectedCoursePlans) => {

      await Promise.all(
        selectedCoursePlans.map(async (coursePlan) => {
          const formBody = JSON.stringify({
            Email: value,
            Current_Term: currentTerm,
            Course_Name: coursePlan
          });

          const response = await fetch(import.meta.env.VITE_API_KEY + "/studentadvising/coursePlanEntry", { 
            method: "POST",
            body: formBody,
            headers: {
              "Content-Type": "application/json",
            },
          });

          
        })
      );

  };

  // Execute API calls upon submission
  const handleSubmit = async (event) => {
    let pass = true;
    let passTwo = true;
    let passThree = true;
    event.preventDefault();

    // Select individual dropdown entries to be sent to database
    const selectedPrerequisites = prerequisiteDropdowns.map((_, index) => {
      const select = document.getElementById(`prerequisite-${index}`);
      return select ? select.value : null;
    }).filter(Boolean);

    // Select individual dropdown enteries to be sent to database
    const selectedCoursePlans = coursePlanDropdowns.map((_, index) => {
      const select = document.getElementById(`coursePlan-${index}`);
      return select ? select.value : null;
    }).filter(Boolean);

    // Check database for duplicate course plans
    await Promise.all(
      selectedCoursePlans.map(async (coursePlan) => {
        const formBody = JSON.stringify({
          Email: value,
          Course_Name: coursePlan
        });

        const response = await fetch(import.meta.env.VITE_API_KEY + "/studentadvising/duplicateCourse", { 
          method: "POST",
          body: formBody,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          alert("Chosen Course already exists!");
          pass = false;
        }
      }),
    );

    // Check database for duplicate prerequisites
    await Promise.all(
      selectedPrerequisites.map(async (prerequisite) => {
        const formBodyTwo = JSON.stringify({
          Email: value,
          Course_Name: prerequisite
        });

        const responseTwo = await fetch(import.meta.env.VITE_API_KEY + "/studentadvising/duplicatePrereq", {
          method: "POST",
          body: formBodyTwo,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!responseTwo.ok) {
          alert("Chosen prerequisite Course already exists!");
          passTwo = false;
        }
      })
    );

    // await Promise.all()
    // // Check database for duplicate advising history
    // const formBody = JSON.stringify({
    //   Email: value
    // })

    
    // const response = await fetch("http://localhost:8080/studentadvising/duplicateHistory", { 
    //   method: "POST",
    //   body: formBody,
    //   headers: {
    //     "Content-Type": "application/json",
    //   }
    // });

    // // If duplicate history found
    // if(!response.ok){
    //   passThree = false;
    // }



    if (pass === true && passTwo === true){
      //if(passThree === false){
        await submitHeaderFields();
      //}
      await submitPrerequisites(selectedPrerequisites);
      await submitCoursePlans(selectedCoursePlans);
      // Only allow header field if there is no duplicate
      alert("Submitted!");
    }

  };

  return (
    <div>
      <h1>Course Plan</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <div>
          <label>Last Term</label>
          <input
            type="text"
            value={lastTerm}
            onChange={(e) => setLastTerm(e.target.value)}
          />
        </div>
        <div>
          <label>Last GPA</label>
          <input
            type="number"
            step="0.01"
            value={lastGPA}
            onChange={(e) => setLastGPA(e.target.value)}
          />
        </div>
        <div>
          <label>Current Term</label>
          <input
            type="text"
            value={currentTerm}
            onChange={(e) => setCurrentTerm(e.target.value)}
          />
        </div>
      </div>

      <h3>Prerequisites</h3>
      {prerequisiteDropdowns.map((_, index) => (
        <div key={index}>
          <select id={`prerequisite-${index}`}>
            <option value="">
              {"Select a course"}
            </option>
            {prerequisites.map((course, courseIndex) => (
              <option key={courseIndex} value={course.Course_Name}>
                {course.Course_Name}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button onClick={addPrerequisiteDropdown}>
        Add Row
      </button>

      <h3>Course Plan</h3>
      {coursePlanDropdowns.map((_, index) => (
        <div key={index}>
          <select id={`coursePlan-${index}`}>
            <option value="">
             {"Select a course"} 
            </option>
            {coursePlans.map((plan, planIndex) => (
              <option key={planIndex} value={plan.Course_Name}>
                {plan.Course_Name}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button onClick={addCoursePlanDropdown}>
        Add Row
      </button>

      <div>
        <button onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default StudentCourseEntry;
