import { Injectable } from '@nestjs/common';
import { sample } from 'lodash';
import { getQuotesFromConfig } from '../../config/utils/config.utils';
import { Quote } from '../models/quotes.model';

@Injectable()
export class QuotesService {
  private readonly quotes: Quote[];

  constructor() {
    this.quotes = getQuotesFromConfig();
  }

  getRandomQuote(): Quote {
    return sample(this.quotes);
  }

  getAmountOfQuotes(): number {
    return this.quotes.length;
  }
}
