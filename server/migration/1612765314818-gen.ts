import {MigrationInterface, QueryRunner} from "typeorm";

export class gen1612765314818 implements MigrationInterface {
    name = 'gen1612765314818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "link_list" ("listId" SERIAL NOT NULL, "listOrder" integer NOT NULL, "listTitle" character varying(100) NOT NULL, CONSTRAINT "PK_adf08cc4fd36623df2d8eba0e96" PRIMARY KEY ("listId"))`);
        await queryRunner.query(`CREATE TABLE "link" ("linkId" SERIAL NOT NULL, "linkOrder" integer NOT NULL, "url" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "listId" integer NOT NULL, CONSTRAINT "PK_7b6029b623ae87018daf980a2df" PRIMARY KEY ("linkId"))`);
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "label" character varying(100) NOT NULL, "done" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_4ec3e5ecac5ece3fb28388ccb1b" FOREIGN KEY ("listId") REFERENCES "link_list"("listId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_4ec3e5ecac5ece3fb28388ccb1b"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "link"`);
        await queryRunner.query(`DROP TABLE "link_list"`);
    }

}
