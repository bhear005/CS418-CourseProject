import 'dotenv/config';
import mysql from 'mysql2';

/* All info within createConnection must be replaced to
   match email/password/firstName/lastName for assignment 1 
   */
const connection=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE
})

export { connection };