import { Controller, Get } from '@nestjs/common';
import { QuotesService } from '../services/quotes.service';
import { Quote } from '../models/quotes.model';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get()
  getRandomQuote(): Quote {
    return this.quotesService.getRandomQuote();
  }

  @Get('amount')
  getAmountOfQuotes(): number {
    return this.quotesService.getAmountOfQuotes();
  }
}
