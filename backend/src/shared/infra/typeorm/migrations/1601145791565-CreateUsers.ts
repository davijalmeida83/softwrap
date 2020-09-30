
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsers1601145791565 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.createTable(
        new Table(
          new Table({
            name: 'users',
            columns: [
              {
                name: 'id',
                type: 'uuid',
                isPrimary: true,
                generationStrategy: 'uuid',
                default: 'uuid_generate_v4()',
              },
              {
                name: 'id_owner',
                type: 'varchar',
                isNullable: false,
              },
              {
                name: 'name',
                type: 'varchar',
                isNullable: false,
              },
              {
              name: 'age',
              type: 'varchar',
              isNullable: false,
              },
              {
                name: 'maritalstatus',
                type: 'varchar',
                isNullable: false,
              },
              {
                name: 'cpf',
                type: 'varchar',
                isNullable: false,
              },
              {
                name: 'city',
                type: 'varchar',
                isNullable: false,
              },
              {
                name: 'state',
                type: 'varchar',
                isNullable: false,
              },
              {
                name: 'email',
                type: 'varchar',
                isUnique: true,
              },
              {
                name: 'password',
                type: 'varchar',
                isUnique: true,
              },
              {
                name: 'avatar',
                type: 'varchar',
                isNullable: true,
              },
              {
                name: 'created_at',
                type: 'timestamp',
                default: 'now()',
              },
              {
                name: 'updated_at',
                type: 'timestamp',
                default: 'now()',
              },
            ],
          })
        )
      );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropTable('users');
    }

}
