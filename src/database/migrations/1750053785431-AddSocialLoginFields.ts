import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSocialLoginFields1750053785431 implements MigrationInterface {
  name = 'AddSocialLoginFields1750053785431';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "provider" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "providerId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "profileImage" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileImage"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "providerId"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "provider"`);
  }
}
