import { Controller, Get } from '@nestjs/common';
import { getClientConfig } from '../utils/config.utils';

@Controller('config')
export class ConfigController {
  @Get()
  clientConfig() {
    return getClientConfig();
  }
}
