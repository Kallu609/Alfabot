import { RecurrenceRule } from 'node-schedule';
import { Message } from 'node-telegram-bot-api';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type IOnTextCallback = (
  msg: Message,
  args: string[],
  argCount: number
) => void;

export interface IScheduleItem {
  name: string;
  rules: IScheduleRule[];
}

type IScheduleRule = Partial<Omit<RecurrenceRule, 'nextInvocationDate'>>;
