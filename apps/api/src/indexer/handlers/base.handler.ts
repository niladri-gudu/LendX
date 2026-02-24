import { RoutedLog } from '../router/event.types';

export interface EventHandler {
  handle(log: RoutedLog): Promise<void>;
}
