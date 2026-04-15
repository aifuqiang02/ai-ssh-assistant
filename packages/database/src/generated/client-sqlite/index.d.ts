
/**
 * Client
**/

import * as runtime from './runtime/library';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model UserSettings
 * 
 */
export type UserSettings = $Result.DefaultSelection<Prisma.$UserSettingsPayload>
/**
 * Model SSHFolder
 * 
 */
export type SSHFolder = $Result.DefaultSelection<Prisma.$SSHFolderPayload>
/**
 * Model SSHConnection
 * 
 */
export type SSHConnection = $Result.DefaultSelection<Prisma.$SSHConnectionPayload>
/**
 * Model CommandLog
 * 
 */
export type CommandLog = $Result.DefaultSelection<Prisma.$CommandLogPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.userSettings`: Exposes CRUD operations for the **UserSettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserSettings
    * const userSettings = await prisma.userSettings.findMany()
    * ```
    */
  get userSettings(): Prisma.UserSettingsDelegate<ExtArgs>;

  /**
   * `prisma.sSHFolder`: Exposes CRUD operations for the **SSHFolder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SSHFolders
    * const sSHFolders = await prisma.sSHFolder.findMany()
    * ```
    */
  get sSHFolder(): Prisma.SSHFolderDelegate<ExtArgs>;

  /**
   * `prisma.sSHConnection`: Exposes CRUD operations for the **SSHConnection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SSHConnections
    * const sSHConnections = await prisma.sSHConnection.findMany()
    * ```
    */
  get sSHConnection(): Prisma.SSHConnectionDelegate<ExtArgs>;

  /**
   * `prisma.commandLog`: Exposes CRUD operations for the **CommandLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CommandLogs
    * const commandLogs = await prisma.commandLog.findMany()
    * ```
    */
  get commandLog(): Prisma.CommandLogDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.7.0
   * Query Engine version: 79fb5193cf0a8fdbef536e4b4a159cad677ab1b9
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray | { toJSON(): unknown }

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    UserSettings: 'UserSettings',
    SSHFolder: 'SSHFolder',
    SSHConnection: 'SSHConnection',
    CommandLog: 'CommandLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'user' | 'userSettings' | 'sSHFolder' | 'sSHConnection' | 'commandLog'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>,
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>,
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      UserSettings: {
        payload: Prisma.$UserSettingsPayload<ExtArgs>
        fields: Prisma.UserSettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserSettingsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserSettingsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload>
          }
          findFirst: {
            args: Prisma.UserSettingsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserSettingsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload>
          }
          findMany: {
            args: Prisma.UserSettingsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload>[]
          }
          create: {
            args: Prisma.UserSettingsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload>
          }
          delete: {
            args: Prisma.UserSettingsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload>
          }
          update: {
            args: Prisma.UserSettingsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload>
          }
          deleteMany: {
            args: Prisma.UserSettingsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.UserSettingsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.UserSettingsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload>
          }
          aggregate: {
            args: Prisma.UserSettingsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUserSettings>
          }
          groupBy: {
            args: Prisma.UserSettingsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<UserSettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserSettingsCountArgs<ExtArgs>,
            result: $Utils.Optional<UserSettingsCountAggregateOutputType> | number
          }
        }
      }
      SSHFolder: {
        payload: Prisma.$SSHFolderPayload<ExtArgs>
        fields: Prisma.SSHFolderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SSHFolderFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SSHFolderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SSHFolderFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SSHFolderPayload>
          }
          findFirst: {
            args: Prisma.SSHFolderFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SSHFolderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SSHFolderFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SSHFolderPayload>
          }
          findMany: {
            args: Prisma.SSHFolderFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SSHFolderPayload>[]
          }
          create: {
            args: Prisma.SSHFolderCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SSHFolderPayload>
          }
          delete: {
            args: Prisma.SSHFolderDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SSHFolderPayload>
          }
          update: {
            args: Prisma.SSHFolderUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SSHFolderPayload>
          }
          deleteMany: {
            args: Prisma.SSHFolderDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.SSHFolderUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.SSHFolderUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SSHFolderPayload>
          }
          aggregate: {
            args: Prisma.SSHFolderAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateSSHFolder>
          }
          groupBy: {
            args: Prisma.SSHFolderGroupByArgs<ExtArgs>,
            result: $Utils.Optional<SSHFolderGroupByOutputType>[]
          }
          count: {
            args: Prisma.SSHFolderCountArgs<ExtArgs>,
            result: $Utils.Optional<SSHFolderCountAggregateOutputType> | number
          }
        }
      }
      SSHConnection: {
        payload: Prisma.$SSHConnectionPayload<ExtArgs>
        fields: Prisma.SSHConnectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SSHConnectionFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SSHConnectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SSHConnectionFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SSHConnectionPayload>
          }
          findFirst: {
            args: Prisma.SSHConnectionFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SSHConnectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SSHConnectionFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SSHConnectionPayload>
          }
          findMany: {
            args: Prisma.SSHConnectionFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SSHConnectionPayload>[]
          }
          create: {
            args: Prisma.SSHConnectionCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SSHConnectionPayload>
          }
          delete: {
            args: Prisma.SSHConnectionDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SSHConnectionPayload>
          }
          update: {
            args: Prisma.SSHConnectionUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SSHConnectionPayload>
          }
          deleteMany: {
            args: Prisma.SSHConnectionDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.SSHConnectionUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.SSHConnectionUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SSHConnectionPayload>
          }
          aggregate: {
            args: Prisma.SSHConnectionAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateSSHConnection>
          }
          groupBy: {
            args: Prisma.SSHConnectionGroupByArgs<ExtArgs>,
            result: $Utils.Optional<SSHConnectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SSHConnectionCountArgs<ExtArgs>,
            result: $Utils.Optional<SSHConnectionCountAggregateOutputType> | number
          }
        }
      }
      CommandLog: {
        payload: Prisma.$CommandLogPayload<ExtArgs>
        fields: Prisma.CommandLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommandLogFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommandLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommandLogFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommandLogPayload>
          }
          findFirst: {
            args: Prisma.CommandLogFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommandLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommandLogFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommandLogPayload>
          }
          findMany: {
            args: Prisma.CommandLogFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommandLogPayload>[]
          }
          create: {
            args: Prisma.CommandLogCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommandLogPayload>
          }
          delete: {
            args: Prisma.CommandLogDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommandLogPayload>
          }
          update: {
            args: Prisma.CommandLogUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommandLogPayload>
          }
          deleteMany: {
            args: Prisma.CommandLogDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.CommandLogUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.CommandLogUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommandLogPayload>
          }
          aggregate: {
            args: Prisma.CommandLogAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateCommandLog>
          }
          groupBy: {
            args: Prisma.CommandLogGroupByArgs<ExtArgs>,
            result: $Utils.Optional<CommandLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommandLogCountArgs<ExtArgs>,
            result: $Utils.Optional<CommandLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sshFolders: number
    sshConnections: number
    commandLogs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sshFolders?: boolean | UserCountOutputTypeCountSshFoldersArgs
    sshConnections?: boolean | UserCountOutputTypeCountSshConnectionsArgs
    commandLogs?: boolean | UserCountOutputTypeCountCommandLogsArgs
  }

  // Custom InputTypes

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSshFoldersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SSHFolderWhereInput
  }


  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSshConnectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SSHConnectionWhereInput
  }


  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCommandLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommandLogWhereInput
  }



  /**
   * Count Type SSHFolderCountOutputType
   */

  export type SSHFolderCountOutputType = {
    children: number
    connections: number
  }

  export type SSHFolderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    children?: boolean | SSHFolderCountOutputTypeCountChildrenArgs
    connections?: boolean | SSHFolderCountOutputTypeCountConnectionsArgs
  }

  // Custom InputTypes

  /**
   * SSHFolderCountOutputType without action
   */
  export type SSHFolderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHFolderCountOutputType
     */
    select?: SSHFolderCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * SSHFolderCountOutputType without action
   */
  export type SSHFolderCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SSHFolderWhereInput
  }


  /**
   * SSHFolderCountOutputType without action
   */
  export type SSHFolderCountOutputTypeCountConnectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SSHConnectionWhereInput
  }



  /**
   * Count Type SSHConnectionCountOutputType
   */

  export type SSHConnectionCountOutputType = {
    commandLogs: number
  }

  export type SSHConnectionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commandLogs?: boolean | SSHConnectionCountOutputTypeCountCommandLogsArgs
  }

  // Custom InputTypes

  /**
   * SSHConnectionCountOutputType without action
   */
  export type SSHConnectionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHConnectionCountOutputType
     */
    select?: SSHConnectionCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * SSHConnectionCountOutputType without action
   */
  export type SSHConnectionCountOutputTypeCountCommandLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommandLogWhereInput
  }



  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    uuid: string | null
    email: string | null
    username: string | null
    password: string | null
    avatar: string | null
    role: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    uuid: string | null
    email: string | null
    username: string | null
    password: string | null
    avatar: string | null
    role: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    uuid: number
    email: number
    username: number
    password: number
    avatar: number
    role: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    uuid?: true
    email?: true
    username?: true
    password?: true
    avatar?: true
    role?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    uuid?: true
    email?: true
    username?: true
    password?: true
    avatar?: true
    role?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    uuid?: true
    email?: true
    username?: true
    password?: true
    avatar?: true
    role?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    uuid: string
    email: string | null
    username: string | null
    password: string | null
    avatar: string | null
    role: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    email?: boolean
    username?: boolean
    password?: boolean
    avatar?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sshFolders?: boolean | User$sshFoldersArgs<ExtArgs>
    sshConnections?: boolean | User$sshConnectionsArgs<ExtArgs>
    commandLogs?: boolean | User$commandLogsArgs<ExtArgs>
    userSettings?: boolean | User$userSettingsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    uuid?: boolean
    email?: boolean
    username?: boolean
    password?: boolean
    avatar?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sshFolders?: boolean | User$sshFoldersArgs<ExtArgs>
    sshConnections?: boolean | User$sshConnectionsArgs<ExtArgs>
    commandLogs?: boolean | User$commandLogsArgs<ExtArgs>
    userSettings?: boolean | User$userSettingsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sshFolders: Prisma.$SSHFolderPayload<ExtArgs>[]
      sshConnections: Prisma.$SSHConnectionPayload<ExtArgs>[]
      commandLogs: Prisma.$CommandLogPayload<ExtArgs>[]
      userSettings: Prisma.$UserSettingsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      uuid: string
      email: string | null
      username: string | null
      password: string | null
      avatar: string | null
      role: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }


  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' > & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UserFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UserFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends UserFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
    **/
    create<T extends UserCreateArgs<ExtArgs>>(
      args: SelectSubset<T, UserCreateArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
    **/
    delete<T extends UserDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, UserDeleteArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UserUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpdateArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UserDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UserUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
    **/
    upsert<T extends UserUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpsertArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    sshFolders<T extends User$sshFoldersArgs<ExtArgs> = {}>(args?: Subset<T, User$sshFoldersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, 'findMany'> | Null>;

    sshConnections<T extends User$sshConnectionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sshConnectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, 'findMany'> | Null>;

    commandLogs<T extends User$commandLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$commandLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, 'findMany'> | Null>;

    userSettings<T extends User$userSettingsArgs<ExtArgs> = {}>(args?: Subset<T, User$userSettingsArgs<ExtArgs>>): Prisma__UserSettingsClient<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, 'findUniqueOrThrow'> | null, null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly uuid: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes

  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }


  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }


  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }


  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }


  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }


  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }


  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }


  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }


  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }


  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }


  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }


  /**
   * User.sshFolders
   */
  export type User$sshFoldersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHFolder
     */
    select?: SSHFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHFolderInclude<ExtArgs> | null
    where?: SSHFolderWhereInput
    orderBy?: SSHFolderOrderByWithRelationInput | SSHFolderOrderByWithRelationInput[]
    cursor?: SSHFolderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SSHFolderScalarFieldEnum | SSHFolderScalarFieldEnum[]
  }


  /**
   * User.sshConnections
   */
  export type User$sshConnectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHConnection
     */
    select?: SSHConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHConnectionInclude<ExtArgs> | null
    where?: SSHConnectionWhereInput
    orderBy?: SSHConnectionOrderByWithRelationInput | SSHConnectionOrderByWithRelationInput[]
    cursor?: SSHConnectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SSHConnectionScalarFieldEnum | SSHConnectionScalarFieldEnum[]
  }


  /**
   * User.commandLogs
   */
  export type User$commandLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommandLog
     */
    select?: CommandLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CommandLogInclude<ExtArgs> | null
    where?: CommandLogWhereInput
    orderBy?: CommandLogOrderByWithRelationInput | CommandLogOrderByWithRelationInput[]
    cursor?: CommandLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommandLogScalarFieldEnum | CommandLogScalarFieldEnum[]
  }


  /**
   * User.userSettings
   */
  export type User$userSettingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSettingsInclude<ExtArgs> | null
    where?: UserSettingsWhereInput
  }


  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
  }



  /**
   * Model UserSettings
   */

  export type AggregateUserSettings = {
    _count: UserSettingsCountAggregateOutputType | null
    _min: UserSettingsMinAggregateOutputType | null
    _max: UserSettingsMaxAggregateOutputType | null
  }

  export type UserSettingsMinAggregateOutputType = {
    id: string | null
    userId: string | null
    data: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserSettingsMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    data: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserSettingsCountAggregateOutputType = {
    id: number
    userId: number
    data: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserSettingsMinAggregateInputType = {
    id?: true
    userId?: true
    data?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserSettingsMaxAggregateInputType = {
    id?: true
    userId?: true
    data?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserSettingsCountAggregateInputType = {
    id?: true
    userId?: true
    data?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserSettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSettings to aggregate.
     */
    where?: UserSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSettings to fetch.
     */
    orderBy?: UserSettingsOrderByWithRelationInput | UserSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserSettings
    **/
    _count?: true | UserSettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserSettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserSettingsMaxAggregateInputType
  }

  export type GetUserSettingsAggregateType<T extends UserSettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateUserSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserSettings[P]>
      : GetScalarType<T[P], AggregateUserSettings[P]>
  }




  export type UserSettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSettingsWhereInput
    orderBy?: UserSettingsOrderByWithAggregationInput | UserSettingsOrderByWithAggregationInput[]
    by: UserSettingsScalarFieldEnum[] | UserSettingsScalarFieldEnum
    having?: UserSettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserSettingsCountAggregateInputType | true
    _min?: UserSettingsMinAggregateInputType
    _max?: UserSettingsMaxAggregateInputType
  }

  export type UserSettingsGroupByOutputType = {
    id: string
    userId: string
    data: string
    createdAt: Date
    updatedAt: Date
    _count: UserSettingsCountAggregateOutputType | null
    _min: UserSettingsMinAggregateOutputType | null
    _max: UserSettingsMaxAggregateOutputType | null
  }

  type GetUserSettingsGroupByPayload<T extends UserSettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserSettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserSettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserSettingsGroupByOutputType[P]>
            : GetScalarType<T[P], UserSettingsGroupByOutputType[P]>
        }
      >
    >


  export type UserSettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSettings"]>

  export type UserSettingsSelectScalar = {
    id?: boolean
    userId?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserSettingsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }


  export type $UserSettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserSettings"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      data: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userSettings"]>
    composites: {}
  }


  type UserSettingsGetPayload<S extends boolean | null | undefined | UserSettingsDefaultArgs> = $Result.GetResult<Prisma.$UserSettingsPayload, S>

  type UserSettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserSettingsFindManyArgs, 'select' | 'include' | 'distinct' > & {
      select?: UserSettingsCountAggregateInputType | true
    }

  export interface UserSettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserSettings'], meta: { name: 'UserSettings' } }
    /**
     * Find zero or one UserSettings that matches the filter.
     * @param {UserSettingsFindUniqueArgs} args - Arguments to find a UserSettings
     * @example
     * // Get one UserSettings
     * const userSettings = await prisma.userSettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UserSettingsFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, UserSettingsFindUniqueArgs<ExtArgs>>
    ): Prisma__UserSettingsClient<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one UserSettings that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {UserSettingsFindUniqueOrThrowArgs} args - Arguments to find a UserSettings
     * @example
     * // Get one UserSettings
     * const userSettings = await prisma.userSettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UserSettingsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UserSettingsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UserSettingsClient<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first UserSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingsFindFirstArgs} args - Arguments to find a UserSettings
     * @example
     * // Get one UserSettings
     * const userSettings = await prisma.userSettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UserSettingsFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, UserSettingsFindFirstArgs<ExtArgs>>
    ): Prisma__UserSettingsClient<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first UserSettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingsFindFirstOrThrowArgs} args - Arguments to find a UserSettings
     * @example
     * // Get one UserSettings
     * const userSettings = await prisma.userSettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UserSettingsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UserSettingsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UserSettingsClient<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more UserSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserSettings
     * const userSettings = await prisma.userSettings.findMany()
     * 
     * // Get first 10 UserSettings
     * const userSettings = await prisma.userSettings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userSettingsWithIdOnly = await prisma.userSettings.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends UserSettingsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserSettingsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a UserSettings.
     * @param {UserSettingsCreateArgs} args - Arguments to create a UserSettings.
     * @example
     * // Create one UserSettings
     * const UserSettings = await prisma.userSettings.create({
     *   data: {
     *     // ... data to create a UserSettings
     *   }
     * })
     * 
    **/
    create<T extends UserSettingsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, UserSettingsCreateArgs<ExtArgs>>
    ): Prisma__UserSettingsClient<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Delete a UserSettings.
     * @param {UserSettingsDeleteArgs} args - Arguments to delete one UserSettings.
     * @example
     * // Delete one UserSettings
     * const UserSettings = await prisma.userSettings.delete({
     *   where: {
     *     // ... filter to delete one UserSettings
     *   }
     * })
     * 
    **/
    delete<T extends UserSettingsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, UserSettingsDeleteArgs<ExtArgs>>
    ): Prisma__UserSettingsClient<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one UserSettings.
     * @param {UserSettingsUpdateArgs} args - Arguments to update one UserSettings.
     * @example
     * // Update one UserSettings
     * const userSettings = await prisma.userSettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UserSettingsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, UserSettingsUpdateArgs<ExtArgs>>
    ): Prisma__UserSettingsClient<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more UserSettings.
     * @param {UserSettingsDeleteManyArgs} args - Arguments to filter UserSettings to delete.
     * @example
     * // Delete a few UserSettings
     * const { count } = await prisma.userSettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UserSettingsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserSettingsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserSettings
     * const userSettings = await prisma.userSettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UserSettingsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, UserSettingsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserSettings.
     * @param {UserSettingsUpsertArgs} args - Arguments to update or create a UserSettings.
     * @example
     * // Update or create a UserSettings
     * const userSettings = await prisma.userSettings.upsert({
     *   create: {
     *     // ... data to create a UserSettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserSettings we want to update
     *   }
     * })
    **/
    upsert<T extends UserSettingsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, UserSettingsUpsertArgs<ExtArgs>>
    ): Prisma__UserSettingsClient<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of UserSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingsCountArgs} args - Arguments to filter UserSettings to count.
     * @example
     * // Count the number of UserSettings
     * const count = await prisma.userSettings.count({
     *   where: {
     *     // ... the filter for the UserSettings we want to count
     *   }
     * })
    **/
    count<T extends UserSettingsCountArgs>(
      args?: Subset<T, UserSettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserSettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserSettingsAggregateArgs>(args: Subset<T, UserSettingsAggregateArgs>): Prisma.PrismaPromise<GetUserSettingsAggregateType<T>>

    /**
     * Group by UserSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserSettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserSettingsGroupByArgs['orderBy'] }
        : { orderBy?: UserSettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserSettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserSettings model
   */
  readonly fields: UserSettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserSettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserSettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the UserSettings model
   */ 
  interface UserSettingsFieldRefs {
    readonly id: FieldRef<"UserSettings", 'String'>
    readonly userId: FieldRef<"UserSettings", 'String'>
    readonly data: FieldRef<"UserSettings", 'String'>
    readonly createdAt: FieldRef<"UserSettings", 'DateTime'>
    readonly updatedAt: FieldRef<"UserSettings", 'DateTime'>
  }
    

  // Custom InputTypes

  /**
   * UserSettings findUnique
   */
  export type UserSettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UserSettings to fetch.
     */
    where: UserSettingsWhereUniqueInput
  }


  /**
   * UserSettings findUniqueOrThrow
   */
  export type UserSettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UserSettings to fetch.
     */
    where: UserSettingsWhereUniqueInput
  }


  /**
   * UserSettings findFirst
   */
  export type UserSettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UserSettings to fetch.
     */
    where?: UserSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSettings to fetch.
     */
    orderBy?: UserSettingsOrderByWithRelationInput | UserSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSettings.
     */
    cursor?: UserSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSettings.
     */
    distinct?: UserSettingsScalarFieldEnum | UserSettingsScalarFieldEnum[]
  }


  /**
   * UserSettings findFirstOrThrow
   */
  export type UserSettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UserSettings to fetch.
     */
    where?: UserSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSettings to fetch.
     */
    orderBy?: UserSettingsOrderByWithRelationInput | UserSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSettings.
     */
    cursor?: UserSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSettings.
     */
    distinct?: UserSettingsScalarFieldEnum | UserSettingsScalarFieldEnum[]
  }


  /**
   * UserSettings findMany
   */
  export type UserSettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UserSettings to fetch.
     */
    where?: UserSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSettings to fetch.
     */
    orderBy?: UserSettingsOrderByWithRelationInput | UserSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserSettings.
     */
    cursor?: UserSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSettings.
     */
    skip?: number
    distinct?: UserSettingsScalarFieldEnum | UserSettingsScalarFieldEnum[]
  }


  /**
   * UserSettings create
   */
  export type UserSettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSettingsInclude<ExtArgs> | null
    /**
     * The data needed to create a UserSettings.
     */
    data: XOR<UserSettingsCreateInput, UserSettingsUncheckedCreateInput>
  }


  /**
   * UserSettings update
   */
  export type UserSettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSettingsInclude<ExtArgs> | null
    /**
     * The data needed to update a UserSettings.
     */
    data: XOR<UserSettingsUpdateInput, UserSettingsUncheckedUpdateInput>
    /**
     * Choose, which UserSettings to update.
     */
    where: UserSettingsWhereUniqueInput
  }


  /**
   * UserSettings updateMany
   */
  export type UserSettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserSettings.
     */
    data: XOR<UserSettingsUpdateManyMutationInput, UserSettingsUncheckedUpdateManyInput>
    /**
     * Filter which UserSettings to update
     */
    where?: UserSettingsWhereInput
  }


  /**
   * UserSettings upsert
   */
  export type UserSettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSettingsInclude<ExtArgs> | null
    /**
     * The filter to search for the UserSettings to update in case it exists.
     */
    where: UserSettingsWhereUniqueInput
    /**
     * In case the UserSettings found by the `where` argument doesn't exist, create a new UserSettings with this data.
     */
    create: XOR<UserSettingsCreateInput, UserSettingsUncheckedCreateInput>
    /**
     * In case the UserSettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserSettingsUpdateInput, UserSettingsUncheckedUpdateInput>
  }


  /**
   * UserSettings delete
   */
  export type UserSettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSettingsInclude<ExtArgs> | null
    /**
     * Filter which UserSettings to delete.
     */
    where: UserSettingsWhereUniqueInput
  }


  /**
   * UserSettings deleteMany
   */
  export type UserSettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSettings to delete
     */
    where?: UserSettingsWhereInput
  }


  /**
   * UserSettings without action
   */
  export type UserSettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSettingsInclude<ExtArgs> | null
  }



  /**
   * Model SSHFolder
   */

  export type AggregateSSHFolder = {
    _count: SSHFolderCountAggregateOutputType | null
    _avg: SSHFolderAvgAggregateOutputType | null
    _sum: SSHFolderSumAggregateOutputType | null
    _min: SSHFolderMinAggregateOutputType | null
    _max: SSHFolderMaxAggregateOutputType | null
  }

  export type SSHFolderAvgAggregateOutputType = {
    order: number | null
  }

  export type SSHFolderSumAggregateOutputType = {
    order: number | null
  }

  export type SSHFolderMinAggregateOutputType = {
    id: string | null
    name: string | null
    order: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    parentId: string | null
    userId: string | null
  }

  export type SSHFolderMaxAggregateOutputType = {
    id: string | null
    name: string | null
    order: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    parentId: string | null
    userId: string | null
  }

  export type SSHFolderCountAggregateOutputType = {
    id: number
    name: number
    order: number
    isActive: number
    createdAt: number
    updatedAt: number
    parentId: number
    userId: number
    _all: number
  }


  export type SSHFolderAvgAggregateInputType = {
    order?: true
  }

  export type SSHFolderSumAggregateInputType = {
    order?: true
  }

  export type SSHFolderMinAggregateInputType = {
    id?: true
    name?: true
    order?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    parentId?: true
    userId?: true
  }

  export type SSHFolderMaxAggregateInputType = {
    id?: true
    name?: true
    order?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    parentId?: true
    userId?: true
  }

  export type SSHFolderCountAggregateInputType = {
    id?: true
    name?: true
    order?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    parentId?: true
    userId?: true
    _all?: true
  }

  export type SSHFolderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SSHFolder to aggregate.
     */
    where?: SSHFolderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SSHFolders to fetch.
     */
    orderBy?: SSHFolderOrderByWithRelationInput | SSHFolderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SSHFolderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SSHFolders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SSHFolders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SSHFolders
    **/
    _count?: true | SSHFolderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SSHFolderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SSHFolderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SSHFolderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SSHFolderMaxAggregateInputType
  }

  export type GetSSHFolderAggregateType<T extends SSHFolderAggregateArgs> = {
        [P in keyof T & keyof AggregateSSHFolder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSSHFolder[P]>
      : GetScalarType<T[P], AggregateSSHFolder[P]>
  }




  export type SSHFolderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SSHFolderWhereInput
    orderBy?: SSHFolderOrderByWithAggregationInput | SSHFolderOrderByWithAggregationInput[]
    by: SSHFolderScalarFieldEnum[] | SSHFolderScalarFieldEnum
    having?: SSHFolderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SSHFolderCountAggregateInputType | true
    _avg?: SSHFolderAvgAggregateInputType
    _sum?: SSHFolderSumAggregateInputType
    _min?: SSHFolderMinAggregateInputType
    _max?: SSHFolderMaxAggregateInputType
  }

  export type SSHFolderGroupByOutputType = {
    id: string
    name: string
    order: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    parentId: string | null
    userId: string
    _count: SSHFolderCountAggregateOutputType | null
    _avg: SSHFolderAvgAggregateOutputType | null
    _sum: SSHFolderSumAggregateOutputType | null
    _min: SSHFolderMinAggregateOutputType | null
    _max: SSHFolderMaxAggregateOutputType | null
  }

  type GetSSHFolderGroupByPayload<T extends SSHFolderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SSHFolderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SSHFolderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SSHFolderGroupByOutputType[P]>
            : GetScalarType<T[P], SSHFolderGroupByOutputType[P]>
        }
      >
    >


  export type SSHFolderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    order?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parentId?: boolean
    userId?: boolean
    parent?: boolean | SSHFolder$parentArgs<ExtArgs>
    children?: boolean | SSHFolder$childrenArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    connections?: boolean | SSHFolder$connectionsArgs<ExtArgs>
    _count?: boolean | SSHFolderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sSHFolder"]>

  export type SSHFolderSelectScalar = {
    id?: boolean
    name?: boolean
    order?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parentId?: boolean
    userId?: boolean
  }

  export type SSHFolderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | SSHFolder$parentArgs<ExtArgs>
    children?: boolean | SSHFolder$childrenArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    connections?: boolean | SSHFolder$connectionsArgs<ExtArgs>
    _count?: boolean | SSHFolderCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $SSHFolderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SSHFolder"
    objects: {
      parent: Prisma.$SSHFolderPayload<ExtArgs> | null
      children: Prisma.$SSHFolderPayload<ExtArgs>[]
      user: Prisma.$UserPayload<ExtArgs>
      connections: Prisma.$SSHConnectionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      order: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
      parentId: string | null
      userId: string
    }, ExtArgs["result"]["sSHFolder"]>
    composites: {}
  }


  type SSHFolderGetPayload<S extends boolean | null | undefined | SSHFolderDefaultArgs> = $Result.GetResult<Prisma.$SSHFolderPayload, S>

  type SSHFolderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SSHFolderFindManyArgs, 'select' | 'include' | 'distinct' > & {
      select?: SSHFolderCountAggregateInputType | true
    }

  export interface SSHFolderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SSHFolder'], meta: { name: 'SSHFolder' } }
    /**
     * Find zero or one SSHFolder that matches the filter.
     * @param {SSHFolderFindUniqueArgs} args - Arguments to find a SSHFolder
     * @example
     * // Get one SSHFolder
     * const sSHFolder = await prisma.sSHFolder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends SSHFolderFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, SSHFolderFindUniqueArgs<ExtArgs>>
    ): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one SSHFolder that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {SSHFolderFindUniqueOrThrowArgs} args - Arguments to find a SSHFolder
     * @example
     * // Get one SSHFolder
     * const sSHFolder = await prisma.sSHFolder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends SSHFolderFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SSHFolderFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first SSHFolder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SSHFolderFindFirstArgs} args - Arguments to find a SSHFolder
     * @example
     * // Get one SSHFolder
     * const sSHFolder = await prisma.sSHFolder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends SSHFolderFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, SSHFolderFindFirstArgs<ExtArgs>>
    ): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first SSHFolder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SSHFolderFindFirstOrThrowArgs} args - Arguments to find a SSHFolder
     * @example
     * // Get one SSHFolder
     * const sSHFolder = await prisma.sSHFolder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends SSHFolderFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SSHFolderFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more SSHFolders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SSHFolderFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SSHFolders
     * const sSHFolders = await prisma.sSHFolder.findMany()
     * 
     * // Get first 10 SSHFolders
     * const sSHFolders = await prisma.sSHFolder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sSHFolderWithIdOnly = await prisma.sSHFolder.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends SSHFolderFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SSHFolderFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a SSHFolder.
     * @param {SSHFolderCreateArgs} args - Arguments to create a SSHFolder.
     * @example
     * // Create one SSHFolder
     * const SSHFolder = await prisma.sSHFolder.create({
     *   data: {
     *     // ... data to create a SSHFolder
     *   }
     * })
     * 
    **/
    create<T extends SSHFolderCreateArgs<ExtArgs>>(
      args: SelectSubset<T, SSHFolderCreateArgs<ExtArgs>>
    ): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Delete a SSHFolder.
     * @param {SSHFolderDeleteArgs} args - Arguments to delete one SSHFolder.
     * @example
     * // Delete one SSHFolder
     * const SSHFolder = await prisma.sSHFolder.delete({
     *   where: {
     *     // ... filter to delete one SSHFolder
     *   }
     * })
     * 
    **/
    delete<T extends SSHFolderDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, SSHFolderDeleteArgs<ExtArgs>>
    ): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one SSHFolder.
     * @param {SSHFolderUpdateArgs} args - Arguments to update one SSHFolder.
     * @example
     * // Update one SSHFolder
     * const sSHFolder = await prisma.sSHFolder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends SSHFolderUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, SSHFolderUpdateArgs<ExtArgs>>
    ): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more SSHFolders.
     * @param {SSHFolderDeleteManyArgs} args - Arguments to filter SSHFolders to delete.
     * @example
     * // Delete a few SSHFolders
     * const { count } = await prisma.sSHFolder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends SSHFolderDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SSHFolderDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SSHFolders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SSHFolderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SSHFolders
     * const sSHFolder = await prisma.sSHFolder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends SSHFolderUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, SSHFolderUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SSHFolder.
     * @param {SSHFolderUpsertArgs} args - Arguments to update or create a SSHFolder.
     * @example
     * // Update or create a SSHFolder
     * const sSHFolder = await prisma.sSHFolder.upsert({
     *   create: {
     *     // ... data to create a SSHFolder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SSHFolder we want to update
     *   }
     * })
    **/
    upsert<T extends SSHFolderUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, SSHFolderUpsertArgs<ExtArgs>>
    ): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of SSHFolders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SSHFolderCountArgs} args - Arguments to filter SSHFolders to count.
     * @example
     * // Count the number of SSHFolders
     * const count = await prisma.sSHFolder.count({
     *   where: {
     *     // ... the filter for the SSHFolders we want to count
     *   }
     * })
    **/
    count<T extends SSHFolderCountArgs>(
      args?: Subset<T, SSHFolderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SSHFolderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SSHFolder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SSHFolderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SSHFolderAggregateArgs>(args: Subset<T, SSHFolderAggregateArgs>): Prisma.PrismaPromise<GetSSHFolderAggregateType<T>>

    /**
     * Group by SSHFolder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SSHFolderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SSHFolderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SSHFolderGroupByArgs['orderBy'] }
        : { orderBy?: SSHFolderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SSHFolderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSSHFolderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SSHFolder model
   */
  readonly fields: SSHFolderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SSHFolder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SSHFolderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    parent<T extends SSHFolder$parentArgs<ExtArgs> = {}>(args?: Subset<T, SSHFolder$parentArgs<ExtArgs>>): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, 'findUniqueOrThrow'> | null, null, ExtArgs>;

    children<T extends SSHFolder$childrenArgs<ExtArgs> = {}>(args?: Subset<T, SSHFolder$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, 'findMany'> | Null>;

    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    connections<T extends SSHFolder$connectionsArgs<ExtArgs> = {}>(args?: Subset<T, SSHFolder$connectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the SSHFolder model
   */ 
  interface SSHFolderFieldRefs {
    readonly id: FieldRef<"SSHFolder", 'String'>
    readonly name: FieldRef<"SSHFolder", 'String'>
    readonly order: FieldRef<"SSHFolder", 'Int'>
    readonly isActive: FieldRef<"SSHFolder", 'Boolean'>
    readonly createdAt: FieldRef<"SSHFolder", 'DateTime'>
    readonly updatedAt: FieldRef<"SSHFolder", 'DateTime'>
    readonly parentId: FieldRef<"SSHFolder", 'String'>
    readonly userId: FieldRef<"SSHFolder", 'String'>
  }
    

  // Custom InputTypes

  /**
   * SSHFolder findUnique
   */
  export type SSHFolderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHFolder
     */
    select?: SSHFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHFolderInclude<ExtArgs> | null
    /**
     * Filter, which SSHFolder to fetch.
     */
    where: SSHFolderWhereUniqueInput
  }


  /**
   * SSHFolder findUniqueOrThrow
   */
  export type SSHFolderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHFolder
     */
    select?: SSHFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHFolderInclude<ExtArgs> | null
    /**
     * Filter, which SSHFolder to fetch.
     */
    where: SSHFolderWhereUniqueInput
  }


  /**
   * SSHFolder findFirst
   */
  export type SSHFolderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHFolder
     */
    select?: SSHFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHFolderInclude<ExtArgs> | null
    /**
     * Filter, which SSHFolder to fetch.
     */
    where?: SSHFolderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SSHFolders to fetch.
     */
    orderBy?: SSHFolderOrderByWithRelationInput | SSHFolderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SSHFolders.
     */
    cursor?: SSHFolderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SSHFolders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SSHFolders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SSHFolders.
     */
    distinct?: SSHFolderScalarFieldEnum | SSHFolderScalarFieldEnum[]
  }


  /**
   * SSHFolder findFirstOrThrow
   */
  export type SSHFolderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHFolder
     */
    select?: SSHFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHFolderInclude<ExtArgs> | null
    /**
     * Filter, which SSHFolder to fetch.
     */
    where?: SSHFolderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SSHFolders to fetch.
     */
    orderBy?: SSHFolderOrderByWithRelationInput | SSHFolderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SSHFolders.
     */
    cursor?: SSHFolderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SSHFolders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SSHFolders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SSHFolders.
     */
    distinct?: SSHFolderScalarFieldEnum | SSHFolderScalarFieldEnum[]
  }


  /**
   * SSHFolder findMany
   */
  export type SSHFolderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHFolder
     */
    select?: SSHFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHFolderInclude<ExtArgs> | null
    /**
     * Filter, which SSHFolders to fetch.
     */
    where?: SSHFolderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SSHFolders to fetch.
     */
    orderBy?: SSHFolderOrderByWithRelationInput | SSHFolderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SSHFolders.
     */
    cursor?: SSHFolderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SSHFolders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SSHFolders.
     */
    skip?: number
    distinct?: SSHFolderScalarFieldEnum | SSHFolderScalarFieldEnum[]
  }


  /**
   * SSHFolder create
   */
  export type SSHFolderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHFolder
     */
    select?: SSHFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHFolderInclude<ExtArgs> | null
    /**
     * The data needed to create a SSHFolder.
     */
    data: XOR<SSHFolderCreateInput, SSHFolderUncheckedCreateInput>
  }


  /**
   * SSHFolder update
   */
  export type SSHFolderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHFolder
     */
    select?: SSHFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHFolderInclude<ExtArgs> | null
    /**
     * The data needed to update a SSHFolder.
     */
    data: XOR<SSHFolderUpdateInput, SSHFolderUncheckedUpdateInput>
    /**
     * Choose, which SSHFolder to update.
     */
    where: SSHFolderWhereUniqueInput
  }


  /**
   * SSHFolder updateMany
   */
  export type SSHFolderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SSHFolders.
     */
    data: XOR<SSHFolderUpdateManyMutationInput, SSHFolderUncheckedUpdateManyInput>
    /**
     * Filter which SSHFolders to update
     */
    where?: SSHFolderWhereInput
  }


  /**
   * SSHFolder upsert
   */
  export type SSHFolderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHFolder
     */
    select?: SSHFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHFolderInclude<ExtArgs> | null
    /**
     * The filter to search for the SSHFolder to update in case it exists.
     */
    where: SSHFolderWhereUniqueInput
    /**
     * In case the SSHFolder found by the `where` argument doesn't exist, create a new SSHFolder with this data.
     */
    create: XOR<SSHFolderCreateInput, SSHFolderUncheckedCreateInput>
    /**
     * In case the SSHFolder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SSHFolderUpdateInput, SSHFolderUncheckedUpdateInput>
  }


  /**
   * SSHFolder delete
   */
  export type SSHFolderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHFolder
     */
    select?: SSHFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHFolderInclude<ExtArgs> | null
    /**
     * Filter which SSHFolder to delete.
     */
    where: SSHFolderWhereUniqueInput
  }


  /**
   * SSHFolder deleteMany
   */
  export type SSHFolderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SSHFolders to delete
     */
    where?: SSHFolderWhereInput
  }


  /**
   * SSHFolder.parent
   */
  export type SSHFolder$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHFolder
     */
    select?: SSHFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHFolderInclude<ExtArgs> | null
    where?: SSHFolderWhereInput
  }


  /**
   * SSHFolder.children
   */
  export type SSHFolder$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHFolder
     */
    select?: SSHFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHFolderInclude<ExtArgs> | null
    where?: SSHFolderWhereInput
    orderBy?: SSHFolderOrderByWithRelationInput | SSHFolderOrderByWithRelationInput[]
    cursor?: SSHFolderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SSHFolderScalarFieldEnum | SSHFolderScalarFieldEnum[]
  }


  /**
   * SSHFolder.connections
   */
  export type SSHFolder$connectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHConnection
     */
    select?: SSHConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHConnectionInclude<ExtArgs> | null
    where?: SSHConnectionWhereInput
    orderBy?: SSHConnectionOrderByWithRelationInput | SSHConnectionOrderByWithRelationInput[]
    cursor?: SSHConnectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SSHConnectionScalarFieldEnum | SSHConnectionScalarFieldEnum[]
  }


  /**
   * SSHFolder without action
   */
  export type SSHFolderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHFolder
     */
    select?: SSHFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHFolderInclude<ExtArgs> | null
  }



  /**
   * Model SSHConnection
   */

  export type AggregateSSHConnection = {
    _count: SSHConnectionCountAggregateOutputType | null
    _avg: SSHConnectionAvgAggregateOutputType | null
    _sum: SSHConnectionSumAggregateOutputType | null
    _min: SSHConnectionMinAggregateOutputType | null
    _max: SSHConnectionMaxAggregateOutputType | null
  }

  export type SSHConnectionAvgAggregateOutputType = {
    port: number | null
    order: number | null
  }

  export type SSHConnectionSumAggregateOutputType = {
    port: number | null
    order: number | null
  }

  export type SSHConnectionMinAggregateOutputType = {
    id: string | null
    name: string | null
    host: string | null
    port: number | null
    username: string | null
    order: number | null
    authType: string | null
    password: string | null
    privateKey: string | null
    publicKey: string | null
    passphrase: string | null
    status: string | null
    lastUsed: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    meta: string | null
    folderId: string | null
    userId: string | null
  }

  export type SSHConnectionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    host: string | null
    port: number | null
    username: string | null
    order: number | null
    authType: string | null
    password: string | null
    privateKey: string | null
    publicKey: string | null
    passphrase: string | null
    status: string | null
    lastUsed: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    meta: string | null
    folderId: string | null
    userId: string | null
  }

  export type SSHConnectionCountAggregateOutputType = {
    id: number
    name: number
    host: number
    port: number
    username: number
    order: number
    authType: number
    password: number
    privateKey: number
    publicKey: number
    passphrase: number
    status: number
    lastUsed: number
    isActive: number
    createdAt: number
    updatedAt: number
    meta: number
    folderId: number
    userId: number
    _all: number
  }


  export type SSHConnectionAvgAggregateInputType = {
    port?: true
    order?: true
  }

  export type SSHConnectionSumAggregateInputType = {
    port?: true
    order?: true
  }

  export type SSHConnectionMinAggregateInputType = {
    id?: true
    name?: true
    host?: true
    port?: true
    username?: true
    order?: true
    authType?: true
    password?: true
    privateKey?: true
    publicKey?: true
    passphrase?: true
    status?: true
    lastUsed?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    meta?: true
    folderId?: true
    userId?: true
  }

  export type SSHConnectionMaxAggregateInputType = {
    id?: true
    name?: true
    host?: true
    port?: true
    username?: true
    order?: true
    authType?: true
    password?: true
    privateKey?: true
    publicKey?: true
    passphrase?: true
    status?: true
    lastUsed?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    meta?: true
    folderId?: true
    userId?: true
  }

  export type SSHConnectionCountAggregateInputType = {
    id?: true
    name?: true
    host?: true
    port?: true
    username?: true
    order?: true
    authType?: true
    password?: true
    privateKey?: true
    publicKey?: true
    passphrase?: true
    status?: true
    lastUsed?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    meta?: true
    folderId?: true
    userId?: true
    _all?: true
  }

  export type SSHConnectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SSHConnection to aggregate.
     */
    where?: SSHConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SSHConnections to fetch.
     */
    orderBy?: SSHConnectionOrderByWithRelationInput | SSHConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SSHConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SSHConnections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SSHConnections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SSHConnections
    **/
    _count?: true | SSHConnectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SSHConnectionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SSHConnectionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SSHConnectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SSHConnectionMaxAggregateInputType
  }

  export type GetSSHConnectionAggregateType<T extends SSHConnectionAggregateArgs> = {
        [P in keyof T & keyof AggregateSSHConnection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSSHConnection[P]>
      : GetScalarType<T[P], AggregateSSHConnection[P]>
  }




  export type SSHConnectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SSHConnectionWhereInput
    orderBy?: SSHConnectionOrderByWithAggregationInput | SSHConnectionOrderByWithAggregationInput[]
    by: SSHConnectionScalarFieldEnum[] | SSHConnectionScalarFieldEnum
    having?: SSHConnectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SSHConnectionCountAggregateInputType | true
    _avg?: SSHConnectionAvgAggregateInputType
    _sum?: SSHConnectionSumAggregateInputType
    _min?: SSHConnectionMinAggregateInputType
    _max?: SSHConnectionMaxAggregateInputType
  }

  export type SSHConnectionGroupByOutputType = {
    id: string
    name: string
    host: string
    port: number
    username: string
    order: number
    authType: string
    password: string | null
    privateKey: string | null
    publicKey: string | null
    passphrase: string | null
    status: string
    lastUsed: Date | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    meta: string | null
    folderId: string | null
    userId: string
    _count: SSHConnectionCountAggregateOutputType | null
    _avg: SSHConnectionAvgAggregateOutputType | null
    _sum: SSHConnectionSumAggregateOutputType | null
    _min: SSHConnectionMinAggregateOutputType | null
    _max: SSHConnectionMaxAggregateOutputType | null
  }

  type GetSSHConnectionGroupByPayload<T extends SSHConnectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SSHConnectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SSHConnectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SSHConnectionGroupByOutputType[P]>
            : GetScalarType<T[P], SSHConnectionGroupByOutputType[P]>
        }
      >
    >


  export type SSHConnectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    host?: boolean
    port?: boolean
    username?: boolean
    order?: boolean
    authType?: boolean
    password?: boolean
    privateKey?: boolean
    publicKey?: boolean
    passphrase?: boolean
    status?: boolean
    lastUsed?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    meta?: boolean
    folderId?: boolean
    userId?: boolean
    folder?: boolean | SSHConnection$folderArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    commandLogs?: boolean | SSHConnection$commandLogsArgs<ExtArgs>
    _count?: boolean | SSHConnectionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sSHConnection"]>

  export type SSHConnectionSelectScalar = {
    id?: boolean
    name?: boolean
    host?: boolean
    port?: boolean
    username?: boolean
    order?: boolean
    authType?: boolean
    password?: boolean
    privateKey?: boolean
    publicKey?: boolean
    passphrase?: boolean
    status?: boolean
    lastUsed?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    meta?: boolean
    folderId?: boolean
    userId?: boolean
  }

  export type SSHConnectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    folder?: boolean | SSHConnection$folderArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    commandLogs?: boolean | SSHConnection$commandLogsArgs<ExtArgs>
    _count?: boolean | SSHConnectionCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $SSHConnectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SSHConnection"
    objects: {
      folder: Prisma.$SSHFolderPayload<ExtArgs> | null
      user: Prisma.$UserPayload<ExtArgs>
      commandLogs: Prisma.$CommandLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      host: string
      port: number
      username: string
      order: number
      authType: string
      password: string | null
      privateKey: string | null
      publicKey: string | null
      passphrase: string | null
      status: string
      lastUsed: Date | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
      meta: string | null
      folderId: string | null
      userId: string
    }, ExtArgs["result"]["sSHConnection"]>
    composites: {}
  }


  type SSHConnectionGetPayload<S extends boolean | null | undefined | SSHConnectionDefaultArgs> = $Result.GetResult<Prisma.$SSHConnectionPayload, S>

  type SSHConnectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SSHConnectionFindManyArgs, 'select' | 'include' | 'distinct' > & {
      select?: SSHConnectionCountAggregateInputType | true
    }

  export interface SSHConnectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SSHConnection'], meta: { name: 'SSHConnection' } }
    /**
     * Find zero or one SSHConnection that matches the filter.
     * @param {SSHConnectionFindUniqueArgs} args - Arguments to find a SSHConnection
     * @example
     * // Get one SSHConnection
     * const sSHConnection = await prisma.sSHConnection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends SSHConnectionFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, SSHConnectionFindUniqueArgs<ExtArgs>>
    ): Prisma__SSHConnectionClient<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one SSHConnection that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {SSHConnectionFindUniqueOrThrowArgs} args - Arguments to find a SSHConnection
     * @example
     * // Get one SSHConnection
     * const sSHConnection = await prisma.sSHConnection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends SSHConnectionFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SSHConnectionFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SSHConnectionClient<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first SSHConnection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SSHConnectionFindFirstArgs} args - Arguments to find a SSHConnection
     * @example
     * // Get one SSHConnection
     * const sSHConnection = await prisma.sSHConnection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends SSHConnectionFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, SSHConnectionFindFirstArgs<ExtArgs>>
    ): Prisma__SSHConnectionClient<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first SSHConnection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SSHConnectionFindFirstOrThrowArgs} args - Arguments to find a SSHConnection
     * @example
     * // Get one SSHConnection
     * const sSHConnection = await prisma.sSHConnection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends SSHConnectionFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SSHConnectionFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SSHConnectionClient<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more SSHConnections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SSHConnectionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SSHConnections
     * const sSHConnections = await prisma.sSHConnection.findMany()
     * 
     * // Get first 10 SSHConnections
     * const sSHConnections = await prisma.sSHConnection.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sSHConnectionWithIdOnly = await prisma.sSHConnection.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends SSHConnectionFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SSHConnectionFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a SSHConnection.
     * @param {SSHConnectionCreateArgs} args - Arguments to create a SSHConnection.
     * @example
     * // Create one SSHConnection
     * const SSHConnection = await prisma.sSHConnection.create({
     *   data: {
     *     // ... data to create a SSHConnection
     *   }
     * })
     * 
    **/
    create<T extends SSHConnectionCreateArgs<ExtArgs>>(
      args: SelectSubset<T, SSHConnectionCreateArgs<ExtArgs>>
    ): Prisma__SSHConnectionClient<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Delete a SSHConnection.
     * @param {SSHConnectionDeleteArgs} args - Arguments to delete one SSHConnection.
     * @example
     * // Delete one SSHConnection
     * const SSHConnection = await prisma.sSHConnection.delete({
     *   where: {
     *     // ... filter to delete one SSHConnection
     *   }
     * })
     * 
    **/
    delete<T extends SSHConnectionDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, SSHConnectionDeleteArgs<ExtArgs>>
    ): Prisma__SSHConnectionClient<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one SSHConnection.
     * @param {SSHConnectionUpdateArgs} args - Arguments to update one SSHConnection.
     * @example
     * // Update one SSHConnection
     * const sSHConnection = await prisma.sSHConnection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends SSHConnectionUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, SSHConnectionUpdateArgs<ExtArgs>>
    ): Prisma__SSHConnectionClient<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more SSHConnections.
     * @param {SSHConnectionDeleteManyArgs} args - Arguments to filter SSHConnections to delete.
     * @example
     * // Delete a few SSHConnections
     * const { count } = await prisma.sSHConnection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends SSHConnectionDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SSHConnectionDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SSHConnections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SSHConnectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SSHConnections
     * const sSHConnection = await prisma.sSHConnection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends SSHConnectionUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, SSHConnectionUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SSHConnection.
     * @param {SSHConnectionUpsertArgs} args - Arguments to update or create a SSHConnection.
     * @example
     * // Update or create a SSHConnection
     * const sSHConnection = await prisma.sSHConnection.upsert({
     *   create: {
     *     // ... data to create a SSHConnection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SSHConnection we want to update
     *   }
     * })
    **/
    upsert<T extends SSHConnectionUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, SSHConnectionUpsertArgs<ExtArgs>>
    ): Prisma__SSHConnectionClient<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of SSHConnections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SSHConnectionCountArgs} args - Arguments to filter SSHConnections to count.
     * @example
     * // Count the number of SSHConnections
     * const count = await prisma.sSHConnection.count({
     *   where: {
     *     // ... the filter for the SSHConnections we want to count
     *   }
     * })
    **/
    count<T extends SSHConnectionCountArgs>(
      args?: Subset<T, SSHConnectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SSHConnectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SSHConnection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SSHConnectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SSHConnectionAggregateArgs>(args: Subset<T, SSHConnectionAggregateArgs>): Prisma.PrismaPromise<GetSSHConnectionAggregateType<T>>

    /**
     * Group by SSHConnection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SSHConnectionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SSHConnectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SSHConnectionGroupByArgs['orderBy'] }
        : { orderBy?: SSHConnectionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SSHConnectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSSHConnectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SSHConnection model
   */
  readonly fields: SSHConnectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SSHConnection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SSHConnectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    folder<T extends SSHConnection$folderArgs<ExtArgs> = {}>(args?: Subset<T, SSHConnection$folderArgs<ExtArgs>>): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, 'findUniqueOrThrow'> | null, null, ExtArgs>;

    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    commandLogs<T extends SSHConnection$commandLogsArgs<ExtArgs> = {}>(args?: Subset<T, SSHConnection$commandLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the SSHConnection model
   */ 
  interface SSHConnectionFieldRefs {
    readonly id: FieldRef<"SSHConnection", 'String'>
    readonly name: FieldRef<"SSHConnection", 'String'>
    readonly host: FieldRef<"SSHConnection", 'String'>
    readonly port: FieldRef<"SSHConnection", 'Int'>
    readonly username: FieldRef<"SSHConnection", 'String'>
    readonly order: FieldRef<"SSHConnection", 'Int'>
    readonly authType: FieldRef<"SSHConnection", 'String'>
    readonly password: FieldRef<"SSHConnection", 'String'>
    readonly privateKey: FieldRef<"SSHConnection", 'String'>
    readonly publicKey: FieldRef<"SSHConnection", 'String'>
    readonly passphrase: FieldRef<"SSHConnection", 'String'>
    readonly status: FieldRef<"SSHConnection", 'String'>
    readonly lastUsed: FieldRef<"SSHConnection", 'DateTime'>
    readonly isActive: FieldRef<"SSHConnection", 'Boolean'>
    readonly createdAt: FieldRef<"SSHConnection", 'DateTime'>
    readonly updatedAt: FieldRef<"SSHConnection", 'DateTime'>
    readonly meta: FieldRef<"SSHConnection", 'String'>
    readonly folderId: FieldRef<"SSHConnection", 'String'>
    readonly userId: FieldRef<"SSHConnection", 'String'>
  }
    

  // Custom InputTypes

  /**
   * SSHConnection findUnique
   */
  export type SSHConnectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHConnection
     */
    select?: SSHConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHConnectionInclude<ExtArgs> | null
    /**
     * Filter, which SSHConnection to fetch.
     */
    where: SSHConnectionWhereUniqueInput
  }


  /**
   * SSHConnection findUniqueOrThrow
   */
  export type SSHConnectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHConnection
     */
    select?: SSHConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHConnectionInclude<ExtArgs> | null
    /**
     * Filter, which SSHConnection to fetch.
     */
    where: SSHConnectionWhereUniqueInput
  }


  /**
   * SSHConnection findFirst
   */
  export type SSHConnectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHConnection
     */
    select?: SSHConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHConnectionInclude<ExtArgs> | null
    /**
     * Filter, which SSHConnection to fetch.
     */
    where?: SSHConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SSHConnections to fetch.
     */
    orderBy?: SSHConnectionOrderByWithRelationInput | SSHConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SSHConnections.
     */
    cursor?: SSHConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SSHConnections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SSHConnections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SSHConnections.
     */
    distinct?: SSHConnectionScalarFieldEnum | SSHConnectionScalarFieldEnum[]
  }


  /**
   * SSHConnection findFirstOrThrow
   */
  export type SSHConnectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHConnection
     */
    select?: SSHConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHConnectionInclude<ExtArgs> | null
    /**
     * Filter, which SSHConnection to fetch.
     */
    where?: SSHConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SSHConnections to fetch.
     */
    orderBy?: SSHConnectionOrderByWithRelationInput | SSHConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SSHConnections.
     */
    cursor?: SSHConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SSHConnections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SSHConnections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SSHConnections.
     */
    distinct?: SSHConnectionScalarFieldEnum | SSHConnectionScalarFieldEnum[]
  }


  /**
   * SSHConnection findMany
   */
  export type SSHConnectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHConnection
     */
    select?: SSHConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHConnectionInclude<ExtArgs> | null
    /**
     * Filter, which SSHConnections to fetch.
     */
    where?: SSHConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SSHConnections to fetch.
     */
    orderBy?: SSHConnectionOrderByWithRelationInput | SSHConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SSHConnections.
     */
    cursor?: SSHConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SSHConnections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SSHConnections.
     */
    skip?: number
    distinct?: SSHConnectionScalarFieldEnum | SSHConnectionScalarFieldEnum[]
  }


  /**
   * SSHConnection create
   */
  export type SSHConnectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHConnection
     */
    select?: SSHConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHConnectionInclude<ExtArgs> | null
    /**
     * The data needed to create a SSHConnection.
     */
    data: XOR<SSHConnectionCreateInput, SSHConnectionUncheckedCreateInput>
  }


  /**
   * SSHConnection update
   */
  export type SSHConnectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHConnection
     */
    select?: SSHConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHConnectionInclude<ExtArgs> | null
    /**
     * The data needed to update a SSHConnection.
     */
    data: XOR<SSHConnectionUpdateInput, SSHConnectionUncheckedUpdateInput>
    /**
     * Choose, which SSHConnection to update.
     */
    where: SSHConnectionWhereUniqueInput
  }


  /**
   * SSHConnection updateMany
   */
  export type SSHConnectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SSHConnections.
     */
    data: XOR<SSHConnectionUpdateManyMutationInput, SSHConnectionUncheckedUpdateManyInput>
    /**
     * Filter which SSHConnections to update
     */
    where?: SSHConnectionWhereInput
  }


  /**
   * SSHConnection upsert
   */
  export type SSHConnectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHConnection
     */
    select?: SSHConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHConnectionInclude<ExtArgs> | null
    /**
     * The filter to search for the SSHConnection to update in case it exists.
     */
    where: SSHConnectionWhereUniqueInput
    /**
     * In case the SSHConnection found by the `where` argument doesn't exist, create a new SSHConnection with this data.
     */
    create: XOR<SSHConnectionCreateInput, SSHConnectionUncheckedCreateInput>
    /**
     * In case the SSHConnection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SSHConnectionUpdateInput, SSHConnectionUncheckedUpdateInput>
  }


  /**
   * SSHConnection delete
   */
  export type SSHConnectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHConnection
     */
    select?: SSHConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHConnectionInclude<ExtArgs> | null
    /**
     * Filter which SSHConnection to delete.
     */
    where: SSHConnectionWhereUniqueInput
  }


  /**
   * SSHConnection deleteMany
   */
  export type SSHConnectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SSHConnections to delete
     */
    where?: SSHConnectionWhereInput
  }


  /**
   * SSHConnection.folder
   */
  export type SSHConnection$folderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHFolder
     */
    select?: SSHFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHFolderInclude<ExtArgs> | null
    where?: SSHFolderWhereInput
  }


  /**
   * SSHConnection.commandLogs
   */
  export type SSHConnection$commandLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommandLog
     */
    select?: CommandLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CommandLogInclude<ExtArgs> | null
    where?: CommandLogWhereInput
    orderBy?: CommandLogOrderByWithRelationInput | CommandLogOrderByWithRelationInput[]
    cursor?: CommandLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommandLogScalarFieldEnum | CommandLogScalarFieldEnum[]
  }


  /**
   * SSHConnection without action
   */
  export type SSHConnectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHConnection
     */
    select?: SSHConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHConnectionInclude<ExtArgs> | null
  }



  /**
   * Model CommandLog
   */

  export type AggregateCommandLog = {
    _count: CommandLogCountAggregateOutputType | null
    _avg: CommandLogAvgAggregateOutputType | null
    _sum: CommandLogSumAggregateOutputType | null
    _min: CommandLogMinAggregateOutputType | null
    _max: CommandLogMaxAggregateOutputType | null
  }

  export type CommandLogAvgAggregateOutputType = {
    exitCode: number | null
    duration: number | null
  }

  export type CommandLogSumAggregateOutputType = {
    exitCode: number | null
    duration: number | null
  }

  export type CommandLogMinAggregateOutputType = {
    id: string | null
    command: string | null
    output: string | null
    exitCode: number | null
    duration: number | null
    createdAt: Date | null
    safetyLevel: string | null
    metadata: string | null
    userId: string | null
    sshConnectionId: string | null
  }

  export type CommandLogMaxAggregateOutputType = {
    id: string | null
    command: string | null
    output: string | null
    exitCode: number | null
    duration: number | null
    createdAt: Date | null
    safetyLevel: string | null
    metadata: string | null
    userId: string | null
    sshConnectionId: string | null
  }

  export type CommandLogCountAggregateOutputType = {
    id: number
    command: number
    output: number
    exitCode: number
    duration: number
    createdAt: number
    safetyLevel: number
    metadata: number
    userId: number
    sshConnectionId: number
    _all: number
  }


  export type CommandLogAvgAggregateInputType = {
    exitCode?: true
    duration?: true
  }

  export type CommandLogSumAggregateInputType = {
    exitCode?: true
    duration?: true
  }

  export type CommandLogMinAggregateInputType = {
    id?: true
    command?: true
    output?: true
    exitCode?: true
    duration?: true
    createdAt?: true
    safetyLevel?: true
    metadata?: true
    userId?: true
    sshConnectionId?: true
  }

  export type CommandLogMaxAggregateInputType = {
    id?: true
    command?: true
    output?: true
    exitCode?: true
    duration?: true
    createdAt?: true
    safetyLevel?: true
    metadata?: true
    userId?: true
    sshConnectionId?: true
  }

  export type CommandLogCountAggregateInputType = {
    id?: true
    command?: true
    output?: true
    exitCode?: true
    duration?: true
    createdAt?: true
    safetyLevel?: true
    metadata?: true
    userId?: true
    sshConnectionId?: true
    _all?: true
  }

  export type CommandLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommandLog to aggregate.
     */
    where?: CommandLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommandLogs to fetch.
     */
    orderBy?: CommandLogOrderByWithRelationInput | CommandLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommandLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommandLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommandLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CommandLogs
    **/
    _count?: true | CommandLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CommandLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CommandLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommandLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommandLogMaxAggregateInputType
  }

  export type GetCommandLogAggregateType<T extends CommandLogAggregateArgs> = {
        [P in keyof T & keyof AggregateCommandLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCommandLog[P]>
      : GetScalarType<T[P], AggregateCommandLog[P]>
  }




  export type CommandLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommandLogWhereInput
    orderBy?: CommandLogOrderByWithAggregationInput | CommandLogOrderByWithAggregationInput[]
    by: CommandLogScalarFieldEnum[] | CommandLogScalarFieldEnum
    having?: CommandLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommandLogCountAggregateInputType | true
    _avg?: CommandLogAvgAggregateInputType
    _sum?: CommandLogSumAggregateInputType
    _min?: CommandLogMinAggregateInputType
    _max?: CommandLogMaxAggregateInputType
  }

  export type CommandLogGroupByOutputType = {
    id: string
    command: string
    output: string | null
    exitCode: number | null
    duration: number | null
    createdAt: Date
    safetyLevel: string
    metadata: string | null
    userId: string
    sshConnectionId: string | null
    _count: CommandLogCountAggregateOutputType | null
    _avg: CommandLogAvgAggregateOutputType | null
    _sum: CommandLogSumAggregateOutputType | null
    _min: CommandLogMinAggregateOutputType | null
    _max: CommandLogMaxAggregateOutputType | null
  }

  type GetCommandLogGroupByPayload<T extends CommandLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommandLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommandLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommandLogGroupByOutputType[P]>
            : GetScalarType<T[P], CommandLogGroupByOutputType[P]>
        }
      >
    >


  export type CommandLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    command?: boolean
    output?: boolean
    exitCode?: boolean
    duration?: boolean
    createdAt?: boolean
    safetyLevel?: boolean
    metadata?: boolean
    userId?: boolean
    sshConnectionId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    sshConnection?: boolean | CommandLog$sshConnectionArgs<ExtArgs>
  }, ExtArgs["result"]["commandLog"]>

  export type CommandLogSelectScalar = {
    id?: boolean
    command?: boolean
    output?: boolean
    exitCode?: boolean
    duration?: boolean
    createdAt?: boolean
    safetyLevel?: boolean
    metadata?: boolean
    userId?: boolean
    sshConnectionId?: boolean
  }

  export type CommandLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    sshConnection?: boolean | CommandLog$sshConnectionArgs<ExtArgs>
  }


  export type $CommandLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CommandLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      sshConnection: Prisma.$SSHConnectionPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      command: string
      output: string | null
      exitCode: number | null
      duration: number | null
      createdAt: Date
      safetyLevel: string
      metadata: string | null
      userId: string
      sshConnectionId: string | null
    }, ExtArgs["result"]["commandLog"]>
    composites: {}
  }


  type CommandLogGetPayload<S extends boolean | null | undefined | CommandLogDefaultArgs> = $Result.GetResult<Prisma.$CommandLogPayload, S>

  type CommandLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CommandLogFindManyArgs, 'select' | 'include' | 'distinct' > & {
      select?: CommandLogCountAggregateInputType | true
    }

  export interface CommandLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CommandLog'], meta: { name: 'CommandLog' } }
    /**
     * Find zero or one CommandLog that matches the filter.
     * @param {CommandLogFindUniqueArgs} args - Arguments to find a CommandLog
     * @example
     * // Get one CommandLog
     * const commandLog = await prisma.commandLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends CommandLogFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, CommandLogFindUniqueArgs<ExtArgs>>
    ): Prisma__CommandLogClient<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one CommandLog that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {CommandLogFindUniqueOrThrowArgs} args - Arguments to find a CommandLog
     * @example
     * // Get one CommandLog
     * const commandLog = await prisma.commandLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends CommandLogFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, CommandLogFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__CommandLogClient<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first CommandLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommandLogFindFirstArgs} args - Arguments to find a CommandLog
     * @example
     * // Get one CommandLog
     * const commandLog = await prisma.commandLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends CommandLogFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, CommandLogFindFirstArgs<ExtArgs>>
    ): Prisma__CommandLogClient<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first CommandLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommandLogFindFirstOrThrowArgs} args - Arguments to find a CommandLog
     * @example
     * // Get one CommandLog
     * const commandLog = await prisma.commandLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends CommandLogFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, CommandLogFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__CommandLogClient<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more CommandLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommandLogFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CommandLogs
     * const commandLogs = await prisma.commandLog.findMany()
     * 
     * // Get first 10 CommandLogs
     * const commandLogs = await prisma.commandLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const commandLogWithIdOnly = await prisma.commandLog.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends CommandLogFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CommandLogFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a CommandLog.
     * @param {CommandLogCreateArgs} args - Arguments to create a CommandLog.
     * @example
     * // Create one CommandLog
     * const CommandLog = await prisma.commandLog.create({
     *   data: {
     *     // ... data to create a CommandLog
     *   }
     * })
     * 
    **/
    create<T extends CommandLogCreateArgs<ExtArgs>>(
      args: SelectSubset<T, CommandLogCreateArgs<ExtArgs>>
    ): Prisma__CommandLogClient<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Delete a CommandLog.
     * @param {CommandLogDeleteArgs} args - Arguments to delete one CommandLog.
     * @example
     * // Delete one CommandLog
     * const CommandLog = await prisma.commandLog.delete({
     *   where: {
     *     // ... filter to delete one CommandLog
     *   }
     * })
     * 
    **/
    delete<T extends CommandLogDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, CommandLogDeleteArgs<ExtArgs>>
    ): Prisma__CommandLogClient<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one CommandLog.
     * @param {CommandLogUpdateArgs} args - Arguments to update one CommandLog.
     * @example
     * // Update one CommandLog
     * const commandLog = await prisma.commandLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends CommandLogUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, CommandLogUpdateArgs<ExtArgs>>
    ): Prisma__CommandLogClient<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more CommandLogs.
     * @param {CommandLogDeleteManyArgs} args - Arguments to filter CommandLogs to delete.
     * @example
     * // Delete a few CommandLogs
     * const { count } = await prisma.commandLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends CommandLogDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CommandLogDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CommandLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommandLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CommandLogs
     * const commandLog = await prisma.commandLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends CommandLogUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, CommandLogUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CommandLog.
     * @param {CommandLogUpsertArgs} args - Arguments to update or create a CommandLog.
     * @example
     * // Update or create a CommandLog
     * const commandLog = await prisma.commandLog.upsert({
     *   create: {
     *     // ... data to create a CommandLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CommandLog we want to update
     *   }
     * })
    **/
    upsert<T extends CommandLogUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, CommandLogUpsertArgs<ExtArgs>>
    ): Prisma__CommandLogClient<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of CommandLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommandLogCountArgs} args - Arguments to filter CommandLogs to count.
     * @example
     * // Count the number of CommandLogs
     * const count = await prisma.commandLog.count({
     *   where: {
     *     // ... the filter for the CommandLogs we want to count
     *   }
     * })
    **/
    count<T extends CommandLogCountArgs>(
      args?: Subset<T, CommandLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommandLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CommandLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommandLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CommandLogAggregateArgs>(args: Subset<T, CommandLogAggregateArgs>): Prisma.PrismaPromise<GetCommandLogAggregateType<T>>

    /**
     * Group by CommandLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommandLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CommandLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommandLogGroupByArgs['orderBy'] }
        : { orderBy?: CommandLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CommandLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommandLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CommandLog model
   */
  readonly fields: CommandLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CommandLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommandLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    sshConnection<T extends CommandLog$sshConnectionArgs<ExtArgs> = {}>(args?: Subset<T, CommandLog$sshConnectionArgs<ExtArgs>>): Prisma__SSHConnectionClient<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, 'findUniqueOrThrow'> | null, null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the CommandLog model
   */ 
  interface CommandLogFieldRefs {
    readonly id: FieldRef<"CommandLog", 'String'>
    readonly command: FieldRef<"CommandLog", 'String'>
    readonly output: FieldRef<"CommandLog", 'String'>
    readonly exitCode: FieldRef<"CommandLog", 'Int'>
    readonly duration: FieldRef<"CommandLog", 'Int'>
    readonly createdAt: FieldRef<"CommandLog", 'DateTime'>
    readonly safetyLevel: FieldRef<"CommandLog", 'String'>
    readonly metadata: FieldRef<"CommandLog", 'String'>
    readonly userId: FieldRef<"CommandLog", 'String'>
    readonly sshConnectionId: FieldRef<"CommandLog", 'String'>
  }
    

  // Custom InputTypes

  /**
   * CommandLog findUnique
   */
  export type CommandLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommandLog
     */
    select?: CommandLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CommandLogInclude<ExtArgs> | null
    /**
     * Filter, which CommandLog to fetch.
     */
    where: CommandLogWhereUniqueInput
  }


  /**
   * CommandLog findUniqueOrThrow
   */
  export type CommandLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommandLog
     */
    select?: CommandLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CommandLogInclude<ExtArgs> | null
    /**
     * Filter, which CommandLog to fetch.
     */
    where: CommandLogWhereUniqueInput
  }


  /**
   * CommandLog findFirst
   */
  export type CommandLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommandLog
     */
    select?: CommandLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CommandLogInclude<ExtArgs> | null
    /**
     * Filter, which CommandLog to fetch.
     */
    where?: CommandLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommandLogs to fetch.
     */
    orderBy?: CommandLogOrderByWithRelationInput | CommandLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommandLogs.
     */
    cursor?: CommandLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommandLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommandLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommandLogs.
     */
    distinct?: CommandLogScalarFieldEnum | CommandLogScalarFieldEnum[]
  }


  /**
   * CommandLog findFirstOrThrow
   */
  export type CommandLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommandLog
     */
    select?: CommandLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CommandLogInclude<ExtArgs> | null
    /**
     * Filter, which CommandLog to fetch.
     */
    where?: CommandLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommandLogs to fetch.
     */
    orderBy?: CommandLogOrderByWithRelationInput | CommandLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommandLogs.
     */
    cursor?: CommandLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommandLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommandLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommandLogs.
     */
    distinct?: CommandLogScalarFieldEnum | CommandLogScalarFieldEnum[]
  }


  /**
   * CommandLog findMany
   */
  export type CommandLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommandLog
     */
    select?: CommandLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CommandLogInclude<ExtArgs> | null
    /**
     * Filter, which CommandLogs to fetch.
     */
    where?: CommandLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommandLogs to fetch.
     */
    orderBy?: CommandLogOrderByWithRelationInput | CommandLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CommandLogs.
     */
    cursor?: CommandLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommandLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommandLogs.
     */
    skip?: number
    distinct?: CommandLogScalarFieldEnum | CommandLogScalarFieldEnum[]
  }


  /**
   * CommandLog create
   */
  export type CommandLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommandLog
     */
    select?: CommandLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CommandLogInclude<ExtArgs> | null
    /**
     * The data needed to create a CommandLog.
     */
    data: XOR<CommandLogCreateInput, CommandLogUncheckedCreateInput>
  }


  /**
   * CommandLog update
   */
  export type CommandLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommandLog
     */
    select?: CommandLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CommandLogInclude<ExtArgs> | null
    /**
     * The data needed to update a CommandLog.
     */
    data: XOR<CommandLogUpdateInput, CommandLogUncheckedUpdateInput>
    /**
     * Choose, which CommandLog to update.
     */
    where: CommandLogWhereUniqueInput
  }


  /**
   * CommandLog updateMany
   */
  export type CommandLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CommandLogs.
     */
    data: XOR<CommandLogUpdateManyMutationInput, CommandLogUncheckedUpdateManyInput>
    /**
     * Filter which CommandLogs to update
     */
    where?: CommandLogWhereInput
  }


  /**
   * CommandLog upsert
   */
  export type CommandLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommandLog
     */
    select?: CommandLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CommandLogInclude<ExtArgs> | null
    /**
     * The filter to search for the CommandLog to update in case it exists.
     */
    where: CommandLogWhereUniqueInput
    /**
     * In case the CommandLog found by the `where` argument doesn't exist, create a new CommandLog with this data.
     */
    create: XOR<CommandLogCreateInput, CommandLogUncheckedCreateInput>
    /**
     * In case the CommandLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommandLogUpdateInput, CommandLogUncheckedUpdateInput>
  }


  /**
   * CommandLog delete
   */
  export type CommandLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommandLog
     */
    select?: CommandLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CommandLogInclude<ExtArgs> | null
    /**
     * Filter which CommandLog to delete.
     */
    where: CommandLogWhereUniqueInput
  }


  /**
   * CommandLog deleteMany
   */
  export type CommandLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommandLogs to delete
     */
    where?: CommandLogWhereInput
  }


  /**
   * CommandLog.sshConnection
   */
  export type CommandLog$sshConnectionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHConnection
     */
    select?: SSHConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SSHConnectionInclude<ExtArgs> | null
    where?: SSHConnectionWhereInput
  }


  /**
   * CommandLog without action
   */
  export type CommandLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommandLog
     */
    select?: CommandLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CommandLogInclude<ExtArgs> | null
  }



  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    email: 'email',
    username: 'username',
    password: 'password',
    avatar: 'avatar',
    role: 'role',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const UserSettingsScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    data: 'data',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserSettingsScalarFieldEnum = (typeof UserSettingsScalarFieldEnum)[keyof typeof UserSettingsScalarFieldEnum]


  export const SSHFolderScalarFieldEnum: {
    id: 'id',
    name: 'name',
    order: 'order',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    parentId: 'parentId',
    userId: 'userId'
  };

  export type SSHFolderScalarFieldEnum = (typeof SSHFolderScalarFieldEnum)[keyof typeof SSHFolderScalarFieldEnum]


  export const SSHConnectionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    host: 'host',
    port: 'port',
    username: 'username',
    order: 'order',
    authType: 'authType',
    password: 'password',
    privateKey: 'privateKey',
    publicKey: 'publicKey',
    passphrase: 'passphrase',
    status: 'status',
    lastUsed: 'lastUsed',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    meta: 'meta',
    folderId: 'folderId',
    userId: 'userId'
  };

  export type SSHConnectionScalarFieldEnum = (typeof SSHConnectionScalarFieldEnum)[keyof typeof SSHConnectionScalarFieldEnum]


  export const CommandLogScalarFieldEnum: {
    id: 'id',
    command: 'command',
    output: 'output',
    exitCode: 'exitCode',
    duration: 'duration',
    createdAt: 'createdAt',
    safetyLevel: 'safetyLevel',
    metadata: 'metadata',
    userId: 'userId',
    sshConnectionId: 'sshConnectionId'
  };

  export type CommandLogScalarFieldEnum = (typeof CommandLogScalarFieldEnum)[keyof typeof CommandLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    uuid?: StringFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    username?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sshFolders?: SSHFolderListRelationFilter
    sshConnections?: SSHConnectionListRelationFilter
    commandLogs?: CommandLogListRelationFilter
    userSettings?: XOR<UserSettingsNullableRelationFilter, UserSettingsWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    email?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sshFolders?: SSHFolderOrderByRelationAggregateInput
    sshConnections?: SSHConnectionOrderByRelationAggregateInput
    commandLogs?: CommandLogOrderByRelationAggregateInput
    userSettings?: UserSettingsOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    uuid?: string
    email?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sshFolders?: SSHFolderListRelationFilter
    sshConnections?: SSHConnectionListRelationFilter
    commandLogs?: CommandLogListRelationFilter
    userSettings?: XOR<UserSettingsNullableRelationFilter, UserSettingsWhereInput> | null
  }, "id" | "uuid" | "email" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    email?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    uuid?: StringWithAggregatesFilter<"User"> | string
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    username?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringWithAggregatesFilter<"User"> | string
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type UserSettingsWhereInput = {
    AND?: UserSettingsWhereInput | UserSettingsWhereInput[]
    OR?: UserSettingsWhereInput[]
    NOT?: UserSettingsWhereInput | UserSettingsWhereInput[]
    id?: StringFilter<"UserSettings"> | string
    userId?: StringFilter<"UserSettings"> | string
    data?: StringFilter<"UserSettings"> | string
    createdAt?: DateTimeFilter<"UserSettings"> | Date | string
    updatedAt?: DateTimeFilter<"UserSettings"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type UserSettingsOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserSettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserSettingsWhereInput | UserSettingsWhereInput[]
    OR?: UserSettingsWhereInput[]
    NOT?: UserSettingsWhereInput | UserSettingsWhereInput[]
    data?: StringFilter<"UserSettings"> | string
    createdAt?: DateTimeFilter<"UserSettings"> | Date | string
    updatedAt?: DateTimeFilter<"UserSettings"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type UserSettingsOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserSettingsCountOrderByAggregateInput
    _max?: UserSettingsMaxOrderByAggregateInput
    _min?: UserSettingsMinOrderByAggregateInput
  }

  export type UserSettingsScalarWhereWithAggregatesInput = {
    AND?: UserSettingsScalarWhereWithAggregatesInput | UserSettingsScalarWhereWithAggregatesInput[]
    OR?: UserSettingsScalarWhereWithAggregatesInput[]
    NOT?: UserSettingsScalarWhereWithAggregatesInput | UserSettingsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserSettings"> | string
    userId?: StringWithAggregatesFilter<"UserSettings"> | string
    data?: StringWithAggregatesFilter<"UserSettings"> | string
    createdAt?: DateTimeWithAggregatesFilter<"UserSettings"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserSettings"> | Date | string
  }

  export type SSHFolderWhereInput = {
    AND?: SSHFolderWhereInput | SSHFolderWhereInput[]
    OR?: SSHFolderWhereInput[]
    NOT?: SSHFolderWhereInput | SSHFolderWhereInput[]
    id?: StringFilter<"SSHFolder"> | string
    name?: StringFilter<"SSHFolder"> | string
    order?: IntFilter<"SSHFolder"> | number
    isActive?: BoolFilter<"SSHFolder"> | boolean
    createdAt?: DateTimeFilter<"SSHFolder"> | Date | string
    updatedAt?: DateTimeFilter<"SSHFolder"> | Date | string
    parentId?: StringNullableFilter<"SSHFolder"> | string | null
    userId?: StringFilter<"SSHFolder"> | string
    parent?: XOR<SSHFolderNullableRelationFilter, SSHFolderWhereInput> | null
    children?: SSHFolderListRelationFilter
    user?: XOR<UserRelationFilter, UserWhereInput>
    connections?: SSHConnectionListRelationFilter
  }

  export type SSHFolderOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    order?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    parentId?: SortOrderInput | SortOrder
    userId?: SortOrder
    parent?: SSHFolderOrderByWithRelationInput
    children?: SSHFolderOrderByRelationAggregateInput
    user?: UserOrderByWithRelationInput
    connections?: SSHConnectionOrderByRelationAggregateInput
  }

  export type SSHFolderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SSHFolderWhereInput | SSHFolderWhereInput[]
    OR?: SSHFolderWhereInput[]
    NOT?: SSHFolderWhereInput | SSHFolderWhereInput[]
    name?: StringFilter<"SSHFolder"> | string
    order?: IntFilter<"SSHFolder"> | number
    isActive?: BoolFilter<"SSHFolder"> | boolean
    createdAt?: DateTimeFilter<"SSHFolder"> | Date | string
    updatedAt?: DateTimeFilter<"SSHFolder"> | Date | string
    parentId?: StringNullableFilter<"SSHFolder"> | string | null
    userId?: StringFilter<"SSHFolder"> | string
    parent?: XOR<SSHFolderNullableRelationFilter, SSHFolderWhereInput> | null
    children?: SSHFolderListRelationFilter
    user?: XOR<UserRelationFilter, UserWhereInput>
    connections?: SSHConnectionListRelationFilter
  }, "id">

  export type SSHFolderOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    order?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    parentId?: SortOrderInput | SortOrder
    userId?: SortOrder
    _count?: SSHFolderCountOrderByAggregateInput
    _avg?: SSHFolderAvgOrderByAggregateInput
    _max?: SSHFolderMaxOrderByAggregateInput
    _min?: SSHFolderMinOrderByAggregateInput
    _sum?: SSHFolderSumOrderByAggregateInput
  }

  export type SSHFolderScalarWhereWithAggregatesInput = {
    AND?: SSHFolderScalarWhereWithAggregatesInput | SSHFolderScalarWhereWithAggregatesInput[]
    OR?: SSHFolderScalarWhereWithAggregatesInput[]
    NOT?: SSHFolderScalarWhereWithAggregatesInput | SSHFolderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SSHFolder"> | string
    name?: StringWithAggregatesFilter<"SSHFolder"> | string
    order?: IntWithAggregatesFilter<"SSHFolder"> | number
    isActive?: BoolWithAggregatesFilter<"SSHFolder"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"SSHFolder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SSHFolder"> | Date | string
    parentId?: StringNullableWithAggregatesFilter<"SSHFolder"> | string | null
    userId?: StringWithAggregatesFilter<"SSHFolder"> | string
  }

  export type SSHConnectionWhereInput = {
    AND?: SSHConnectionWhereInput | SSHConnectionWhereInput[]
    OR?: SSHConnectionWhereInput[]
    NOT?: SSHConnectionWhereInput | SSHConnectionWhereInput[]
    id?: StringFilter<"SSHConnection"> | string
    name?: StringFilter<"SSHConnection"> | string
    host?: StringFilter<"SSHConnection"> | string
    port?: IntFilter<"SSHConnection"> | number
    username?: StringFilter<"SSHConnection"> | string
    order?: IntFilter<"SSHConnection"> | number
    authType?: StringFilter<"SSHConnection"> | string
    password?: StringNullableFilter<"SSHConnection"> | string | null
    privateKey?: StringNullableFilter<"SSHConnection"> | string | null
    publicKey?: StringNullableFilter<"SSHConnection"> | string | null
    passphrase?: StringNullableFilter<"SSHConnection"> | string | null
    status?: StringFilter<"SSHConnection"> | string
    lastUsed?: DateTimeNullableFilter<"SSHConnection"> | Date | string | null
    isActive?: BoolFilter<"SSHConnection"> | boolean
    createdAt?: DateTimeFilter<"SSHConnection"> | Date | string
    updatedAt?: DateTimeFilter<"SSHConnection"> | Date | string
    meta?: StringNullableFilter<"SSHConnection"> | string | null
    folderId?: StringNullableFilter<"SSHConnection"> | string | null
    userId?: StringFilter<"SSHConnection"> | string
    folder?: XOR<SSHFolderNullableRelationFilter, SSHFolderWhereInput> | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    commandLogs?: CommandLogListRelationFilter
  }

  export type SSHConnectionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    order?: SortOrder
    authType?: SortOrder
    password?: SortOrderInput | SortOrder
    privateKey?: SortOrderInput | SortOrder
    publicKey?: SortOrderInput | SortOrder
    passphrase?: SortOrderInput | SortOrder
    status?: SortOrder
    lastUsed?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    meta?: SortOrderInput | SortOrder
    folderId?: SortOrderInput | SortOrder
    userId?: SortOrder
    folder?: SSHFolderOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    commandLogs?: CommandLogOrderByRelationAggregateInput
  }

  export type SSHConnectionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SSHConnectionWhereInput | SSHConnectionWhereInput[]
    OR?: SSHConnectionWhereInput[]
    NOT?: SSHConnectionWhereInput | SSHConnectionWhereInput[]
    name?: StringFilter<"SSHConnection"> | string
    host?: StringFilter<"SSHConnection"> | string
    port?: IntFilter<"SSHConnection"> | number
    username?: StringFilter<"SSHConnection"> | string
    order?: IntFilter<"SSHConnection"> | number
    authType?: StringFilter<"SSHConnection"> | string
    password?: StringNullableFilter<"SSHConnection"> | string | null
    privateKey?: StringNullableFilter<"SSHConnection"> | string | null
    publicKey?: StringNullableFilter<"SSHConnection"> | string | null
    passphrase?: StringNullableFilter<"SSHConnection"> | string | null
    status?: StringFilter<"SSHConnection"> | string
    lastUsed?: DateTimeNullableFilter<"SSHConnection"> | Date | string | null
    isActive?: BoolFilter<"SSHConnection"> | boolean
    createdAt?: DateTimeFilter<"SSHConnection"> | Date | string
    updatedAt?: DateTimeFilter<"SSHConnection"> | Date | string
    meta?: StringNullableFilter<"SSHConnection"> | string | null
    folderId?: StringNullableFilter<"SSHConnection"> | string | null
    userId?: StringFilter<"SSHConnection"> | string
    folder?: XOR<SSHFolderNullableRelationFilter, SSHFolderWhereInput> | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    commandLogs?: CommandLogListRelationFilter
  }, "id">

  export type SSHConnectionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    order?: SortOrder
    authType?: SortOrder
    password?: SortOrderInput | SortOrder
    privateKey?: SortOrderInput | SortOrder
    publicKey?: SortOrderInput | SortOrder
    passphrase?: SortOrderInput | SortOrder
    status?: SortOrder
    lastUsed?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    meta?: SortOrderInput | SortOrder
    folderId?: SortOrderInput | SortOrder
    userId?: SortOrder
    _count?: SSHConnectionCountOrderByAggregateInput
    _avg?: SSHConnectionAvgOrderByAggregateInput
    _max?: SSHConnectionMaxOrderByAggregateInput
    _min?: SSHConnectionMinOrderByAggregateInput
    _sum?: SSHConnectionSumOrderByAggregateInput
  }

  export type SSHConnectionScalarWhereWithAggregatesInput = {
    AND?: SSHConnectionScalarWhereWithAggregatesInput | SSHConnectionScalarWhereWithAggregatesInput[]
    OR?: SSHConnectionScalarWhereWithAggregatesInput[]
    NOT?: SSHConnectionScalarWhereWithAggregatesInput | SSHConnectionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SSHConnection"> | string
    name?: StringWithAggregatesFilter<"SSHConnection"> | string
    host?: StringWithAggregatesFilter<"SSHConnection"> | string
    port?: IntWithAggregatesFilter<"SSHConnection"> | number
    username?: StringWithAggregatesFilter<"SSHConnection"> | string
    order?: IntWithAggregatesFilter<"SSHConnection"> | number
    authType?: StringWithAggregatesFilter<"SSHConnection"> | string
    password?: StringNullableWithAggregatesFilter<"SSHConnection"> | string | null
    privateKey?: StringNullableWithAggregatesFilter<"SSHConnection"> | string | null
    publicKey?: StringNullableWithAggregatesFilter<"SSHConnection"> | string | null
    passphrase?: StringNullableWithAggregatesFilter<"SSHConnection"> | string | null
    status?: StringWithAggregatesFilter<"SSHConnection"> | string
    lastUsed?: DateTimeNullableWithAggregatesFilter<"SSHConnection"> | Date | string | null
    isActive?: BoolWithAggregatesFilter<"SSHConnection"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"SSHConnection"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SSHConnection"> | Date | string
    meta?: StringNullableWithAggregatesFilter<"SSHConnection"> | string | null
    folderId?: StringNullableWithAggregatesFilter<"SSHConnection"> | string | null
    userId?: StringWithAggregatesFilter<"SSHConnection"> | string
  }

  export type CommandLogWhereInput = {
    AND?: CommandLogWhereInput | CommandLogWhereInput[]
    OR?: CommandLogWhereInput[]
    NOT?: CommandLogWhereInput | CommandLogWhereInput[]
    id?: StringFilter<"CommandLog"> | string
    command?: StringFilter<"CommandLog"> | string
    output?: StringNullableFilter<"CommandLog"> | string | null
    exitCode?: IntNullableFilter<"CommandLog"> | number | null
    duration?: IntNullableFilter<"CommandLog"> | number | null
    createdAt?: DateTimeFilter<"CommandLog"> | Date | string
    safetyLevel?: StringFilter<"CommandLog"> | string
    metadata?: StringNullableFilter<"CommandLog"> | string | null
    userId?: StringFilter<"CommandLog"> | string
    sshConnectionId?: StringNullableFilter<"CommandLog"> | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    sshConnection?: XOR<SSHConnectionNullableRelationFilter, SSHConnectionWhereInput> | null
  }

  export type CommandLogOrderByWithRelationInput = {
    id?: SortOrder
    command?: SortOrder
    output?: SortOrderInput | SortOrder
    exitCode?: SortOrderInput | SortOrder
    duration?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    safetyLevel?: SortOrder
    metadata?: SortOrderInput | SortOrder
    userId?: SortOrder
    sshConnectionId?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    sshConnection?: SSHConnectionOrderByWithRelationInput
  }

  export type CommandLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CommandLogWhereInput | CommandLogWhereInput[]
    OR?: CommandLogWhereInput[]
    NOT?: CommandLogWhereInput | CommandLogWhereInput[]
    command?: StringFilter<"CommandLog"> | string
    output?: StringNullableFilter<"CommandLog"> | string | null
    exitCode?: IntNullableFilter<"CommandLog"> | number | null
    duration?: IntNullableFilter<"CommandLog"> | number | null
    createdAt?: DateTimeFilter<"CommandLog"> | Date | string
    safetyLevel?: StringFilter<"CommandLog"> | string
    metadata?: StringNullableFilter<"CommandLog"> | string | null
    userId?: StringFilter<"CommandLog"> | string
    sshConnectionId?: StringNullableFilter<"CommandLog"> | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    sshConnection?: XOR<SSHConnectionNullableRelationFilter, SSHConnectionWhereInput> | null
  }, "id">

  export type CommandLogOrderByWithAggregationInput = {
    id?: SortOrder
    command?: SortOrder
    output?: SortOrderInput | SortOrder
    exitCode?: SortOrderInput | SortOrder
    duration?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    safetyLevel?: SortOrder
    metadata?: SortOrderInput | SortOrder
    userId?: SortOrder
    sshConnectionId?: SortOrderInput | SortOrder
    _count?: CommandLogCountOrderByAggregateInput
    _avg?: CommandLogAvgOrderByAggregateInput
    _max?: CommandLogMaxOrderByAggregateInput
    _min?: CommandLogMinOrderByAggregateInput
    _sum?: CommandLogSumOrderByAggregateInput
  }

  export type CommandLogScalarWhereWithAggregatesInput = {
    AND?: CommandLogScalarWhereWithAggregatesInput | CommandLogScalarWhereWithAggregatesInput[]
    OR?: CommandLogScalarWhereWithAggregatesInput[]
    NOT?: CommandLogScalarWhereWithAggregatesInput | CommandLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CommandLog"> | string
    command?: StringWithAggregatesFilter<"CommandLog"> | string
    output?: StringNullableWithAggregatesFilter<"CommandLog"> | string | null
    exitCode?: IntNullableWithAggregatesFilter<"CommandLog"> | number | null
    duration?: IntNullableWithAggregatesFilter<"CommandLog"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"CommandLog"> | Date | string
    safetyLevel?: StringWithAggregatesFilter<"CommandLog"> | string
    metadata?: StringNullableWithAggregatesFilter<"CommandLog"> | string | null
    userId?: StringWithAggregatesFilter<"CommandLog"> | string
    sshConnectionId?: StringNullableWithAggregatesFilter<"CommandLog"> | string | null
  }

  export type UserCreateInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshFolders?: SSHFolderCreateNestedManyWithoutUserInput
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshFolders?: SSHFolderUncheckedCreateNestedManyWithoutUserInput
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshFolders?: SSHFolderUpdateManyWithoutUserNestedInput
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshFolders?: SSHFolderUncheckedUpdateManyWithoutUserNestedInput
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUncheckedUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSettingsCreateInput = {
    id?: string
    data: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutUserSettingsInput
  }

  export type UserSettingsUncheckedCreateInput = {
    id?: string
    userId: string
    data: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUserSettingsNestedInput
  }

  export type UserSettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SSHFolderCreateInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: SSHFolderCreateNestedOneWithoutChildrenInput
    children?: SSHFolderCreateNestedManyWithoutParentInput
    user: UserCreateNestedOneWithoutSshFoldersInput
    connections?: SSHConnectionCreateNestedManyWithoutFolderInput
  }

  export type SSHFolderUncheckedCreateInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parentId?: string | null
    userId: string
    children?: SSHFolderUncheckedCreateNestedManyWithoutParentInput
    connections?: SSHConnectionUncheckedCreateNestedManyWithoutFolderInput
  }

  export type SSHFolderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: SSHFolderUpdateOneWithoutChildrenNestedInput
    children?: SSHFolderUpdateManyWithoutParentNestedInput
    user?: UserUpdateOneRequiredWithoutSshFoldersNestedInput
    connections?: SSHConnectionUpdateManyWithoutFolderNestedInput
  }

  export type SSHFolderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    children?: SSHFolderUncheckedUpdateManyWithoutParentNestedInput
    connections?: SSHConnectionUncheckedUpdateManyWithoutFolderNestedInput
  }

  export type SSHFolderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SSHFolderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type SSHConnectionCreateInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
    order?: number
    authType: string
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: string
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: string | null
    folder?: SSHFolderCreateNestedOneWithoutConnectionsInput
    user: UserCreateNestedOneWithoutSshConnectionsInput
    commandLogs?: CommandLogCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionUncheckedCreateInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
    order?: number
    authType: string
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: string
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: string | null
    folderId?: string | null
    userId: string
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    folder?: SSHFolderUpdateOneWithoutConnectionsNestedInput
    user?: UserUpdateOneRequiredWithoutSshConnectionsNestedInput
    commandLogs?: CommandLogUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    commandLogs?: CommandLogUncheckedUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SSHConnectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type CommandLogCreateInput = {
    id?: string
    command: string
    output?: string | null
    exitCode?: number | null
    duration?: number | null
    createdAt?: Date | string
    safetyLevel?: string
    metadata?: string | null
    user: UserCreateNestedOneWithoutCommandLogsInput
    sshConnection?: SSHConnectionCreateNestedOneWithoutCommandLogsInput
  }

  export type CommandLogUncheckedCreateInput = {
    id?: string
    command: string
    output?: string | null
    exitCode?: number | null
    duration?: number | null
    createdAt?: Date | string
    safetyLevel?: string
    metadata?: string | null
    userId: string
    sshConnectionId?: string | null
  }

  export type CommandLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    exitCode?: NullableIntFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    safetyLevel?: StringFieldUpdateOperationsInput | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutCommandLogsNestedInput
    sshConnection?: SSHConnectionUpdateOneWithoutCommandLogsNestedInput
  }

  export type CommandLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    exitCode?: NullableIntFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    safetyLevel?: StringFieldUpdateOperationsInput | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    sshConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommandLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    exitCode?: NullableIntFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    safetyLevel?: StringFieldUpdateOperationsInput | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommandLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    exitCode?: NullableIntFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    safetyLevel?: StringFieldUpdateOperationsInput | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    sshConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SSHFolderListRelationFilter = {
    every?: SSHFolderWhereInput
    some?: SSHFolderWhereInput
    none?: SSHFolderWhereInput
  }

  export type SSHConnectionListRelationFilter = {
    every?: SSHConnectionWhereInput
    some?: SSHConnectionWhereInput
    none?: SSHConnectionWhereInput
  }

  export type CommandLogListRelationFilter = {
    every?: CommandLogWhereInput
    some?: CommandLogWhereInput
    none?: CommandLogWhereInput
  }

  export type UserSettingsNullableRelationFilter = {
    is?: UserSettingsWhereInput | null
    isNot?: UserSettingsWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SSHFolderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SSHConnectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CommandLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    email?: SortOrder
    username?: SortOrder
    password?: SortOrder
    avatar?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    email?: SortOrder
    username?: SortOrder
    password?: SortOrder
    avatar?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    email?: SortOrder
    username?: SortOrder
    password?: SortOrder
    avatar?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserSettingsCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSettingsMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type SSHFolderNullableRelationFilter = {
    is?: SSHFolderWhereInput | null
    isNot?: SSHFolderWhereInput | null
  }

  export type SSHFolderCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    order?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    parentId?: SortOrder
    userId?: SortOrder
  }

  export type SSHFolderAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type SSHFolderMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    order?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    parentId?: SortOrder
    userId?: SortOrder
  }

  export type SSHFolderMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    order?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    parentId?: SortOrder
    userId?: SortOrder
  }

  export type SSHFolderSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SSHConnectionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    order?: SortOrder
    authType?: SortOrder
    password?: SortOrder
    privateKey?: SortOrder
    publicKey?: SortOrder
    passphrase?: SortOrder
    status?: SortOrder
    lastUsed?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    meta?: SortOrder
    folderId?: SortOrder
    userId?: SortOrder
  }

  export type SSHConnectionAvgOrderByAggregateInput = {
    port?: SortOrder
    order?: SortOrder
  }

  export type SSHConnectionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    order?: SortOrder
    authType?: SortOrder
    password?: SortOrder
    privateKey?: SortOrder
    publicKey?: SortOrder
    passphrase?: SortOrder
    status?: SortOrder
    lastUsed?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    meta?: SortOrder
    folderId?: SortOrder
    userId?: SortOrder
  }

  export type SSHConnectionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    order?: SortOrder
    authType?: SortOrder
    password?: SortOrder
    privateKey?: SortOrder
    publicKey?: SortOrder
    passphrase?: SortOrder
    status?: SortOrder
    lastUsed?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    meta?: SortOrder
    folderId?: SortOrder
    userId?: SortOrder
  }

  export type SSHConnectionSumOrderByAggregateInput = {
    port?: SortOrder
    order?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type SSHConnectionNullableRelationFilter = {
    is?: SSHConnectionWhereInput | null
    isNot?: SSHConnectionWhereInput | null
  }

  export type CommandLogCountOrderByAggregateInput = {
    id?: SortOrder
    command?: SortOrder
    output?: SortOrder
    exitCode?: SortOrder
    duration?: SortOrder
    createdAt?: SortOrder
    safetyLevel?: SortOrder
    metadata?: SortOrder
    userId?: SortOrder
    sshConnectionId?: SortOrder
  }

  export type CommandLogAvgOrderByAggregateInput = {
    exitCode?: SortOrder
    duration?: SortOrder
  }

  export type CommandLogMaxOrderByAggregateInput = {
    id?: SortOrder
    command?: SortOrder
    output?: SortOrder
    exitCode?: SortOrder
    duration?: SortOrder
    createdAt?: SortOrder
    safetyLevel?: SortOrder
    metadata?: SortOrder
    userId?: SortOrder
    sshConnectionId?: SortOrder
  }

  export type CommandLogMinOrderByAggregateInput = {
    id?: SortOrder
    command?: SortOrder
    output?: SortOrder
    exitCode?: SortOrder
    duration?: SortOrder
    createdAt?: SortOrder
    safetyLevel?: SortOrder
    metadata?: SortOrder
    userId?: SortOrder
    sshConnectionId?: SortOrder
  }

  export type CommandLogSumOrderByAggregateInput = {
    exitCode?: SortOrder
    duration?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type SSHFolderCreateNestedManyWithoutUserInput = {
    create?: XOR<SSHFolderCreateWithoutUserInput, SSHFolderUncheckedCreateWithoutUserInput> | SSHFolderCreateWithoutUserInput[] | SSHFolderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SSHFolderCreateOrConnectWithoutUserInput | SSHFolderCreateOrConnectWithoutUserInput[]
    connect?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
  }

  export type SSHConnectionCreateNestedManyWithoutUserInput = {
    create?: XOR<SSHConnectionCreateWithoutUserInput, SSHConnectionUncheckedCreateWithoutUserInput> | SSHConnectionCreateWithoutUserInput[] | SSHConnectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutUserInput | SSHConnectionCreateOrConnectWithoutUserInput[]
    connect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
  }

  export type CommandLogCreateNestedManyWithoutUserInput = {
    create?: XOR<CommandLogCreateWithoutUserInput, CommandLogUncheckedCreateWithoutUserInput> | CommandLogCreateWithoutUserInput[] | CommandLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommandLogCreateOrConnectWithoutUserInput | CommandLogCreateOrConnectWithoutUserInput[]
    connect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
  }

  export type UserSettingsCreateNestedOneWithoutUserInput = {
    create?: XOR<UserSettingsCreateWithoutUserInput, UserSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSettingsCreateOrConnectWithoutUserInput
    connect?: UserSettingsWhereUniqueInput
  }

  export type SSHFolderUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SSHFolderCreateWithoutUserInput, SSHFolderUncheckedCreateWithoutUserInput> | SSHFolderCreateWithoutUserInput[] | SSHFolderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SSHFolderCreateOrConnectWithoutUserInput | SSHFolderCreateOrConnectWithoutUserInput[]
    connect?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
  }

  export type SSHConnectionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SSHConnectionCreateWithoutUserInput, SSHConnectionUncheckedCreateWithoutUserInput> | SSHConnectionCreateWithoutUserInput[] | SSHConnectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutUserInput | SSHConnectionCreateOrConnectWithoutUserInput[]
    connect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
  }

  export type CommandLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CommandLogCreateWithoutUserInput, CommandLogUncheckedCreateWithoutUserInput> | CommandLogCreateWithoutUserInput[] | CommandLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommandLogCreateOrConnectWithoutUserInput | CommandLogCreateOrConnectWithoutUserInput[]
    connect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
  }

  export type UserSettingsUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UserSettingsCreateWithoutUserInput, UserSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSettingsCreateOrConnectWithoutUserInput
    connect?: UserSettingsWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SSHFolderUpdateManyWithoutUserNestedInput = {
    create?: XOR<SSHFolderCreateWithoutUserInput, SSHFolderUncheckedCreateWithoutUserInput> | SSHFolderCreateWithoutUserInput[] | SSHFolderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SSHFolderCreateOrConnectWithoutUserInput | SSHFolderCreateOrConnectWithoutUserInput[]
    upsert?: SSHFolderUpsertWithWhereUniqueWithoutUserInput | SSHFolderUpsertWithWhereUniqueWithoutUserInput[]
    set?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
    disconnect?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
    delete?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
    connect?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
    update?: SSHFolderUpdateWithWhereUniqueWithoutUserInput | SSHFolderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SSHFolderUpdateManyWithWhereWithoutUserInput | SSHFolderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SSHFolderScalarWhereInput | SSHFolderScalarWhereInput[]
  }

  export type SSHConnectionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SSHConnectionCreateWithoutUserInput, SSHConnectionUncheckedCreateWithoutUserInput> | SSHConnectionCreateWithoutUserInput[] | SSHConnectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutUserInput | SSHConnectionCreateOrConnectWithoutUserInput[]
    upsert?: SSHConnectionUpsertWithWhereUniqueWithoutUserInput | SSHConnectionUpsertWithWhereUniqueWithoutUserInput[]
    set?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    disconnect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    delete?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    connect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    update?: SSHConnectionUpdateWithWhereUniqueWithoutUserInput | SSHConnectionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SSHConnectionUpdateManyWithWhereWithoutUserInput | SSHConnectionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SSHConnectionScalarWhereInput | SSHConnectionScalarWhereInput[]
  }

  export type CommandLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommandLogCreateWithoutUserInput, CommandLogUncheckedCreateWithoutUserInput> | CommandLogCreateWithoutUserInput[] | CommandLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommandLogCreateOrConnectWithoutUserInput | CommandLogCreateOrConnectWithoutUserInput[]
    upsert?: CommandLogUpsertWithWhereUniqueWithoutUserInput | CommandLogUpsertWithWhereUniqueWithoutUserInput[]
    set?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    disconnect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    delete?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    connect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    update?: CommandLogUpdateWithWhereUniqueWithoutUserInput | CommandLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommandLogUpdateManyWithWhereWithoutUserInput | CommandLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommandLogScalarWhereInput | CommandLogScalarWhereInput[]
  }

  export type UserSettingsUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserSettingsCreateWithoutUserInput, UserSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSettingsCreateOrConnectWithoutUserInput
    upsert?: UserSettingsUpsertWithoutUserInput
    disconnect?: UserSettingsWhereInput | boolean
    delete?: UserSettingsWhereInput | boolean
    connect?: UserSettingsWhereUniqueInput
    update?: XOR<XOR<UserSettingsUpdateToOneWithWhereWithoutUserInput, UserSettingsUpdateWithoutUserInput>, UserSettingsUncheckedUpdateWithoutUserInput>
  }

  export type SSHFolderUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SSHFolderCreateWithoutUserInput, SSHFolderUncheckedCreateWithoutUserInput> | SSHFolderCreateWithoutUserInput[] | SSHFolderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SSHFolderCreateOrConnectWithoutUserInput | SSHFolderCreateOrConnectWithoutUserInput[]
    upsert?: SSHFolderUpsertWithWhereUniqueWithoutUserInput | SSHFolderUpsertWithWhereUniqueWithoutUserInput[]
    set?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
    disconnect?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
    delete?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
    connect?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
    update?: SSHFolderUpdateWithWhereUniqueWithoutUserInput | SSHFolderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SSHFolderUpdateManyWithWhereWithoutUserInput | SSHFolderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SSHFolderScalarWhereInput | SSHFolderScalarWhereInput[]
  }

  export type SSHConnectionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SSHConnectionCreateWithoutUserInput, SSHConnectionUncheckedCreateWithoutUserInput> | SSHConnectionCreateWithoutUserInput[] | SSHConnectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutUserInput | SSHConnectionCreateOrConnectWithoutUserInput[]
    upsert?: SSHConnectionUpsertWithWhereUniqueWithoutUserInput | SSHConnectionUpsertWithWhereUniqueWithoutUserInput[]
    set?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    disconnect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    delete?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    connect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    update?: SSHConnectionUpdateWithWhereUniqueWithoutUserInput | SSHConnectionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SSHConnectionUpdateManyWithWhereWithoutUserInput | SSHConnectionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SSHConnectionScalarWhereInput | SSHConnectionScalarWhereInput[]
  }

  export type CommandLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommandLogCreateWithoutUserInput, CommandLogUncheckedCreateWithoutUserInput> | CommandLogCreateWithoutUserInput[] | CommandLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommandLogCreateOrConnectWithoutUserInput | CommandLogCreateOrConnectWithoutUserInput[]
    upsert?: CommandLogUpsertWithWhereUniqueWithoutUserInput | CommandLogUpsertWithWhereUniqueWithoutUserInput[]
    set?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    disconnect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    delete?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    connect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    update?: CommandLogUpdateWithWhereUniqueWithoutUserInput | CommandLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommandLogUpdateManyWithWhereWithoutUserInput | CommandLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommandLogScalarWhereInput | CommandLogScalarWhereInput[]
  }

  export type UserSettingsUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserSettingsCreateWithoutUserInput, UserSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSettingsCreateOrConnectWithoutUserInput
    upsert?: UserSettingsUpsertWithoutUserInput
    disconnect?: UserSettingsWhereInput | boolean
    delete?: UserSettingsWhereInput | boolean
    connect?: UserSettingsWhereUniqueInput
    update?: XOR<XOR<UserSettingsUpdateToOneWithWhereWithoutUserInput, UserSettingsUpdateWithoutUserInput>, UserSettingsUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutUserSettingsInput = {
    create?: XOR<UserCreateWithoutUserSettingsInput, UserUncheckedCreateWithoutUserSettingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserSettingsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutUserSettingsNestedInput = {
    create?: XOR<UserCreateWithoutUserSettingsInput, UserUncheckedCreateWithoutUserSettingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserSettingsInput
    upsert?: UserUpsertWithoutUserSettingsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUserSettingsInput, UserUpdateWithoutUserSettingsInput>, UserUncheckedUpdateWithoutUserSettingsInput>
  }

  export type SSHFolderCreateNestedOneWithoutChildrenInput = {
    create?: XOR<SSHFolderCreateWithoutChildrenInput, SSHFolderUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: SSHFolderCreateOrConnectWithoutChildrenInput
    connect?: SSHFolderWhereUniqueInput
  }

  export type SSHFolderCreateNestedManyWithoutParentInput = {
    create?: XOR<SSHFolderCreateWithoutParentInput, SSHFolderUncheckedCreateWithoutParentInput> | SSHFolderCreateWithoutParentInput[] | SSHFolderUncheckedCreateWithoutParentInput[]
    connectOrCreate?: SSHFolderCreateOrConnectWithoutParentInput | SSHFolderCreateOrConnectWithoutParentInput[]
    connect?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutSshFoldersInput = {
    create?: XOR<UserCreateWithoutSshFoldersInput, UserUncheckedCreateWithoutSshFoldersInput>
    connectOrCreate?: UserCreateOrConnectWithoutSshFoldersInput
    connect?: UserWhereUniqueInput
  }

  export type SSHConnectionCreateNestedManyWithoutFolderInput = {
    create?: XOR<SSHConnectionCreateWithoutFolderInput, SSHConnectionUncheckedCreateWithoutFolderInput> | SSHConnectionCreateWithoutFolderInput[] | SSHConnectionUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutFolderInput | SSHConnectionCreateOrConnectWithoutFolderInput[]
    connect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
  }

  export type SSHFolderUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<SSHFolderCreateWithoutParentInput, SSHFolderUncheckedCreateWithoutParentInput> | SSHFolderCreateWithoutParentInput[] | SSHFolderUncheckedCreateWithoutParentInput[]
    connectOrCreate?: SSHFolderCreateOrConnectWithoutParentInput | SSHFolderCreateOrConnectWithoutParentInput[]
    connect?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
  }

  export type SSHConnectionUncheckedCreateNestedManyWithoutFolderInput = {
    create?: XOR<SSHConnectionCreateWithoutFolderInput, SSHConnectionUncheckedCreateWithoutFolderInput> | SSHConnectionCreateWithoutFolderInput[] | SSHConnectionUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutFolderInput | SSHConnectionCreateOrConnectWithoutFolderInput[]
    connect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SSHFolderUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<SSHFolderCreateWithoutChildrenInput, SSHFolderUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: SSHFolderCreateOrConnectWithoutChildrenInput
    upsert?: SSHFolderUpsertWithoutChildrenInput
    disconnect?: SSHFolderWhereInput | boolean
    delete?: SSHFolderWhereInput | boolean
    connect?: SSHFolderWhereUniqueInput
    update?: XOR<XOR<SSHFolderUpdateToOneWithWhereWithoutChildrenInput, SSHFolderUpdateWithoutChildrenInput>, SSHFolderUncheckedUpdateWithoutChildrenInput>
  }

  export type SSHFolderUpdateManyWithoutParentNestedInput = {
    create?: XOR<SSHFolderCreateWithoutParentInput, SSHFolderUncheckedCreateWithoutParentInput> | SSHFolderCreateWithoutParentInput[] | SSHFolderUncheckedCreateWithoutParentInput[]
    connectOrCreate?: SSHFolderCreateOrConnectWithoutParentInput | SSHFolderCreateOrConnectWithoutParentInput[]
    upsert?: SSHFolderUpsertWithWhereUniqueWithoutParentInput | SSHFolderUpsertWithWhereUniqueWithoutParentInput[]
    set?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
    disconnect?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
    delete?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
    connect?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
    update?: SSHFolderUpdateWithWhereUniqueWithoutParentInput | SSHFolderUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: SSHFolderUpdateManyWithWhereWithoutParentInput | SSHFolderUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: SSHFolderScalarWhereInput | SSHFolderScalarWhereInput[]
  }

  export type UserUpdateOneRequiredWithoutSshFoldersNestedInput = {
    create?: XOR<UserCreateWithoutSshFoldersInput, UserUncheckedCreateWithoutSshFoldersInput>
    connectOrCreate?: UserCreateOrConnectWithoutSshFoldersInput
    upsert?: UserUpsertWithoutSshFoldersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSshFoldersInput, UserUpdateWithoutSshFoldersInput>, UserUncheckedUpdateWithoutSshFoldersInput>
  }

  export type SSHConnectionUpdateManyWithoutFolderNestedInput = {
    create?: XOR<SSHConnectionCreateWithoutFolderInput, SSHConnectionUncheckedCreateWithoutFolderInput> | SSHConnectionCreateWithoutFolderInput[] | SSHConnectionUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutFolderInput | SSHConnectionCreateOrConnectWithoutFolderInput[]
    upsert?: SSHConnectionUpsertWithWhereUniqueWithoutFolderInput | SSHConnectionUpsertWithWhereUniqueWithoutFolderInput[]
    set?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    disconnect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    delete?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    connect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    update?: SSHConnectionUpdateWithWhereUniqueWithoutFolderInput | SSHConnectionUpdateWithWhereUniqueWithoutFolderInput[]
    updateMany?: SSHConnectionUpdateManyWithWhereWithoutFolderInput | SSHConnectionUpdateManyWithWhereWithoutFolderInput[]
    deleteMany?: SSHConnectionScalarWhereInput | SSHConnectionScalarWhereInput[]
  }

  export type SSHFolderUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<SSHFolderCreateWithoutParentInput, SSHFolderUncheckedCreateWithoutParentInput> | SSHFolderCreateWithoutParentInput[] | SSHFolderUncheckedCreateWithoutParentInput[]
    connectOrCreate?: SSHFolderCreateOrConnectWithoutParentInput | SSHFolderCreateOrConnectWithoutParentInput[]
    upsert?: SSHFolderUpsertWithWhereUniqueWithoutParentInput | SSHFolderUpsertWithWhereUniqueWithoutParentInput[]
    set?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
    disconnect?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
    delete?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
    connect?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
    update?: SSHFolderUpdateWithWhereUniqueWithoutParentInput | SSHFolderUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: SSHFolderUpdateManyWithWhereWithoutParentInput | SSHFolderUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: SSHFolderScalarWhereInput | SSHFolderScalarWhereInput[]
  }

  export type SSHConnectionUncheckedUpdateManyWithoutFolderNestedInput = {
    create?: XOR<SSHConnectionCreateWithoutFolderInput, SSHConnectionUncheckedCreateWithoutFolderInput> | SSHConnectionCreateWithoutFolderInput[] | SSHConnectionUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutFolderInput | SSHConnectionCreateOrConnectWithoutFolderInput[]
    upsert?: SSHConnectionUpsertWithWhereUniqueWithoutFolderInput | SSHConnectionUpsertWithWhereUniqueWithoutFolderInput[]
    set?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    disconnect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    delete?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    connect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    update?: SSHConnectionUpdateWithWhereUniqueWithoutFolderInput | SSHConnectionUpdateWithWhereUniqueWithoutFolderInput[]
    updateMany?: SSHConnectionUpdateManyWithWhereWithoutFolderInput | SSHConnectionUpdateManyWithWhereWithoutFolderInput[]
    deleteMany?: SSHConnectionScalarWhereInput | SSHConnectionScalarWhereInput[]
  }

  export type SSHFolderCreateNestedOneWithoutConnectionsInput = {
    create?: XOR<SSHFolderCreateWithoutConnectionsInput, SSHFolderUncheckedCreateWithoutConnectionsInput>
    connectOrCreate?: SSHFolderCreateOrConnectWithoutConnectionsInput
    connect?: SSHFolderWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutSshConnectionsInput = {
    create?: XOR<UserCreateWithoutSshConnectionsInput, UserUncheckedCreateWithoutSshConnectionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSshConnectionsInput
    connect?: UserWhereUniqueInput
  }

  export type CommandLogCreateNestedManyWithoutSshConnectionInput = {
    create?: XOR<CommandLogCreateWithoutSshConnectionInput, CommandLogUncheckedCreateWithoutSshConnectionInput> | CommandLogCreateWithoutSshConnectionInput[] | CommandLogUncheckedCreateWithoutSshConnectionInput[]
    connectOrCreate?: CommandLogCreateOrConnectWithoutSshConnectionInput | CommandLogCreateOrConnectWithoutSshConnectionInput[]
    connect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
  }

  export type CommandLogUncheckedCreateNestedManyWithoutSshConnectionInput = {
    create?: XOR<CommandLogCreateWithoutSshConnectionInput, CommandLogUncheckedCreateWithoutSshConnectionInput> | CommandLogCreateWithoutSshConnectionInput[] | CommandLogUncheckedCreateWithoutSshConnectionInput[]
    connectOrCreate?: CommandLogCreateOrConnectWithoutSshConnectionInput | CommandLogCreateOrConnectWithoutSshConnectionInput[]
    connect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type SSHFolderUpdateOneWithoutConnectionsNestedInput = {
    create?: XOR<SSHFolderCreateWithoutConnectionsInput, SSHFolderUncheckedCreateWithoutConnectionsInput>
    connectOrCreate?: SSHFolderCreateOrConnectWithoutConnectionsInput
    upsert?: SSHFolderUpsertWithoutConnectionsInput
    disconnect?: SSHFolderWhereInput | boolean
    delete?: SSHFolderWhereInput | boolean
    connect?: SSHFolderWhereUniqueInput
    update?: XOR<XOR<SSHFolderUpdateToOneWithWhereWithoutConnectionsInput, SSHFolderUpdateWithoutConnectionsInput>, SSHFolderUncheckedUpdateWithoutConnectionsInput>
  }

  export type UserUpdateOneRequiredWithoutSshConnectionsNestedInput = {
    create?: XOR<UserCreateWithoutSshConnectionsInput, UserUncheckedCreateWithoutSshConnectionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSshConnectionsInput
    upsert?: UserUpsertWithoutSshConnectionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSshConnectionsInput, UserUpdateWithoutSshConnectionsInput>, UserUncheckedUpdateWithoutSshConnectionsInput>
  }

  export type CommandLogUpdateManyWithoutSshConnectionNestedInput = {
    create?: XOR<CommandLogCreateWithoutSshConnectionInput, CommandLogUncheckedCreateWithoutSshConnectionInput> | CommandLogCreateWithoutSshConnectionInput[] | CommandLogUncheckedCreateWithoutSshConnectionInput[]
    connectOrCreate?: CommandLogCreateOrConnectWithoutSshConnectionInput | CommandLogCreateOrConnectWithoutSshConnectionInput[]
    upsert?: CommandLogUpsertWithWhereUniqueWithoutSshConnectionInput | CommandLogUpsertWithWhereUniqueWithoutSshConnectionInput[]
    set?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    disconnect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    delete?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    connect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    update?: CommandLogUpdateWithWhereUniqueWithoutSshConnectionInput | CommandLogUpdateWithWhereUniqueWithoutSshConnectionInput[]
    updateMany?: CommandLogUpdateManyWithWhereWithoutSshConnectionInput | CommandLogUpdateManyWithWhereWithoutSshConnectionInput[]
    deleteMany?: CommandLogScalarWhereInput | CommandLogScalarWhereInput[]
  }

  export type CommandLogUncheckedUpdateManyWithoutSshConnectionNestedInput = {
    create?: XOR<CommandLogCreateWithoutSshConnectionInput, CommandLogUncheckedCreateWithoutSshConnectionInput> | CommandLogCreateWithoutSshConnectionInput[] | CommandLogUncheckedCreateWithoutSshConnectionInput[]
    connectOrCreate?: CommandLogCreateOrConnectWithoutSshConnectionInput | CommandLogCreateOrConnectWithoutSshConnectionInput[]
    upsert?: CommandLogUpsertWithWhereUniqueWithoutSshConnectionInput | CommandLogUpsertWithWhereUniqueWithoutSshConnectionInput[]
    set?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    disconnect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    delete?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    connect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    update?: CommandLogUpdateWithWhereUniqueWithoutSshConnectionInput | CommandLogUpdateWithWhereUniqueWithoutSshConnectionInput[]
    updateMany?: CommandLogUpdateManyWithWhereWithoutSshConnectionInput | CommandLogUpdateManyWithWhereWithoutSshConnectionInput[]
    deleteMany?: CommandLogScalarWhereInput | CommandLogScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutCommandLogsInput = {
    create?: XOR<UserCreateWithoutCommandLogsInput, UserUncheckedCreateWithoutCommandLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommandLogsInput
    connect?: UserWhereUniqueInput
  }

  export type SSHConnectionCreateNestedOneWithoutCommandLogsInput = {
    create?: XOR<SSHConnectionCreateWithoutCommandLogsInput, SSHConnectionUncheckedCreateWithoutCommandLogsInput>
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutCommandLogsInput
    connect?: SSHConnectionWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutCommandLogsNestedInput = {
    create?: XOR<UserCreateWithoutCommandLogsInput, UserUncheckedCreateWithoutCommandLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommandLogsInput
    upsert?: UserUpsertWithoutCommandLogsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCommandLogsInput, UserUpdateWithoutCommandLogsInput>, UserUncheckedUpdateWithoutCommandLogsInput>
  }

  export type SSHConnectionUpdateOneWithoutCommandLogsNestedInput = {
    create?: XOR<SSHConnectionCreateWithoutCommandLogsInput, SSHConnectionUncheckedCreateWithoutCommandLogsInput>
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutCommandLogsInput
    upsert?: SSHConnectionUpsertWithoutCommandLogsInput
    disconnect?: SSHConnectionWhereInput | boolean
    delete?: SSHConnectionWhereInput | boolean
    connect?: SSHConnectionWhereUniqueInput
    update?: XOR<XOR<SSHConnectionUpdateToOneWithWhereWithoutCommandLogsInput, SSHConnectionUpdateWithoutCommandLogsInput>, SSHConnectionUncheckedUpdateWithoutCommandLogsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type SSHFolderCreateWithoutUserInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: SSHFolderCreateNestedOneWithoutChildrenInput
    children?: SSHFolderCreateNestedManyWithoutParentInput
    connections?: SSHConnectionCreateNestedManyWithoutFolderInput
  }

  export type SSHFolderUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parentId?: string | null
    children?: SSHFolderUncheckedCreateNestedManyWithoutParentInput
    connections?: SSHConnectionUncheckedCreateNestedManyWithoutFolderInput
  }

  export type SSHFolderCreateOrConnectWithoutUserInput = {
    where: SSHFolderWhereUniqueInput
    create: XOR<SSHFolderCreateWithoutUserInput, SSHFolderUncheckedCreateWithoutUserInput>
  }

  export type SSHConnectionCreateWithoutUserInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
    order?: number
    authType: string
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: string
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: string | null
    folder?: SSHFolderCreateNestedOneWithoutConnectionsInput
    commandLogs?: CommandLogCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
    order?: number
    authType: string
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: string
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: string | null
    folderId?: string | null
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionCreateOrConnectWithoutUserInput = {
    where: SSHConnectionWhereUniqueInput
    create: XOR<SSHConnectionCreateWithoutUserInput, SSHConnectionUncheckedCreateWithoutUserInput>
  }

  export type CommandLogCreateWithoutUserInput = {
    id?: string
    command: string
    output?: string | null
    exitCode?: number | null
    duration?: number | null
    createdAt?: Date | string
    safetyLevel?: string
    metadata?: string | null
    sshConnection?: SSHConnectionCreateNestedOneWithoutCommandLogsInput
  }

  export type CommandLogUncheckedCreateWithoutUserInput = {
    id?: string
    command: string
    output?: string | null
    exitCode?: number | null
    duration?: number | null
    createdAt?: Date | string
    safetyLevel?: string
    metadata?: string | null
    sshConnectionId?: string | null
  }

  export type CommandLogCreateOrConnectWithoutUserInput = {
    where: CommandLogWhereUniqueInput
    create: XOR<CommandLogCreateWithoutUserInput, CommandLogUncheckedCreateWithoutUserInput>
  }

  export type UserSettingsCreateWithoutUserInput = {
    id?: string
    data: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSettingsUncheckedCreateWithoutUserInput = {
    id?: string
    data: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSettingsCreateOrConnectWithoutUserInput = {
    where: UserSettingsWhereUniqueInput
    create: XOR<UserSettingsCreateWithoutUserInput, UserSettingsUncheckedCreateWithoutUserInput>
  }

  export type SSHFolderUpsertWithWhereUniqueWithoutUserInput = {
    where: SSHFolderWhereUniqueInput
    update: XOR<SSHFolderUpdateWithoutUserInput, SSHFolderUncheckedUpdateWithoutUserInput>
    create: XOR<SSHFolderCreateWithoutUserInput, SSHFolderUncheckedCreateWithoutUserInput>
  }

  export type SSHFolderUpdateWithWhereUniqueWithoutUserInput = {
    where: SSHFolderWhereUniqueInput
    data: XOR<SSHFolderUpdateWithoutUserInput, SSHFolderUncheckedUpdateWithoutUserInput>
  }

  export type SSHFolderUpdateManyWithWhereWithoutUserInput = {
    where: SSHFolderScalarWhereInput
    data: XOR<SSHFolderUpdateManyMutationInput, SSHFolderUncheckedUpdateManyWithoutUserInput>
  }

  export type SSHFolderScalarWhereInput = {
    AND?: SSHFolderScalarWhereInput | SSHFolderScalarWhereInput[]
    OR?: SSHFolderScalarWhereInput[]
    NOT?: SSHFolderScalarWhereInput | SSHFolderScalarWhereInput[]
    id?: StringFilter<"SSHFolder"> | string
    name?: StringFilter<"SSHFolder"> | string
    order?: IntFilter<"SSHFolder"> | number
    isActive?: BoolFilter<"SSHFolder"> | boolean
    createdAt?: DateTimeFilter<"SSHFolder"> | Date | string
    updatedAt?: DateTimeFilter<"SSHFolder"> | Date | string
    parentId?: StringNullableFilter<"SSHFolder"> | string | null
    userId?: StringFilter<"SSHFolder"> | string
  }

  export type SSHConnectionUpsertWithWhereUniqueWithoutUserInput = {
    where: SSHConnectionWhereUniqueInput
    update: XOR<SSHConnectionUpdateWithoutUserInput, SSHConnectionUncheckedUpdateWithoutUserInput>
    create: XOR<SSHConnectionCreateWithoutUserInput, SSHConnectionUncheckedCreateWithoutUserInput>
  }

  export type SSHConnectionUpdateWithWhereUniqueWithoutUserInput = {
    where: SSHConnectionWhereUniqueInput
    data: XOR<SSHConnectionUpdateWithoutUserInput, SSHConnectionUncheckedUpdateWithoutUserInput>
  }

  export type SSHConnectionUpdateManyWithWhereWithoutUserInput = {
    where: SSHConnectionScalarWhereInput
    data: XOR<SSHConnectionUpdateManyMutationInput, SSHConnectionUncheckedUpdateManyWithoutUserInput>
  }

  export type SSHConnectionScalarWhereInput = {
    AND?: SSHConnectionScalarWhereInput | SSHConnectionScalarWhereInput[]
    OR?: SSHConnectionScalarWhereInput[]
    NOT?: SSHConnectionScalarWhereInput | SSHConnectionScalarWhereInput[]
    id?: StringFilter<"SSHConnection"> | string
    name?: StringFilter<"SSHConnection"> | string
    host?: StringFilter<"SSHConnection"> | string
    port?: IntFilter<"SSHConnection"> | number
    username?: StringFilter<"SSHConnection"> | string
    order?: IntFilter<"SSHConnection"> | number
    authType?: StringFilter<"SSHConnection"> | string
    password?: StringNullableFilter<"SSHConnection"> | string | null
    privateKey?: StringNullableFilter<"SSHConnection"> | string | null
    publicKey?: StringNullableFilter<"SSHConnection"> | string | null
    passphrase?: StringNullableFilter<"SSHConnection"> | string | null
    status?: StringFilter<"SSHConnection"> | string
    lastUsed?: DateTimeNullableFilter<"SSHConnection"> | Date | string | null
    isActive?: BoolFilter<"SSHConnection"> | boolean
    createdAt?: DateTimeFilter<"SSHConnection"> | Date | string
    updatedAt?: DateTimeFilter<"SSHConnection"> | Date | string
    meta?: StringNullableFilter<"SSHConnection"> | string | null
    folderId?: StringNullableFilter<"SSHConnection"> | string | null
    userId?: StringFilter<"SSHConnection"> | string
  }

  export type CommandLogUpsertWithWhereUniqueWithoutUserInput = {
    where: CommandLogWhereUniqueInput
    update: XOR<CommandLogUpdateWithoutUserInput, CommandLogUncheckedUpdateWithoutUserInput>
    create: XOR<CommandLogCreateWithoutUserInput, CommandLogUncheckedCreateWithoutUserInput>
  }

  export type CommandLogUpdateWithWhereUniqueWithoutUserInput = {
    where: CommandLogWhereUniqueInput
    data: XOR<CommandLogUpdateWithoutUserInput, CommandLogUncheckedUpdateWithoutUserInput>
  }

  export type CommandLogUpdateManyWithWhereWithoutUserInput = {
    where: CommandLogScalarWhereInput
    data: XOR<CommandLogUpdateManyMutationInput, CommandLogUncheckedUpdateManyWithoutUserInput>
  }

  export type CommandLogScalarWhereInput = {
    AND?: CommandLogScalarWhereInput | CommandLogScalarWhereInput[]
    OR?: CommandLogScalarWhereInput[]
    NOT?: CommandLogScalarWhereInput | CommandLogScalarWhereInput[]
    id?: StringFilter<"CommandLog"> | string
    command?: StringFilter<"CommandLog"> | string
    output?: StringNullableFilter<"CommandLog"> | string | null
    exitCode?: IntNullableFilter<"CommandLog"> | number | null
    duration?: IntNullableFilter<"CommandLog"> | number | null
    createdAt?: DateTimeFilter<"CommandLog"> | Date | string
    safetyLevel?: StringFilter<"CommandLog"> | string
    metadata?: StringNullableFilter<"CommandLog"> | string | null
    userId?: StringFilter<"CommandLog"> | string
    sshConnectionId?: StringNullableFilter<"CommandLog"> | string | null
  }

  export type UserSettingsUpsertWithoutUserInput = {
    update: XOR<UserSettingsUpdateWithoutUserInput, UserSettingsUncheckedUpdateWithoutUserInput>
    create: XOR<UserSettingsCreateWithoutUserInput, UserSettingsUncheckedCreateWithoutUserInput>
    where?: UserSettingsWhereInput
  }

  export type UserSettingsUpdateToOneWithWhereWithoutUserInput = {
    where?: UserSettingsWhereInput
    data: XOR<UserSettingsUpdateWithoutUserInput, UserSettingsUncheckedUpdateWithoutUserInput>
  }

  export type UserSettingsUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSettingsUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutUserSettingsInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshFolders?: SSHFolderCreateNestedManyWithoutUserInput
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUserSettingsInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshFolders?: SSHFolderUncheckedCreateNestedManyWithoutUserInput
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUserSettingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUserSettingsInput, UserUncheckedCreateWithoutUserSettingsInput>
  }

  export type UserUpsertWithoutUserSettingsInput = {
    update: XOR<UserUpdateWithoutUserSettingsInput, UserUncheckedUpdateWithoutUserSettingsInput>
    create: XOR<UserCreateWithoutUserSettingsInput, UserUncheckedCreateWithoutUserSettingsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUserSettingsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUserSettingsInput, UserUncheckedUpdateWithoutUserSettingsInput>
  }

  export type UserUpdateWithoutUserSettingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshFolders?: SSHFolderUpdateManyWithoutUserNestedInput
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUserSettingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshFolders?: SSHFolderUncheckedUpdateManyWithoutUserNestedInput
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type SSHFolderCreateWithoutChildrenInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: SSHFolderCreateNestedOneWithoutChildrenInput
    user: UserCreateNestedOneWithoutSshFoldersInput
    connections?: SSHConnectionCreateNestedManyWithoutFolderInput
  }

  export type SSHFolderUncheckedCreateWithoutChildrenInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parentId?: string | null
    userId: string
    connections?: SSHConnectionUncheckedCreateNestedManyWithoutFolderInput
  }

  export type SSHFolderCreateOrConnectWithoutChildrenInput = {
    where: SSHFolderWhereUniqueInput
    create: XOR<SSHFolderCreateWithoutChildrenInput, SSHFolderUncheckedCreateWithoutChildrenInput>
  }

  export type SSHFolderCreateWithoutParentInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: SSHFolderCreateNestedManyWithoutParentInput
    user: UserCreateNestedOneWithoutSshFoldersInput
    connections?: SSHConnectionCreateNestedManyWithoutFolderInput
  }

  export type SSHFolderUncheckedCreateWithoutParentInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    children?: SSHFolderUncheckedCreateNestedManyWithoutParentInput
    connections?: SSHConnectionUncheckedCreateNestedManyWithoutFolderInput
  }

  export type SSHFolderCreateOrConnectWithoutParentInput = {
    where: SSHFolderWhereUniqueInput
    create: XOR<SSHFolderCreateWithoutParentInput, SSHFolderUncheckedCreateWithoutParentInput>
  }

  export type UserCreateWithoutSshFoldersInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSshFoldersInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSshFoldersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSshFoldersInput, UserUncheckedCreateWithoutSshFoldersInput>
  }

  export type SSHConnectionCreateWithoutFolderInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
    order?: number
    authType: string
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: string
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: string | null
    user: UserCreateNestedOneWithoutSshConnectionsInput
    commandLogs?: CommandLogCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionUncheckedCreateWithoutFolderInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
    order?: number
    authType: string
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: string
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: string | null
    userId: string
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionCreateOrConnectWithoutFolderInput = {
    where: SSHConnectionWhereUniqueInput
    create: XOR<SSHConnectionCreateWithoutFolderInput, SSHConnectionUncheckedCreateWithoutFolderInput>
  }

  export type SSHFolderUpsertWithoutChildrenInput = {
    update: XOR<SSHFolderUpdateWithoutChildrenInput, SSHFolderUncheckedUpdateWithoutChildrenInput>
    create: XOR<SSHFolderCreateWithoutChildrenInput, SSHFolderUncheckedCreateWithoutChildrenInput>
    where?: SSHFolderWhereInput
  }

  export type SSHFolderUpdateToOneWithWhereWithoutChildrenInput = {
    where?: SSHFolderWhereInput
    data: XOR<SSHFolderUpdateWithoutChildrenInput, SSHFolderUncheckedUpdateWithoutChildrenInput>
  }

  export type SSHFolderUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: SSHFolderUpdateOneWithoutChildrenNestedInput
    user?: UserUpdateOneRequiredWithoutSshFoldersNestedInput
    connections?: SSHConnectionUpdateManyWithoutFolderNestedInput
  }

  export type SSHFolderUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    connections?: SSHConnectionUncheckedUpdateManyWithoutFolderNestedInput
  }

  export type SSHFolderUpsertWithWhereUniqueWithoutParentInput = {
    where: SSHFolderWhereUniqueInput
    update: XOR<SSHFolderUpdateWithoutParentInput, SSHFolderUncheckedUpdateWithoutParentInput>
    create: XOR<SSHFolderCreateWithoutParentInput, SSHFolderUncheckedCreateWithoutParentInput>
  }

  export type SSHFolderUpdateWithWhereUniqueWithoutParentInput = {
    where: SSHFolderWhereUniqueInput
    data: XOR<SSHFolderUpdateWithoutParentInput, SSHFolderUncheckedUpdateWithoutParentInput>
  }

  export type SSHFolderUpdateManyWithWhereWithoutParentInput = {
    where: SSHFolderScalarWhereInput
    data: XOR<SSHFolderUpdateManyMutationInput, SSHFolderUncheckedUpdateManyWithoutParentInput>
  }

  export type UserUpsertWithoutSshFoldersInput = {
    update: XOR<UserUpdateWithoutSshFoldersInput, UserUncheckedUpdateWithoutSshFoldersInput>
    create: XOR<UserCreateWithoutSshFoldersInput, UserUncheckedCreateWithoutSshFoldersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSshFoldersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSshFoldersInput, UserUncheckedUpdateWithoutSshFoldersInput>
  }

  export type UserUpdateWithoutSshFoldersInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSshFoldersInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUncheckedUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUncheckedUpdateOneWithoutUserNestedInput
  }

  export type SSHConnectionUpsertWithWhereUniqueWithoutFolderInput = {
    where: SSHConnectionWhereUniqueInput
    update: XOR<SSHConnectionUpdateWithoutFolderInput, SSHConnectionUncheckedUpdateWithoutFolderInput>
    create: XOR<SSHConnectionCreateWithoutFolderInput, SSHConnectionUncheckedCreateWithoutFolderInput>
  }

  export type SSHConnectionUpdateWithWhereUniqueWithoutFolderInput = {
    where: SSHConnectionWhereUniqueInput
    data: XOR<SSHConnectionUpdateWithoutFolderInput, SSHConnectionUncheckedUpdateWithoutFolderInput>
  }

  export type SSHConnectionUpdateManyWithWhereWithoutFolderInput = {
    where: SSHConnectionScalarWhereInput
    data: XOR<SSHConnectionUpdateManyMutationInput, SSHConnectionUncheckedUpdateManyWithoutFolderInput>
  }

  export type SSHFolderCreateWithoutConnectionsInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: SSHFolderCreateNestedOneWithoutChildrenInput
    children?: SSHFolderCreateNestedManyWithoutParentInput
    user: UserCreateNestedOneWithoutSshFoldersInput
  }

  export type SSHFolderUncheckedCreateWithoutConnectionsInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parentId?: string | null
    userId: string
    children?: SSHFolderUncheckedCreateNestedManyWithoutParentInput
  }

  export type SSHFolderCreateOrConnectWithoutConnectionsInput = {
    where: SSHFolderWhereUniqueInput
    create: XOR<SSHFolderCreateWithoutConnectionsInput, SSHFolderUncheckedCreateWithoutConnectionsInput>
  }

  export type UserCreateWithoutSshConnectionsInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshFolders?: SSHFolderCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSshConnectionsInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshFolders?: SSHFolderUncheckedCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSshConnectionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSshConnectionsInput, UserUncheckedCreateWithoutSshConnectionsInput>
  }

  export type CommandLogCreateWithoutSshConnectionInput = {
    id?: string
    command: string
    output?: string | null
    exitCode?: number | null
    duration?: number | null
    createdAt?: Date | string
    safetyLevel?: string
    metadata?: string | null
    user: UserCreateNestedOneWithoutCommandLogsInput
  }

  export type CommandLogUncheckedCreateWithoutSshConnectionInput = {
    id?: string
    command: string
    output?: string | null
    exitCode?: number | null
    duration?: number | null
    createdAt?: Date | string
    safetyLevel?: string
    metadata?: string | null
    userId: string
  }

  export type CommandLogCreateOrConnectWithoutSshConnectionInput = {
    where: CommandLogWhereUniqueInput
    create: XOR<CommandLogCreateWithoutSshConnectionInput, CommandLogUncheckedCreateWithoutSshConnectionInput>
  }

  export type SSHFolderUpsertWithoutConnectionsInput = {
    update: XOR<SSHFolderUpdateWithoutConnectionsInput, SSHFolderUncheckedUpdateWithoutConnectionsInput>
    create: XOR<SSHFolderCreateWithoutConnectionsInput, SSHFolderUncheckedCreateWithoutConnectionsInput>
    where?: SSHFolderWhereInput
  }

  export type SSHFolderUpdateToOneWithWhereWithoutConnectionsInput = {
    where?: SSHFolderWhereInput
    data: XOR<SSHFolderUpdateWithoutConnectionsInput, SSHFolderUncheckedUpdateWithoutConnectionsInput>
  }

  export type SSHFolderUpdateWithoutConnectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: SSHFolderUpdateOneWithoutChildrenNestedInput
    children?: SSHFolderUpdateManyWithoutParentNestedInput
    user?: UserUpdateOneRequiredWithoutSshFoldersNestedInput
  }

  export type SSHFolderUncheckedUpdateWithoutConnectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    children?: SSHFolderUncheckedUpdateManyWithoutParentNestedInput
  }

  export type UserUpsertWithoutSshConnectionsInput = {
    update: XOR<UserUpdateWithoutSshConnectionsInput, UserUncheckedUpdateWithoutSshConnectionsInput>
    create: XOR<UserCreateWithoutSshConnectionsInput, UserUncheckedCreateWithoutSshConnectionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSshConnectionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSshConnectionsInput, UserUncheckedUpdateWithoutSshConnectionsInput>
  }

  export type UserUpdateWithoutSshConnectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshFolders?: SSHFolderUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSshConnectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshFolders?: SSHFolderUncheckedUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUncheckedUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUncheckedUpdateOneWithoutUserNestedInput
  }

  export type CommandLogUpsertWithWhereUniqueWithoutSshConnectionInput = {
    where: CommandLogWhereUniqueInput
    update: XOR<CommandLogUpdateWithoutSshConnectionInput, CommandLogUncheckedUpdateWithoutSshConnectionInput>
    create: XOR<CommandLogCreateWithoutSshConnectionInput, CommandLogUncheckedCreateWithoutSshConnectionInput>
  }

  export type CommandLogUpdateWithWhereUniqueWithoutSshConnectionInput = {
    where: CommandLogWhereUniqueInput
    data: XOR<CommandLogUpdateWithoutSshConnectionInput, CommandLogUncheckedUpdateWithoutSshConnectionInput>
  }

  export type CommandLogUpdateManyWithWhereWithoutSshConnectionInput = {
    where: CommandLogScalarWhereInput
    data: XOR<CommandLogUpdateManyMutationInput, CommandLogUncheckedUpdateManyWithoutSshConnectionInput>
  }

  export type UserCreateWithoutCommandLogsInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshFolders?: SSHFolderCreateNestedManyWithoutUserInput
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCommandLogsInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshFolders?: SSHFolderUncheckedCreateNestedManyWithoutUserInput
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCommandLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCommandLogsInput, UserUncheckedCreateWithoutCommandLogsInput>
  }

  export type SSHConnectionCreateWithoutCommandLogsInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
    order?: number
    authType: string
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: string
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: string | null
    folder?: SSHFolderCreateNestedOneWithoutConnectionsInput
    user: UserCreateNestedOneWithoutSshConnectionsInput
  }

  export type SSHConnectionUncheckedCreateWithoutCommandLogsInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
    order?: number
    authType: string
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: string
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: string | null
    folderId?: string | null
    userId: string
  }

  export type SSHConnectionCreateOrConnectWithoutCommandLogsInput = {
    where: SSHConnectionWhereUniqueInput
    create: XOR<SSHConnectionCreateWithoutCommandLogsInput, SSHConnectionUncheckedCreateWithoutCommandLogsInput>
  }

  export type UserUpsertWithoutCommandLogsInput = {
    update: XOR<UserUpdateWithoutCommandLogsInput, UserUncheckedUpdateWithoutCommandLogsInput>
    create: XOR<UserCreateWithoutCommandLogsInput, UserUncheckedCreateWithoutCommandLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCommandLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCommandLogsInput, UserUncheckedUpdateWithoutCommandLogsInput>
  }

  export type UserUpdateWithoutCommandLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshFolders?: SSHFolderUpdateManyWithoutUserNestedInput
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCommandLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshFolders?: SSHFolderUncheckedUpdateManyWithoutUserNestedInput
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUncheckedUpdateOneWithoutUserNestedInput
  }

  export type SSHConnectionUpsertWithoutCommandLogsInput = {
    update: XOR<SSHConnectionUpdateWithoutCommandLogsInput, SSHConnectionUncheckedUpdateWithoutCommandLogsInput>
    create: XOR<SSHConnectionCreateWithoutCommandLogsInput, SSHConnectionUncheckedCreateWithoutCommandLogsInput>
    where?: SSHConnectionWhereInput
  }

  export type SSHConnectionUpdateToOneWithWhereWithoutCommandLogsInput = {
    where?: SSHConnectionWhereInput
    data: XOR<SSHConnectionUpdateWithoutCommandLogsInput, SSHConnectionUncheckedUpdateWithoutCommandLogsInput>
  }

  export type SSHConnectionUpdateWithoutCommandLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    folder?: SSHFolderUpdateOneWithoutConnectionsNestedInput
    user?: UserUpdateOneRequiredWithoutSshConnectionsNestedInput
  }

  export type SSHConnectionUncheckedUpdateWithoutCommandLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type SSHFolderUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: SSHFolderUpdateOneWithoutChildrenNestedInput
    children?: SSHFolderUpdateManyWithoutParentNestedInput
    connections?: SSHConnectionUpdateManyWithoutFolderNestedInput
  }

  export type SSHFolderUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    children?: SSHFolderUncheckedUpdateManyWithoutParentNestedInput
    connections?: SSHConnectionUncheckedUpdateManyWithoutFolderNestedInput
  }

  export type SSHFolderUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SSHConnectionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    folder?: SSHFolderUpdateOneWithoutConnectionsNestedInput
    commandLogs?: CommandLogUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
    commandLogs?: CommandLogUncheckedUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommandLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    exitCode?: NullableIntFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    safetyLevel?: StringFieldUpdateOperationsInput | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    sshConnection?: SSHConnectionUpdateOneWithoutCommandLogsNestedInput
  }

  export type CommandLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    exitCode?: NullableIntFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    safetyLevel?: StringFieldUpdateOperationsInput | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    sshConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommandLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    exitCode?: NullableIntFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    safetyLevel?: StringFieldUpdateOperationsInput | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    sshConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SSHFolderUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: SSHFolderUpdateManyWithoutParentNestedInput
    user?: UserUpdateOneRequiredWithoutSshFoldersNestedInput
    connections?: SSHConnectionUpdateManyWithoutFolderNestedInput
  }

  export type SSHFolderUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    children?: SSHFolderUncheckedUpdateManyWithoutParentNestedInput
    connections?: SSHConnectionUncheckedUpdateManyWithoutFolderNestedInput
  }

  export type SSHFolderUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type SSHConnectionUpdateWithoutFolderInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutSshConnectionsNestedInput
    commandLogs?: CommandLogUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionUncheckedUpdateWithoutFolderInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    commandLogs?: CommandLogUncheckedUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionUncheckedUpdateManyWithoutFolderInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type CommandLogUpdateWithoutSshConnectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    exitCode?: NullableIntFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    safetyLevel?: StringFieldUpdateOperationsInput | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutCommandLogsNestedInput
  }

  export type CommandLogUncheckedUpdateWithoutSshConnectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    exitCode?: NullableIntFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    safetyLevel?: StringFieldUpdateOperationsInput | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type CommandLogUncheckedUpdateManyWithoutSshConnectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    exitCode?: NullableIntFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    safetyLevel?: StringFieldUpdateOperationsInput | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SSHFolderCountOutputTypeDefaultArgs instead
     */
    export type SSHFolderCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SSHFolderCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SSHConnectionCountOutputTypeDefaultArgs instead
     */
    export type SSHConnectionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SSHConnectionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserSettingsDefaultArgs instead
     */
    export type UserSettingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserSettingsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SSHFolderDefaultArgs instead
     */
    export type SSHFolderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SSHFolderDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SSHConnectionDefaultArgs instead
     */
    export type SSHConnectionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SSHConnectionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommandLogDefaultArgs instead
     */
    export type CommandLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommandLogDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}