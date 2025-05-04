import { Role } from 'generated/prisma';
import { Roles } from './roles.decorator';

export const isAdmin = () => Roles(Role.ADMIN);
