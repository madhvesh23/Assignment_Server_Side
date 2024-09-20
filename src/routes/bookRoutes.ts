import { Router } from 'express';
import { BookController } from '../controllers/bookController';

const router = Router();

router.post('/books', BookController.addBook);
router.get('/books', BookController.getBooks);
router.put('/books/:id', BookController.updateBook);
router.delete('/books/:id', BookController.deleteBook);

export default router;
