import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsernameToPost1748539935617 implements MigrationInterface {
  name = 'AddUsernameToPost1748539935617';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. 먼저 nullable로 컬럼 추가
    await queryRunner.query(
      `ALTER TABLE "post" ADD "username" character varying(100)`,
    );

    // 2. 기존 데이터에 기본값 설정 (사용자 정보와 연결해서 업데이트)
    await queryRunner.query(`
            UPDATE "post" 
            SET "username" = "user"."username" 
            FROM "user" 
            WHERE "post"."userId" = "user"."id"
        `);

    // 3. 기본값이 없는 경우를 위한 fallback (혹시 orphan 데이터가 있을 경우)
    await queryRunner.query(
      `UPDATE "post" SET "username" = '알 수 없음' WHERE "username" IS NULL`,
    );

    // 4. NOT NULL 제약조건 추가
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "username" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "username"`);
  }
}
