import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitialSchema1776968425507 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'search_history',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'city', type: 'varchar', isNullable: false },
          { name: 'country', type: 'varchar', isNullable: false },
          {
            name: 'temperature',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: false,
          },
          { name: 'description', type: 'varchar', isNullable: false },
          {
            name: 'humidity',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'windSpeed',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'searchedAt',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
      }),
      true, // ifNotExists — seguro de rodar mesmo com a tabela já existente
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('search_history');
  }
}