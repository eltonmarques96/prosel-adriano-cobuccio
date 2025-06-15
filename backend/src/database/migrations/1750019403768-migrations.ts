import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1750019403768 implements MigrationInterface {
  name = 'Migrations1750019403768';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "sender_wallet" character varying NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "receiver_wallet" character varying NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "receiver_wallet"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "sender_wallet"`,
    );
  }
}
