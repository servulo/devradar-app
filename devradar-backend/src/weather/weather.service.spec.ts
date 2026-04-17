import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HistoryService } from '../history/history.service';
import { of } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

const mockWeatherApiResponse = {
  data: {
    name: 'Rio de Janeiro',
    sys: { country: 'BR' },
    main: { temp: 30, feels_like: 32, humidity: 80 },
    weather: [{ description: 'céu limpo' }],
    wind: { speed: 5 },
  },
};

describe('WeatherService', () => {
  let service: WeatherService;
  let httpService: jest.Mocked<HttpService>;
  let cacheManager: { get: jest.Mock; set: jest.Mock };
  let historyService: { save: jest.Mock };

  beforeEach(async () => {
    cacheManager = { get: jest.fn(), set: jest.fn() };
    historyService = { save: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'WEATHER_API_KEY') return 'fake-key';
              if (key === 'WEATHER_API_URL') return 'https://api.openweathermap.org/data/2.5';
            }),
          },
        },
        { provide: CACHE_MANAGER, useValue: cacheManager },
        { provide: HistoryService, useValue: historyService },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    httpService = module.get(HttpService);
  });

  it('deve retornar dados do clima da API quando não há cache', async () => {
    cacheManager.get.mockResolvedValue(null);
    jest.spyOn(httpService, 'get').mockReturnValue(of(mockWeatherApiResponse as any));

    const result = await service.getWeather('Rio de Janeiro');

    expect(result.city).toBe('Rio de Janeiro');
    expect(result.temperature).toBe(30);
    expect(historyService.save).toHaveBeenCalledTimes(1);
    expect(cacheManager.set).toHaveBeenCalledTimes(1);
  });

  it('deve retornar do cache sem chamar a API', async () => {
    const cached = { city: 'Rio de Janeiro', temperature: 30 };
    cacheManager.get.mockResolvedValue(cached);

    const result = await service.getWeather('Rio de Janeiro');

    expect(result).toEqual(cached);
    expect(httpService.get).not.toHaveBeenCalled();
    expect(historyService.save).not.toHaveBeenCalled();
  });

  it('deve lançar NotFoundException quando cidade não é encontrada', async () => {
    cacheManager.get.mockResolvedValue(null);
    jest.spyOn(httpService, 'get').mockReturnValue(
      of({ response: { status: 404 } } as any),
    );
    // Simula o erro que o axios lança
    jest.spyOn(httpService, 'get').mockImplementation(() => {
      throw { response: { status: 404 } };
    });

    await expect(service.getWeather('CidadeInexistente')).rejects.toThrow(
      NotFoundException,
    );
  });
});