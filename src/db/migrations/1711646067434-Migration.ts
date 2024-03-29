import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1711646067434 implements MigrationInterface {
    name = 'Migration1711646067434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`files\` (\`id\` varchar(36) NOT NULL, \`path\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`firstname\` varchar(255) NOT NULL, \`lastname\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`birthdate\` date NULL, \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user', \`loggin_provider\` enum ('local', 'google', 'facebook', 'github') NOT NULL DEFAULT 'local', \`profile_image\` varchar(36) NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`REL_b942413feef0a5cd9af7c4841d\` (\`profile_image\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`blog_comments\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`comment\` varchar(500) NOT NULL, \`blog_id\` varchar(36) NULL, \`user_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`blog_like\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`blog_id\` varchar(36) NULL, \`user_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`blogs\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(125) NOT NULL, \`description\` varchar(300) NULL, \`article\` text NOT NULL, \`is_public\` tinyint NOT NULL DEFAULT 1, \`thumbnail\` varchar(36) NULL, UNIQUE INDEX \`REL_c99937229ad5271e10f79ec398\` (\`thumbnail\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`projects\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`article\` text NOT NULL, \`resource\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_b942413feef0a5cd9af7c4841dd\` FOREIGN KEY (\`profile_image\`) REFERENCES \`files\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`blog_comments\` ADD CONSTRAINT \`FK_044ee27753221b2b8860f8926c7\` FOREIGN KEY (\`blog_id\`) REFERENCES \`blogs\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`blog_comments\` ADD CONSTRAINT \`FK_c34a2a0bf1dcc3687871de1ff1e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`blog_like\` ADD CONSTRAINT \`FK_c31c3cca5125d59ef2503ce5b73\` FOREIGN KEY (\`blog_id\`) REFERENCES \`blogs\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`blog_like\` ADD CONSTRAINT \`FK_431dc13abde8665553741971bc4\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`blogs\` ADD CONSTRAINT \`FK_c99937229ad5271e10f79ec3985\` FOREIGN KEY (\`thumbnail\`) REFERENCES \`files\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`blogs\` DROP FOREIGN KEY \`FK_c99937229ad5271e10f79ec3985\``);
        await queryRunner.query(`ALTER TABLE \`blog_like\` DROP FOREIGN KEY \`FK_431dc13abde8665553741971bc4\``);
        await queryRunner.query(`ALTER TABLE \`blog_like\` DROP FOREIGN KEY \`FK_c31c3cca5125d59ef2503ce5b73\``);
        await queryRunner.query(`ALTER TABLE \`blog_comments\` DROP FOREIGN KEY \`FK_c34a2a0bf1dcc3687871de1ff1e\``);
        await queryRunner.query(`ALTER TABLE \`blog_comments\` DROP FOREIGN KEY \`FK_044ee27753221b2b8860f8926c7\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_b942413feef0a5cd9af7c4841dd\``);
        await queryRunner.query(`DROP TABLE \`projects\``);
        await queryRunner.query(`DROP INDEX \`REL_c99937229ad5271e10f79ec398\` ON \`blogs\``);
        await queryRunner.query(`DROP TABLE \`blogs\``);
        await queryRunner.query(`DROP TABLE \`blog_like\``);
        await queryRunner.query(`DROP TABLE \`blog_comments\``);
        await queryRunner.query(`DROP INDEX \`REL_b942413feef0a5cd9af7c4841d\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`files\``);
    }

}
