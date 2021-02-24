import {MigrationInterface, QueryRunner} from "typeorm";

export class generate1613962301823 implements MigrationInterface {
    name = 'generate1613962301823'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "faq_group"."description" IS NULL`);
        await queryRunner.query(`ALTER TABLE "faq_group" ALTER COLUMN "description" SET DEFAULT ''`);
        await queryRunner.query(`COMMENT ON COLUMN "faq"."updateDate" IS NULL`);
        await queryRunner.query(`ALTER TABLE "faq" ALTER COLUMN "updateDate" SET DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "faq" ALTER COLUMN "updateDate" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "faq"."updateDate" IS NULL`);
        await queryRunner.query(`ALTER TABLE "faq_group" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "faq_group"."description" IS NULL`);
    }

}
