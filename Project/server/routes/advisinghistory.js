import { Router } from "express";
import { connection } from "../database/database.js";
const advisinghistory = Router();

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

export default advisinghistory;