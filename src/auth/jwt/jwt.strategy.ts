import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from '../user.entity';
import { UserRepository } from '../user.repository';
import { JwtPlayload } from './jwt-playload.interface';
import * as config from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
    });
  }

  async validate(playload: JwtPlayload): Promise<User> {
    const { username } = playload;
    const user = await this.userRepository.findOne({ username });

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
