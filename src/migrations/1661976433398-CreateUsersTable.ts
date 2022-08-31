import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUsersTable1661976433398 implements MigrationInterface {
    name = 'CreateUsersTable1661976433398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "isEmailVerified" boolean NOT NULL DEFAULT false, "createdAt" date DEFAULT NOW(), "updatedAt" date DEFAULT NOW(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
