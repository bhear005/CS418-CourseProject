import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdvisorView() {
  const value = localStorage.getItem('Email');
  const termValue = localStorage.getItem('Term');
  const studentEmail = localStorage.getItem('studentEmail');
  const [lastTerm, setLastTerm] = useState('');
  const [lastGPA, setLastGPA] = useState('');
  const [termStatus, setTermStatus] = useState('');
  const [prerequisites, setPrerequisites] = useState([]);
  const [coursePlans, setCoursePlans] = useState([]);
  const [comments, setComments] = useState('');
  const navigate = useNavigate();

  // Load student data that pertains to current term
  useEffect(() => {
    const getStudentData = async () => {
      const response = await fetch(import.meta.env.VITE_API_KEY + `/advisinghistory/${studentEmail}/${termValue}`);
      const result = await response.json();
      if (result.data) {
        setLastTerm(result.data[0].Last_Term);
        setLastGPA(result.data[0].Last_GPA);
        setTermStatus(result.data[0].Term_Status);
      }
    };
    getStudentData();
  }, [studentEmail, termValue]);

  // Load course data pertaining to current term
  useEffect(() => {
    const loadStudentChosenPrereq = async () => {
      const response = await fetch(
        import.meta.env.VITE_API_KEY + "/classes/prereqData",
        {
          method: "POST",
          body: JSON.stringify({ Email: studentEmail, Current_Term: termValue }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await response.json();
      if (Array.isArray(result.data)) {
        setPrerequisites(result.data.map((item) => item.Course_Name));
      }
    };

    const loadStudentChosenCoursePlan = async () => {
      const response = await fetch(
        import.meta.env.VITE_API_KEY + "/classes/coursePlanData",
        {
          method: "POST",
          body: JSON.stringify({ Email: studentEmail, Current_Term: termValue }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await response.json();
      if (Array.isArray(result.data)) {
        setCoursePlans(result.data.map((item) => item.Course_Name));
      }
    };

    loadStudentChosenPrereq();
    loadStudentChosenCoursePlan();
  }, [studentEmail, termValue]);

  const handleApprove = async () => {
    const response = await fetch(import.meta.env.VITE_API_KEY + '/advisinghistory/approve', {
      method: 'POST',
      body: JSON.stringify({
        Email: studentEmail,
        Term: termValue,
        comments: comments
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      setTermStatus('Approved');
    }
  };

  const handleReject = async () => {
    const response = await fetch(import.meta.env.VITE_API_KEY + '/advisinghistory/reject', {
      method: 'POST',
      body: JSON.stringify({
        Email: studentEmail,
        Term: termValue,
        comments: comments
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      setTermStatus('Denied');
    }
  };

  const returnToDash = async () => {
    const adminValue = await fetch(
      import.meta.env.VITE_API_KEY + `/user/adminCheck/${value}`
    );
    if (adminValue.ok) {
      navigate('/admindashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div>
      <h1>Student Advising Request</h1>
      <div className="cp-container">
        <h2>Student Email: <u>{value}</u></h2>
        <h2>Last Term: <u>{lastTerm}</u></h2>
        <h2>Last GPA: <u>{lastGPA}</u></h2>
        <h2>Current Term: <u>{termValue}</u></h2>
        <h2>Term Status: <u>{termStatus}</u></h2>
        <h2>Prerequisite Courses:</h2>
        <ul>
          {prerequisites.map((course, index) => (
            <li key={index}><u>{course}</u></li>
          ))}
        </ul>
        <h2>Courses:</h2>
        <ul>
          {coursePlans.map((course, index) => (
            <li key={index}><u>{course}</u></li>
          ))}
        </ul>
        {termStatus !== 'Approved' && termStatus !== 'Denied' && (
          <span>
            <button onClick={handleApprove}>Approve</button>
            <button onClick={handleReject}>Reject</button>
            <input
              type="text"
              placeholder="Enter comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </span>
        )}
      </div>
      <div>
        <button onClick={returnToDash}>Return to Dashboard</button>
      </div>
    </div>
  );
}

export default AdvisorView;