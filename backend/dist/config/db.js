import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
export const initializeDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL database');
        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user'
      )
    `);
        await connection.query(`
      CREATE TABLE IF NOT EXISTS buses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        total_seats INT NOT NULL
      )
    `);
        await connection.query(`
      CREATE TABLE IF NOT EXISTS routes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bus_id INT,
        origin VARCHAR(255) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        departure_time DATETIME NOT NULL,
        arrival_time DATETIME NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
      )
    `);
        await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        route_id INT,
        seat_number INT NOT NULL,
        status ENUM('booked', 'cancelled') DEFAULT 'booked',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
      )
    `);
        console.log('Database tables initialized');
        connection.release();
    }
    catch (error) {
        console.error('Error initializing database:', error);
        // If database doesn't exist, we might need to create it first.
        // But usually in development, we expect the DB to be created or we can try to create it here.
        if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('Database does not exist. Creating database...');
            const tempConn = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
            });
            await tempConn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
            await tempConn.end();
            console.log('Database created. Re-initializing...');
            return initializeDB();
        }
    }
};
export default pool;
//# sourceMappingURL=db.js.map