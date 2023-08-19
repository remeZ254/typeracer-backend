import { RoomModes } from '../models/rooms.model';
import { getFromConfig, ServerConfig } from '../../config/utils/config.utils';

const countdownConfig: ServerConfig['countdown'] = getFromConfig('countdown');

export const countdownResolver = (mode: RoomModes, playersAmount: number) =>
  mode === RoomModes.PRACTICE ? countdownConfig.practice : countdownConfig[playersAmount];
