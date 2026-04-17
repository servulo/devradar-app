import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { WeatherResponseDto } from './dto/weather-response.dto';
import { HistoryService } from '../history/history.service';

@Injectable()
export class WeatherService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly historyService: HistoryService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getWeather(city: string): Promise<WeatherResponseDto> {
    const cacheKey = `weather:${city.toLowerCase()}`;

    // Verifica o cache primeiro
    const cached = await this.cacheManager.get<WeatherResponseDto>(cacheKey);
    if (cached) return cached;

    const apiKey = this.configService.get<string>('WEATHER_API_KEY');
    const apiUrl = this.configService.get<string>('WEATHER_API_URL');

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${apiUrl}/weather`, {
          params: {
            q: city,
            appid: apiKey,
            units: 'metric',
            lang: 'pt_br',
          },
        }),
      );

      const weather: WeatherResponseDto = {
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
      };

      // Salva no cache e no histórico
      await this.cacheManager.set(cacheKey, weather);
      await this.historyService.save(weather);

      return weather;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Cidade "${city}" não encontrada.`);
      }
      throw error;
    }
  }
}