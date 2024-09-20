import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  connectionLimit: 10,
});

export const initializeDatabase = async () => {
  try {
    await pool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await pool.query(`USE ${process.env.DB_NAME}`);
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Inventory (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        genre VARCHAR(100),
        publication_date DATE,
        isbn VARCHAR(13) UNIQUE NOT NULL
      )
    `;
    await pool.query(createTableQuery);
    console.log('Database and table initialized');
  } catch (error) {
    console.error('Error initializing the database:', error);
    throw error;
  }
};
