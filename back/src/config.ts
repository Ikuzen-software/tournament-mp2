import { config } from 'dotenv';
import * as path from 'path';

config({
    path: path.resolve('../.env'),
});

function env(name: string): string {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`Environment variable "${name}" must be defined`);
    }

    return value;
}

export let uri: string;
uri = env('PG_URI')
export const allowedOrigins = ['http://localhost:3000', 'http://localhost:4200'];
