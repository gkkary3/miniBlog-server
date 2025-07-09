import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddThumbnailToPost1750055000000 implements MigrationInterface {
  name = 'AddThumbnailToPost1750055000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" ADD "thumbnail" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "thumbnail"`);
  }
}
