import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class WeatherQueryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  city!: string;
}