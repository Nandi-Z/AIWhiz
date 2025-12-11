export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatConfig {
  systemInstruction?: string;
}

export interface Theme {
  primaryColor: string;
  backgroundColor: string;
  botBubbleColor: string;
  userBubbleColor: string;
}