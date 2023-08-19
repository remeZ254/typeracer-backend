import { Module } from '@nestjs/common';
import { QuotesModule } from '../quotes/quotes.module';
import { AuthModule } from '../auth/auth.module';
import { RoomsService } from './services/rooms.service';
import { RoomsGateway } from './gateways/rooms.gateway';

@Module({
  imports: [AuthModule, QuotesModule],
  providers: [RoomsGateway, RoomsService]
})
export class RoomsModule {}
