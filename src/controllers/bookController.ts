import { Request, Response } from "express";
import { BookService } from "../services/bookService";
import { Book } from "../models/bookModel";
import { BookUser, IFilter, IFilterValue } from "../types/bookTypes";

export class BookController {
  static async addBook(req: Request, res: Response): Promise<Response> {
    try {
      const newBook: Book = req.body;
      const final = await BookService.addBook(newBook);
      if (!final.success) {
        return res
          .status(501)
          .json({ success:false, message: final?.message || "Empty Fields" });
      }
      return res.status(201).json({ success:true, message: "Added Successfully" });
    } catch (error) {
      return res.status(500).json({ success:false, error: "Failed, Try Again!" });
    }
  }

  static async getBooks(req: Request, res: Response): Promise<Response> {
    try {
      const filterValues: BookUser = {
        author: "",
        genre: "",
        id: "",
        isbn: "",
        publication_date: "",
        title: "",
      }; 
      const filterData = req.query as IFilter;
      const filters: IFilterValue[] = JSON.parse(filterData?.filters);

      filters?.length > 0 &&
        filters?.map((f: IFilterValue) => {
          const searchFieldId = f.id;
          const searchFieldValue = f.value;

          if (searchFieldId === "title") filterValues.title = searchFieldValue;
          if (searchFieldId === "author")
            filterValues.author = searchFieldValue;
          if (searchFieldId === "genre") filterValues.genre = searchFieldValue;
          if (searchFieldId === "isbn") filterValues.isbn = searchFieldValue;
          if (searchFieldId === "publication_date")
            filterValues.publication_date = searchFieldValue;
        }); 
      const books = await BookService.getBooks(filterValues);
 

      return res.status(200).json(books);
    } catch (error) {
      return res.status(500).json({ error: "Failed to retrieve books" });
    }
  }

  static async getBooksById(req: Request, res: Response): Promise<Response> {
    try {
      const filters = req.query;
      const books = await BookService.getBooks(filters);
      return res.status(200).json(books);
    } catch (error) {
      return res.status(500).json({ error: "Failed to retrieve books" });
    }
  }

  static async updateBook(req: Request, res: Response): Promise<Response> {
    try {
      const bookId = parseInt(req.params.id, 10);
      const bookData: Partial<Book> = req.body;
      await BookService.updateBook(bookId, bookData);
      return res.status(200).json({ message: "Book updated successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update book" });
    }
  }

  static async deleteBook(req: Request, res: Response): Promise<Response> {
    try {
      const bookId = parseInt(req.params.id, 10);
      await BookService.deleteBook(bookId);
      return res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete book" });
    }
  }
}
