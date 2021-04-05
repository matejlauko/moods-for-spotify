import packageConfig from '../package.json';

export const IS_PROD: boolean = process.env.NODE_ENV === 'production';
export const PORT = process.argv[2];

export const BASE_URL = IS_PROD ? `app://.` : `http://localhost:${PORT}`;
export const APP_PROTOCOL = packageConfig.build.protocols.schemes[0];
