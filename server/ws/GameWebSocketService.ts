import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import prisma from '../prisma/prismaClient.ts'
import { GameStatus, GameType } from '../services/gameService.ts'

const ActionType = {
  JOIN_GAME: 'JOIN_GAME',
  MOVE_FIGURE: 'MOVE_FIGURE',
} as const

type EnumValues<
  T extends Record<string, string | number> | ReadonlyArray<string | number>
> = T extends ReadonlyArray<string | number> ? T[number] : T[keyof T]

export type TGameType = EnumValues<typeof GameType>
type TGameStatus = EnumValues<typeof GameStatus>

interface ICheckersUserData {
  color: IFigure['color']
}

interface IGame {
  id: string
  type: TGameType
  status: TGameStatus
  userData: ICheckersUserData
}

interface IFigure {
  id: number
  x: number
  y: number
  color: 'white' | 'black'
  isStain: boolean
  cellId: ICell['id']
}

interface ICell {
  id: number
  x: number
  y: number
  color: 'white' | 'black'
  figureId?: IFigure['id']
}

interface IJoinGameData {
  username: string
  game: Omit<IGame, 'status'>
}

interface IMoveFigure {
  startCell: ICell
  finishCell: ICell
  gameId: IGame['id']
}

interface WebsocketDataConstructor<
  T = string,
  D = Record<string, unknown>
> {
  type: T
  data: D
}

type JoinGameRequestWebsocket = WebsocketDataConstructor<
  typeof ActionType.JOIN_GAME,
  IJoinGameData
>
type MoveFigureRequestWebsocket = WebsocketDataConstructor<
  typeof ActionType.MOVE_FIGURE,
  IMoveFigure
>

class GameWebSocketService {
  private wss: WebSocketServer;
  
  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.initializeHandlers();
  }
  
  private initializeHandlers(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket connection');
      
      ws.on('message', async (data: string) => {
        try {
          const message = JSON.parse(data) as JoinGameRequestWebsocket;
          await this.handleMessage(ws, message)
        } catch (error) {
          console.error('Failed to parse message:', error);
          ws.send(JSON.stringify({ type: 'ERROR', error: 'Invalid message' }));
        }
      });
      
      ws.on('close', () => {
        console.log('WebSocket disconnected');
        // this.handleDisconnect(ws);
      });
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }
  
  private async handleMessage(ws: WebSocket, message: JoinGameRequestWebsocket | MoveFigureRequestWebsocket): Promise<void> {
    switch (message.type) {
      case ActionType.JOIN_GAME:
        await this.joinGame(ws, message.data);
        break;
      case ActionType.MOVE_FIGURE:
        await this.handleMove(ws, message.data);
        break;
      default:
        ws.send(JSON.stringify({ type: 'ERROR', error: 'Unknown message type' }));
    }
  }
  
  private async joinGame(ws: WebSocket, message: IJoinGameData): Promise<void> {
    const { game, username } = message;
    const { id: gameId } = game;
    
    const joinUserInGame = (client: WebSocket, params: Pick<IGame, 'status'> & Partial<Omit<IGame, 'status'>>) => {
      const data: IGame = {  ...game, ...params }
      client.send(JSON.stringify({ type: ActionType.JOIN_GAME, data }));
    }
    
    const gameInDB = await prisma.game.findUnique({ where: { id: gameId } })

    if (!gameInDB) {
      ws.send(JSON.stringify({ type: 'ERROR', error: 'Game not found' }));
      return;
    }
    
    const user = await prisma.user.findUnique({ where: { login: username } })
    
    if (!user) {
      ws.send(JSON.stringify({ type: 'ERROR', error: 'User not found', }));
      return;
    }
    
    const currentUser = await prisma.gameParticipant.findUnique({
      where: { gameId_playerId: { gameId, playerId: user.id }  }
    })
    
    if (gameInDB.status === GameStatus.PENDING) {
      // Пользователь найден в базе - играет белыми
      if (currentUser) {
        const userWithColor = await prisma.gameWithColorParticipant.findUnique({ where: { participantId: currentUser.id } })
        
        if (!userWithColor) {
          ws.send(JSON.stringify({ type: 'ERROR', error: 'User not found', }));
          return;
        }
        
        joinUserInGame(ws, {
          status: GameStatus.PENDING,
          userData: {
            color: userWithColor.color as ICheckersUserData['color']
          }
        });
      // Пользователь не найден в базе - играет черными
      } else {
        const color = 'black';
        await prisma.gameParticipant.create({
          data: {
            gameId,
            playerId: user.id,
            colorParticipant: {
              create: {
                color,
              }
            }
          }
        })
        joinUserInGame(ws, {
          status: GameStatus.PENDING,
          userData: { color }
        });
        const otherPlayer = await prisma.gameParticipant.findMany({ where: { gameId } })
        await prisma.game.update({ where: { id: gameId }, data: { status: GameStatus.PLAYING } })
        
        this.wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            joinUserInGame(client, { status: GameStatus.PLAYING });
          }
        })
        // otherPlayer.forEach(player => {
        //   if (player.playerId !== user.id) {
        //     if (ws.client !== excludeWs && ws.readyState === WebSocket.OPEN) {
        //       client.send(JSON.stringify(message));
        //     }
        //   }
        // })
      }
    }
    
    if (gameInDB.status === GameStatus.PLAYING) {
      if (currentUser) {
        const userWithColor = await prisma.gameWithColorParticipant.findUnique({ where: { participantId: currentUser.id } })
        
        if (!userWithColor) {
          ws.send(JSON.stringify({ type: 'ERROR', error: 'User not found', }));
          return;
        }
        
        joinUserInGame(ws, {
          status: GameStatus.PLAYING,
          userData: { color: userWithColor.color as ICheckersUserData['color'] }
        });
      }
    }
  }
  
  private async handleMove(ws: WebSocket, message: IMoveFigure): Promise<void> {
    const { gameId, startCell, finishCell } = message;
    const gameInDB = await prisma.game.findUnique({ where: { id: gameId } })

    if (!gameInDB) {
      ws.send(JSON.stringify({ type: 'ERROR', error: 'Game not found' }));
      return;
    }
    
    const currentCheckersGame = await prisma.checkersGame.findUnique({ where: { gameId: gameInDB.id } })
    
    if (!currentCheckersGame) {
      ws.send(JSON.stringify({ type: 'ERROR', error: 'Game not found' }));
      return;
    }
    
    const updatedCheckersGame = await prisma.checkersGame.update({
      where: { id: currentCheckersGame.id },
      data: { currentTurn: currentCheckersGame.currentTurn === 'white' ? 'black' : 'white' }
    })
    const data = { startCell, finishCell, currentTurn: updatedCheckersGame.currentTurn }
    const moveData = { type: ActionType.MOVE_FIGURE, data }

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(moveData));
      }
    })
  }
  
  // private async broadcastToRoom(gameId: string, message: any, excludeWs?: WebSocket): void {
  //   const room = await prisma.gameParticipant.findMany({
  //     where: { gameId },
  //   })
  //   if (!room) return;
  //
  //   room.forEach((client) => {
  //     if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
  //       client.send(JSON.stringify(message));
  //     }
  //   });
  // }
  //
  // private handleDisconnect(ws: WebSocket): void {
  //   // Удаляем клиента из всех комнат
  //   this.gameRooms.forEach((room, gameId) => {
  //     if (room.has(ws)) {
  //       room.delete(ws);
  //
  //       // Если комната пуста, удаляем её
  //       if (room.size === 0) {
  //         this.gameRooms.delete(gameId);
  //       } else {
  //         // Уведомляем остальных
  //         this.broadcastToRoom(gameId, {
  //           type: 'PLAYER_LEFT',
  //           gameId,
  //         });
  //       }
  //     }
  //   });
  // }
  
  broadcast(message: any): void {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
  
  // sendToGame(gameId: string, message: any): void {
  //   this.broadcastToRoom(gameId, message);
  // }
  //
  // getGameClients(gameId: string): number {
  //   return this.gameRooms.get(gameId)?.size || 0;
  // }
}

export default GameWebSocketService;
