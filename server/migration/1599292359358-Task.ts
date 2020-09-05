import {MigrationInterface, QueryRunner} from "typeorm";

export class Task1599292359358 implements MigrationInterface {
    name = 'Task1599292359358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `link` DROP FOREIGN KEY `FK_f7c90bb268a4133f691caaa0c6b`");
        await queryRunner.query("ALTER TABLE `link` CHANGE `linkListListId` `linkListListId` int NOT NULL");
        await queryRunner.query("ALTER TABLE `link` ADD CONSTRAINT `FK_f7c90bb268a4133f691caaa0c6b` FOREIGN KEY (`linkListListId`) REFERENCES `link_list`(`listId`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `link` DROP FOREIGN KEY `FK_f7c90bb268a4133f691caaa0c6b`");
        await queryRunner.query("ALTER TABLE `link` CHANGE `linkListListId` `linkListListId` int NULL");
        await queryRunner.query("ALTER TABLE `link` ADD CONSTRAINT `FK_f7c90bb268a4133f691caaa0c6b` FOREIGN KEY (`linkListListId`) REFERENCES `link_list`(`listId`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
