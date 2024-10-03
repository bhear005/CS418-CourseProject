import mysql from 'mysql2';

/* All info within createConnection must be replaced to
   match email/password/firstName/lastName for assignment 1 
   */
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456789',
    database: 'course_advising'
})

export { connection };