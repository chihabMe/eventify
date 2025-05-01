import { Roles } from './roles.decorator';

export const isAdmin = () => Roles('ADMIN');
