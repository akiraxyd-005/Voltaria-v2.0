import type { WASocket, WAMessage, proto } from '@whiskeysockets/baileys';

export interface CommandContext {
  client: WASocket;
  msg: proto.IWebMessageInfo;
  args: string[];
  fullArgs: string;
  command: string;
  prefix: string;
  sender: string;
  jid: string;
  isGroup: boolean;
  isOwner: boolean;
  isAdmin?: boolean;
}

export interface CommandModule {
  aliases: string[];
  description: string;
  category: 'economy' | 'gambling' | 'games' | 'moderation' | 'fun' | 'tools' | 'info' | 'owner';
  usage?: string;
  example?: string;
  minArgs?: number;
  maxArgs?: number;
  groupOnly?: boolean;
  adminOnly?: boolean;
  ownerOnly?: boolean;
  cooldown?: number;
  callback: (ctx: CommandContext) => Promise<void>;
}

export interface UserData {
  jid: string;
  name: string;
  wallet: number;
  bank: number;
  level: number;
  xp: number;
}

export interface GroupData {
  jid: string;
  name: string;
  welcomeEnabled: boolean;
  antiLink: boolean;
  antiSpam: boolean;
}