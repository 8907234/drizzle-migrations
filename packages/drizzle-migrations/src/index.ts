import { defineConfig as defineConfigOg, type Config } from 'drizzle-kit'
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import type { MySql2Database, MySqlDatabase } from 'drizzle-orm/mysql2'
import type { PgDatabase } from 'drizzle-orm/pg-core'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core'
export * from './seed/_base.seeder'
export * from './seed/seed-runner'

export type ConfigDialect = Config['dialect']
export type DrizzleMigrationsConfig = Config & {
  /**
   * Configuration for seeders
   */
  seed?: {
    /**
     * Path to the directory containing seeders
     */
    dirPath: string
    /**
     * Seeder to run by default if no seeder name is specified
     * @default 'db-seeder'
     */
    defaultSeeder?: string
  }
} & (
    | {
        dialect: 'postgresql'
        getMigrator: () => Promise<PostgresJsDatabase | PgDatabase<any, any, any>>
      }
    | {
        dialect: 'sqlite'
        getMigrator: () => Promise<BetterSQLite3Database | BaseSQLiteDatabase<any, any, any>>
      }
    | {
        dialect: 'mysql'
        getMigrator: () => Promise<MySql2Database | MySqlDatabase<any, any, any>>
      }
  )

/**
 * @deprecated Use `defineConfig` instead
 */
export function defineConfigWithMigrator(config: DrizzleMigrationsConfig) {
  return defineConfigOg(config)
}

export function defineConfig(config: DrizzleMigrationsConfig) {
  return defineConfigOg(config)
}

export type DBClient<TDialect extends ConfigDialect> = TDialect extends 'sqlite'
  ? BetterSQLite3Database | BaseSQLiteDatabase<any, any, any>
  : TDialect extends 'mysql'
    ? MySql2Database | MySqlDatabase<any, any, any>
    : TDialect extends 'postgresql'
      ? PostgresJsDatabase | PgDatabase<any, any, any>
      : never

export type MigrationArgs<TDialect extends ConfigDialect> = {
  db: DBClient<TDialect>
}

export type Migration<TDialect extends ConfigDialect> = {
  up: (args: MigrationArgs<TDialect>) => Promise<void>
  down: (args: MigrationArgs<TDialect>) => Promise<void>
}
