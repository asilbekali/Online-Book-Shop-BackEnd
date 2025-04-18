import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'StrongPassword123!',
  })
  password: string;

  @ApiProperty({
    description: 'The Gmail address of the user',
    example: 'john.doe@gmail.com',
  })
  gmail: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'user',
  })
  role: string;
}
