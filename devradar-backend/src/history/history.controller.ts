import { Controller, Delete, Get, Param, Query } from "@nestjs/common";
import { HistoryService } from "./history.service";

@Controller('history')
export class HistoryController {

    constructor(private readonly historyService: HistoryService) {
    
    }

    @Get()
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.historyService.findAll(Number(page), Number(limit));
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.historyService.remove(Number(id));
    }


}