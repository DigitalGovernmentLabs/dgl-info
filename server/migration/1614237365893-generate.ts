import {MigrationInterface, QueryRunner} from "typeorm";

export class generate1614237365893 implements MigrationInterface {
    name = 'generate1614237365893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "faq_group" ADD "lastListUpdateDate" TIMESTAMP NOT NULL DEFAULT NOW()`);
        await queryRunner.query(`COMMENT ON COLUMN "faq"."updateDate" IS NULL`);
        await queryRunner.query(`ALTER TABLE "faq" ALTER COLUMN "updateDate" SET DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "faq" ALTER COLUMN "updateDate" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "faq"."updateDate" IS NULL`);
        await queryRunner.query(`ALTER TABLE "faq_group" DROP COLUMN "lastListUpdateDate"`);
    }

}
