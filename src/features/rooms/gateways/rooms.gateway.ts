import { ConflictException, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { GatewayMetadata } from '@nestjs/websockets/interfaces';
import { Server, Socket } from 'socket.io';

import { AuthService } from '../../auth/services/auth.service';
import { PlayerUpdate, Room, RoomModes } from '../models/rooms.model';
import { RoomsService } from '../services/rooms.service';

@WebSocketGateway<GatewayMetadata>({
  cors: {
    origin: '*'
  }
})
export class RoomsGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('RoomGateway');

  constructor(private roomsService: RoomsService, private authService: AuthService) {}

  handleDisconnect(client: Socket) {
    const nickName = this.authService.getAuth(client);
    this.logger.log(`Client '${nickName}' disconnected`);
    this.roomsService.getClientRooms(client).forEach((room: Room) => {
      this.roomsService.leaveRoom(client, room);
      this.server.to(room.id).emit('room', room);
    });
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() mode: RoomModes, @ConnectedSocket() client: Socket) {
    const nickName = this.authService.getAuth(client);

    // TODO: send 'unauthorized' message
    if (!nickName) {
      client.disconnect();
      return;
    }

    if (!this.roomsService.server) {
      this.roomsService.server = this.server;
    }

    try {
      const room: Room = this.roomsService.joinRoom(client, nickName, mode);
      this.logger.log(`Client '${nickName}' joined ${mode.toLowerCase()} room ${room.id}`);
      this.server.to(room.id).emit('room', room);
    } catch (e) {
      this.logger.warn(`Error during 'joinRoom' message: ${(e as ConflictException).message}`);
    }
  }

  @SubscribeMessage('playerUpdate')
  playerUpdate(@MessageBody() playerUpdate: PlayerUpdate, @ConnectedSocket() client: Socket) {
    try {
      const room = this.roomsService.playerUpdate(playerUpdate);
      this.server.to(room.id).emit('room', room);
    } catch (e) {
      this.logger.warn(`Error during 'playerUpdate' message: ${(e as ConflictException).message}`);
    }
  }
}
