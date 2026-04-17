import { IsNotEmpty, IsString } from 'class-validator';

export class WeatherQueryDto {
  @IsNotEmpty()
  @IsString()
  city!: string;
}