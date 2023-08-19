import { Injectable } from '@nestjs/common';
import { Health } from '../models/common.model';

@Injectable()
export class CommonService {
  getHealth = (): Health => ({ alive: true });
}
