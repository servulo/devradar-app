import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SearchHistory } from "./search-history.entity";
import { Repository } from "typeorm";
import { WeatherResponseDto } from "../weather/dto/weather-response.dto";

@Injectable()
export class HistoryService {

    constructor(
        @InjectRepository(SearchHistory)
        private readonly historyRepository: Repository<SearchHistory>,
    ) {}

    async save(weather: WeatherResponseDto): Promise<SearchHistory> {
        const entry = this.historyRepository.create({
            city: weather.city,
            country: weather.country,
            temperature: weather.temperature,
            description: weather.description,
            humidity: weather.humidity,
            windSpeed: weather.windSpeed,
        });
        return this.historyRepository.save(entry);
    }

    async findAll(page: number = 1, limit: number = 10) {
        const [data,total] = await this.historyRepository.findAndCount({
            order: { searchedAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }

    async remove(id: number): Promise<void> {
        await this.historyRepository.delete(id);
    }
    
}