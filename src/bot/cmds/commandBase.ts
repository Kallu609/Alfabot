import { EditMessageTextOptions, Message, SendMessageOptions } from 'node-telegram-bot-api';
import { logger } from 'shared/logger';
import { IOnTextCallback } from 'shared/types';
import Bot from 'shared/types/bot';
import { helpSingle } from './help';

class CommandBase {
  name: string;
  helpText?: string;
  helpArgs?: string;
  visible: boolean = true;

  constructor(public bot: Bot) { }

  onText(regexp: RegExp, callback: IOnTextCallback) {
    this.bot.onText(regexp, msg => {
      const text = msg.text || '';
      const args = text.split(' ').slice(1);

      this.logMessage(msg);

      callback(msg, args, args.length);
    });
  }

  async showHelp(msg: Message): Promise<void> {
    const helpText = helpSingle(this.name);

    await this.bot.sendMessage(msg.chat.id, helpText, {
      parse_mode: 'Markdown',
    });
  }

  async reply(msg: Message, text: string, options?: SendMessageOptions): Promise<Message> {
    const message = await this.bot.sendMessage(msg.chat.id, text, {
      parse_mode: 'Markdown',
      ...options,
    });

    return message;
  }

  async editReply(msg: Message, text: string, options?: EditMessageTextOptions): Promise<Message> {
    const editedMsg = await this.bot.editMessageText(text, {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
      parse_mode: 'Markdown',
      ...options,
    });

    return editedMsg as Message;
  }

  private logMessage(msg: Message): void {
    if (!msg.from) {
      return;
    }

    const firstName = msg.from.first_name || '';
    const lastName = msg.from.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    const msgBody = msg.text ? msg.text.replace('\n', '\\n') : '';

    logger.bot(`/${this.name} command triggered\n` +
      `Chat: ${msg.chat.id}\n` +
      `From: ${fullName}\n` +
      `Body: ${msgBody}`);
  }
}

export default CommandBase;
