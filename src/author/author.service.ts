import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from '../entities/author.entity';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author) private AuthorRepo: Repository<Author>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto) {
    try {
      const newAuthor = await this.AuthorRepo.create(createAuthorDto);
      return newAuthor;
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

      const [authors, totalAuthors] = await this.AuthorRepo.findAndCount({
        order: { name: sort.toUpperCase() as 'ASC' | 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

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

  async findOne(id: number) {
    try {
      const author = await this.AuthorRepo.findOne({ where: { id } });
      if (!author) {
        throw new BadRequestException('Author not found');
      }
      return author;
    } catch (error) {
      console.error('Error in findOne:', error.message);
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    try {
      const existingAuthor = await this.AuthorRepo.findOne({
        where: { id },
      });
      if (!existingAuthor) {
        throw new BadRequestException('Author not found');
      }

      const updateAuthor = this.AuthorRepo.merge(
        existingAuthor,
        updateAuthorDto,
      );
      return await this.AuthorRepo.save(updateAuthor);
    } catch (error) {
      console.error('Error in update:', error.message);
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const deletedAuthor = await this.AuthorRepo.findOne({ where: { id } });
      if (!deletedAuthor) {
        throw new BadRequestException('Author not found or already deleted');
      }

      await this.AuthorRepo.remove(deletedAuthor);
      return { message: 'Author successfully removed', author: deletedAuthor };
    } catch (error) {
      console.error('Error in remove:', error.message);
      throw new BadRequestException(error.message);
    }
  }
}
