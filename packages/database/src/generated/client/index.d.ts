
/**
 * Client
**/

import * as runtime from './runtime/library.js';
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
 * Model SSHConnection
 * 
 */
export type SSHConnection = $Result.DefaultSelection<Prisma.$SSHConnectionPayload>
/**
 * Model ChatSession
 * 
 */
export type ChatSession = $Result.DefaultSelection<Prisma.$ChatSessionPayload>
/**
 * Model Message
 * 
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>
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
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
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


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

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
   * `prisma.sSHConnection`: Exposes CRUD operations for the **SSHConnection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SSHConnections
    * const sSHConnections = await prisma.sSHConnection.findMany()
    * ```
    */
  get sSHConnection(): Prisma.SSHConnectionDelegate<ExtArgs>;

  /**
   * `prisma.chatSession`: Exposes CRUD operations for the **ChatSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatSessions
    * const chatSessions = await prisma.chatSession.findMany()
    * ```
    */
  get chatSession(): Prisma.ChatSessionDelegate<ExtArgs>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<ExtArgs>;

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
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

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

  type SelectAndOmit = {
    select: any
    omit: any
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
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
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
    SSHConnection: 'SSHConnection',
    ChatSession: 'ChatSession',
    Message: 'Message',
    CommandLog: 'CommandLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "sSHConnection" | "chatSession" | "message" | "commandLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      SSHConnection: {
        payload: Prisma.$SSHConnectionPayload<ExtArgs>
        fields: Prisma.SSHConnectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SSHConnectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHConnectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SSHConnectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHConnectionPayload>
          }
          findFirst: {
            args: Prisma.SSHConnectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHConnectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SSHConnectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHConnectionPayload>
          }
          findMany: {
            args: Prisma.SSHConnectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHConnectionPayload>[]
          }
          create: {
            args: Prisma.SSHConnectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHConnectionPayload>
          }
          createMany: {
            args: Prisma.SSHConnectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SSHConnectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHConnectionPayload>[]
          }
          delete: {
            args: Prisma.SSHConnectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHConnectionPayload>
          }
          update: {
            args: Prisma.SSHConnectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHConnectionPayload>
          }
          deleteMany: {
            args: Prisma.SSHConnectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SSHConnectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SSHConnectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHConnectionPayload>
          }
          aggregate: {
            args: Prisma.SSHConnectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSSHConnection>
          }
          groupBy: {
            args: Prisma.SSHConnectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SSHConnectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SSHConnectionCountArgs<ExtArgs>
            result: $Utils.Optional<SSHConnectionCountAggregateOutputType> | number
          }
        }
      }
      ChatSession: {
        payload: Prisma.$ChatSessionPayload<ExtArgs>
        fields: Prisma.ChatSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          findFirst: {
            args: Prisma.ChatSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          findMany: {
            args: Prisma.ChatSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>[]
          }
          create: {
            args: Prisma.ChatSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          createMany: {
            args: Prisma.ChatSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>[]
          }
          delete: {
            args: Prisma.ChatSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          update: {
            args: Prisma.ChatSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          deleteMany: {
            args: Prisma.ChatSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ChatSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          aggregate: {
            args: Prisma.ChatSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatSession>
          }
          groupBy: {
            args: Prisma.ChatSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatSessionCountArgs<ExtArgs>
            result: $Utils.Optional<ChatSessionCountAggregateOutputType> | number
          }
        }
      }
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>
        fields: Prisma.MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessage>
          }
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>
            result: $Utils.Optional<MessageCountAggregateOutputType> | number
          }
        }
      }
      CommandLog: {
        payload: Prisma.$CommandLogPayload<ExtArgs>
        fields: Prisma.CommandLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommandLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommandLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommandLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommandLogPayload>
          }
          findFirst: {
            args: Prisma.CommandLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommandLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommandLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommandLogPayload>
          }
          findMany: {
            args: Prisma.CommandLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommandLogPayload>[]
          }
          create: {
            args: Prisma.CommandLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommandLogPayload>
          }
          createMany: {
            args: Prisma.CommandLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommandLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommandLogPayload>[]
          }
          delete: {
            args: Prisma.CommandLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommandLogPayload>
          }
          update: {
            args: Prisma.CommandLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommandLogPayload>
          }
          deleteMany: {
            args: Prisma.CommandLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommandLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CommandLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommandLogPayload>
          }
          aggregate: {
            args: Prisma.CommandLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCommandLog>
          }
          groupBy: {
            args: Prisma.CommandLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommandLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommandLogCountArgs<ExtArgs>
            result: $Utils.Optional<CommandLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
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
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
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
    | 'createManyAndReturn'
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
    sshConnections: number
    chatSessions: number
    messages: number
    commandLogs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sshConnections?: boolean | UserCountOutputTypeCountSshConnectionsArgs
    chatSessions?: boolean | UserCountOutputTypeCountChatSessionsArgs
    messages?: boolean | UserCountOutputTypeCountMessagesArgs
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
  export type UserCountOutputTypeCountSshConnectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SSHConnectionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountChatSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatSessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCommandLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommandLogWhereInput
  }


  /**
   * Count Type SSHConnectionCountOutputType
   */

  export type SSHConnectionCountOutputType = {
    chatSessions: number
    commandLogs: number
  }

  export type SSHConnectionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chatSessions?: boolean | SSHConnectionCountOutputTypeCountChatSessionsArgs
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
  export type SSHConnectionCountOutputTypeCountChatSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatSessionWhereInput
  }

  /**
   * SSHConnectionCountOutputType without action
   */
  export type SSHConnectionCountOutputTypeCountCommandLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommandLogWhereInput
  }


  /**
   * Count Type ChatSessionCountOutputType
   */

  export type ChatSessionCountOutputType = {
    messages: number
  }

  export type ChatSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | ChatSessionCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * ChatSessionCountOutputType without action
   */
  export type ChatSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSessionCountOutputType
     */
    select?: ChatSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChatSessionCountOutputType without action
   */
  export type ChatSessionCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
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
    settings: string | null
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
    settings: string | null
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
    settings: number
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
    settings?: true
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
    settings?: true
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
    settings?: true
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
    settings: string | null
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
    settings?: boolean
    sshConnections?: boolean | User$sshConnectionsArgs<ExtArgs>
    chatSessions?: boolean | User$chatSessionsArgs<ExtArgs>
    messages?: boolean | User$messagesArgs<ExtArgs>
    commandLogs?: boolean | User$commandLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
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
    settings?: boolean
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
    settings?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sshConnections?: boolean | User$sshConnectionsArgs<ExtArgs>
    chatSessions?: boolean | User$chatSessionsArgs<ExtArgs>
    messages?: boolean | User$messagesArgs<ExtArgs>
    commandLogs?: boolean | User$commandLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sshConnections: Prisma.$SSHConnectionPayload<ExtArgs>[]
      chatSessions: Prisma.$ChatSessionPayload<ExtArgs>[]
      messages: Prisma.$MessagePayload<ExtArgs>[]
      commandLogs: Prisma.$CommandLogPayload<ExtArgs>[]
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
      settings: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
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
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

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
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

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
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
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
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

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
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

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
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

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
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

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
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

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
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

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
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


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
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sshConnections<T extends User$sshConnectionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sshConnectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, "findMany"> | Null>
    chatSessions<T extends User$chatSessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$chatSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findMany"> | Null>
    messages<T extends User$messagesArgs<ExtArgs> = {}>(args?: Subset<T, User$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany"> | Null>
    commandLogs<T extends User$commandLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$commandLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
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
    readonly settings: FieldRef<"User", 'String'>
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
   * User.sshConnections
   */
  export type User$sshConnectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHConnection
     */
    select?: SSHConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
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
   * User.chatSessions
   */
  export type User$chatSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    where?: ChatSessionWhereInput
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    cursor?: ChatSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * User.messages
   */
  export type User$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
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
     * Choose, which related nodes to fetch as well
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
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
  }

  export type SSHConnectionSumAggregateOutputType = {
    port: number | null
  }

  export type SSHConnectionMinAggregateOutputType = {
    id: string | null
    name: string | null
    host: string | null
    port: number | null
    username: string | null
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
    userId: string | null
  }

  export type SSHConnectionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    host: string | null
    port: number | null
    username: string | null
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
    userId: string | null
  }

  export type SSHConnectionCountAggregateOutputType = {
    id: number
    name: number
    host: number
    port: number
    username: number
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
    userId: number
    _all: number
  }


  export type SSHConnectionAvgAggregateInputType = {
    port?: true
  }

  export type SSHConnectionSumAggregateInputType = {
    port?: true
  }

  export type SSHConnectionMinAggregateInputType = {
    id?: true
    name?: true
    host?: true
    port?: true
    username?: true
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
    userId?: true
  }

  export type SSHConnectionMaxAggregateInputType = {
    id?: true
    name?: true
    host?: true
    port?: true
    username?: true
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
    userId?: true
  }

  export type SSHConnectionCountAggregateInputType = {
    id?: true
    name?: true
    host?: true
    port?: true
    username?: true
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
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    chatSessions?: boolean | SSHConnection$chatSessionsArgs<ExtArgs>
    commandLogs?: boolean | SSHConnection$commandLogsArgs<ExtArgs>
    _count?: boolean | SSHConnectionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sSHConnection"]>

  export type SSHConnectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    host?: boolean
    port?: boolean
    username?: boolean
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
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sSHConnection"]>

  export type SSHConnectionSelectScalar = {
    id?: boolean
    name?: boolean
    host?: boolean
    port?: boolean
    username?: boolean
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
    userId?: boolean
  }

  export type SSHConnectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    chatSessions?: boolean | SSHConnection$chatSessionsArgs<ExtArgs>
    commandLogs?: boolean | SSHConnection$commandLogsArgs<ExtArgs>
    _count?: boolean | SSHConnectionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SSHConnectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SSHConnectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SSHConnection"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      chatSessions: Prisma.$ChatSessionPayload<ExtArgs>[]
      commandLogs: Prisma.$CommandLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      host: string
      port: number
      username: string
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
      userId: string
    }, ExtArgs["result"]["sSHConnection"]>
    composites: {}
  }

  type SSHConnectionGetPayload<S extends boolean | null | undefined | SSHConnectionDefaultArgs> = $Result.GetResult<Prisma.$SSHConnectionPayload, S>

  type SSHConnectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SSHConnectionFindManyArgs, 'select' | 'include' | 'distinct'> & {
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
     */
    findUnique<T extends SSHConnectionFindUniqueArgs>(args: SelectSubset<T, SSHConnectionFindUniqueArgs<ExtArgs>>): Prisma__SSHConnectionClient<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SSHConnection that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SSHConnectionFindUniqueOrThrowArgs} args - Arguments to find a SSHConnection
     * @example
     * // Get one SSHConnection
     * const sSHConnection = await prisma.sSHConnection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SSHConnectionFindUniqueOrThrowArgs>(args: SelectSubset<T, SSHConnectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SSHConnectionClient<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

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
     */
    findFirst<T extends SSHConnectionFindFirstArgs>(args?: SelectSubset<T, SSHConnectionFindFirstArgs<ExtArgs>>): Prisma__SSHConnectionClient<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

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
     */
    findFirstOrThrow<T extends SSHConnectionFindFirstOrThrowArgs>(args?: SelectSubset<T, SSHConnectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SSHConnectionClient<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SSHConnections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SSHConnectionFindManyArgs} args - Arguments to filter and select certain fields only.
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
     */
    findMany<T extends SSHConnectionFindManyArgs>(args?: SelectSubset<T, SSHConnectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, "findMany">>

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
     */
    create<T extends SSHConnectionCreateArgs>(args: SelectSubset<T, SSHConnectionCreateArgs<ExtArgs>>): Prisma__SSHConnectionClient<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SSHConnections.
     * @param {SSHConnectionCreateManyArgs} args - Arguments to create many SSHConnections.
     * @example
     * // Create many SSHConnections
     * const sSHConnection = await prisma.sSHConnection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SSHConnectionCreateManyArgs>(args?: SelectSubset<T, SSHConnectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SSHConnections and returns the data saved in the database.
     * @param {SSHConnectionCreateManyAndReturnArgs} args - Arguments to create many SSHConnections.
     * @example
     * // Create many SSHConnections
     * const sSHConnection = await prisma.sSHConnection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SSHConnections and only return the `id`
     * const sSHConnectionWithIdOnly = await prisma.sSHConnection.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SSHConnectionCreateManyAndReturnArgs>(args?: SelectSubset<T, SSHConnectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, "createManyAndReturn">>

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
     */
    delete<T extends SSHConnectionDeleteArgs>(args: SelectSubset<T, SSHConnectionDeleteArgs<ExtArgs>>): Prisma__SSHConnectionClient<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

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
     */
    update<T extends SSHConnectionUpdateArgs>(args: SelectSubset<T, SSHConnectionUpdateArgs<ExtArgs>>): Prisma__SSHConnectionClient<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, "update">, never, ExtArgs>

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
     */
    deleteMany<T extends SSHConnectionDeleteManyArgs>(args?: SelectSubset<T, SSHConnectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

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
     */
    updateMany<T extends SSHConnectionUpdateManyArgs>(args: SelectSubset<T, SSHConnectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

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
     */
    upsert<T extends SSHConnectionUpsertArgs>(args: SelectSubset<T, SSHConnectionUpsertArgs<ExtArgs>>): Prisma__SSHConnectionClient<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


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
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    chatSessions<T extends SSHConnection$chatSessionsArgs<ExtArgs> = {}>(args?: Subset<T, SSHConnection$chatSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findMany"> | Null>
    commandLogs<T extends SSHConnection$commandLogsArgs<ExtArgs> = {}>(args?: Subset<T, SSHConnection$commandLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
     */
    include?: SSHConnectionInclude<ExtArgs> | null
    /**
     * The data needed to create a SSHConnection.
     */
    data: XOR<SSHConnectionCreateInput, SSHConnectionUncheckedCreateInput>
  }

  /**
   * SSHConnection createMany
   */
  export type SSHConnectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SSHConnections.
     */
    data: SSHConnectionCreateManyInput | SSHConnectionCreateManyInput[]
  }

  /**
   * SSHConnection createManyAndReturn
   */
  export type SSHConnectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHConnection
     */
    select?: SSHConnectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SSHConnections.
     */
    data: SSHConnectionCreateManyInput | SSHConnectionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SSHConnectionIncludeCreateManyAndReturn<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
   * SSHConnection.chatSessions
   */
  export type SSHConnection$chatSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    where?: ChatSessionWhereInput
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    cursor?: ChatSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
     */
    include?: SSHConnectionInclude<ExtArgs> | null
  }


  /**
   * Model ChatSession
   */

  export type AggregateChatSession = {
    _count: ChatSessionCountAggregateOutputType | null
    _min: ChatSessionMinAggregateOutputType | null
    _max: ChatSessionMaxAggregateOutputType | null
  }

  export type ChatSessionMinAggregateOutputType = {
    id: string | null
    title: string | null
    type: string | null
    createdAt: Date | null
    updatedAt: Date | null
    config: string | null
    meta: string | null
    userId: string | null
    sshConnectionId: string | null
  }

  export type ChatSessionMaxAggregateOutputType = {
    id: string | null
    title: string | null
    type: string | null
    createdAt: Date | null
    updatedAt: Date | null
    config: string | null
    meta: string | null
    userId: string | null
    sshConnectionId: string | null
  }

  export type ChatSessionCountAggregateOutputType = {
    id: number
    title: number
    type: number
    createdAt: number
    updatedAt: number
    config: number
    meta: number
    userId: number
    sshConnectionId: number
    _all: number
  }


  export type ChatSessionMinAggregateInputType = {
    id?: true
    title?: true
    type?: true
    createdAt?: true
    updatedAt?: true
    config?: true
    meta?: true
    userId?: true
    sshConnectionId?: true
  }

  export type ChatSessionMaxAggregateInputType = {
    id?: true
    title?: true
    type?: true
    createdAt?: true
    updatedAt?: true
    config?: true
    meta?: true
    userId?: true
    sshConnectionId?: true
  }

  export type ChatSessionCountAggregateInputType = {
    id?: true
    title?: true
    type?: true
    createdAt?: true
    updatedAt?: true
    config?: true
    meta?: true
    userId?: true
    sshConnectionId?: true
    _all?: true
  }

  export type ChatSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatSession to aggregate.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatSessions
    **/
    _count?: true | ChatSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatSessionMaxAggregateInputType
  }

  export type GetChatSessionAggregateType<T extends ChatSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateChatSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatSession[P]>
      : GetScalarType<T[P], AggregateChatSession[P]>
  }




  export type ChatSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatSessionWhereInput
    orderBy?: ChatSessionOrderByWithAggregationInput | ChatSessionOrderByWithAggregationInput[]
    by: ChatSessionScalarFieldEnum[] | ChatSessionScalarFieldEnum
    having?: ChatSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatSessionCountAggregateInputType | true
    _min?: ChatSessionMinAggregateInputType
    _max?: ChatSessionMaxAggregateInputType
  }

  export type ChatSessionGroupByOutputType = {
    id: string
    title: string
    type: string
    createdAt: Date
    updatedAt: Date
    config: string | null
    meta: string | null
    userId: string
    sshConnectionId: string | null
    _count: ChatSessionCountAggregateOutputType | null
    _min: ChatSessionMinAggregateOutputType | null
    _max: ChatSessionMaxAggregateOutputType | null
  }

  type GetChatSessionGroupByPayload<T extends ChatSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatSessionGroupByOutputType[P]>
            : GetScalarType<T[P], ChatSessionGroupByOutputType[P]>
        }
      >
    >


  export type ChatSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    config?: boolean
    meta?: boolean
    userId?: boolean
    sshConnectionId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    sshConnection?: boolean | ChatSession$sshConnectionArgs<ExtArgs>
    messages?: boolean | ChatSession$messagesArgs<ExtArgs>
    _count?: boolean | ChatSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatSession"]>

  export type ChatSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    config?: boolean
    meta?: boolean
    userId?: boolean
    sshConnectionId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    sshConnection?: boolean | ChatSession$sshConnectionArgs<ExtArgs>
  }, ExtArgs["result"]["chatSession"]>

  export type ChatSessionSelectScalar = {
    id?: boolean
    title?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    config?: boolean
    meta?: boolean
    userId?: boolean
    sshConnectionId?: boolean
  }

  export type ChatSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    sshConnection?: boolean | ChatSession$sshConnectionArgs<ExtArgs>
    messages?: boolean | ChatSession$messagesArgs<ExtArgs>
    _count?: boolean | ChatSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChatSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    sshConnection?: boolean | ChatSession$sshConnectionArgs<ExtArgs>
  }

  export type $ChatSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      sshConnection: Prisma.$SSHConnectionPayload<ExtArgs> | null
      messages: Prisma.$MessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      type: string
      createdAt: Date
      updatedAt: Date
      config: string | null
      meta: string | null
      userId: string
      sshConnectionId: string | null
    }, ExtArgs["result"]["chatSession"]>
    composites: {}
  }

  type ChatSessionGetPayload<S extends boolean | null | undefined | ChatSessionDefaultArgs> = $Result.GetResult<Prisma.$ChatSessionPayload, S>

  type ChatSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ChatSessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ChatSessionCountAggregateInputType | true
    }

  export interface ChatSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatSession'], meta: { name: 'ChatSession' } }
    /**
     * Find zero or one ChatSession that matches the filter.
     * @param {ChatSessionFindUniqueArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatSessionFindUniqueArgs>(args: SelectSubset<T, ChatSessionFindUniqueArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ChatSession that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ChatSessionFindUniqueOrThrowArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ChatSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionFindFirstArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatSessionFindFirstArgs>(args?: SelectSubset<T, ChatSessionFindFirstArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ChatSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionFindFirstOrThrowArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ChatSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatSessions
     * const chatSessions = await prisma.chatSession.findMany()
     * 
     * // Get first 10 ChatSessions
     * const chatSessions = await prisma.chatSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatSessionWithIdOnly = await prisma.chatSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatSessionFindManyArgs>(args?: SelectSubset<T, ChatSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ChatSession.
     * @param {ChatSessionCreateArgs} args - Arguments to create a ChatSession.
     * @example
     * // Create one ChatSession
     * const ChatSession = await prisma.chatSession.create({
     *   data: {
     *     // ... data to create a ChatSession
     *   }
     * })
     * 
     */
    create<T extends ChatSessionCreateArgs>(args: SelectSubset<T, ChatSessionCreateArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ChatSessions.
     * @param {ChatSessionCreateManyArgs} args - Arguments to create many ChatSessions.
     * @example
     * // Create many ChatSessions
     * const chatSession = await prisma.chatSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatSessionCreateManyArgs>(args?: SelectSubset<T, ChatSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatSessions and returns the data saved in the database.
     * @param {ChatSessionCreateManyAndReturnArgs} args - Arguments to create many ChatSessions.
     * @example
     * // Create many ChatSessions
     * const chatSession = await prisma.chatSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatSessions and only return the `id`
     * const chatSessionWithIdOnly = await prisma.chatSession.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ChatSession.
     * @param {ChatSessionDeleteArgs} args - Arguments to delete one ChatSession.
     * @example
     * // Delete one ChatSession
     * const ChatSession = await prisma.chatSession.delete({
     *   where: {
     *     // ... filter to delete one ChatSession
     *   }
     * })
     * 
     */
    delete<T extends ChatSessionDeleteArgs>(args: SelectSubset<T, ChatSessionDeleteArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ChatSession.
     * @param {ChatSessionUpdateArgs} args - Arguments to update one ChatSession.
     * @example
     * // Update one ChatSession
     * const chatSession = await prisma.chatSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatSessionUpdateArgs>(args: SelectSubset<T, ChatSessionUpdateArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ChatSessions.
     * @param {ChatSessionDeleteManyArgs} args - Arguments to filter ChatSessions to delete.
     * @example
     * // Delete a few ChatSessions
     * const { count } = await prisma.chatSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatSessionDeleteManyArgs>(args?: SelectSubset<T, ChatSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatSessions
     * const chatSession = await prisma.chatSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatSessionUpdateManyArgs>(args: SelectSubset<T, ChatSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ChatSession.
     * @param {ChatSessionUpsertArgs} args - Arguments to update or create a ChatSession.
     * @example
     * // Update or create a ChatSession
     * const chatSession = await prisma.chatSession.upsert({
     *   create: {
     *     // ... data to create a ChatSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatSession we want to update
     *   }
     * })
     */
    upsert<T extends ChatSessionUpsertArgs>(args: SelectSubset<T, ChatSessionUpsertArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ChatSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionCountArgs} args - Arguments to filter ChatSessions to count.
     * @example
     * // Count the number of ChatSessions
     * const count = await prisma.chatSession.count({
     *   where: {
     *     // ... the filter for the ChatSessions we want to count
     *   }
     * })
    **/
    count<T extends ChatSessionCountArgs>(
      args?: Subset<T, ChatSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChatSessionAggregateArgs>(args: Subset<T, ChatSessionAggregateArgs>): Prisma.PrismaPromise<GetChatSessionAggregateType<T>>

    /**
     * Group by ChatSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionGroupByArgs} args - Group by arguments.
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
      T extends ChatSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatSessionGroupByArgs['orderBy'] }
        : { orderBy?: ChatSessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ChatSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatSession model
   */
  readonly fields: ChatSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    sshConnection<T extends ChatSession$sshConnectionArgs<ExtArgs> = {}>(args?: Subset<T, ChatSession$sshConnectionArgs<ExtArgs>>): Prisma__SSHConnectionClient<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    messages<T extends ChatSession$messagesArgs<ExtArgs> = {}>(args?: Subset<T, ChatSession$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatSession model
   */ 
  interface ChatSessionFieldRefs {
    readonly id: FieldRef<"ChatSession", 'String'>
    readonly title: FieldRef<"ChatSession", 'String'>
    readonly type: FieldRef<"ChatSession", 'String'>
    readonly createdAt: FieldRef<"ChatSession", 'DateTime'>
    readonly updatedAt: FieldRef<"ChatSession", 'DateTime'>
    readonly config: FieldRef<"ChatSession", 'String'>
    readonly meta: FieldRef<"ChatSession", 'String'>
    readonly userId: FieldRef<"ChatSession", 'String'>
    readonly sshConnectionId: FieldRef<"ChatSession", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ChatSession findUnique
   */
  export type ChatSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession findUniqueOrThrow
   */
  export type ChatSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession findFirst
   */
  export type ChatSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatSessions.
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatSessions.
     */
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * ChatSession findFirstOrThrow
   */
  export type ChatSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatSessions.
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatSessions.
     */
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * ChatSession findMany
   */
  export type ChatSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSessions to fetch.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatSessions.
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * ChatSession create
   */
  export type ChatSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatSession.
     */
    data: XOR<ChatSessionCreateInput, ChatSessionUncheckedCreateInput>
  }

  /**
   * ChatSession createMany
   */
  export type ChatSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatSessions.
     */
    data: ChatSessionCreateManyInput | ChatSessionCreateManyInput[]
  }

  /**
   * ChatSession createManyAndReturn
   */
  export type ChatSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ChatSessions.
     */
    data: ChatSessionCreateManyInput | ChatSessionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatSession update
   */
  export type ChatSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatSession.
     */
    data: XOR<ChatSessionUpdateInput, ChatSessionUncheckedUpdateInput>
    /**
     * Choose, which ChatSession to update.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession updateMany
   */
  export type ChatSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatSessions.
     */
    data: XOR<ChatSessionUpdateManyMutationInput, ChatSessionUncheckedUpdateManyInput>
    /**
     * Filter which ChatSessions to update
     */
    where?: ChatSessionWhereInput
  }

  /**
   * ChatSession upsert
   */
  export type ChatSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatSession to update in case it exists.
     */
    where: ChatSessionWhereUniqueInput
    /**
     * In case the ChatSession found by the `where` argument doesn't exist, create a new ChatSession with this data.
     */
    create: XOR<ChatSessionCreateInput, ChatSessionUncheckedCreateInput>
    /**
     * In case the ChatSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatSessionUpdateInput, ChatSessionUncheckedUpdateInput>
  }

  /**
   * ChatSession delete
   */
  export type ChatSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter which ChatSession to delete.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession deleteMany
   */
  export type ChatSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatSessions to delete
     */
    where?: ChatSessionWhereInput
  }

  /**
   * ChatSession.sshConnection
   */
  export type ChatSession$sshConnectionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHConnection
     */
    select?: SSHConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SSHConnectionInclude<ExtArgs> | null
    where?: SSHConnectionWhereInput
  }

  /**
   * ChatSession.messages
   */
  export type ChatSession$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * ChatSession without action
   */
  export type ChatSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
  }


  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageMinAggregateOutputType = {
    id: string | null
    content: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
    meta: string | null
    extra: string | null
    isDeleted: boolean | null
    isEdited: boolean | null
    plugin: string | null
    pluginState: string | null
    translate: string | null
    tts: string | null
    sessionId: string | null
    userId: string | null
  }

  export type MessageMaxAggregateOutputType = {
    id: string | null
    content: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
    meta: string | null
    extra: string | null
    isDeleted: boolean | null
    isEdited: boolean | null
    plugin: string | null
    pluginState: string | null
    translate: string | null
    tts: string | null
    sessionId: string | null
    userId: string | null
  }

  export type MessageCountAggregateOutputType = {
    id: number
    content: number
    role: number
    createdAt: number
    updatedAt: number
    meta: number
    extra: number
    isDeleted: number
    isEdited: number
    plugin: number
    pluginState: number
    translate: number
    tts: number
    sessionId: number
    userId: number
    _all: number
  }


  export type MessageMinAggregateInputType = {
    id?: true
    content?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    meta?: true
    extra?: true
    isDeleted?: true
    isEdited?: true
    plugin?: true
    pluginState?: true
    translate?: true
    tts?: true
    sessionId?: true
    userId?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    content?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    meta?: true
    extra?: true
    isDeleted?: true
    isEdited?: true
    plugin?: true
    pluginState?: true
    translate?: true
    tts?: true
    sessionId?: true
    userId?: true
  }

  export type MessageCountAggregateInputType = {
    id?: true
    content?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    meta?: true
    extra?: true
    isDeleted?: true
    isEdited?: true
    plugin?: true
    pluginState?: true
    translate?: true
    tts?: true
    sessionId?: true
    userId?: true
    _all?: true
  }

  export type MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithAggregationInput | MessageOrderByWithAggregationInput[]
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }

  export type MessageGroupByOutputType = {
    id: string
    content: string
    role: string
    createdAt: Date
    updatedAt: Date
    meta: string | null
    extra: string | null
    isDeleted: boolean
    isEdited: boolean
    plugin: string | null
    pluginState: string | null
    translate: string | null
    tts: string | null
    sessionId: string
    userId: string
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    meta?: boolean
    extra?: boolean
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: boolean
    pluginState?: boolean
    translate?: boolean
    tts?: boolean
    sessionId?: boolean
    userId?: boolean
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    meta?: boolean
    extra?: boolean
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: boolean
    pluginState?: boolean
    translate?: boolean
    tts?: boolean
    sessionId?: boolean
    userId?: boolean
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectScalar = {
    id?: boolean
    content?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    meta?: boolean
    extra?: boolean
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: boolean
    pluginState?: boolean
    translate?: boolean
    tts?: boolean
    sessionId?: boolean
    userId?: boolean
  }

  export type MessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Message"
    objects: {
      session: Prisma.$ChatSessionPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      role: string
      createdAt: Date
      updatedAt: Date
      meta: string | null
      extra: string | null
      isDeleted: boolean
      isEdited: boolean
      plugin: string | null
      pluginState: string | null
      translate: string | null
      tts: string | null
      sessionId: string
      userId: string
    }, ExtArgs["result"]["message"]>
    composites: {}
  }

  type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = $Result.GetResult<Prisma.$MessagePayload, S>

  type MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Message'], meta: { name: 'Message' } }
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageFindManyArgs>(args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
     */
    create<T extends MessageCreateArgs>(args: SelectSubset<T, MessageCreateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageCreateManyArgs>(args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {MessageCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs>(args?: SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
     */
    delete<T extends MessageDeleteArgs>(args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageUpdateArgs>(args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageDeleteManyArgs>(args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageUpdateManyArgs>(args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
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
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Message model
   */
  readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends ChatSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChatSessionDefaultArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Message model
   */ 
  interface MessageFieldRefs {
    readonly id: FieldRef<"Message", 'String'>
    readonly content: FieldRef<"Message", 'String'>
    readonly role: FieldRef<"Message", 'String'>
    readonly createdAt: FieldRef<"Message", 'DateTime'>
    readonly updatedAt: FieldRef<"Message", 'DateTime'>
    readonly meta: FieldRef<"Message", 'String'>
    readonly extra: FieldRef<"Message", 'String'>
    readonly isDeleted: FieldRef<"Message", 'Boolean'>
    readonly isEdited: FieldRef<"Message", 'Boolean'>
    readonly plugin: FieldRef<"Message", 'String'>
    readonly pluginState: FieldRef<"Message", 'String'>
    readonly translate: FieldRef<"Message", 'String'>
    readonly tts: FieldRef<"Message", 'String'>
    readonly sessionId: FieldRef<"Message", 'String'>
    readonly userId: FieldRef<"Message", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message create
   */
  export type MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
  }

  /**
   * Message createManyAndReturn
   */
  export type MessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message update
   */
  export type MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
  }

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }

  /**
   * Message delete
   */
  export type MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
  }

  /**
   * Message without action
   */
  export type MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
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

  export type CommandLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
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
  export type CommandLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
    Omit<CommandLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
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
     */
    findUnique<T extends CommandLogFindUniqueArgs>(args: SelectSubset<T, CommandLogFindUniqueArgs<ExtArgs>>): Prisma__CommandLogClient<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CommandLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CommandLogFindUniqueOrThrowArgs} args - Arguments to find a CommandLog
     * @example
     * // Get one CommandLog
     * const commandLog = await prisma.commandLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommandLogFindUniqueOrThrowArgs>(args: SelectSubset<T, CommandLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommandLogClient<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

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
     */
    findFirst<T extends CommandLogFindFirstArgs>(args?: SelectSubset<T, CommandLogFindFirstArgs<ExtArgs>>): Prisma__CommandLogClient<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

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
     */
    findFirstOrThrow<T extends CommandLogFindFirstOrThrowArgs>(args?: SelectSubset<T, CommandLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommandLogClient<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CommandLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommandLogFindManyArgs} args - Arguments to filter and select certain fields only.
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
     */
    findMany<T extends CommandLogFindManyArgs>(args?: SelectSubset<T, CommandLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, "findMany">>

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
     */
    create<T extends CommandLogCreateArgs>(args: SelectSubset<T, CommandLogCreateArgs<ExtArgs>>): Prisma__CommandLogClient<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CommandLogs.
     * @param {CommandLogCreateManyArgs} args - Arguments to create many CommandLogs.
     * @example
     * // Create many CommandLogs
     * const commandLog = await prisma.commandLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommandLogCreateManyArgs>(args?: SelectSubset<T, CommandLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CommandLogs and returns the data saved in the database.
     * @param {CommandLogCreateManyAndReturnArgs} args - Arguments to create many CommandLogs.
     * @example
     * // Create many CommandLogs
     * const commandLog = await prisma.commandLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CommandLogs and only return the `id`
     * const commandLogWithIdOnly = await prisma.commandLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommandLogCreateManyAndReturnArgs>(args?: SelectSubset<T, CommandLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, "createManyAndReturn">>

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
     */
    delete<T extends CommandLogDeleteArgs>(args: SelectSubset<T, CommandLogDeleteArgs<ExtArgs>>): Prisma__CommandLogClient<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

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
     */
    update<T extends CommandLogUpdateArgs>(args: SelectSubset<T, CommandLogUpdateArgs<ExtArgs>>): Prisma__CommandLogClient<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

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
     */
    deleteMany<T extends CommandLogDeleteManyArgs>(args?: SelectSubset<T, CommandLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

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
     */
    updateMany<T extends CommandLogUpdateManyArgs>(args: SelectSubset<T, CommandLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

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
     */
    upsert<T extends CommandLogUpsertArgs>(args: SelectSubset<T, CommandLogUpsertArgs<ExtArgs>>): Prisma__CommandLogClient<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


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
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    sshConnection<T extends CommandLog$sshConnectionArgs<ExtArgs> = {}>(args?: Subset<T, CommandLog$sshConnectionArgs<ExtArgs>>): Prisma__SSHConnectionClient<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
     */
    include?: CommandLogInclude<ExtArgs> | null
    /**
     * The data needed to create a CommandLog.
     */
    data: XOR<CommandLogCreateInput, CommandLogUncheckedCreateInput>
  }

  /**
   * CommandLog createMany
   */
  export type CommandLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CommandLogs.
     */
    data: CommandLogCreateManyInput | CommandLogCreateManyInput[]
  }

  /**
   * CommandLog createManyAndReturn
   */
  export type CommandLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommandLog
     */
    select?: CommandLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CommandLogs.
     */
    data: CommandLogCreateManyInput | CommandLogCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommandLogIncludeCreateManyAndReturn<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
    updatedAt: 'updatedAt',
    settings: 'settings'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SSHConnectionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    host: 'host',
    port: 'port',
    username: 'username',
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
    userId: 'userId'
  };

  export type SSHConnectionScalarFieldEnum = (typeof SSHConnectionScalarFieldEnum)[keyof typeof SSHConnectionScalarFieldEnum]


  export const ChatSessionScalarFieldEnum: {
    id: 'id',
    title: 'title',
    type: 'type',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    config: 'config',
    meta: 'meta',
    userId: 'userId',
    sshConnectionId: 'sshConnectionId'
  };

  export type ChatSessionScalarFieldEnum = (typeof ChatSessionScalarFieldEnum)[keyof typeof ChatSessionScalarFieldEnum]


  export const MessageScalarFieldEnum: {
    id: 'id',
    content: 'content',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    meta: 'meta',
    extra: 'extra',
    isDeleted: 'isDeleted',
    isEdited: 'isEdited',
    plugin: 'plugin',
    pluginState: 'pluginState',
    translate: 'translate',
    tts: 'tts',
    sessionId: 'sessionId',
    userId: 'userId'
  };

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


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
    settings?: StringNullableFilter<"User"> | string | null
    sshConnections?: SSHConnectionListRelationFilter
    chatSessions?: ChatSessionListRelationFilter
    messages?: MessageListRelationFilter
    commandLogs?: CommandLogListRelationFilter
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
    settings?: SortOrderInput | SortOrder
    sshConnections?: SSHConnectionOrderByRelationAggregateInput
    chatSessions?: ChatSessionOrderByRelationAggregateInput
    messages?: MessageOrderByRelationAggregateInput
    commandLogs?: CommandLogOrderByRelationAggregateInput
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
    settings?: StringNullableFilter<"User"> | string | null
    sshConnections?: SSHConnectionListRelationFilter
    chatSessions?: ChatSessionListRelationFilter
    messages?: MessageListRelationFilter
    commandLogs?: CommandLogListRelationFilter
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
    settings?: SortOrderInput | SortOrder
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
    settings?: StringNullableWithAggregatesFilter<"User"> | string | null
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
    userId?: StringFilter<"SSHConnection"> | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    chatSessions?: ChatSessionListRelationFilter
    commandLogs?: CommandLogListRelationFilter
  }

  export type SSHConnectionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
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
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
    chatSessions?: ChatSessionOrderByRelationAggregateInput
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
    userId?: StringFilter<"SSHConnection"> | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    chatSessions?: ChatSessionListRelationFilter
    commandLogs?: CommandLogListRelationFilter
  }, "id">

  export type SSHConnectionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
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
    userId?: StringWithAggregatesFilter<"SSHConnection"> | string
  }

  export type ChatSessionWhereInput = {
    AND?: ChatSessionWhereInput | ChatSessionWhereInput[]
    OR?: ChatSessionWhereInput[]
    NOT?: ChatSessionWhereInput | ChatSessionWhereInput[]
    id?: StringFilter<"ChatSession"> | string
    title?: StringFilter<"ChatSession"> | string
    type?: StringFilter<"ChatSession"> | string
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
    config?: StringNullableFilter<"ChatSession"> | string | null
    meta?: StringNullableFilter<"ChatSession"> | string | null
    userId?: StringFilter<"ChatSession"> | string
    sshConnectionId?: StringNullableFilter<"ChatSession"> | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    sshConnection?: XOR<SSHConnectionNullableRelationFilter, SSHConnectionWhereInput> | null
    messages?: MessageListRelationFilter
  }

  export type ChatSessionOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    config?: SortOrderInput | SortOrder
    meta?: SortOrderInput | SortOrder
    userId?: SortOrder
    sshConnectionId?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    sshConnection?: SSHConnectionOrderByWithRelationInput
    messages?: MessageOrderByRelationAggregateInput
  }

  export type ChatSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatSessionWhereInput | ChatSessionWhereInput[]
    OR?: ChatSessionWhereInput[]
    NOT?: ChatSessionWhereInput | ChatSessionWhereInput[]
    title?: StringFilter<"ChatSession"> | string
    type?: StringFilter<"ChatSession"> | string
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
    config?: StringNullableFilter<"ChatSession"> | string | null
    meta?: StringNullableFilter<"ChatSession"> | string | null
    userId?: StringFilter<"ChatSession"> | string
    sshConnectionId?: StringNullableFilter<"ChatSession"> | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    sshConnection?: XOR<SSHConnectionNullableRelationFilter, SSHConnectionWhereInput> | null
    messages?: MessageListRelationFilter
  }, "id">

  export type ChatSessionOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    config?: SortOrderInput | SortOrder
    meta?: SortOrderInput | SortOrder
    userId?: SortOrder
    sshConnectionId?: SortOrderInput | SortOrder
    _count?: ChatSessionCountOrderByAggregateInput
    _max?: ChatSessionMaxOrderByAggregateInput
    _min?: ChatSessionMinOrderByAggregateInput
  }

  export type ChatSessionScalarWhereWithAggregatesInput = {
    AND?: ChatSessionScalarWhereWithAggregatesInput | ChatSessionScalarWhereWithAggregatesInput[]
    OR?: ChatSessionScalarWhereWithAggregatesInput[]
    NOT?: ChatSessionScalarWhereWithAggregatesInput | ChatSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatSession"> | string
    title?: StringWithAggregatesFilter<"ChatSession"> | string
    type?: StringWithAggregatesFilter<"ChatSession"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ChatSession"> | Date | string
    config?: StringNullableWithAggregatesFilter<"ChatSession"> | string | null
    meta?: StringNullableWithAggregatesFilter<"ChatSession"> | string | null
    userId?: StringWithAggregatesFilter<"ChatSession"> | string
    sshConnectionId?: StringNullableWithAggregatesFilter<"ChatSession"> | string | null
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    role?: StringFilter<"Message"> | string
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
    meta?: StringNullableFilter<"Message"> | string | null
    extra?: StringNullableFilter<"Message"> | string | null
    isDeleted?: BoolFilter<"Message"> | boolean
    isEdited?: BoolFilter<"Message"> | boolean
    plugin?: StringNullableFilter<"Message"> | string | null
    pluginState?: StringNullableFilter<"Message"> | string | null
    translate?: StringNullableFilter<"Message"> | string | null
    tts?: StringNullableFilter<"Message"> | string | null
    sessionId?: StringFilter<"Message"> | string
    userId?: StringFilter<"Message"> | string
    session?: XOR<ChatSessionRelationFilter, ChatSessionWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    meta?: SortOrderInput | SortOrder
    extra?: SortOrderInput | SortOrder
    isDeleted?: SortOrder
    isEdited?: SortOrder
    plugin?: SortOrderInput | SortOrder
    pluginState?: SortOrderInput | SortOrder
    translate?: SortOrderInput | SortOrder
    tts?: SortOrderInput | SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    session?: ChatSessionOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    content?: StringFilter<"Message"> | string
    role?: StringFilter<"Message"> | string
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
    meta?: StringNullableFilter<"Message"> | string | null
    extra?: StringNullableFilter<"Message"> | string | null
    isDeleted?: BoolFilter<"Message"> | boolean
    isEdited?: BoolFilter<"Message"> | boolean
    plugin?: StringNullableFilter<"Message"> | string | null
    pluginState?: StringNullableFilter<"Message"> | string | null
    translate?: StringNullableFilter<"Message"> | string | null
    tts?: StringNullableFilter<"Message"> | string | null
    sessionId?: StringFilter<"Message"> | string
    userId?: StringFilter<"Message"> | string
    session?: XOR<ChatSessionRelationFilter, ChatSessionWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    meta?: SortOrderInput | SortOrder
    extra?: SortOrderInput | SortOrder
    isDeleted?: SortOrder
    isEdited?: SortOrder
    plugin?: SortOrderInput | SortOrder
    pluginState?: SortOrderInput | SortOrder
    translate?: SortOrderInput | SortOrder
    tts?: SortOrderInput | SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    _count?: MessageCountOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    OR?: MessageScalarWhereWithAggregatesInput[]
    NOT?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Message"> | string
    content?: StringWithAggregatesFilter<"Message"> | string
    role?: StringWithAggregatesFilter<"Message"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
    meta?: StringNullableWithAggregatesFilter<"Message"> | string | null
    extra?: StringNullableWithAggregatesFilter<"Message"> | string | null
    isDeleted?: BoolWithAggregatesFilter<"Message"> | boolean
    isEdited?: BoolWithAggregatesFilter<"Message"> | boolean
    plugin?: StringNullableWithAggregatesFilter<"Message"> | string | null
    pluginState?: StringNullableWithAggregatesFilter<"Message"> | string | null
    translate?: StringNullableWithAggregatesFilter<"Message"> | string | null
    tts?: StringNullableWithAggregatesFilter<"Message"> | string | null
    sessionId?: StringWithAggregatesFilter<"Message"> | string
    userId?: StringWithAggregatesFilter<"Message"> | string
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
    settings?: string | null
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogCreateNestedManyWithoutUserInput
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
    settings?: string | null
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutUserInput
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
    settings?: NullableStringFieldUpdateOperationsInput | string | null
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUpdateManyWithoutUserNestedInput
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
    settings?: NullableStringFieldUpdateOperationsInput | string | null
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
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
    settings?: string | null
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
    settings?: NullableStringFieldUpdateOperationsInput | string | null
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
    settings?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SSHConnectionCreateInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
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
    chatSessions?: ChatSessionCreateNestedManyWithoutSshConnectionInput
    commandLogs?: CommandLogCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionUncheckedCreateInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
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
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutSshConnectionInput
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
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
    chatSessions?: ChatSessionUpdateManyWithoutSshConnectionNestedInput
    commandLogs?: CommandLogUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
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
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutSshConnectionNestedInput
    commandLogs?: CommandLogUncheckedUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionCreateManyInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
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
  }

  export type SSHConnectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
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

  export type ChatSessionCreateInput = {
    id?: string
    title: string
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: string | null
    meta?: string | null
    user: UserCreateNestedOneWithoutChatSessionsInput
    sshConnection?: SSHConnectionCreateNestedOneWithoutChatSessionsInput
    messages?: MessageCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUncheckedCreateInput = {
    id?: string
    title: string
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: string | null
    meta?: string | null
    userId: string
    sshConnectionId?: string | null
    messages?: MessageUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutChatSessionsNestedInput
    sshConnection?: SSHConnectionUpdateOneWithoutChatSessionsNestedInput
    messages?: MessageUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    sshConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
    messages?: MessageUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionCreateManyInput = {
    id?: string
    title: string
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: string | null
    meta?: string | null
    userId: string
    sshConnectionId?: string | null
  }

  export type ChatSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ChatSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    sshConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MessageCreateInput = {
    id?: string
    content: string
    role: string
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: string | null
    extra?: string | null
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: string | null
    pluginState?: string | null
    translate?: string | null
    tts?: string | null
    session: ChatSessionCreateNestedOneWithoutMessagesInput
    user: UserCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateInput = {
    id?: string
    content: string
    role: string
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: string | null
    extra?: string | null
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: string | null
    pluginState?: string | null
    translate?: string | null
    tts?: string | null
    sessionId: string
    userId: string
  }

  export type MessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    extra?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableStringFieldUpdateOperationsInput | string | null
    pluginState?: NullableStringFieldUpdateOperationsInput | string | null
    translate?: NullableStringFieldUpdateOperationsInput | string | null
    tts?: NullableStringFieldUpdateOperationsInput | string | null
    session?: ChatSessionUpdateOneRequiredWithoutMessagesNestedInput
    user?: UserUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    extra?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableStringFieldUpdateOperationsInput | string | null
    pluginState?: NullableStringFieldUpdateOperationsInput | string | null
    translate?: NullableStringFieldUpdateOperationsInput | string | null
    tts?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type MessageCreateManyInput = {
    id?: string
    content: string
    role: string
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: string | null
    extra?: string | null
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: string | null
    pluginState?: string | null
    translate?: string | null
    tts?: string | null
    sessionId: string
    userId: string
  }

  export type MessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    extra?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableStringFieldUpdateOperationsInput | string | null
    pluginState?: NullableStringFieldUpdateOperationsInput | string | null
    translate?: NullableStringFieldUpdateOperationsInput | string | null
    tts?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    extra?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableStringFieldUpdateOperationsInput | string | null
    pluginState?: NullableStringFieldUpdateOperationsInput | string | null
    translate?: NullableStringFieldUpdateOperationsInput | string | null
    tts?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: StringFieldUpdateOperationsInput | string
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

  export type CommandLogCreateManyInput = {
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

  export type SSHConnectionListRelationFilter = {
    every?: SSHConnectionWhereInput
    some?: SSHConnectionWhereInput
    none?: SSHConnectionWhereInput
  }

  export type ChatSessionListRelationFilter = {
    every?: ChatSessionWhereInput
    some?: ChatSessionWhereInput
    none?: ChatSessionWhereInput
  }

  export type MessageListRelationFilter = {
    every?: MessageWhereInput
    some?: MessageWhereInput
    none?: MessageWhereInput
  }

  export type CommandLogListRelationFilter = {
    every?: CommandLogWhereInput
    some?: CommandLogWhereInput
    none?: CommandLogWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SSHConnectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MessageOrderByRelationAggregateInput = {
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
    settings?: SortOrder
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
    settings?: SortOrder
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
    settings?: SortOrder
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

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SSHConnectionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
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
    userId?: SortOrder
  }

  export type SSHConnectionAvgOrderByAggregateInput = {
    port?: SortOrder
  }

  export type SSHConnectionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
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
    userId?: SortOrder
  }

  export type SSHConnectionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
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
    userId?: SortOrder
  }

  export type SSHConnectionSumOrderByAggregateInput = {
    port?: SortOrder
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

  export type SSHConnectionNullableRelationFilter = {
    is?: SSHConnectionWhereInput | null
    isNot?: SSHConnectionWhereInput | null
  }

  export type ChatSessionCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    config?: SortOrder
    meta?: SortOrder
    userId?: SortOrder
    sshConnectionId?: SortOrder
  }

  export type ChatSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    config?: SortOrder
    meta?: SortOrder
    userId?: SortOrder
    sshConnectionId?: SortOrder
  }

  export type ChatSessionMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    config?: SortOrder
    meta?: SortOrder
    userId?: SortOrder
    sshConnectionId?: SortOrder
  }

  export type ChatSessionRelationFilter = {
    is?: ChatSessionWhereInput
    isNot?: ChatSessionWhereInput
  }

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    meta?: SortOrder
    extra?: SortOrder
    isDeleted?: SortOrder
    isEdited?: SortOrder
    plugin?: SortOrder
    pluginState?: SortOrder
    translate?: SortOrder
    tts?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    meta?: SortOrder
    extra?: SortOrder
    isDeleted?: SortOrder
    isEdited?: SortOrder
    plugin?: SortOrder
    pluginState?: SortOrder
    translate?: SortOrder
    tts?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    meta?: SortOrder
    extra?: SortOrder
    isDeleted?: SortOrder
    isEdited?: SortOrder
    plugin?: SortOrder
    pluginState?: SortOrder
    translate?: SortOrder
    tts?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
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

  export type SSHConnectionCreateNestedManyWithoutUserInput = {
    create?: XOR<SSHConnectionCreateWithoutUserInput, SSHConnectionUncheckedCreateWithoutUserInput> | SSHConnectionCreateWithoutUserInput[] | SSHConnectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutUserInput | SSHConnectionCreateOrConnectWithoutUserInput[]
    createMany?: SSHConnectionCreateManyUserInputEnvelope
    connect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
  }

  export type ChatSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutUserInput = {
    create?: XOR<MessageCreateWithoutUserInput, MessageUncheckedCreateWithoutUserInput> | MessageCreateWithoutUserInput[] | MessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutUserInput | MessageCreateOrConnectWithoutUserInput[]
    createMany?: MessageCreateManyUserInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type CommandLogCreateNestedManyWithoutUserInput = {
    create?: XOR<CommandLogCreateWithoutUserInput, CommandLogUncheckedCreateWithoutUserInput> | CommandLogCreateWithoutUserInput[] | CommandLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommandLogCreateOrConnectWithoutUserInput | CommandLogCreateOrConnectWithoutUserInput[]
    createMany?: CommandLogCreateManyUserInputEnvelope
    connect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
  }

  export type SSHConnectionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SSHConnectionCreateWithoutUserInput, SSHConnectionUncheckedCreateWithoutUserInput> | SSHConnectionCreateWithoutUserInput[] | SSHConnectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutUserInput | SSHConnectionCreateOrConnectWithoutUserInput[]
    createMany?: SSHConnectionCreateManyUserInputEnvelope
    connect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
  }

  export type ChatSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<MessageCreateWithoutUserInput, MessageUncheckedCreateWithoutUserInput> | MessageCreateWithoutUserInput[] | MessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutUserInput | MessageCreateOrConnectWithoutUserInput[]
    createMany?: MessageCreateManyUserInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type CommandLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CommandLogCreateWithoutUserInput, CommandLogUncheckedCreateWithoutUserInput> | CommandLogCreateWithoutUserInput[] | CommandLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommandLogCreateOrConnectWithoutUserInput | CommandLogCreateOrConnectWithoutUserInput[]
    createMany?: CommandLogCreateManyUserInputEnvelope
    connect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
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

  export type SSHConnectionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SSHConnectionCreateWithoutUserInput, SSHConnectionUncheckedCreateWithoutUserInput> | SSHConnectionCreateWithoutUserInput[] | SSHConnectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutUserInput | SSHConnectionCreateOrConnectWithoutUserInput[]
    upsert?: SSHConnectionUpsertWithWhereUniqueWithoutUserInput | SSHConnectionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SSHConnectionCreateManyUserInputEnvelope
    set?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    disconnect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    delete?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    connect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    update?: SSHConnectionUpdateWithWhereUniqueWithoutUserInput | SSHConnectionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SSHConnectionUpdateManyWithWhereWithoutUserInput | SSHConnectionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SSHConnectionScalarWhereInput | SSHConnectionScalarWhereInput[]
  }

  export type ChatSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    upsert?: ChatSessionUpsertWithWhereUniqueWithoutUserInput | ChatSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    set?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    disconnect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    delete?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    update?: ChatSessionUpdateWithWhereUniqueWithoutUserInput | ChatSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatSessionUpdateManyWithWhereWithoutUserInput | ChatSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutUserNestedInput = {
    create?: XOR<MessageCreateWithoutUserInput, MessageUncheckedCreateWithoutUserInput> | MessageCreateWithoutUserInput[] | MessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutUserInput | MessageCreateOrConnectWithoutUserInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutUserInput | MessageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MessageCreateManyUserInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutUserInput | MessageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutUserInput | MessageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type CommandLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommandLogCreateWithoutUserInput, CommandLogUncheckedCreateWithoutUserInput> | CommandLogCreateWithoutUserInput[] | CommandLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommandLogCreateOrConnectWithoutUserInput | CommandLogCreateOrConnectWithoutUserInput[]
    upsert?: CommandLogUpsertWithWhereUniqueWithoutUserInput | CommandLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CommandLogCreateManyUserInputEnvelope
    set?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    disconnect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    delete?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    connect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    update?: CommandLogUpdateWithWhereUniqueWithoutUserInput | CommandLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommandLogUpdateManyWithWhereWithoutUserInput | CommandLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommandLogScalarWhereInput | CommandLogScalarWhereInput[]
  }

  export type SSHConnectionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SSHConnectionCreateWithoutUserInput, SSHConnectionUncheckedCreateWithoutUserInput> | SSHConnectionCreateWithoutUserInput[] | SSHConnectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutUserInput | SSHConnectionCreateOrConnectWithoutUserInput[]
    upsert?: SSHConnectionUpsertWithWhereUniqueWithoutUserInput | SSHConnectionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SSHConnectionCreateManyUserInputEnvelope
    set?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    disconnect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    delete?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    connect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    update?: SSHConnectionUpdateWithWhereUniqueWithoutUserInput | SSHConnectionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SSHConnectionUpdateManyWithWhereWithoutUserInput | SSHConnectionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SSHConnectionScalarWhereInput | SSHConnectionScalarWhereInput[]
  }

  export type ChatSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    upsert?: ChatSessionUpsertWithWhereUniqueWithoutUserInput | ChatSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    set?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    disconnect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    delete?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    update?: ChatSessionUpdateWithWhereUniqueWithoutUserInput | ChatSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatSessionUpdateManyWithWhereWithoutUserInput | ChatSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<MessageCreateWithoutUserInput, MessageUncheckedCreateWithoutUserInput> | MessageCreateWithoutUserInput[] | MessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutUserInput | MessageCreateOrConnectWithoutUserInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutUserInput | MessageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MessageCreateManyUserInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutUserInput | MessageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutUserInput | MessageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type CommandLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommandLogCreateWithoutUserInput, CommandLogUncheckedCreateWithoutUserInput> | CommandLogCreateWithoutUserInput[] | CommandLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommandLogCreateOrConnectWithoutUserInput | CommandLogCreateOrConnectWithoutUserInput[]
    upsert?: CommandLogUpsertWithWhereUniqueWithoutUserInput | CommandLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CommandLogCreateManyUserInputEnvelope
    set?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    disconnect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    delete?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    connect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    update?: CommandLogUpdateWithWhereUniqueWithoutUserInput | CommandLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommandLogUpdateManyWithWhereWithoutUserInput | CommandLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommandLogScalarWhereInput | CommandLogScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSshConnectionsInput = {
    create?: XOR<UserCreateWithoutSshConnectionsInput, UserUncheckedCreateWithoutSshConnectionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSshConnectionsInput
    connect?: UserWhereUniqueInput
  }

  export type ChatSessionCreateNestedManyWithoutSshConnectionInput = {
    create?: XOR<ChatSessionCreateWithoutSshConnectionInput, ChatSessionUncheckedCreateWithoutSshConnectionInput> | ChatSessionCreateWithoutSshConnectionInput[] | ChatSessionUncheckedCreateWithoutSshConnectionInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutSshConnectionInput | ChatSessionCreateOrConnectWithoutSshConnectionInput[]
    createMany?: ChatSessionCreateManySshConnectionInputEnvelope
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
  }

  export type CommandLogCreateNestedManyWithoutSshConnectionInput = {
    create?: XOR<CommandLogCreateWithoutSshConnectionInput, CommandLogUncheckedCreateWithoutSshConnectionInput> | CommandLogCreateWithoutSshConnectionInput[] | CommandLogUncheckedCreateWithoutSshConnectionInput[]
    connectOrCreate?: CommandLogCreateOrConnectWithoutSshConnectionInput | CommandLogCreateOrConnectWithoutSshConnectionInput[]
    createMany?: CommandLogCreateManySshConnectionInputEnvelope
    connect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
  }

  export type ChatSessionUncheckedCreateNestedManyWithoutSshConnectionInput = {
    create?: XOR<ChatSessionCreateWithoutSshConnectionInput, ChatSessionUncheckedCreateWithoutSshConnectionInput> | ChatSessionCreateWithoutSshConnectionInput[] | ChatSessionUncheckedCreateWithoutSshConnectionInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutSshConnectionInput | ChatSessionCreateOrConnectWithoutSshConnectionInput[]
    createMany?: ChatSessionCreateManySshConnectionInputEnvelope
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
  }

  export type CommandLogUncheckedCreateNestedManyWithoutSshConnectionInput = {
    create?: XOR<CommandLogCreateWithoutSshConnectionInput, CommandLogUncheckedCreateWithoutSshConnectionInput> | CommandLogCreateWithoutSshConnectionInput[] | CommandLogUncheckedCreateWithoutSshConnectionInput[]
    connectOrCreate?: CommandLogCreateOrConnectWithoutSshConnectionInput | CommandLogCreateOrConnectWithoutSshConnectionInput[]
    createMany?: CommandLogCreateManySshConnectionInputEnvelope
    connect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutSshConnectionsNestedInput = {
    create?: XOR<UserCreateWithoutSshConnectionsInput, UserUncheckedCreateWithoutSshConnectionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSshConnectionsInput
    upsert?: UserUpsertWithoutSshConnectionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSshConnectionsInput, UserUpdateWithoutSshConnectionsInput>, UserUncheckedUpdateWithoutSshConnectionsInput>
  }

  export type ChatSessionUpdateManyWithoutSshConnectionNestedInput = {
    create?: XOR<ChatSessionCreateWithoutSshConnectionInput, ChatSessionUncheckedCreateWithoutSshConnectionInput> | ChatSessionCreateWithoutSshConnectionInput[] | ChatSessionUncheckedCreateWithoutSshConnectionInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutSshConnectionInput | ChatSessionCreateOrConnectWithoutSshConnectionInput[]
    upsert?: ChatSessionUpsertWithWhereUniqueWithoutSshConnectionInput | ChatSessionUpsertWithWhereUniqueWithoutSshConnectionInput[]
    createMany?: ChatSessionCreateManySshConnectionInputEnvelope
    set?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    disconnect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    delete?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    update?: ChatSessionUpdateWithWhereUniqueWithoutSshConnectionInput | ChatSessionUpdateWithWhereUniqueWithoutSshConnectionInput[]
    updateMany?: ChatSessionUpdateManyWithWhereWithoutSshConnectionInput | ChatSessionUpdateManyWithWhereWithoutSshConnectionInput[]
    deleteMany?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
  }

  export type CommandLogUpdateManyWithoutSshConnectionNestedInput = {
    create?: XOR<CommandLogCreateWithoutSshConnectionInput, CommandLogUncheckedCreateWithoutSshConnectionInput> | CommandLogCreateWithoutSshConnectionInput[] | CommandLogUncheckedCreateWithoutSshConnectionInput[]
    connectOrCreate?: CommandLogCreateOrConnectWithoutSshConnectionInput | CommandLogCreateOrConnectWithoutSshConnectionInput[]
    upsert?: CommandLogUpsertWithWhereUniqueWithoutSshConnectionInput | CommandLogUpsertWithWhereUniqueWithoutSshConnectionInput[]
    createMany?: CommandLogCreateManySshConnectionInputEnvelope
    set?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    disconnect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    delete?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    connect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    update?: CommandLogUpdateWithWhereUniqueWithoutSshConnectionInput | CommandLogUpdateWithWhereUniqueWithoutSshConnectionInput[]
    updateMany?: CommandLogUpdateManyWithWhereWithoutSshConnectionInput | CommandLogUpdateManyWithWhereWithoutSshConnectionInput[]
    deleteMany?: CommandLogScalarWhereInput | CommandLogScalarWhereInput[]
  }

  export type ChatSessionUncheckedUpdateManyWithoutSshConnectionNestedInput = {
    create?: XOR<ChatSessionCreateWithoutSshConnectionInput, ChatSessionUncheckedCreateWithoutSshConnectionInput> | ChatSessionCreateWithoutSshConnectionInput[] | ChatSessionUncheckedCreateWithoutSshConnectionInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutSshConnectionInput | ChatSessionCreateOrConnectWithoutSshConnectionInput[]
    upsert?: ChatSessionUpsertWithWhereUniqueWithoutSshConnectionInput | ChatSessionUpsertWithWhereUniqueWithoutSshConnectionInput[]
    createMany?: ChatSessionCreateManySshConnectionInputEnvelope
    set?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    disconnect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    delete?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    update?: ChatSessionUpdateWithWhereUniqueWithoutSshConnectionInput | ChatSessionUpdateWithWhereUniqueWithoutSshConnectionInput[]
    updateMany?: ChatSessionUpdateManyWithWhereWithoutSshConnectionInput | ChatSessionUpdateManyWithWhereWithoutSshConnectionInput[]
    deleteMany?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
  }

  export type CommandLogUncheckedUpdateManyWithoutSshConnectionNestedInput = {
    create?: XOR<CommandLogCreateWithoutSshConnectionInput, CommandLogUncheckedCreateWithoutSshConnectionInput> | CommandLogCreateWithoutSshConnectionInput[] | CommandLogUncheckedCreateWithoutSshConnectionInput[]
    connectOrCreate?: CommandLogCreateOrConnectWithoutSshConnectionInput | CommandLogCreateOrConnectWithoutSshConnectionInput[]
    upsert?: CommandLogUpsertWithWhereUniqueWithoutSshConnectionInput | CommandLogUpsertWithWhereUniqueWithoutSshConnectionInput[]
    createMany?: CommandLogCreateManySshConnectionInputEnvelope
    set?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    disconnect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    delete?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    connect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
    update?: CommandLogUpdateWithWhereUniqueWithoutSshConnectionInput | CommandLogUpdateWithWhereUniqueWithoutSshConnectionInput[]
    updateMany?: CommandLogUpdateManyWithWhereWithoutSshConnectionInput | CommandLogUpdateManyWithWhereWithoutSshConnectionInput[]
    deleteMany?: CommandLogScalarWhereInput | CommandLogScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutChatSessionsInput = {
    create?: XOR<UserCreateWithoutChatSessionsInput, UserUncheckedCreateWithoutChatSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutChatSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type SSHConnectionCreateNestedOneWithoutChatSessionsInput = {
    create?: XOR<SSHConnectionCreateWithoutChatSessionsInput, SSHConnectionUncheckedCreateWithoutChatSessionsInput>
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutChatSessionsInput
    connect?: SSHConnectionWhereUniqueInput
  }

  export type MessageCreateNestedManyWithoutSessionInput = {
    create?: XOR<MessageCreateWithoutSessionInput, MessageUncheckedCreateWithoutSessionInput> | MessageCreateWithoutSessionInput[] | MessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSessionInput | MessageCreateOrConnectWithoutSessionInput[]
    createMany?: MessageCreateManySessionInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<MessageCreateWithoutSessionInput, MessageUncheckedCreateWithoutSessionInput> | MessageCreateWithoutSessionInput[] | MessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSessionInput | MessageCreateOrConnectWithoutSessionInput[]
    createMany?: MessageCreateManySessionInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutChatSessionsNestedInput = {
    create?: XOR<UserCreateWithoutChatSessionsInput, UserUncheckedCreateWithoutChatSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutChatSessionsInput
    upsert?: UserUpsertWithoutChatSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutChatSessionsInput, UserUpdateWithoutChatSessionsInput>, UserUncheckedUpdateWithoutChatSessionsInput>
  }

  export type SSHConnectionUpdateOneWithoutChatSessionsNestedInput = {
    create?: XOR<SSHConnectionCreateWithoutChatSessionsInput, SSHConnectionUncheckedCreateWithoutChatSessionsInput>
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutChatSessionsInput
    upsert?: SSHConnectionUpsertWithoutChatSessionsInput
    disconnect?: SSHConnectionWhereInput | boolean
    delete?: SSHConnectionWhereInput | boolean
    connect?: SSHConnectionWhereUniqueInput
    update?: XOR<XOR<SSHConnectionUpdateToOneWithWhereWithoutChatSessionsInput, SSHConnectionUpdateWithoutChatSessionsInput>, SSHConnectionUncheckedUpdateWithoutChatSessionsInput>
  }

  export type MessageUpdateManyWithoutSessionNestedInput = {
    create?: XOR<MessageCreateWithoutSessionInput, MessageUncheckedCreateWithoutSessionInput> | MessageCreateWithoutSessionInput[] | MessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSessionInput | MessageCreateOrConnectWithoutSessionInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutSessionInput | MessageUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: MessageCreateManySessionInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutSessionInput | MessageUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutSessionInput | MessageUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<MessageCreateWithoutSessionInput, MessageUncheckedCreateWithoutSessionInput> | MessageCreateWithoutSessionInput[] | MessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSessionInput | MessageCreateOrConnectWithoutSessionInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutSessionInput | MessageUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: MessageCreateManySessionInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutSessionInput | MessageUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutSessionInput | MessageUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ChatSessionCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatSessionCreateOrConnectWithoutMessagesInput
    connect?: ChatSessionWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutMessagesInput = {
    create?: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutMessagesInput
    connect?: UserWhereUniqueInput
  }

  export type ChatSessionUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatSessionCreateOrConnectWithoutMessagesInput
    upsert?: ChatSessionUpsertWithoutMessagesInput
    connect?: ChatSessionWhereUniqueInput
    update?: XOR<XOR<ChatSessionUpdateToOneWithWhereWithoutMessagesInput, ChatSessionUpdateWithoutMessagesInput>, ChatSessionUncheckedUpdateWithoutMessagesInput>
  }

  export type UserUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutMessagesInput
    upsert?: UserUpsertWithoutMessagesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMessagesInput, UserUpdateWithoutMessagesInput>, UserUncheckedUpdateWithoutMessagesInput>
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

  export type SSHConnectionCreateWithoutUserInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
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
    chatSessions?: ChatSessionCreateNestedManyWithoutSshConnectionInput
    commandLogs?: CommandLogCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
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
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutSshConnectionInput
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionCreateOrConnectWithoutUserInput = {
    where: SSHConnectionWhereUniqueInput
    create: XOR<SSHConnectionCreateWithoutUserInput, SSHConnectionUncheckedCreateWithoutUserInput>
  }

  export type SSHConnectionCreateManyUserInputEnvelope = {
    data: SSHConnectionCreateManyUserInput | SSHConnectionCreateManyUserInput[]
  }

  export type ChatSessionCreateWithoutUserInput = {
    id?: string
    title: string
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: string | null
    meta?: string | null
    sshConnection?: SSHConnectionCreateNestedOneWithoutChatSessionsInput
    messages?: MessageCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: string | null
    meta?: string | null
    sshConnectionId?: string | null
    messages?: MessageUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionCreateOrConnectWithoutUserInput = {
    where: ChatSessionWhereUniqueInput
    create: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput>
  }

  export type ChatSessionCreateManyUserInputEnvelope = {
    data: ChatSessionCreateManyUserInput | ChatSessionCreateManyUserInput[]
  }

  export type MessageCreateWithoutUserInput = {
    id?: string
    content: string
    role: string
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: string | null
    extra?: string | null
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: string | null
    pluginState?: string | null
    translate?: string | null
    tts?: string | null
    session: ChatSessionCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateWithoutUserInput = {
    id?: string
    content: string
    role: string
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: string | null
    extra?: string | null
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: string | null
    pluginState?: string | null
    translate?: string | null
    tts?: string | null
    sessionId: string
  }

  export type MessageCreateOrConnectWithoutUserInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutUserInput, MessageUncheckedCreateWithoutUserInput>
  }

  export type MessageCreateManyUserInputEnvelope = {
    data: MessageCreateManyUserInput | MessageCreateManyUserInput[]
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

  export type CommandLogCreateManyUserInputEnvelope = {
    data: CommandLogCreateManyUserInput | CommandLogCreateManyUserInput[]
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
    userId?: StringFilter<"SSHConnection"> | string
  }

  export type ChatSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: ChatSessionWhereUniqueInput
    update: XOR<ChatSessionUpdateWithoutUserInput, ChatSessionUncheckedUpdateWithoutUserInput>
    create: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput>
  }

  export type ChatSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: ChatSessionWhereUniqueInput
    data: XOR<ChatSessionUpdateWithoutUserInput, ChatSessionUncheckedUpdateWithoutUserInput>
  }

  export type ChatSessionUpdateManyWithWhereWithoutUserInput = {
    where: ChatSessionScalarWhereInput
    data: XOR<ChatSessionUpdateManyMutationInput, ChatSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type ChatSessionScalarWhereInput = {
    AND?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
    OR?: ChatSessionScalarWhereInput[]
    NOT?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
    id?: StringFilter<"ChatSession"> | string
    title?: StringFilter<"ChatSession"> | string
    type?: StringFilter<"ChatSession"> | string
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
    config?: StringNullableFilter<"ChatSession"> | string | null
    meta?: StringNullableFilter<"ChatSession"> | string | null
    userId?: StringFilter<"ChatSession"> | string
    sshConnectionId?: StringNullableFilter<"ChatSession"> | string | null
  }

  export type MessageUpsertWithWhereUniqueWithoutUserInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutUserInput, MessageUncheckedUpdateWithoutUserInput>
    create: XOR<MessageCreateWithoutUserInput, MessageUncheckedCreateWithoutUserInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutUserInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutUserInput, MessageUncheckedUpdateWithoutUserInput>
  }

  export type MessageUpdateManyWithWhereWithoutUserInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutUserInput>
  }

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[]
    OR?: MessageScalarWhereInput[]
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[]
    id?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    role?: StringFilter<"Message"> | string
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
    meta?: StringNullableFilter<"Message"> | string | null
    extra?: StringNullableFilter<"Message"> | string | null
    isDeleted?: BoolFilter<"Message"> | boolean
    isEdited?: BoolFilter<"Message"> | boolean
    plugin?: StringNullableFilter<"Message"> | string | null
    pluginState?: StringNullableFilter<"Message"> | string | null
    translate?: StringNullableFilter<"Message"> | string | null
    tts?: StringNullableFilter<"Message"> | string | null
    sessionId?: StringFilter<"Message"> | string
    userId?: StringFilter<"Message"> | string
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
    settings?: string | null
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogCreateNestedManyWithoutUserInput
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
    settings?: string | null
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSshConnectionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSshConnectionsInput, UserUncheckedCreateWithoutSshConnectionsInput>
  }

  export type ChatSessionCreateWithoutSshConnectionInput = {
    id?: string
    title: string
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: string | null
    meta?: string | null
    user: UserCreateNestedOneWithoutChatSessionsInput
    messages?: MessageCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUncheckedCreateWithoutSshConnectionInput = {
    id?: string
    title: string
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: string | null
    meta?: string | null
    userId: string
    messages?: MessageUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionCreateOrConnectWithoutSshConnectionInput = {
    where: ChatSessionWhereUniqueInput
    create: XOR<ChatSessionCreateWithoutSshConnectionInput, ChatSessionUncheckedCreateWithoutSshConnectionInput>
  }

  export type ChatSessionCreateManySshConnectionInputEnvelope = {
    data: ChatSessionCreateManySshConnectionInput | ChatSessionCreateManySshConnectionInput[]
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

  export type CommandLogCreateManySshConnectionInputEnvelope = {
    data: CommandLogCreateManySshConnectionInput | CommandLogCreateManySshConnectionInput[]
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
    settings?: NullableStringFieldUpdateOperationsInput | string | null
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUpdateManyWithoutUserNestedInput
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
    settings?: NullableStringFieldUpdateOperationsInput | string | null
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChatSessionUpsertWithWhereUniqueWithoutSshConnectionInput = {
    where: ChatSessionWhereUniqueInput
    update: XOR<ChatSessionUpdateWithoutSshConnectionInput, ChatSessionUncheckedUpdateWithoutSshConnectionInput>
    create: XOR<ChatSessionCreateWithoutSshConnectionInput, ChatSessionUncheckedCreateWithoutSshConnectionInput>
  }

  export type ChatSessionUpdateWithWhereUniqueWithoutSshConnectionInput = {
    where: ChatSessionWhereUniqueInput
    data: XOR<ChatSessionUpdateWithoutSshConnectionInput, ChatSessionUncheckedUpdateWithoutSshConnectionInput>
  }

  export type ChatSessionUpdateManyWithWhereWithoutSshConnectionInput = {
    where: ChatSessionScalarWhereInput
    data: XOR<ChatSessionUpdateManyMutationInput, ChatSessionUncheckedUpdateManyWithoutSshConnectionInput>
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

  export type UserCreateWithoutChatSessionsInput = {
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
    settings?: string | null
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutChatSessionsInput = {
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
    settings?: string | null
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutChatSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutChatSessionsInput, UserUncheckedCreateWithoutChatSessionsInput>
  }

  export type SSHConnectionCreateWithoutChatSessionsInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
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

  export type SSHConnectionUncheckedCreateWithoutChatSessionsInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
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

  export type SSHConnectionCreateOrConnectWithoutChatSessionsInput = {
    where: SSHConnectionWhereUniqueInput
    create: XOR<SSHConnectionCreateWithoutChatSessionsInput, SSHConnectionUncheckedCreateWithoutChatSessionsInput>
  }

  export type MessageCreateWithoutSessionInput = {
    id?: string
    content: string
    role: string
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: string | null
    extra?: string | null
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: string | null
    pluginState?: string | null
    translate?: string | null
    tts?: string | null
    user: UserCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateWithoutSessionInput = {
    id?: string
    content: string
    role: string
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: string | null
    extra?: string | null
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: string | null
    pluginState?: string | null
    translate?: string | null
    tts?: string | null
    userId: string
  }

  export type MessageCreateOrConnectWithoutSessionInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutSessionInput, MessageUncheckedCreateWithoutSessionInput>
  }

  export type MessageCreateManySessionInputEnvelope = {
    data: MessageCreateManySessionInput | MessageCreateManySessionInput[]
  }

  export type UserUpsertWithoutChatSessionsInput = {
    update: XOR<UserUpdateWithoutChatSessionsInput, UserUncheckedUpdateWithoutChatSessionsInput>
    create: XOR<UserCreateWithoutChatSessionsInput, UserUncheckedCreateWithoutChatSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutChatSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutChatSessionsInput, UserUncheckedUpdateWithoutChatSessionsInput>
  }

  export type UserUpdateWithoutChatSessionsInput = {
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
    settings?: NullableStringFieldUpdateOperationsInput | string | null
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutChatSessionsInput = {
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
    settings?: NullableStringFieldUpdateOperationsInput | string | null
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type SSHConnectionUpsertWithoutChatSessionsInput = {
    update: XOR<SSHConnectionUpdateWithoutChatSessionsInput, SSHConnectionUncheckedUpdateWithoutChatSessionsInput>
    create: XOR<SSHConnectionCreateWithoutChatSessionsInput, SSHConnectionUncheckedCreateWithoutChatSessionsInput>
    where?: SSHConnectionWhereInput
  }

  export type SSHConnectionUpdateToOneWithWhereWithoutChatSessionsInput = {
    where?: SSHConnectionWhereInput
    data: XOR<SSHConnectionUpdateWithoutChatSessionsInput, SSHConnectionUncheckedUpdateWithoutChatSessionsInput>
  }

  export type SSHConnectionUpdateWithoutChatSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
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

  export type SSHConnectionUncheckedUpdateWithoutChatSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
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

  export type MessageUpsertWithWhereUniqueWithoutSessionInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutSessionInput, MessageUncheckedUpdateWithoutSessionInput>
    create: XOR<MessageCreateWithoutSessionInput, MessageUncheckedCreateWithoutSessionInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutSessionInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutSessionInput, MessageUncheckedUpdateWithoutSessionInput>
  }

  export type MessageUpdateManyWithWhereWithoutSessionInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutSessionInput>
  }

  export type ChatSessionCreateWithoutMessagesInput = {
    id?: string
    title: string
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: string | null
    meta?: string | null
    user: UserCreateNestedOneWithoutChatSessionsInput
    sshConnection?: SSHConnectionCreateNestedOneWithoutChatSessionsInput
  }

  export type ChatSessionUncheckedCreateWithoutMessagesInput = {
    id?: string
    title: string
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: string | null
    meta?: string | null
    userId: string
    sshConnectionId?: string | null
  }

  export type ChatSessionCreateOrConnectWithoutMessagesInput = {
    where: ChatSessionWhereUniqueInput
    create: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
  }

  export type UserCreateWithoutMessagesInput = {
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
    settings?: string | null
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMessagesInput = {
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
    settings?: string | null
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMessagesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
  }

  export type ChatSessionUpsertWithoutMessagesInput = {
    update: XOR<ChatSessionUpdateWithoutMessagesInput, ChatSessionUncheckedUpdateWithoutMessagesInput>
    create: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
    where?: ChatSessionWhereInput
  }

  export type ChatSessionUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ChatSessionWhereInput
    data: XOR<ChatSessionUpdateWithoutMessagesInput, ChatSessionUncheckedUpdateWithoutMessagesInput>
  }

  export type ChatSessionUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutChatSessionsNestedInput
    sshConnection?: SSHConnectionUpdateOneWithoutChatSessionsNestedInput
  }

  export type ChatSessionUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    sshConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUpsertWithoutMessagesInput = {
    update: XOR<UserUpdateWithoutMessagesInput, UserUncheckedUpdateWithoutMessagesInput>
    create: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMessagesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMessagesInput, UserUncheckedUpdateWithoutMessagesInput>
  }

  export type UserUpdateWithoutMessagesInput = {
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
    settings?: NullableStringFieldUpdateOperationsInput | string | null
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMessagesInput = {
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
    settings?: NullableStringFieldUpdateOperationsInput | string | null
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUncheckedUpdateManyWithoutUserNestedInput
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
    settings?: string | null
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutUserInput
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
    settings?: string | null
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutUserInput
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
    chatSessions?: ChatSessionCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionUncheckedCreateWithoutCommandLogsInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
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
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutSshConnectionInput
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
    settings?: NullableStringFieldUpdateOperationsInput | string | null
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutUserNestedInput
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
    settings?: NullableStringFieldUpdateOperationsInput | string | null
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutUserNestedInput
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
    chatSessions?: ChatSessionUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionUncheckedUpdateWithoutCommandLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
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
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionCreateManyUserInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
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
  }

  export type ChatSessionCreateManyUserInput = {
    id?: string
    title: string
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: string | null
    meta?: string | null
    sshConnectionId?: string | null
  }

  export type MessageCreateManyUserInput = {
    id?: string
    content: string
    role: string
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: string | null
    extra?: string | null
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: string | null
    pluginState?: string | null
    translate?: string | null
    tts?: string | null
    sessionId: string
  }

  export type CommandLogCreateManyUserInput = {
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

  export type SSHConnectionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
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
    chatSessions?: ChatSessionUpdateManyWithoutSshConnectionNestedInput
    commandLogs?: CommandLogUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
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
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutSshConnectionNestedInput
    commandLogs?: CommandLogUncheckedUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
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

  export type ChatSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    sshConnection?: SSHConnectionUpdateOneWithoutChatSessionsNestedInput
    messages?: MessageUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    sshConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
    messages?: MessageUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    sshConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MessageUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    extra?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableStringFieldUpdateOperationsInput | string | null
    pluginState?: NullableStringFieldUpdateOperationsInput | string | null
    translate?: NullableStringFieldUpdateOperationsInput | string | null
    tts?: NullableStringFieldUpdateOperationsInput | string | null
    session?: ChatSessionUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    extra?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableStringFieldUpdateOperationsInput | string | null
    pluginState?: NullableStringFieldUpdateOperationsInput | string | null
    translate?: NullableStringFieldUpdateOperationsInput | string | null
    tts?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: StringFieldUpdateOperationsInput | string
  }

  export type MessageUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    extra?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableStringFieldUpdateOperationsInput | string | null
    pluginState?: NullableStringFieldUpdateOperationsInput | string | null
    translate?: NullableStringFieldUpdateOperationsInput | string | null
    tts?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: StringFieldUpdateOperationsInput | string
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

  export type ChatSessionCreateManySshConnectionInput = {
    id?: string
    title: string
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: string | null
    meta?: string | null
    userId: string
  }

  export type CommandLogCreateManySshConnectionInput = {
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

  export type ChatSessionUpdateWithoutSshConnectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutChatSessionsNestedInput
    messages?: MessageUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateWithoutSshConnectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    messages?: MessageUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateManyWithoutSshConnectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type MessageCreateManySessionInput = {
    id?: string
    content: string
    role: string
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: string | null
    extra?: string | null
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: string | null
    pluginState?: string | null
    translate?: string | null
    tts?: string | null
    userId: string
  }

  export type MessageUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    extra?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableStringFieldUpdateOperationsInput | string | null
    pluginState?: NullableStringFieldUpdateOperationsInput | string | null
    translate?: NullableStringFieldUpdateOperationsInput | string | null
    tts?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    extra?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableStringFieldUpdateOperationsInput | string | null
    pluginState?: NullableStringFieldUpdateOperationsInput | string | null
    translate?: NullableStringFieldUpdateOperationsInput | string | null
    tts?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type MessageUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableStringFieldUpdateOperationsInput | string | null
    extra?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableStringFieldUpdateOperationsInput | string | null
    pluginState?: NullableStringFieldUpdateOperationsInput | string | null
    translate?: NullableStringFieldUpdateOperationsInput | string | null
    tts?: NullableStringFieldUpdateOperationsInput | string | null
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
     * @deprecated Use SSHConnectionCountOutputTypeDefaultArgs instead
     */
    export type SSHConnectionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SSHConnectionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChatSessionCountOutputTypeDefaultArgs instead
     */
    export type ChatSessionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChatSessionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SSHConnectionDefaultArgs instead
     */
    export type SSHConnectionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SSHConnectionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChatSessionDefaultArgs instead
     */
    export type ChatSessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChatSessionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MessageDefaultArgs instead
     */
    export type MessageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MessageDefaultArgs<ExtArgs>
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