import { Injectable } from '@nestjs/common';
import { Chat, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getMessages(): Promise<Chat[]> {
    return this.prisma.chat.findMany();
  }

  async createMessage(data: Prisma.ChatCreateInput) {
    return this.prisma.chat.create({ data });
  }
}
