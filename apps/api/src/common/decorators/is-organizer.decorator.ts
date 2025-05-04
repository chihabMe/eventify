import { Role } from 'generated/prisma';
import { Roles } from './roles.decorator';

export const isOrganizer = () => Roles(Role.ORGANIZER);
