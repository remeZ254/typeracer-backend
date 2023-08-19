import { ConflictException, Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { v4 as uuid } from 'uuid';

import {
  getRandomAirTrack,
  Player,
  PlayerUpdate,
  Room,
  RoomModes,
  RoomStatus
} from '../models/rooms.model';
import { QuotesService } from '../../quotes/services/quotes.service';
import { countdownResolver } from '../utils/rooms.utils';
import { getFromConfig } from '../../config/utils/config.utils';

@Injectable()
export class RoomsService {
  server: Server;
  private readonly rooms: Record<string, Room>;
  private readonly roomMaxCapacity = getFromConfig('roomMaxCapacity');

  constructor(private quotesService: QuotesService) {
    this.rooms = {};
  }

  joinRoom(client: Socket, nickName: string, mode: RoomModes): Room {
    const room: Room = this.getRoom(mode);
    this.addPlayerToRoom(client, room, nickName);
    return room;
  }

  leaveRoom(client: Socket, room: Room) {
    client.leave(room.id);
    this.rooms[room.id].players = this.rooms[room.id].players.filter(
      ({ socketId }: Player) => socketId !== client.id
    );
    this.rooms[room.id].countdown = countdownResolver(room.mode, room.players.length);
    if (room.players.length === 1 && this.rooms[room.id].status === RoomStatus.ACTIVE) {
      this.rooms[room.id].status = RoomStatus.DONE;
    }
    if (room.players.length === 0) {
      delete this.rooms[room.id];
    }
  }

  getClientRooms(client: Socket): Room[] {
    return Object.values(this.rooms).filter((room: Room) => this.isPlayerInRoom(room, client));
  }

  playerUpdate({ roomId, socketId, wordIndex }: PlayerUpdate): Room {
    if (!this.rooms[roomId]) {
      throw new ConflictException(`Room ${roomId} does not exist`);
    }

    const player = this.rooms[roomId].players.find(
      (currPlayer: Player) => currPlayer.socketId === socketId
    );

    player.wordIndex = wordIndex;
    player.wpm = this.calcWPM(
      wordIndex,
      this.rooms[roomId].text.quote,
      this.rooms[roomId].startTime
    );

    if (this.didPlayerFinish(player, roomId)) {
      this.rooms[roomId].playersDone++;
      player.rank = this.rooms[roomId].playersDone;
    }

    if (this.didAllPlayerFinish(roomId)) {
      this.rooms[roomId].status = RoomStatus.DONE;
    }

    return this.rooms[roomId];
  }

  private didAllPlayerFinish(roomId: string) {
    return this.rooms[roomId].playersDone === this.rooms[roomId].players.length;
  }

  private didPlayerFinish(player: Player, roomId: string) {
    return player.wordIndex === this.rooms[roomId].text.quote.split(' ').length;
  }

  private calcWPM(wordIndex: number, quote: string, startTime: Date): number {
    const typedCharacters = quote.split(' ', wordIndex).join(' ').length + 1;
    const timePassed = new Date().getTime() - startTime.getTime();
    const timeMultiplier = 1000 * 60;
    const wordsDivider = 5;

    return Math.floor(typedCharacters / wordsDivider / (timePassed / timeMultiplier));
  }

  private addPlayerToRoom(client: Socket, room: Room, nickName: string) {
    if (this.isPlayerInRoom(room, client)) {
      throw new ConflictException(
        `Client ${client.id} attempted to join room ${room.id} more than once`
      );
    }
    room.players.push({
      socketId: client.id,
      nickName,
      wordIndex: 0,
      wpm: 0,
      track: getRandomAirTrack()
    });
    room.countdown = countdownResolver(room.mode, room.players.length);
    client.join(room.id);
    this.rooms[room.id] = room;
  }

  private isPlayerInRoom(room: Room, { id }: Socket) {
    return room.players.some(({ socketId }: Player) => socketId === id);
  }

  private getRoom(mode: RoomModes): Room {
    return {
      [RoomModes.PUBLIC]: this.getExistingRoom() || this.getNewRoom(RoomModes.PUBLIC),
      [RoomModes.PRACTICE]: this.getNewRoom(RoomModes.PRACTICE)
    }[mode];
  }

  private getExistingRoom(): Room | undefined {
    return Object.values(this.rooms).find(
      (room: Room) =>
        room.players.length < this.roomMaxCapacity &&
        room.status === RoomStatus.QUEUED &&
        room.mode === RoomModes.PUBLIC
    );
  }

  private getNewRoom(mode: RoomModes): Room {
    const room: Room = {
      id: uuid(),
      status: RoomStatus.QUEUED,
      players: [],
      playersDone: 0,
      text: this.quotesService.getRandomQuote(),
      countdown: countdownResolver(mode, 1),
      mode
    };

    const interval = setInterval(() => {
      if (
        !this.rooms[room.id] ||
        this.rooms[room.id].status === RoomStatus.DONE ||
        room.countdown === 0
      ) {
        clearInterval(interval);
      }
      if (room.countdown > 0) {
        room.countdown--;
      }
      if (room.countdown === 0) {
        room.status = RoomStatus.ACTIVE;
        room.startTime = new Date();
      }
      if (room.countdown >= 0) {
        this.server.to(room.id).emit('room', room);
      }
    }, 1000);

    return room;
  }
}
