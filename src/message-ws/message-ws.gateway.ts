import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({cors: true})
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wsServer: Server;

  constructor(private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService
  ) {}
  
  async handleConnection(client: Socket) {

    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try{
      payload=this.jwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);
    }catch(error){
      client.disconnect();
      throw new WsException('Invalid credentials')
    }

    // console.log({payload});
    // console.log('Cliente conectado', client.id);
    

    this.wsServer.emit('clients-updated',this.messageWsService.getConnectedClients());
  }
  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado', client.id);
    this.messageWsService.removeClient(client.id);
    this.wsServer.emit('clients-updated',this.messageWsService.getConnectedClients());
  }
  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client:Socket, payload: NewMessageDto){
    // client.emit('message-from-server', {
    //   fullName: 'soy yo',
    //   message:payload.message || 'no-message'
    // })

    //  client.broadcast.emit('message-from-server', {
    //    fullName: 'soy yo',
    //    message:payload.message || 'no-message'
    //  })

    this.wsServer.emit('message-from-server', {
      fullName: this.messageWsService.getUserFullName(client.id),
      message:payload.message || 'no-message'
    })
  }


}
