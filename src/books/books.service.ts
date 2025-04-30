import { Injectable } from '@nestjs/common';
import { Book } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}
  create(data: CreateBookDto) {
    return this.prisma.book.create({
      data,
    });
  }
  findAll() {
    return this.prisma.book.findMany();
  }
  findOne(id: string) {
    return this.prisma.book.findUnique({
      where: {
        id,
      },
    });
  }
  update(id: string, data: Partial<Omit<Book, 'id'>>) {
    return this.prisma.book.update({
      where: {
        id,
      },
      data,
    });
  }
  remove(id: string) {
    return this.prisma.book.delete({
      where: {
        id,
      },
    });
  }
}
