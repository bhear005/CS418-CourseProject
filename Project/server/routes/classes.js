import { Router } from "express";
import { connection } from "../database/database.js";
const classes = Router();

// GET all data stored in Classes
classes.get("/", (req, res) => {
  connection.execute("select * from Classes", function (err, result) {
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

// GET all admin declared prereq courses stored in Classes
classes.get("/loadPrereq", (req, res) => {
  connection.execute("select * from Classes where Prerequisite=1", function (err, result) {
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

// GET all non-prereq courses stored in Classes
classes.get("/loadNonPrereq", (req, res) => {
  connection.execute("select * from Classes where Prerequisite=0", function (err, result) {
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

// Checkbox API endpoint for prereq selection page
classes.post("/enablePrereq", (req, res) => {
  console.log(req.body.Course_Name);

  connection.execute(
    "select Prerequisite from Classes where Course_Name=?",
    [req.body.Course_Name],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } else {
        const tempStr = JSON.stringify(result[0].Prerequisite);
        console.log(tempStr);
        if (tempStr === '0') {
          // Set Prerequisite to 1
          connection.execute(
            "update classes set Prerequisite=? where Course_Name=?",
            [1, req.body.Course_Name],
            function (err, result) {
              if (err) {
                res.json(err.message);
              }
            }
          );

          console.log("in if statement");
          res.json({
            status: 200,
            message: "Prerequisite set to 1",
            data: result,
          });
        } 
        else {
          // Set Prerequisite to 1
          connection.execute(
            "update classes set Prerequisite=? where Course_Name=?",
            [0, req.body.Course_Name],
            function (err, result) {
              if (err) {
                res.json(err.message);
              }
            }
          );

          console.log("in else statement");
          res.json({
            status: 200,
            message: "Prerequisite set to 0",
            data: result,
          });
        }
      }
    }
  );
});

// POST used to retrieve data from prerequisites table based on Email and Current_Term
classes.post("/prereqData", (req, res) => {
  connection.execute(
    "select * from Prerequisites where Email=? and Current_Term=?",
    [req.body.Email, req.body.Current_Term],
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

// POST used to retrieve data from course_plan table based on Email and Current_Term
classes.post("/coursePlanData", (req, res) => {
  connection.execute(
    "select * from course_plan where Email=? and Current_Term=?",
    [req.body.Email, req.body.Current_Term],
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

export default classes;