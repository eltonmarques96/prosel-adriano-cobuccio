import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1750014164432 implements MigrationInterface {
  name = 'Migrations1750014164432';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "type" character varying NOT NULL DEFAULT 'transactional'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "type"`);
  }
}
