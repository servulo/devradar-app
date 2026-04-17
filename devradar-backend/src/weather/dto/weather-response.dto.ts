import { ApiProperty } from '@nestjs/swagger';

export class WeatherResponseDto {
  @ApiProperty({ example: 'Rio de Janeiro' })
  city!: string;

  @ApiProperty({ example: 'BR' })
  country!: string;

  @ApiProperty({ example: 28.5 })
  temperature!: number;

  @ApiProperty({ example: 31.0 })
  feelsLike!: number;

  @ApiProperty({ example: 'céu limpo' })
  description!: string;

  @ApiProperty({ example: 75 })
  humidity!: number;

  @ApiProperty({ example: 3.5 })
  windSpeed!: number;
}