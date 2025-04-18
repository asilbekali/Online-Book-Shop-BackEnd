import { ApiProperty } from '@nestjs/swagger';


export class CreateBookDto {
  @ApiProperty({
    description: 'Book name',
    example: "O'tgan kunlar",
  })
  name: string;

  @ApiProperty({
    description: 'Author name',
    example: 'John Doe',
  })
  author: string;
}
