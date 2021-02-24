import {MigrationInterface, QueryRunner} from "typeorm";

export class generate1613955465523 implements MigrationInterface {
    name = 'generate1613955465523'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "faq_group" ADD "order" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "faq" ADD "deleteDate" TIMESTAMP`);
        await queryRunner.query(`COMMENT ON COLUMN "faq"."updateDate" IS NULL`);
        await queryRunner.query(`ALTER TABLE "faq" ALTER COLUMN "updateDate" SET DEFAULT null`);
        await queryRunner.query(`CREATE INDEX "IDX_249ef0f71c0ee7f1a5c960a5eb" ON "faq_group" ("order") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_249ef0f71c0ee7f1a5c960a5eb"`);
        await queryRunner.query(`ALTER TABLE "faq" ALTER COLUMN "updateDate" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "faq"."updateDate" IS NULL`);
        await queryRunner.query(`ALTER TABLE "faq" DROP COLUMN "deleteDate"`);
        await queryRunner.query(`ALTER TABLE "faq_group" DROP COLUMN "order"`);
    }

}
