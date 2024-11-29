import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {

  constructor(@InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ){}
  async createUser(createUserDto: CreateUserDto) {
    
    try{
      const { password, ...userDate} = createUserDto;

      const user = this.userRepository.create({
        ...userDate,
        password: bcrypt.hashSync(password,10)
      });

      await this.userRepository.save(user);
      delete user.password;

      return {...user, 
        token: this.getJwtToken({id: user.id})
      };

    }catch(error){
      this.handleDBError(error);
    }

  }
  async createLogin(loginUserDto: LoginUserDto){
    try{
      const { password, email } = loginUserDto;
      const user = await this.userRepository.findOne({where:{email},
      select: {email:true, password:true, id:true}})
        

      if(!user)
        throw new UnauthorizedException('Credentials are not valid (email)');
     
      if(!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Credentials are not valid (email)');
      
      return {...user, token: this.getJwtToken({id: user.id})};
    
    
    }catch(error){
      this.handleDBError(error);
    }
  }

  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }
  private handleDBError(error: any) : never {
    if(error.code === '23505')
      throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
