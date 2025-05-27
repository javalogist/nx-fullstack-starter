import { SetMetadata } from '@nestjs/common';

export const CUSTOM_REDIRECT = 'custom-redirect';

export const CustomRedirect = () => SetMetadata(CUSTOM_REDIRECT, true);
