import { pool } from "../config/database";
import { Book } from "../models/bookModel";
import { BookUser } from "../types/bookTypes";

export class BookService {
  static async addBook(
    book: Book
  ): Promise<{ success: boolean; message?: string }> {
    if (!book) {
      return {
        success: false,
        message: "Empty fields",
      };
    }
    const checkSql = "SELECT COUNT(*) AS count FROM Inventory WHERE isbn = ?";
    const [rows] = await pool.query(checkSql, [book.isbn]);

    if ((rows as [{ count: number }])[0].count > 0) {
      return { success: false, message: "ISBN already exists" };
    }
    const sql =
      "INSERT INTO Inventory (title, author, genre, publication_date, isbn) VALUES (?, ?, ?, ?, ?)";
    await pool.query(sql, [
      book.title,
      book.author,
      book.genre,
      book.publication_date,
      book.isbn,
    ]);
    return { success: true, message: "Book added successfully" };
  }

  static async getBooks(filter: Partial<BookUser>): Promise<{
    success: boolean;
    data: Book[];
    metaData: number;
  }> {
    let sql = "SELECT * FROM Inventory WHERE 1=1";
    let countSql = "SELECT COUNT(*) as totalCount FROM Inventory WHERE 1=1";  

    const params: string[] = [];

    if (filter.title) {
      sql += " AND title LIKE ?";
      countSql += " AND title LIKE ?";
      params.push(`%${filter.title}%`);
    }
    if (filter.author) {
      sql += " AND author LIKE ?";
      countSql += " AND author LIKE ?";
      params.push(`%${filter.author}%`);
    }
    if (filter.genre) {
      sql += " AND genre LIKE ?";
      countSql += " AND genre LIKE ?";
      params.push(`%${filter.genre}%`);
    }
    if (filter.isbn) {
      sql += " AND isbn LIKE ?";
      countSql += " AND isbn LIKE ?";
      params.push(`%${filter.isbn}%`);
    }
    if (filter.publication_date) {
      sql += " AND publication_date = ?";
      countSql += " AND publication_date = ?";
      params.push(filter.publication_date);
    }

    const [rows] = await pool.query(sql, params);

    const [countResult] = await pool.query(countSql, params);
    const totalCount = (countResult as { totalCount: number }[])[0].totalCount;

    return {
      success: true,
      data: rows as Book[],
      metaData: totalCount,
    };
  }

  static async updateBook(id: number, book: Partial<Book>): Promise<void> {
    const sql =
      "UPDATE Inventory SET title = ?, author = ?, genre = ?, publication_date = ?, isbn = ? WHERE id = ?";
    await pool.query(sql, [
      book.title,
      book.author,
      book.genre,
      book.publication_date,
      book.isbn,
      id,
    ]);
  }

  static async deleteBook(id: number): Promise<void> {
    const sql = "DELETE FROM Inventory WHERE id = ?";
    await pool.query(sql, [id]);
  }
}
