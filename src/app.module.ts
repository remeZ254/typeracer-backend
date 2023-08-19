import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CommonModule } from './features/common/common.module';
import { RoomsModule } from './features/rooms/rooms.module';
import { QuotesModule } from './features/quotes/quotes.module';
import { ConfigModule } from './features/config/config.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/typeracer-client')
    }),
    RouterModule.register([
      {
        path: 'api',
        children: [CommonModule, QuotesModule]
      }
    ]),
    CommonModule,
    RoomsModule,
    ConfigModule
  ]
})
export class AppModule {}
