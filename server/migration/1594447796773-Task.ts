import { MigrationInterface, QueryRunner } from 'typeorm'

export class Task1594447796773 implements MigrationInterface {
  name = 'Task1594447796773'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `link_list` (`listId` int NOT NULL AUTO_INCREMENT, `listOrder` int NOT NULL, `listTitle` varchar(100) NOT NULL, PRIMARY KEY (`listId`)) ENGINE=InnoDB'
    )
    await queryRunner.query(
      'CREATE TABLE `link` (`linkId` int NOT NULL AUTO_INCREMENT, `linkOrder` int NOT NULL, `url` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `linkListListId` int NULL, PRIMARY KEY (`linkId`)) ENGINE=InnoDB'
    )
    await queryRunner.query(
      'ALTER TABLE `link` ADD CONSTRAINT `FK_f7c90bb268a4133f691caaa0c6b` FOREIGN KEY (`linkListListId`) REFERENCES `link_list`(`listId`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `link` DROP FOREIGN KEY `FK_f7c90bb268a4133f691caaa0c6b`'
    )
    await queryRunner.query('DROP TABLE `link`')
    await queryRunner.query('DROP TABLE `link_list`')
  }
}
