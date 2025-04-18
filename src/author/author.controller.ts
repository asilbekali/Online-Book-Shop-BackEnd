import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiQuery } from '@nestjs/swagger';



export enum SortOrder {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

@UseGuards(AuthGuard)
@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  
    @Get()
    @ApiQuery({
      name: 'sort',
      description: 'Sort order',
      enum: SortOrder,
      enumName: 'SortOrder',
      required: false,
    })
    @ApiQuery({
      name: 'page',
      description: 'Page number',
      required: false,
    })
    @ApiQuery({
      name: 'limit',
      description: 'Number of items per page',
      required: false,
    })
    findAll(
      @Query('page') page?: string,
      @Query('limit') limit?: string,
      @Query('sort') sort?: SortOrder,
    ) {
      const query = {
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 100,
        sort: sort || SortOrder.ASCENDING,
      };
  
      return this.authorService.findAll(query);
    }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorService.remove(id);
  }
}
