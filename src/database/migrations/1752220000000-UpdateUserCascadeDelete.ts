import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserCascadeDelete1752220000000
  implements MigrationInterface
{
  name = 'UpdateUserCascadeDelete1752220000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Post 테이블의 userId 외래키 제약조건을 CASCADE DELETE로 변경
    await queryRunner.query(`
      ALTER TABLE "post" 
      DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"
    `);

    await queryRunner.query(`
      ALTER TABLE "post" 
      ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // 2. Comment 테이블의 userId 외래키 제약조건을 CASCADE DELETE로 변경
    await queryRunner.query(`
      ALTER TABLE "comment" 
      DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"
    `);

    await queryRunner.query(`
      ALTER TABLE "comment" 
      ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Post 테이블의 외래키 제약조건을 원래대로 되돌림
    await queryRunner.query(`
      ALTER TABLE "post" 
      DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"
    `);

    await queryRunner.query(`
      ALTER TABLE "post" 
      ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // 2. Comment 테이블의 외래키 제약조건을 원래대로 되돌림
    await queryRunner.query(`
      ALTER TABLE "comment" 
      DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"
    `);

    await queryRunner.query(`
      ALTER TABLE "comment" 
      ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }
}
