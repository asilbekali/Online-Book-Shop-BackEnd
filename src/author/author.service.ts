import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';
import { Model } from 'mongoose';

@Injectable()
export class AuthorService {
  constructor(@InjectModel(Author.name) private author: Model<Author>) {}

  async create(createAuthorDto: CreateAuthorDto) {
    try {
      const newAuthor = new this.author(createAuthorDto);
      return await newAuthor.save();
    } catch (error) {
      console.error('Error in create:', error.message);
      throw new BadRequestException('Failed to create author');
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

      const authors = await this.author
        .find(filterQuery)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit);
      const totalAuthors = await this.author.countDocuments(filterQuery);

      return {
        data: authors,
        pagination: {
          total: totalAuthors,
          currentPage: page,
          totalPages: Math.ceil(totalAuthors / limit),
        },
      };
    } catch (error) {
      console.error('Error in findAll:', error.message);
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const author = await this.author.findById(id);
      if (!author) {
        throw new BadRequestException('Author not found');
      }
      return author;
    } catch (error) {
      console.error('Error in findOne:', error.message);
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    try {
      const updatedAuthor = await this.author.findByIdAndUpdate(
        id,
        { $set: updateAuthorDto },
        { new: true },
      );
      if (!updatedAuthor) {
        throw new BadRequestException('Failed to update author');
      }
      return updatedAuthor;
    } catch (error) {
      console.error('Error in update:', error.message);
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const deletedAuthor = await this.author.findByIdAndDelete(id);
      if (!deletedAuthor) {
        throw new BadRequestException('Author not found or already deleted');
      }
      return { message: 'Author successfully removed', author: deletedAuthor };
    } catch (error) {
      console.error('Error in remove:', error.message);
      throw new BadRequestException(error.message);
    }
  }
}
