import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { getFromConfig } from '../../config/utils/config.utils';

@Injectable()
export class AuthService {
  getAuth(client: Socket): string {
    return parse(client.request.headers.cookie || '')[getFromConfig('authKey')];
  }
}
