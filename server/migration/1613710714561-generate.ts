import {MigrationInterface, QueryRunner} from "typeorm";

export class generate1613710714561 implements MigrationInterface {
    name = 'generate1613710714561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "faq_group" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_a77cdcc009ed34cee19bc0dce8f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "faq" ("id" SERIAL NOT NULL, "question" text NOT NULL DEFAULT '', "answer" text NOT NULL DEFAULT '', "keywords" text NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" date DEFAULT null, "groupId" integer, CONSTRAINT "PK_d6f5a52b1a96dd8d0591f9fbc47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "faq" ADD CONSTRAINT "FK_d7a5ae6b0f94c6ca4e1e910bfe4" FOREIGN KEY ("groupId") REFERENCES "faq_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "faq" DROP CONSTRAINT "FK_d7a5ae6b0f94c6ca4e1e910bfe4"`);
        await queryRunner.query(`DROP TABLE "faq"`);
        await queryRunner.query(`DROP TABLE "faq_group"`);
    }

}
