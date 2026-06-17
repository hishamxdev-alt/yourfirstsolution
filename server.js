// // Load environment variables from the .env file
// require('dotenv').config();

// // Required packages
// const express = require('express');
// const mysql = require('mysql2');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// const bodyParser = require('body-parser');
  
// // Initialize Express app
// const app = express();
// const port = 5000;
// app.options('*', cors()); // This will handle OPTIONS requests for all routes
 
// // Use middleware
// app.use(express.json());
// app.use(bodyParser.json()); // Middleware to parse JSON requests
// app.use(cors({
//   origin: 'http://localhost:4200',  // Allow Angular app's origin
//   methods: ['GET', 'POST', 'OPTIONS'], // Allow only specific methods
//   allowedHeaders: ['Content-Type', 'Authorization']  // Allow headers sent by the frontend
// }));

// // MySQL connection
// const db = mysql.createConnection({
//   host: process.env.MYSQL_HOST || 'localhost', 
//   user: process.env.MYSQL_USER || 'yfs_databse',
//   password: process.env.MYSQL_PASSWORD || 'YFS_Supp@123',
//   database: process.env.MYSQL_DATABASE || 'yfs_database',
// });

// // Check MySQL connection
// db.connect(err => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     return;
//   }
//   console.log('Connected to MySQL database');
// });

// // JWT secret from environment variable
// const JWT_SECRET = process.env.JWT_SECRET;

// // Middleware to verify JWT tokens
// const verifyToken = (req, res, next) => {
//   const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
//   console.warn(token)
//   if (!token) {
//     return res.status(403).json({ message: 'No token provided' });
//   }

//   jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
//     req.user = decoded;  // Attach the decoded token data to the request object
//     next();
//   });
// };



// //  track visitors
//  app.post('/api/track-visitor', (req, res) => {
//   const { device } = req.body;

//   if (!device) {
//     return res.status(400).json({ message: 'Device type is required' });
//   }

//   db.query('INSERT INTO visitors (device_type, visit_time) VALUES (?, NOW())', [device], (err, result) => {
//     if (err) {
//       console.error('Error tracking visitor:', err);
//       res.status(500).json({ message: 'Error tracking visitor' });
//     } else {
//       res.json({ message: 'Visitor tracked successfully' });
//     }
//   });
// });

// // get visitor statistics
// app.get('/api/visitors', (req, res) => {
//   const sql = `
//       SELECT 
//           COUNT(*) AS total_visits,
//           SUM(CASE WHEN device_type = 'mobile' THEN 1 ELSE 0 END) AS mobile_visits,
//           SUM(CASE WHEN device_type = 'desktop' THEN 1 ELSE 0 END) AS desktop_visits
//       FROM visitors;
//   `;

//   db.query(sql, (err, results) => {
//       if (err) {
//           console.error('Error fetching visitor data:', err);
//           res.status(500).json({ message: 'Database error' });
//       } else {
//           res.json(results[0]);
//       }
//   });
// });



// // POST insert data into the database (e.g., contact form submissions)
// app.post('/api/contact-us', (req, res) => {
//   const { name, email, subject, message } = req.body;

//   if (!name || !email || !subject || !message) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   const sql = `INSERT INTO contact_us (name, email, subject, message) VALUES (?, ?, ?, ?)`;
  
//   db.query(sql, [name, email, subject, message], (err, result) => {
//     if (err) {
//       console.error('Error inserting data:', err.message);
//       return res.status(500).json({ error: 'Failed to insert data into the database' });
//     }
//     return res.status(201).json({
//       message: "Form submitted successfully",
//       data: req.body,
//     });
//   });
// });

// // GET retrieve all contact form submissions (protected)
// app.get('/api/contact-us', (req, res) => {
//   const sql = 'SELECT id, name, email, subject, message, DATE_FORMAT(created_at, "%Y-%m-%d %H:%i:%s") AS created_at FROM contact_us';

//   db.query(sql, (err, rows) => {
//     if (err) {
//       console.error('Error retrieving data:', err.message);
//       return res.status(500).json({ error: 'Failed to retrieve data from the database' });
//     }
//     res.json(rows);
//   });
// });



// // DELETE API to remove a contact form submission by ID
// app.delete('/api/contact-us/:id', (req, res) => {
//   const { id } = req.params;
//   const sql = 'DELETE FROM contact_us WHERE id = ?';

//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       console.error('Error deleting data:', err.message);
//       return res.status(500).json({ error: 'Failed to delete data from the database' });
//     }
    
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'No record found with that ID' });
//     }

//     res.json({ message: `Record with ID ${id} deleted successfully` });
//   });
// });


// // Test route for protected access using JWT
// app.get('/api/protected', verifyToken, (req, res) => {
//   res.json({ message: 'This is a protected route', user: req.user });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
