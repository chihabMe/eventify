import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

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
  update(id: string, data: UpdateBookDto) {
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
