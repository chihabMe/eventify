import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from 'generated/prisma';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  @Post()
  create(@Body() data: CreateBookDto) {
    return this.bookService.create(data);
  }
  @Get()
  findAll() {
    return this.bookService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Omit<Book, 'id'>>) {
    return this.bookService.update(id, data);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }
}
