import { Quote } from '../../quotes/models/quotes.model';
import { sample } from 'lodash';

export interface Room {
  id: string;
  status: RoomStatus;
  players: Player[];
  playersDone: number;
  text: Quote;
  countdown: number;
  startTime?: Date;
  mode: RoomModes;
}

export enum RoomModes {
  PUBLIC = 'PUBLIC',
  PRACTICE = 'PRACTICE'
}

export enum RoomStatus {
  QUEUED = 'QUEUED',
  ACTIVE = 'ACTIVE',
  DONE = 'DONE'
}

export interface Player {
  socketId: string;
  nickName: string;
  wordIndex: number;
  wpm: number;
  track: string;
  rank?: number;
}

export interface PlayerUpdate {
  roomId: string;
  socketId: string;
  wordIndex: number;
}

const airTracks = [
  'adir',
  'atalef',
  'barak',
  'baz',
  'eitan',
  'karnaf',
  'nachshon',
  'raam',
  'reem',
  'saraf',
  'shimshon',
  'shoval',
  'sufa',
  'tzufit',
  'yanshuf',
  'yasur'
];

export const getRandomAirTrack = (): string => sample(airTracks);
