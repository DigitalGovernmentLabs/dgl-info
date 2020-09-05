import {MigrationInterface, QueryRunner} from "typeorm";

export class Task1599293592829 implements MigrationInterface {
    name = 'Task1599293592829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `link` DROP FOREIGN KEY `FK_f7c90bb268a4133f691caaa0c6b`");
        await queryRunner.query("ALTER TABLE `link` CHANGE `linkListListId` `listId` int NOT NULL");
        await queryRunner.query("ALTER TABLE `link` ADD CONSTRAINT `FK_4ec3e5ecac5ece3fb28388ccb1b` FOREIGN KEY (`listId`) REFERENCES `link_list`(`listId`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `link` DROP FOREIGN KEY `FK_4ec3e5ecac5ece3fb28388ccb1b`");
        await queryRunner.query("ALTER TABLE `link` CHANGE `listId` `linkListListId` int NOT NULL");
        await queryRunner.query("ALTER TABLE `link` ADD CONSTRAINT `FK_f7c90bb268a4133f691caaa0c6b` FOREIGN KEY (`linkListListId`) REFERENCES `link_list`(`listId`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
