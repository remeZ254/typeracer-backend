import { Controller, Get } from '@nestjs/common';
import { CommonService } from '../services/common.service';
import { Health } from '../models/common.model';

@Controller()
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('version')
  getVersion(): string {
    return process.env.npm_package_version;
  }

  @Get('health')
  getHealth(): Health {
    return this.commonService.getHealth();
  }
}
