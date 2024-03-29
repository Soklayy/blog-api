import { MigrationInterface, QueryRunner } from "typeorm";
import { config } from '@nestjs/config/node_modules/dotenv'
import { ConfigService } from "@nestjs/config";
import { genSaltSync, hashSync } from "bcrypt";

config()
export class Admin1711646992564 implements MigrationInterface {
    private configService = new ConfigService()

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO users (id,firstname,lastname,email,role,password) VALUES ('1c2c52ad-a773-4739-b163-5460c77cd087','soklay','yorn','${this.configService.get<string>('ADMIN_EMAIL')}','admin','${hashSync(this.configService.get<string>('PASSWORD') || '12345678', genSaltSync(10))}')`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`DELETE FROM users WHERE email = ''`)
    }

}
