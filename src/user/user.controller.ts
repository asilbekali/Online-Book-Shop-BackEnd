import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('User') 
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' }) 
  @ApiBody({
    description: 'User registration data',
    type: CreateUserDto,
  }) 
  register(@Body() user: CreateUserDto) {
    return this.userService.register(user);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login an existing user' })
  @ApiBody({
    description: 'User login data',
    schema: {
      type: 'object',
      properties: {
        gmail: { type: 'string', example: 'john.doe@gmail.com' },
        password: { type: 'string', example: 'StrongPassword123!' },
      },
    },
  })
  login(@Body() user: CreateUserDto) {
    return this.userService.login(user);
  }
}
