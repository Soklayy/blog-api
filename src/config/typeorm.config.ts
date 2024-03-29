import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { config } from '@nestjs/config/node_modules/dotenv'

export async function typeOrmConfig(
  configService: ConfigService,
): Promise<TypeOrmModuleAsyncOptions> {
  const APP_ENV = configService.get<string>('APP_ENV');

  if (APP_ENV === 'dev') {
    return {
      type: configService.get<string>('DB_TYPE'),
      host: configService.get<string>('DB_HOST'),
      port: Number(configService.get('DB_PORT')),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      synchronize: false,
      migrationsRun: true,
      entities: [join(__dirname, '../**/**.entity{.js,.ts}')],
      migrations: [join(__dirname, '../db/migrations/**{.ts,.js}')],
      cli: {
        migrationsDir: 'db/migrations',
      },
    } as TypeOrmModuleAsyncOptions;
  } else if (APP_ENV === 'prod') {
    return {
      type: configService.get<string>('DB_TYPE'),
      url: configService.get<string>('DATABASE_URL'),
      entities: [__dirname + './../**/**.entity{.ts,.js}'],
      migrations: [join(__dirname, '../db/migrations/**{.ts,.js}')],
      synchronize: false,
      migrationsRun: true,
      ssl: true,
      retryAttempts: 20,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    } as TypeOrmModuleAsyncOptions;
  }
}

//for migration
config()
const configService = new ConfigService()
let dataSource: DataSource;
const databaseType: any = configService.get<string>('DB_TYPE');
const APP_ENV = configService.get<string>('APP_ENV');

if (APP_ENV === 'dev') {
  dataSource = new DataSource({
    type: databaseType,
    host: configService.get<string>('DB_HOST'),
    port: Number(configService.get('DB_PORT')),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    synchronize: false,
    migrations: [join(__dirname, '../db/migrations/**{.ts,.js}')],
    entities: [join(__dirname + './../**/**.entity{.ts,.js}')]
  })
} else if (APP_ENV === 'prod') {
  dataSource = new DataSource({
    type: databaseType,
    url: configService.get<string>('DATABASE_URL'),
    entities: [join(__dirname + './../**/**.entity{.ts,.js}')],
    migrations: [join(__dirname, '../db/migrations/**{.ts,.js}')],
    synchronize: false,
    migrationsRun: true,
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  })
}


export default dataSource