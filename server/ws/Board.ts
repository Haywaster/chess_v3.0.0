import { type WebSocket } from 'ws'

import prisma from '../prisma/prismaClient'

import { CommonWsMethods } from './Common'

import type { GameWithColorParticipant } from '@prisma/client'

export class BoardSocketServiceConstructor {
  protected async getUserWithColorByParticipantId(
    participantId: GameWithColorParticipant['participantId'],
    ws: WebSocket
  ): Promise<GameWithColorParticipant | null> {
    const color = await prisma.gameWithColorParticipant.findUnique({
      where: { participantId }
    })

    if (!color) {
      CommonWsMethods.sendError(ws, 'Participant color not found')
      return null
    }

    return color
  }
}
