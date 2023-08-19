import { initConfiguration } from './features/config/utils/config.utils';

initConfiguration();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(3000);
})();
