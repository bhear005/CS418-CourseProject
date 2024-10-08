import { Router } from "express";
import { connection } from "../database/database.js";
import { ComparePasword, HashedPassword } from "../utils/helper.js";
import { SendMail } from "../utils/SendMail.js";
import { compare } from "bcrypt";
const user = Router();

let validation = 0;

function randomIntRange(){
  validation = Math.floor(Math.random() * 99999)+10000;
  return (validation)
}

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

user.post("/email/validation", (req, res) => {
 
  connection.execute(
    "select Validation_Code from user_information where email=?",
    [req.body.Email],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } 
      else {
       if(result[0].Validation_code === req.body.Validation_code){
          res.json({
             status: 200,
             message: "User has been verified",
            data: result,
          });
       } 
      }
    }
  );
});


user.post("/", (req, res) => {

  const hashedPassword = HashedPassword(req.body.Password)
  console.log("before send mail");
  SendMail(req.body.Email,"Login Verification", `Your login verification is ${randomIntRange()}`)
  console.log("after send mail");
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


user.put("/:id", (req, res) => {
  connection.execute(
    "update user_information set First_Name=? , Last_Name=? where user_id=?",
    [req.body.First_Name, req.body.Last_Name, req.params.id],
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

user.post("/send/email", (req,res) => {
  SendMail(req.body.Email,"Login Verification", `Your login verification is ${randomIntRange()}`)
});

user.post("/login", (req, res) => {

  connection.execute(
    "select * from user_information where email=?",
    [req.body.Email],
    function (err, result) {
      if (err) {
        res.json(err.message);
      } else {
        console.log(result[0].Password);
        console.log(req.body.Password);
        if (ComparePasword(req.body.Password, result[0].Password)) {
          console.log("in if statement");
          SendMail(req.body.Email, "Login Verification", `Your login verification is ${randomIntRange()}`)

          connection.execute(
            "update user_information set Validation_Code=? where Email=?",
            [validation, req.body.Email],
            function (err, result) {
              if (err) {
                res.json(err.message);
              }
              else {
                console.log(validation);
              }
            }
          )

          res.json({
            status: 200,
            message: "user logged in successfully",
            data: result,
          });
        }
        else {
          res.json("Invalid Password");
        }
        console.log(validation);
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
  console.log(req.body.Email);
  console.log(req.body.Password);


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

export default user;