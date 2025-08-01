import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCommentPostCascadeDelete1752220000001
  implements MigrationInterface
{
  name = 'UpdateCommentPostCascadeDelete1752220000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Comment 테이블의 postId 외래키 제약조건을 CASCADE DELETE로 변경
    await queryRunner.query(`
      ALTER TABLE "comment" 
      DROP CONSTRAINT "FK_94a85bb16d24033a2afdd5df060"
    `);

    await queryRunner.query(`
      ALTER TABLE "comment" 
      ADD CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" 
      FOREIGN KEY ("postId") REFERENCES "post"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Comment 테이블의 외래키 제약조건을 원래대로 되돌림
    await queryRunner.query(`
      ALTER TABLE "comment" 
      DROP CONSTRAINT "FK_94a85bb16d24033a2afdd5df060"
    `);

    await queryRunner.query(`
      ALTER TABLE "comment" 
      ADD CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" 
      FOREIGN KEY ("postId") REFERENCES "post"("id") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }
}
