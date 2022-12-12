import express from 'express';
import controller from '../controller/Author';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const app = express.Router();

app.post(
  '/create',
  ValidateSchema(Schemas.author.create),
  controller.createAuthor
);
app.get('/get/:authorId', controller.readAuthor);
app.get('/get', controller.readAllAuthor);
app.patch(
  '/update/:authorId',
  ValidateSchema(Schemas.author.update),
  controller.updateAuthor
);
app.delete('/delete/:authorId', controller.deleteAuthor);

export = app;
