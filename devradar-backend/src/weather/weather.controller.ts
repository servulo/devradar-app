
import { Controller, Get, Query } from "@nestjs/common";
import { WeatherService } from "./weather.service";
import { WeatherQueryDto } from "./dto/weather-query.dto";

@Controller('weather')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) {}

    @Get()
    getWeather(@Query() query: WeatherQueryDto) {
        return this.weatherService.getWeather(query.city);
    }

}