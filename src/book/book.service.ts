import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Model } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(User.name) private user: Model<User>,
    @InjectModel(Book.name) private book: Model<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    try {
      const userName = await this.user.findOne({ name: createBookDto.author });
      if (!userName) {
        throw new NotFoundException('Author not found');
      }
      return await this.book.create(createBookDto);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    sort?: 'asc' | 'desc';
  }) {
    try {
      const { page = 1, limit = 10, sort = 'asc' } = query;

      const filterQuery = {};
      const sortQuery: { [key: string]: 1 | -1 } = {
        name: sort === 'asc' ? 1 : -1,
      };

      const skip = (page - 1) * limit;

      const books = await this.book
        .find(filterQuery)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit);
      const totalBooks = await this.book.countDocuments(filterQuery);

      return {
        data: books,
        pagination: {
          total: totalBooks,
          currentPage: page,
          totalPages: Math.ceil(totalBooks / limit),
        },
      };
    } catch (error) {
      console.error('Error in findAll:', error.message);
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const user = await this.user.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const book = await this.book.findById(id);
      if (!book) {
        throw new Error('Book not found');
      }

      return book;
    } catch (error) {
      console.error('Error in findOne:', error.message);
      throw error;
    }
  }
  async update(id: string, updateBookDto: UpdateBookDto) {
    try {
      const bazaAuthor = await this.user.findOne({
        name: updateBookDto.author,
      });

      if (!bazaAuthor) {
        throw new NotFoundException('Author not found !');
      }

      const book = await this.book.findById(id);
      if (!book) {
        throw new Error('Book not found');
      }

      const updatedBook = await this.book
        .findByIdAndUpdate(id, { $set: updateBookDto }, { new: true })
        .exec();

      if (!updatedBook) {
        throw new Error('Failed to update book');
      }

      return updatedBook;
    } catch (error) {
      console.error('Error updating book:', error.message);
      throw new Error(`Could not update book: ${error.message}`);
    }
  }
  async remove(id: string) {
    try {
      const book = await this.book.findById(id);
      if (!book) {
        throw new Error('Book not found');
      }
  
      const deleteResult = await this.book.deleteOne({ _id: id });
  
      if (deleteResult.deletedCount === 0) {
        throw new Error('Failed to delete book');
      }
  
      return { message: 'Book successfully deleted', book };
    } catch (error) {
      console.error('Error removing book:', error.message);
      throw new Error(`Could not remove book: ${error.message}`);
    }
  }
  
}
