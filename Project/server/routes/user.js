import { Router } from "express";
import { connection } from "../database/database.js";
import { ComparePasword, HashedPassword } from "../utils/helper.js";
import { SendMail } from "../utils/SendMail.js";
import { compare } from "bcrypt";
const user = Router();

// Randomly generated code used for email validation
let validation = 0;

// Function to generate validation code
function randomIntRange(){
  validation = Math.floor(Math.random() * 99999)+10000;
  return (validation)
}

// GET all data stored in user_information
user.get("/", (req, res) => {
  connection.execute("select * from user_information", function (err, result) {
    if (err) {
      res.json(err.message);
    } else {
      res.json({
        status: 200,
        message: "Response from user get api",
        data: result,
      });
    }
  });
});

// Get data stored in user_information based on entered id param
user.get("/:id", (req, res) => {
  connection.execute(
    "select * from user_information where user_id=?",
    [req.params.id],
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

// Initial email validation 
user.post("/email/validation", (req, res) => {
  let tempVal = JSON.stringify(req.body.Validation_Code);
  tempVal = tempVal.replace(/^"(.*)"$/, '$1');
  console.log(req.body.Email);
 
  connection.execute(
    "select Validation_Code from user_information where Email=?",
    [req.body.Email],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } 
      else {
        const tempStr = JSON.stringify(result[0].Validation_Code);

        if(tempVal === tempStr){

          // Set Email_Validated to 1
          connection.execute(
            "update user_information set Email_Validated=? where Email=?",
            [1,req.body.Email],
            function (err, result){
              if (err){
                res.json(err.message);
              }
            }
          )  

          console.log("in if statement");
            res.json({
              status: 200,
              message: "User has been verified",
              data: result,
            });
        }
        else{
          return res.status(400).json({ message: 'Invalid Code' });
        } 
      }
    }
  );
});


// POST used create user data
user.post("/", (req, res) => {

  const hashedPassword = HashedPassword(req.body.Password)
  SendMail(req.body.Email,"Login Verification", `Your login verification is ${randomIntRange()}`)
  connection.execute(
    "Insert into user_information (First_Name,Last_Name,Email,Password,Validation_Code) values(?,?,?,?,?)",
    [req.body.First_Name, req.body.Last_Name, req.body.Email, hashedPassword,validation],
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


// user.delete("/:id", (req, res) => {
//   connection.execute(
//     "delete from user_information where user_id=?",
//     [req.params.id],
//     function (err, result) {
//       if (err) {
//         res.json(err.message);
//       } else {
//         res.json({
//           status: 200,
//           message: "Response from user delete api",
//           data: result,
//         });
//       }
//     }
//   );
// });


// Edit user info based on Email identifier
// user.put("/:Email", (req, res) => {
//   const hashedPassword = HashedPassword(req.body.Password)
//   connection.execute(
//     "update user_information set First_Name=? , Last_Name=?, Password=? where Email=?",
//     [req.body.First_Name, req.body.Last_Name, hashedPassword, req.params.Email],
//     function (err, result) {
//       if (err) {
//         res.json(err.message);
//       } else {
//         res.json({
//           status: 200,
//           message: "Response from user delete api",
//           data: result,
//         });
//       }
//     }
//   );
// });

// Send email for validation code
user.post("/send/email", (req,res) => {
  SendMail(req.body.Email,"Login Validation", `Your login validation code is ${randomIntRange()}`)
  connection.execute(
    "update user_information set Validation_Code=? where Email=?",
    [validation, req.body.Email],
    function(err,result){
      if (err){
        res.json(err.message);
      }
      else{
        res.json({
          status: 200,
          message: "Response from send email api",
          data: result,
        });
      }
    }
  )
});

// Login based on user credentials
user.post("/login", (req, res) => {

  connection.execute(
    "select * from user_information where Email=?",
    [req.body.Email],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } else {
        if (ComparePasword(req.body.Password, result[0].Password) && result[0].Email_Validated === 1) {
          console.log("in if statement");
          //SendMail(req.body.email,"Login Verification","Your login verification is 1234567")

          res.json({
            status: 200,
            message: "user logged in successfully",
            data: result,
          });
        }
        else {
          console.log("in else statement");
          return res.status(400).json({ message: 'Invalid Password' });
        }
      }
    }
  );
});

// Sends password reset link to email (poor naming choice)
user.post("/reset/password", (req,res) => {
  SendMail(req.body.Email,"Password Reset", "Reset Password Link: http://localhost:5173/PasswordReset")
})

user.post("/check/email", (req, res) => {

//console.log(req.body.Email);

  connection.execute(
    "select email from user_information where email=?",
    [req.body.Email],
    function (err, result) {
      if (result.length <= 0) {
        console.log("inside if statement");
        res.json({
          status: 200,
          message: "Email is available",
          data: result,
        });
        console.log(result);
      }
      // else {
      //   res.json(err.message);
      // }
    }
  );
});

// Actually resets password
user.put("/change/password", (req, res) => {
  const hashedPassword = HashedPassword(req.body.Password)
  //console.log(req.body.Email);
  //console.log(req.body.Password);

  SendMail(req.body.Email,"Password Reset", "Reset Password Link: http://localhost:5173/PasswordReset")
  connection.execute(
    "update user_information set Password=? where Email=?",
    [hashedPassword, req.body.Email],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } else {
        res.json({
          status: 200,
          message: "Response from user PUT api",
          data: result,
        });
      }
    }
  );
});

// Edit user First_Name based on Email identifier
user.put("/First_Name", (req, res) => {
  connection.execute(
    "update user_information set First_Name=? where Email=?",
    [req.body.First_Name, req.body.Email],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } else {
        res.json({
          status: 200,
          message: "Response from user delete api",
          data: result,
        });
      }
    }
  );
});

// Edit user Last_Name based on Email identifier
user.put("/Last_Name", (req, res) => {
  connection.execute(
    "update user_information set Last_Name=? where Email=?",
    [req.body.Last_Name, req.body.Email],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } else {
        res.json({
          status: 200,
          message: "Response from user delete api",
          data: result,
        });
      }
    }
  );
});

// Edit user Password based on Email identifier
user.put("/Password", (req, res) => {
  const hashedPassword = HashedPassword(req.body.Password)
  connection.execute(
    "update user_information set Password=? where Email=?",
    [hashedPassword, req.body.Email],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } else {
        res.json({
          status: 200,
          message: "Response from user delete api",
          data: result,
        });
      }
    }
  );
});

// Determine if account is an administrator
user.post("/Admin", (req, res) => {
  connection.execute(
    "select Admin_Account from user_information where Email=?",
    [req.body.Email],
    function (err, result) {
      console.log(result[0].Admin_Account);
      if (err) {
        res.json(err.message);
      } else {
        console.log(result[0].Admin === 1);
        if (result[0].Admin_Account === 1){
          res.json({
            status: 200,
            message: "Response from user get api",
            data: result,
          });
        }
        else{
          return res.status(400).json({ message: 'Not Admin Account' });
        }
      }
    }
  );
});

export default user;