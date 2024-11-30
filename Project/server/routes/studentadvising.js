import { Router } from "express";
import { connection } from "../database/database.js";
const studentadvising = Router();

function generateCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}/${year}`;
}

// GET all data stored in Student_Advising
studentadvising.get("/", (req, res) => {
  connection.execute("select * from Student_Advising", function (err, result) {
    if (err) {
      res.json(err.message);
    } 
    else {
      res.json({
        status: 200,
        message: "Response from user get api",
        data: result,
      });
    }
  });
});

// POST used store student advising data
studentadvising.post("/headerEntry", (req, res) => {
    console.log(req.body.Email);
    console.log(req.body.Last_Term);
    console.log(req.body.Current_Term);
    console.log(req.body.Last_GPA);
  let date = generateCurrentDate();

  connection.execute(
    "Insert into advising_history (Email,Submission_Date,Term,Last_Term,Last_GPA) values(?,?,?,?,?)",
    [req.body.Email, date, req.body.Current_Term, req.body.Last_Term, req.body.Last_GPA],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } else {
        res.json({
          status: 200,
          message: "Response from user post api",
          data: result,
        });
      }
    }
  );
});

// POST used to store prerequisite courses
studentadvising.post("/prerequisiteEntry", (req, res) => {
  console.log("inside prerequisiteEntry");
  console.log(req.body.Email);
  console.log(req.body.Current_Term);
  console.log(req.body.Course_Name);
  connection.execute(
    "Insert into prerequisite (Email,Current_Term,Course_Name) values(?,?,?)",
    [req.body.Email, req.body.Current_Term, req.body.Course_Name],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } else {
        res.json({
          status: 200,
          message: "Response from user post api",
          data: result,
        });
      }
    }
  );
});

// POST used to store course plan
studentadvising.post("/coursePlanEntry", (req, res) => {
  connection.execute(
    "Insert into course_plan (Email,Current_Term,Course_Name) values(?,?,?)",
    [req.body.Email, req.body.Current_Term, req.body.Course_Name],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } else {
        res.json({
          status: 200,
          message: "Response from user post api",
          data: result,
        });
      }
    }
  );
});

// POST used to amend course plan
studentadvising.post("/coursePlanAmend", (req, res) => {
  connection.execute(
    "Update course_plan set Course_Name=? where Email=?",
    [req.body.Course_Name, req.body.Email],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } else {
        res.json({
          status: 200,
          message: "Response from user post api",
          data: result,
        });
      }
    }
  );
});

// POST used to amend prerequisite courses
studentadvising.post("/prerequisiteAmend", (req, res) => {
  connection.execute(
    "Update prerequisite set Course_Name=? where Email=?",
    [req.body.Course_Name, req.body.Email],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } else {
        res.json({
          status: 200,
          message: "Response from user post api",
          data: result,
        });
      }
    }
  );
});

// GET used to check for duplicate prerequisites
studentadvising.post("/duplicatePrereq", (req, res) => {
  connection.execute(
    "Select Email from prerequisite where Course_Name=?",
    [req.body.Course_Name],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } else {
        if(result.length === 0){
          res.json({
            status: 200,
            message: "Response from user post api",
            data: result,
          });
        }
        else{
          console.log(result);
          let tempStr = JSON.stringify(result[0].Email);
          tempStr = tempStr.replace(/^"(.*)"$/, '$1');
          if(tempStr === req.body.Email){
            console.log(tempStr);
            return res.status(400).json({ message: 'Duplicate Course' });
          }
          else{
            res.json({
              status: 200,
              message: "Response from user post api",
              data: result,
            });
          }
        }
      }
    }
  );
});

// GET used to check for duplicate courses
studentadvising.post("/duplicateCourse", (req, res) => {
  connection.execute(
    "Select Email from course_plan where Course_Name=?",
    [req.body.Course_Name],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } else {
        if(result.length === 0){
          res.json({
            status: 200,
            message: "Response from user post api",
            data: result,
          });
        }
        else{
          console.log(result);
          let tempStr = JSON.stringify(result[0].Email);
          tempStr = tempStr.replace(/^"(.*)"$/, '$1');
          if(tempStr === req.body.Email){
            console.log(tempStr);
            return res.status(400).json({ message: 'Duplicate Course' });
          }
          else{
            res.json({
              status: 200,
              message: "Response from user post api",
              data: result,
            });
          }
        }
      }
    }
  );
});

// GET used to check for duplicate advising history
studentadvising.get("/duplicateHistory", (req, res) => {
  console.log(req.body.Email);
  console.log(req.body.Current_Term);
  console.log("Inside duplicateHistory");
  connection.execute(
    "Select Term_Status from advising_history where Email=?",
    [req.body.Email],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } else {
        let tempStr = JSON.stringify(result[0].Term_Status);
        tempStr = tempStr.replace(/^"(.*)"$/, '$1');
        if(tempStr === "Pending"){
          return res.status(400).json({ message: 'Advising changes pending approval' });
        }
        else{
          res.json({
            status: 200,
            message: "Response from user post api",
            data: result,
          });
        }
      }
    }
  );
});

// GET call to retrieve student advising history based on email and term
studentadvising.post("/retrieveHistory", (req, res) => {
  connection.execute(
    "Select * from course_plan where Email=? and Current_Term=?",
    [req.body.Email, req.body.Term],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } else {
        res.json({
          status: 200,
          message: "Response from user post api",
          data: result,
        });
      }
    }
  );
});

export default studentadvising;