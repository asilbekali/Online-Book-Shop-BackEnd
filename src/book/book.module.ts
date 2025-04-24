import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Book } from 'src/entities/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    JwtModule.register({ global: true, secret: 'book' }),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
