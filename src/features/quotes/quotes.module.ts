import { Module } from '@nestjs/common';
import { QuotesService } from './services/quotes.service';
import { QuotesController } from './controllers/common.controller';

@Module({
  controllers: [QuotesController],
  providers: [QuotesService],
  exports: [QuotesService]
})
export class QuotesModule {}
