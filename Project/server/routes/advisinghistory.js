import { Router } from "express";
import { connection } from "../database/database.js";
const advisinghistory = Router();
import { SendMail } from "../utils/SendMail.js";

// GET data stored in advising history based on student email
advisinghistory.get("/:Email", (req, res) => {
  console.log(req.params.Email);
  connection.execute(
    "select * from advising_history where Email=?",
    [req.params.Email],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } else {
        res.json({
          status: 200,
          message: "Response from user get api",
          data: result,
        });
      }
    }
  );
});

// GET data store in advising history based on student email and term
advisinghistory.get("/:Email/:Term", (req, res) => {
  // console.log(req.params.Email);
  // console.log(req.params.Term);
  connection.execute(
    "select * from advising_history where Email=? and Term=?",
    [req.params.Email, req.params.Term],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } else {
        res.json({
          status: 200,
          message: "Response from user get api",
          data: result,
        });
      }
    }
  );
});

// POST used to amend Term_Status to "Denied" in advising_history table
advisinghistory.post("/reject", (req, res) => {
  console.log(req.body.Email);
  console.log(req.body.Term);
  console.log(req.body.comments);
  SendMail(
    req.body.Email, "Advising Request Denied", `Your advising request for ${req.body.Term} term has been denied. 
    Advisor comments: ${req.body.comments}`);
  connection.execute(
    "update advising_history set Term_Status='Denied' where Email=? and Term=?",
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

// POST used to amend Term_Status to "Approved" in advising_history table
advisinghistory.post("/approve", (req, res) => {
  console.log(req.body.Email);
  console.log(req.body.Term);
  console.log(req.body.comments);
  SendMail(
    req.body.Email, "Advising Request Approval", `Your advising request for the ${req.body.Term} term has been approved!
    Advisor comments: ${req.body.comments}`);
  connection.execute(
    "update advising_history set Term_Status='Approved' where Email=? and Term=?",
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



export default advisinghistory;