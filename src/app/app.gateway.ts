import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from 'src/app.service';

import { Prisma } from '@prisma/client';
import { CLIENT_URL } from 'src/constants';

@WebSocketGateway({
  cors: {
    origin: CLIENT_URL,
  },
  serveClient: false,
  namespace: 'chat',
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly appService: AppService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('messages:get')
  async handleMessagesGet(): Promise<void> {
    const messages = await this.appService.getMessages();
    this.server.emit('messages', messages);
  }

  @SubscribeMessage('message:post')
  async handleMessagePost(
    @MessageBody()
    payload: // { userId: string, userName: string, text: string }
    Prisma.ChatCreateInput,
  ): Promise<void> {
    const createdMessage = await this.appService.createMessage(payload);
    this.server.emit('message:post', createdMessage);
    this.handleMessagesGet();
  }

  afterInit(server: Server) {
    console.log(server);
  }

  handleConnection(client: Socket) {
    console.log(`Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }
}
