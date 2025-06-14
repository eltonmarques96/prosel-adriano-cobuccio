import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1749885417573 implements MigrationInterface {
  name = 'Migrations1749885417573';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL DEFAULT '0', "status" character varying NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "sender_wallet_id" uuid, "receiver_wallet_id" uuid, "wallet_id" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_f899c6238f87a9059b5c5d1ffcc" FOREIGN KEY ("sender_wallet_id") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_160d626ade6f7dee4e88650e372" FOREIGN KEY ("receiver_wallet_id") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_08081d10759ec250c557cebd81a" FOREIGN KEY ("wallet_id") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_08081d10759ec250c557cebd81a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_160d626ade6f7dee4e88650e372"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_f899c6238f87a9059b5c5d1ffcc"`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "createdAt"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
