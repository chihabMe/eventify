import { Role } from 'generated/prisma';
import { Roles } from './roles.decorator';

export const isUser = () => Roles(Role.USER);
