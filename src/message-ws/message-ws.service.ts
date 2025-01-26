import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
    [id: string]:Socket
}

@Injectable()
export class MessageWsService {
    private connectedClients:ConnectedClients = {}
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}
    async registerClient(client:Socket, userId: string){
        const user = await this.userRepository.findOneBy({ id: userId })
        if()
        
        this.connectedClients[client.id] = client;
    }
    removeClient(clientId:string){
        delete this.connectedClients[clientId];
    }

    getConnectedClients():string[]{
        return Object.keys(this.connectedClients);
    }
}
