import { Injectable } from '@nestjs/common';
import { Conquest } from './entities/conquest.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export const PRIMEIRO_TREINO = 1,
  PRIMEIRA_SEMANA = 2,
  CINCO_DIAS_SEGUIDOS = 3,
  ADICIONAR_AMIGO = 4,
  TREINAR_COM_AMIGO = 5,
  RECEBER_CURTIDA = 6;

const conquistas = [
  {
    id: PRIMEIRO_TREINO,
    name: 'Primeiro treino',
    description: 'Realize seu primeiro treino',
    image: '',
  },
  {
    id: PRIMEIRA_SEMANA,
    name: 'Primeira semana',
    description: 'Conquiste a primeira semana de treino',
    image: 'https://i.imgur.com/9c1j7pT.png',
  },
  {
    id: CINCO_DIAS_SEGUIDOS,
    name: 'Cinco dias seguidos',
    description: 'Treine cinco dias seguidos',
    image: 'https://i.imgur.com/9c1j7pT.png',
  },
  {
    id: ADICIONAR_AMIGO,
    name: 'Adicionar amigo',
    description: 'Adicione um amigo',
    image: 'https://i.imgur.com/9c1j7pT.png',
  },
  {
    id: TREINAR_COM_AMIGO,
    name: 'Treinar com amigo',
    description: 'Treine com um amigo',
    image: 'https://i.imgur.com/9c1j7pT.png',
  },
  {
    id: RECEBER_CURTIDA,
    name: 'Receber curtida',
    description: 'Receba uma curtida',
    image: 'https://i.imgur.com/9c1j7pT.png',
  },
] as Conquest[];

@Injectable()
export class ConquestService {
  constructor(
    @InjectRepository(Conquest)
    private repository: Repository<Conquest>,
  ) {
    this.createConquests();
  }

  async createConquests() {
    for (const conquest of conquistas) {
      const exists = await this.repository.findOne({
        where: { id: conquest.id },
      });
      if (!exists) {
        await this.repository.save(conquest);
      }
    }
  }

  async hasConquest(conquestId: number, userId: number) {
    const conquest = await this.repository.findOne({
      where: { id: conquestId },
      relations: ['users'],
    });
    return conquest.users.some((user) => user.id === userId);
  }

  async addConquest(conquestId: number, userId: number) {
    if (await this.hasConquest(conquestId, userId)) return;
    const conquest = await this.repository.findOne({
      where: { id: conquestId },
      relations: ['users'],
    });
    if (!conquest.users) conquest.users = [];
    conquest.users.push({ id: userId } as any);
    await this.repository.save(conquest);
  }
}
