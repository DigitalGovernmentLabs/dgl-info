import {MigrationInterface, QueryRunner} from "typeorm";

export class generate1613107370101 implements MigrationInterface {
    name = 'generate1613107370101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(128) NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "passwordHash" character varying(256) NOT NULL, CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
