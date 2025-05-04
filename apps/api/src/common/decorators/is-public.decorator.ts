import { SetMetadata } from '@nestjs/common';

export const isPublicKey = 'isPublic';

export const isPublic = () => SetMetadata(isPublicKey, true);
