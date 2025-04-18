import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({
    description: 'Author name',
    example: "Alex Johns",
  })
  name: string;
}
