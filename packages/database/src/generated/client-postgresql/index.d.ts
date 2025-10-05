
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
 * Model ChatFolder
 * 
 */
export type ChatFolder = $Result.DefaultSelection<Prisma.$ChatFolderPayload>
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
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  USER: 'USER',
  ADMIN: 'ADMIN',
  PREMIUM: 'PREMIUM'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const SSHAuthType: {
  PASSWORD: 'PASSWORD',
  PRIVATE_KEY: 'PRIVATE_KEY',
  SSH_AGENT: 'SSH_AGENT'
};

export type SSHAuthType = (typeof SSHAuthType)[keyof typeof SSHAuthType]


export const ConnectionStatus: {
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  CONNECTING: 'CONNECTING',
  ERROR: 'ERROR'
};

export type ConnectionStatus = (typeof ConnectionStatus)[keyof typeof ConnectionStatus]


export const SessionType: {
  CHAT: 'CHAT',
  SSH: 'SSH',
  MIXED: 'MIXED'
};

export type SessionType = (typeof SessionType)[keyof typeof SessionType]


export const MessageRole: {
  USER: 'USER',
  ASSISTANT: 'ASSISTANT',
  SYSTEM: 'SYSTEM',
  FUNCTION: 'FUNCTION',
  TOOL: 'TOOL'
};

export type MessageRole = (typeof MessageRole)[keyof typeof MessageRole]


export const SafetyLevel: {
  SAFE: 'SAFE',
  CAUTION: 'CAUTION',
  DANGEROUS: 'DANGEROUS'
};

export type SafetyLevel = (typeof SafetyLevel)[keyof typeof SafetyLevel]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type SSHAuthType = $Enums.SSHAuthType

export const SSHAuthType: typeof $Enums.SSHAuthType

export type ConnectionStatus = $Enums.ConnectionStatus

export const ConnectionStatus: typeof $Enums.ConnectionStatus

export type SessionType = $Enums.SessionType

export const SessionType: typeof $Enums.SessionType

export type MessageRole = $Enums.MessageRole

export const MessageRole: typeof $Enums.MessageRole

export type SafetyLevel = $Enums.SafetyLevel

export const SafetyLevel: typeof $Enums.SafetyLevel

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
   * `prisma.chatFolder`: Exposes CRUD operations for the **ChatFolder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatFolders
    * const chatFolders = await prisma.chatFolder.findMany()
    * ```
    */
  get chatFolder(): Prisma.ChatFolderDelegate<ExtArgs>;

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
    SSHFolder: 'SSHFolder',
    SSHConnection: 'SSHConnection',
    ChatFolder: 'ChatFolder',
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
      modelProps: "user" | "sSHFolder" | "sSHConnection" | "chatFolder" | "chatSession" | "message" | "commandLog"
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
      SSHFolder: {
        payload: Prisma.$SSHFolderPayload<ExtArgs>
        fields: Prisma.SSHFolderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SSHFolderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHFolderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SSHFolderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHFolderPayload>
          }
          findFirst: {
            args: Prisma.SSHFolderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHFolderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SSHFolderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHFolderPayload>
          }
          findMany: {
            args: Prisma.SSHFolderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHFolderPayload>[]
          }
          create: {
            args: Prisma.SSHFolderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHFolderPayload>
          }
          createMany: {
            args: Prisma.SSHFolderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SSHFolderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHFolderPayload>[]
          }
          delete: {
            args: Prisma.SSHFolderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHFolderPayload>
          }
          update: {
            args: Prisma.SSHFolderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHFolderPayload>
          }
          deleteMany: {
            args: Prisma.SSHFolderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SSHFolderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SSHFolderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SSHFolderPayload>
          }
          aggregate: {
            args: Prisma.SSHFolderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSSHFolder>
          }
          groupBy: {
            args: Prisma.SSHFolderGroupByArgs<ExtArgs>
            result: $Utils.Optional<SSHFolderGroupByOutputType>[]
          }
          count: {
            args: Prisma.SSHFolderCountArgs<ExtArgs>
            result: $Utils.Optional<SSHFolderCountAggregateOutputType> | number
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
      ChatFolder: {
        payload: Prisma.$ChatFolderPayload<ExtArgs>
        fields: Prisma.ChatFolderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatFolderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatFolderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatFolderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatFolderPayload>
          }
          findFirst: {
            args: Prisma.ChatFolderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatFolderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatFolderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatFolderPayload>
          }
          findMany: {
            args: Prisma.ChatFolderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatFolderPayload>[]
          }
          create: {
            args: Prisma.ChatFolderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatFolderPayload>
          }
          createMany: {
            args: Prisma.ChatFolderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatFolderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatFolderPayload>[]
          }
          delete: {
            args: Prisma.ChatFolderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatFolderPayload>
          }
          update: {
            args: Prisma.ChatFolderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatFolderPayload>
          }
          deleteMany: {
            args: Prisma.ChatFolderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatFolderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ChatFolderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatFolderPayload>
          }
          aggregate: {
            args: Prisma.ChatFolderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatFolder>
          }
          groupBy: {
            args: Prisma.ChatFolderGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatFolderGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatFolderCountArgs<ExtArgs>
            result: $Utils.Optional<ChatFolderCountAggregateOutputType> | number
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
    sshFolders: number
    sshConnections: number
    chatFolders: number
    chatSessions: number
    messages: number
    commandLogs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sshFolders?: boolean | UserCountOutputTypeCountSshFoldersArgs
    sshConnections?: boolean | UserCountOutputTypeCountSshConnectionsArgs
    chatFolders?: boolean | UserCountOutputTypeCountChatFoldersArgs
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
  export type UserCountOutputTypeCountChatFoldersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatFolderWhereInput
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
   * Count Type ChatFolderCountOutputType
   */

  export type ChatFolderCountOutputType = {
    children: number
    sessions: number
  }

  export type ChatFolderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    children?: boolean | ChatFolderCountOutputTypeCountChildrenArgs
    sessions?: boolean | ChatFolderCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * ChatFolderCountOutputType without action
   */
  export type ChatFolderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatFolderCountOutputType
     */
    select?: ChatFolderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChatFolderCountOutputType without action
   */
  export type ChatFolderCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatFolderWhereInput
  }

  /**
   * ChatFolderCountOutputType without action
   */
  export type ChatFolderCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatSessionWhereInput
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
    role: $Enums.UserRole | null
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
    role: $Enums.UserRole | null
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
    role: $Enums.UserRole
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    settings: JsonValue | null
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
    sshFolders?: boolean | User$sshFoldersArgs<ExtArgs>
    sshConnections?: boolean | User$sshConnectionsArgs<ExtArgs>
    chatFolders?: boolean | User$chatFoldersArgs<ExtArgs>
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
    sshFolders?: boolean | User$sshFoldersArgs<ExtArgs>
    sshConnections?: boolean | User$sshConnectionsArgs<ExtArgs>
    chatFolders?: boolean | User$chatFoldersArgs<ExtArgs>
    chatSessions?: boolean | User$chatSessionsArgs<ExtArgs>
    messages?: boolean | User$messagesArgs<ExtArgs>
    commandLogs?: boolean | User$commandLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sshFolders: Prisma.$SSHFolderPayload<ExtArgs>[]
      sshConnections: Prisma.$SSHConnectionPayload<ExtArgs>[]
      chatFolders: Prisma.$ChatFolderPayload<ExtArgs>[]
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
      role: $Enums.UserRole
      isActive: boolean
      createdAt: Date
      updatedAt: Date
      settings: Prisma.JsonValue | null
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
    sshFolders<T extends User$sshFoldersArgs<ExtArgs> = {}>(args?: Subset<T, User$sshFoldersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, "findMany"> | Null>
    sshConnections<T extends User$sshConnectionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sshConnectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, "findMany"> | Null>
    chatFolders<T extends User$chatFoldersArgs<ExtArgs> = {}>(args?: Subset<T, User$chatFoldersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatFolderPayload<ExtArgs>, T, "findMany"> | Null>
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
    readonly role: FieldRef<"User", 'UserRole'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly settings: FieldRef<"User", 'Json'>
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
    skipDuplicates?: boolean
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
    skipDuplicates?: boolean
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
   * User.sshFolders
   */
  export type User$sshFoldersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHFolder
     */
    select?: SSHFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
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
   * User.chatFolders
   */
  export type User$chatFoldersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatFolder
     */
    select?: ChatFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatFolderInclude<ExtArgs> | null
    where?: ChatFolderWhereInput
    orderBy?: ChatFolderOrderByWithRelationInput | ChatFolderOrderByWithRelationInput[]
    cursor?: ChatFolderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatFolderScalarFieldEnum | ChatFolderScalarFieldEnum[]
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

  export type SSHFolderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    order?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parentId?: boolean
    userId?: boolean
    parent?: boolean | SSHFolder$parentArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
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
  export type SSHFolderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | SSHFolder$parentArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
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
    Omit<SSHFolderFindManyArgs, 'select' | 'include' | 'distinct'> & {
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
     */
    findUnique<T extends SSHFolderFindUniqueArgs>(args: SelectSubset<T, SSHFolderFindUniqueArgs<ExtArgs>>): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SSHFolder that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SSHFolderFindUniqueOrThrowArgs} args - Arguments to find a SSHFolder
     * @example
     * // Get one SSHFolder
     * const sSHFolder = await prisma.sSHFolder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SSHFolderFindUniqueOrThrowArgs>(args: SelectSubset<T, SSHFolderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

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
     */
    findFirst<T extends SSHFolderFindFirstArgs>(args?: SelectSubset<T, SSHFolderFindFirstArgs<ExtArgs>>): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

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
     */
    findFirstOrThrow<T extends SSHFolderFindFirstOrThrowArgs>(args?: SelectSubset<T, SSHFolderFindFirstOrThrowArgs<ExtArgs>>): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SSHFolders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SSHFolderFindManyArgs} args - Arguments to filter and select certain fields only.
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
     */
    findMany<T extends SSHFolderFindManyArgs>(args?: SelectSubset<T, SSHFolderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, "findMany">>

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
     */
    create<T extends SSHFolderCreateArgs>(args: SelectSubset<T, SSHFolderCreateArgs<ExtArgs>>): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SSHFolders.
     * @param {SSHFolderCreateManyArgs} args - Arguments to create many SSHFolders.
     * @example
     * // Create many SSHFolders
     * const sSHFolder = await prisma.sSHFolder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SSHFolderCreateManyArgs>(args?: SelectSubset<T, SSHFolderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SSHFolders and returns the data saved in the database.
     * @param {SSHFolderCreateManyAndReturnArgs} args - Arguments to create many SSHFolders.
     * @example
     * // Create many SSHFolders
     * const sSHFolder = await prisma.sSHFolder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SSHFolders and only return the `id`
     * const sSHFolderWithIdOnly = await prisma.sSHFolder.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SSHFolderCreateManyAndReturnArgs>(args?: SelectSubset<T, SSHFolderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, "createManyAndReturn">>

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
     */
    delete<T extends SSHFolderDeleteArgs>(args: SelectSubset<T, SSHFolderDeleteArgs<ExtArgs>>): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, "delete">, never, ExtArgs>

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
     */
    update<T extends SSHFolderUpdateArgs>(args: SelectSubset<T, SSHFolderUpdateArgs<ExtArgs>>): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, "update">, never, ExtArgs>

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
     */
    deleteMany<T extends SSHFolderDeleteManyArgs>(args?: SelectSubset<T, SSHFolderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

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
     */
    updateMany<T extends SSHFolderUpdateManyArgs>(args: SelectSubset<T, SSHFolderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

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
     */
    upsert<T extends SSHFolderUpsertArgs>(args: SelectSubset<T, SSHFolderUpsertArgs<ExtArgs>>): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


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
    readonly [Symbol.toStringTag]: "PrismaPromise"
    parent<T extends SSHFolder$parentArgs<ExtArgs> = {}>(args?: Subset<T, SSHFolder$parentArgs<ExtArgs>>): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    children<T extends SSHFolder$childrenArgs<ExtArgs> = {}>(args?: Subset<T, SSHFolder$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, "findMany"> | Null>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    connections<T extends SSHFolder$connectionsArgs<ExtArgs> = {}>(args?: Subset<T, SSHFolder$connectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, "findMany"> | Null>
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
     */
    include?: SSHFolderInclude<ExtArgs> | null
    /**
     * The data needed to create a SSHFolder.
     */
    data: XOR<SSHFolderCreateInput, SSHFolderUncheckedCreateInput>
  }

  /**
   * SSHFolder createMany
   */
  export type SSHFolderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SSHFolders.
     */
    data: SSHFolderCreateManyInput | SSHFolderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SSHFolder createManyAndReturn
   */
  export type SSHFolderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHFolder
     */
    select?: SSHFolderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SSHFolders.
     */
    data: SSHFolderCreateManyInput | SSHFolderCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SSHFolderIncludeCreateManyAndReturn<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
     * Choose, which related nodes to fetch as well
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
   * SSHFolder without action
   */
  export type SSHFolderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHFolder
     */
    select?: SSHFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
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
    authType: $Enums.SSHAuthType | null
    password: string | null
    privateKey: string | null
    publicKey: string | null
    passphrase: string | null
    status: $Enums.ConnectionStatus | null
    lastUsed: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
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
    authType: $Enums.SSHAuthType | null
    password: string | null
    privateKey: string | null
    publicKey: string | null
    passphrase: string | null
    status: $Enums.ConnectionStatus | null
    lastUsed: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
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
    authType: $Enums.SSHAuthType
    password: string | null
    privateKey: string | null
    publicKey: string | null
    passphrase: string | null
    status: $Enums.ConnectionStatus
    lastUsed: Date | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    meta: JsonValue | null
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
    chatSessions?: boolean | SSHConnection$chatSessionsArgs<ExtArgs>
    commandLogs?: boolean | SSHConnection$commandLogsArgs<ExtArgs>
    _count?: boolean | SSHConnectionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SSHConnectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    folder?: boolean | SSHConnection$folderArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SSHConnectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SSHConnection"
    objects: {
      folder: Prisma.$SSHFolderPayload<ExtArgs> | null
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
      order: number
      authType: $Enums.SSHAuthType
      password: string | null
      privateKey: string | null
      publicKey: string | null
      passphrase: string | null
      status: $Enums.ConnectionStatus
      lastUsed: Date | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
      meta: Prisma.JsonValue | null
      folderId: string | null
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
    folder<T extends SSHConnection$folderArgs<ExtArgs> = {}>(args?: Subset<T, SSHConnection$folderArgs<ExtArgs>>): Prisma__SSHFolderClient<$Result.GetResult<Prisma.$SSHFolderPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
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
    readonly order: FieldRef<"SSHConnection", 'Int'>
    readonly authType: FieldRef<"SSHConnection", 'SSHAuthType'>
    readonly password: FieldRef<"SSHConnection", 'String'>
    readonly privateKey: FieldRef<"SSHConnection", 'String'>
    readonly publicKey: FieldRef<"SSHConnection", 'String'>
    readonly passphrase: FieldRef<"SSHConnection", 'String'>
    readonly status: FieldRef<"SSHConnection", 'ConnectionStatus'>
    readonly lastUsed: FieldRef<"SSHConnection", 'DateTime'>
    readonly isActive: FieldRef<"SSHConnection", 'Boolean'>
    readonly createdAt: FieldRef<"SSHConnection", 'DateTime'>
    readonly updatedAt: FieldRef<"SSHConnection", 'DateTime'>
    readonly meta: FieldRef<"SSHConnection", 'Json'>
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
    skipDuplicates?: boolean
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
    skipDuplicates?: boolean
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
   * SSHConnection.folder
   */
  export type SSHConnection$folderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SSHFolder
     */
    select?: SSHFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SSHFolderInclude<ExtArgs> | null
    where?: SSHFolderWhereInput
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
   * Model ChatFolder
   */

  export type AggregateChatFolder = {
    _count: ChatFolderCountAggregateOutputType | null
    _avg: ChatFolderAvgAggregateOutputType | null
    _sum: ChatFolderSumAggregateOutputType | null
    _min: ChatFolderMinAggregateOutputType | null
    _max: ChatFolderMaxAggregateOutputType | null
  }

  export type ChatFolderAvgAggregateOutputType = {
    order: number | null
  }

  export type ChatFolderSumAggregateOutputType = {
    order: number | null
  }

  export type ChatFolderMinAggregateOutputType = {
    id: string | null
    name: string | null
    order: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    parentId: string | null
    userId: string | null
  }

  export type ChatFolderMaxAggregateOutputType = {
    id: string | null
    name: string | null
    order: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    parentId: string | null
    userId: string | null
  }

  export type ChatFolderCountAggregateOutputType = {
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


  export type ChatFolderAvgAggregateInputType = {
    order?: true
  }

  export type ChatFolderSumAggregateInputType = {
    order?: true
  }

  export type ChatFolderMinAggregateInputType = {
    id?: true
    name?: true
    order?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    parentId?: true
    userId?: true
  }

  export type ChatFolderMaxAggregateInputType = {
    id?: true
    name?: true
    order?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    parentId?: true
    userId?: true
  }

  export type ChatFolderCountAggregateInputType = {
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

  export type ChatFolderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatFolder to aggregate.
     */
    where?: ChatFolderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatFolders to fetch.
     */
    orderBy?: ChatFolderOrderByWithRelationInput | ChatFolderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatFolderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatFolders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatFolders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatFolders
    **/
    _count?: true | ChatFolderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChatFolderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChatFolderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatFolderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatFolderMaxAggregateInputType
  }

  export type GetChatFolderAggregateType<T extends ChatFolderAggregateArgs> = {
        [P in keyof T & keyof AggregateChatFolder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatFolder[P]>
      : GetScalarType<T[P], AggregateChatFolder[P]>
  }




  export type ChatFolderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatFolderWhereInput
    orderBy?: ChatFolderOrderByWithAggregationInput | ChatFolderOrderByWithAggregationInput[]
    by: ChatFolderScalarFieldEnum[] | ChatFolderScalarFieldEnum
    having?: ChatFolderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatFolderCountAggregateInputType | true
    _avg?: ChatFolderAvgAggregateInputType
    _sum?: ChatFolderSumAggregateInputType
    _min?: ChatFolderMinAggregateInputType
    _max?: ChatFolderMaxAggregateInputType
  }

  export type ChatFolderGroupByOutputType = {
    id: string
    name: string
    order: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    parentId: string | null
    userId: string
    _count: ChatFolderCountAggregateOutputType | null
    _avg: ChatFolderAvgAggregateOutputType | null
    _sum: ChatFolderSumAggregateOutputType | null
    _min: ChatFolderMinAggregateOutputType | null
    _max: ChatFolderMaxAggregateOutputType | null
  }

  type GetChatFolderGroupByPayload<T extends ChatFolderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatFolderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatFolderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatFolderGroupByOutputType[P]>
            : GetScalarType<T[P], ChatFolderGroupByOutputType[P]>
        }
      >
    >


  export type ChatFolderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    order?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parentId?: boolean
    userId?: boolean
    parent?: boolean | ChatFolder$parentArgs<ExtArgs>
    children?: boolean | ChatFolder$childrenArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    sessions?: boolean | ChatFolder$sessionsArgs<ExtArgs>
    _count?: boolean | ChatFolderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatFolder"]>

  export type ChatFolderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    order?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parentId?: boolean
    userId?: boolean
    parent?: boolean | ChatFolder$parentArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatFolder"]>

  export type ChatFolderSelectScalar = {
    id?: boolean
    name?: boolean
    order?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parentId?: boolean
    userId?: boolean
  }

  export type ChatFolderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | ChatFolder$parentArgs<ExtArgs>
    children?: boolean | ChatFolder$childrenArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    sessions?: boolean | ChatFolder$sessionsArgs<ExtArgs>
    _count?: boolean | ChatFolderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChatFolderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | ChatFolder$parentArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ChatFolderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatFolder"
    objects: {
      parent: Prisma.$ChatFolderPayload<ExtArgs> | null
      children: Prisma.$ChatFolderPayload<ExtArgs>[]
      user: Prisma.$UserPayload<ExtArgs>
      sessions: Prisma.$ChatSessionPayload<ExtArgs>[]
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
    }, ExtArgs["result"]["chatFolder"]>
    composites: {}
  }

  type ChatFolderGetPayload<S extends boolean | null | undefined | ChatFolderDefaultArgs> = $Result.GetResult<Prisma.$ChatFolderPayload, S>

  type ChatFolderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ChatFolderFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ChatFolderCountAggregateInputType | true
    }

  export interface ChatFolderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatFolder'], meta: { name: 'ChatFolder' } }
    /**
     * Find zero or one ChatFolder that matches the filter.
     * @param {ChatFolderFindUniqueArgs} args - Arguments to find a ChatFolder
     * @example
     * // Get one ChatFolder
     * const chatFolder = await prisma.chatFolder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatFolderFindUniqueArgs>(args: SelectSubset<T, ChatFolderFindUniqueArgs<ExtArgs>>): Prisma__ChatFolderClient<$Result.GetResult<Prisma.$ChatFolderPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ChatFolder that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ChatFolderFindUniqueOrThrowArgs} args - Arguments to find a ChatFolder
     * @example
     * // Get one ChatFolder
     * const chatFolder = await prisma.chatFolder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatFolderFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatFolderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatFolderClient<$Result.GetResult<Prisma.$ChatFolderPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ChatFolder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatFolderFindFirstArgs} args - Arguments to find a ChatFolder
     * @example
     * // Get one ChatFolder
     * const chatFolder = await prisma.chatFolder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatFolderFindFirstArgs>(args?: SelectSubset<T, ChatFolderFindFirstArgs<ExtArgs>>): Prisma__ChatFolderClient<$Result.GetResult<Prisma.$ChatFolderPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ChatFolder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatFolderFindFirstOrThrowArgs} args - Arguments to find a ChatFolder
     * @example
     * // Get one ChatFolder
     * const chatFolder = await prisma.chatFolder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatFolderFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatFolderFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatFolderClient<$Result.GetResult<Prisma.$ChatFolderPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ChatFolders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatFolderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatFolders
     * const chatFolders = await prisma.chatFolder.findMany()
     * 
     * // Get first 10 ChatFolders
     * const chatFolders = await prisma.chatFolder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatFolderWithIdOnly = await prisma.chatFolder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatFolderFindManyArgs>(args?: SelectSubset<T, ChatFolderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatFolderPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ChatFolder.
     * @param {ChatFolderCreateArgs} args - Arguments to create a ChatFolder.
     * @example
     * // Create one ChatFolder
     * const ChatFolder = await prisma.chatFolder.create({
     *   data: {
     *     // ... data to create a ChatFolder
     *   }
     * })
     * 
     */
    create<T extends ChatFolderCreateArgs>(args: SelectSubset<T, ChatFolderCreateArgs<ExtArgs>>): Prisma__ChatFolderClient<$Result.GetResult<Prisma.$ChatFolderPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ChatFolders.
     * @param {ChatFolderCreateManyArgs} args - Arguments to create many ChatFolders.
     * @example
     * // Create many ChatFolders
     * const chatFolder = await prisma.chatFolder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatFolderCreateManyArgs>(args?: SelectSubset<T, ChatFolderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatFolders and returns the data saved in the database.
     * @param {ChatFolderCreateManyAndReturnArgs} args - Arguments to create many ChatFolders.
     * @example
     * // Create many ChatFolders
     * const chatFolder = await prisma.chatFolder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatFolders and only return the `id`
     * const chatFolderWithIdOnly = await prisma.chatFolder.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatFolderCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatFolderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatFolderPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ChatFolder.
     * @param {ChatFolderDeleteArgs} args - Arguments to delete one ChatFolder.
     * @example
     * // Delete one ChatFolder
     * const ChatFolder = await prisma.chatFolder.delete({
     *   where: {
     *     // ... filter to delete one ChatFolder
     *   }
     * })
     * 
     */
    delete<T extends ChatFolderDeleteArgs>(args: SelectSubset<T, ChatFolderDeleteArgs<ExtArgs>>): Prisma__ChatFolderClient<$Result.GetResult<Prisma.$ChatFolderPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ChatFolder.
     * @param {ChatFolderUpdateArgs} args - Arguments to update one ChatFolder.
     * @example
     * // Update one ChatFolder
     * const chatFolder = await prisma.chatFolder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatFolderUpdateArgs>(args: SelectSubset<T, ChatFolderUpdateArgs<ExtArgs>>): Prisma__ChatFolderClient<$Result.GetResult<Prisma.$ChatFolderPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ChatFolders.
     * @param {ChatFolderDeleteManyArgs} args - Arguments to filter ChatFolders to delete.
     * @example
     * // Delete a few ChatFolders
     * const { count } = await prisma.chatFolder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatFolderDeleteManyArgs>(args?: SelectSubset<T, ChatFolderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatFolders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatFolderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatFolders
     * const chatFolder = await prisma.chatFolder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatFolderUpdateManyArgs>(args: SelectSubset<T, ChatFolderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ChatFolder.
     * @param {ChatFolderUpsertArgs} args - Arguments to update or create a ChatFolder.
     * @example
     * // Update or create a ChatFolder
     * const chatFolder = await prisma.chatFolder.upsert({
     *   create: {
     *     // ... data to create a ChatFolder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatFolder we want to update
     *   }
     * })
     */
    upsert<T extends ChatFolderUpsertArgs>(args: SelectSubset<T, ChatFolderUpsertArgs<ExtArgs>>): Prisma__ChatFolderClient<$Result.GetResult<Prisma.$ChatFolderPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ChatFolders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatFolderCountArgs} args - Arguments to filter ChatFolders to count.
     * @example
     * // Count the number of ChatFolders
     * const count = await prisma.chatFolder.count({
     *   where: {
     *     // ... the filter for the ChatFolders we want to count
     *   }
     * })
    **/
    count<T extends ChatFolderCountArgs>(
      args?: Subset<T, ChatFolderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatFolderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatFolder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatFolderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChatFolderAggregateArgs>(args: Subset<T, ChatFolderAggregateArgs>): Prisma.PrismaPromise<GetChatFolderAggregateType<T>>

    /**
     * Group by ChatFolder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatFolderGroupByArgs} args - Group by arguments.
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
      T extends ChatFolderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatFolderGroupByArgs['orderBy'] }
        : { orderBy?: ChatFolderGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ChatFolderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatFolderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatFolder model
   */
  readonly fields: ChatFolderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatFolder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatFolderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    parent<T extends ChatFolder$parentArgs<ExtArgs> = {}>(args?: Subset<T, ChatFolder$parentArgs<ExtArgs>>): Prisma__ChatFolderClient<$Result.GetResult<Prisma.$ChatFolderPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    children<T extends ChatFolder$childrenArgs<ExtArgs> = {}>(args?: Subset<T, ChatFolder$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatFolderPayload<ExtArgs>, T, "findMany"> | Null>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    sessions<T extends ChatFolder$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, ChatFolder$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the ChatFolder model
   */ 
  interface ChatFolderFieldRefs {
    readonly id: FieldRef<"ChatFolder", 'String'>
    readonly name: FieldRef<"ChatFolder", 'String'>
    readonly order: FieldRef<"ChatFolder", 'Int'>
    readonly isActive: FieldRef<"ChatFolder", 'Boolean'>
    readonly createdAt: FieldRef<"ChatFolder", 'DateTime'>
    readonly updatedAt: FieldRef<"ChatFolder", 'DateTime'>
    readonly parentId: FieldRef<"ChatFolder", 'String'>
    readonly userId: FieldRef<"ChatFolder", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ChatFolder findUnique
   */
  export type ChatFolderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatFolder
     */
    select?: ChatFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatFolderInclude<ExtArgs> | null
    /**
     * Filter, which ChatFolder to fetch.
     */
    where: ChatFolderWhereUniqueInput
  }

  /**
   * ChatFolder findUniqueOrThrow
   */
  export type ChatFolderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatFolder
     */
    select?: ChatFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatFolderInclude<ExtArgs> | null
    /**
     * Filter, which ChatFolder to fetch.
     */
    where: ChatFolderWhereUniqueInput
  }

  /**
   * ChatFolder findFirst
   */
  export type ChatFolderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatFolder
     */
    select?: ChatFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatFolderInclude<ExtArgs> | null
    /**
     * Filter, which ChatFolder to fetch.
     */
    where?: ChatFolderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatFolders to fetch.
     */
    orderBy?: ChatFolderOrderByWithRelationInput | ChatFolderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatFolders.
     */
    cursor?: ChatFolderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatFolders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatFolders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatFolders.
     */
    distinct?: ChatFolderScalarFieldEnum | ChatFolderScalarFieldEnum[]
  }

  /**
   * ChatFolder findFirstOrThrow
   */
  export type ChatFolderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatFolder
     */
    select?: ChatFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatFolderInclude<ExtArgs> | null
    /**
     * Filter, which ChatFolder to fetch.
     */
    where?: ChatFolderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatFolders to fetch.
     */
    orderBy?: ChatFolderOrderByWithRelationInput | ChatFolderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatFolders.
     */
    cursor?: ChatFolderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatFolders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatFolders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatFolders.
     */
    distinct?: ChatFolderScalarFieldEnum | ChatFolderScalarFieldEnum[]
  }

  /**
   * ChatFolder findMany
   */
  export type ChatFolderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatFolder
     */
    select?: ChatFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatFolderInclude<ExtArgs> | null
    /**
     * Filter, which ChatFolders to fetch.
     */
    where?: ChatFolderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatFolders to fetch.
     */
    orderBy?: ChatFolderOrderByWithRelationInput | ChatFolderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatFolders.
     */
    cursor?: ChatFolderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatFolders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatFolders.
     */
    skip?: number
    distinct?: ChatFolderScalarFieldEnum | ChatFolderScalarFieldEnum[]
  }

  /**
   * ChatFolder create
   */
  export type ChatFolderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatFolder
     */
    select?: ChatFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatFolderInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatFolder.
     */
    data: XOR<ChatFolderCreateInput, ChatFolderUncheckedCreateInput>
  }

  /**
   * ChatFolder createMany
   */
  export type ChatFolderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatFolders.
     */
    data: ChatFolderCreateManyInput | ChatFolderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatFolder createManyAndReturn
   */
  export type ChatFolderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatFolder
     */
    select?: ChatFolderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ChatFolders.
     */
    data: ChatFolderCreateManyInput | ChatFolderCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatFolderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatFolder update
   */
  export type ChatFolderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatFolder
     */
    select?: ChatFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatFolderInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatFolder.
     */
    data: XOR<ChatFolderUpdateInput, ChatFolderUncheckedUpdateInput>
    /**
     * Choose, which ChatFolder to update.
     */
    where: ChatFolderWhereUniqueInput
  }

  /**
   * ChatFolder updateMany
   */
  export type ChatFolderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatFolders.
     */
    data: XOR<ChatFolderUpdateManyMutationInput, ChatFolderUncheckedUpdateManyInput>
    /**
     * Filter which ChatFolders to update
     */
    where?: ChatFolderWhereInput
  }

  /**
   * ChatFolder upsert
   */
  export type ChatFolderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatFolder
     */
    select?: ChatFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatFolderInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatFolder to update in case it exists.
     */
    where: ChatFolderWhereUniqueInput
    /**
     * In case the ChatFolder found by the `where` argument doesn't exist, create a new ChatFolder with this data.
     */
    create: XOR<ChatFolderCreateInput, ChatFolderUncheckedCreateInput>
    /**
     * In case the ChatFolder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatFolderUpdateInput, ChatFolderUncheckedUpdateInput>
  }

  /**
   * ChatFolder delete
   */
  export type ChatFolderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatFolder
     */
    select?: ChatFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatFolderInclude<ExtArgs> | null
    /**
     * Filter which ChatFolder to delete.
     */
    where: ChatFolderWhereUniqueInput
  }

  /**
   * ChatFolder deleteMany
   */
  export type ChatFolderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatFolders to delete
     */
    where?: ChatFolderWhereInput
  }

  /**
   * ChatFolder.parent
   */
  export type ChatFolder$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatFolder
     */
    select?: ChatFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatFolderInclude<ExtArgs> | null
    where?: ChatFolderWhereInput
  }

  /**
   * ChatFolder.children
   */
  export type ChatFolder$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatFolder
     */
    select?: ChatFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatFolderInclude<ExtArgs> | null
    where?: ChatFolderWhereInput
    orderBy?: ChatFolderOrderByWithRelationInput | ChatFolderOrderByWithRelationInput[]
    cursor?: ChatFolderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatFolderScalarFieldEnum | ChatFolderScalarFieldEnum[]
  }

  /**
   * ChatFolder.sessions
   */
  export type ChatFolder$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * ChatFolder without action
   */
  export type ChatFolderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatFolder
     */
    select?: ChatFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatFolderInclude<ExtArgs> | null
  }


  /**
   * Model ChatSession
   */

  export type AggregateChatSession = {
    _count: ChatSessionCountAggregateOutputType | null
    _avg: ChatSessionAvgAggregateOutputType | null
    _sum: ChatSessionSumAggregateOutputType | null
    _min: ChatSessionMinAggregateOutputType | null
    _max: ChatSessionMaxAggregateOutputType | null
  }

  export type ChatSessionAvgAggregateOutputType = {
    order: number | null
  }

  export type ChatSessionSumAggregateOutputType = {
    order: number | null
  }

  export type ChatSessionMinAggregateOutputType = {
    id: string | null
    title: string | null
    type: $Enums.SessionType | null
    order: number | null
    createdAt: Date | null
    updatedAt: Date | null
    folderId: string | null
    userId: string | null
    sshConnectionId: string | null
  }

  export type ChatSessionMaxAggregateOutputType = {
    id: string | null
    title: string | null
    type: $Enums.SessionType | null
    order: number | null
    createdAt: Date | null
    updatedAt: Date | null
    folderId: string | null
    userId: string | null
    sshConnectionId: string | null
  }

  export type ChatSessionCountAggregateOutputType = {
    id: number
    title: number
    type: number
    order: number
    createdAt: number
    updatedAt: number
    config: number
    meta: number
    folderId: number
    userId: number
    sshConnectionId: number
    _all: number
  }


  export type ChatSessionAvgAggregateInputType = {
    order?: true
  }

  export type ChatSessionSumAggregateInputType = {
    order?: true
  }

  export type ChatSessionMinAggregateInputType = {
    id?: true
    title?: true
    type?: true
    order?: true
    createdAt?: true
    updatedAt?: true
    folderId?: true
    userId?: true
    sshConnectionId?: true
  }

  export type ChatSessionMaxAggregateInputType = {
    id?: true
    title?: true
    type?: true
    order?: true
    createdAt?: true
    updatedAt?: true
    folderId?: true
    userId?: true
    sshConnectionId?: true
  }

  export type ChatSessionCountAggregateInputType = {
    id?: true
    title?: true
    type?: true
    order?: true
    createdAt?: true
    updatedAt?: true
    config?: true
    meta?: true
    folderId?: true
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
     * Select which fields to average
    **/
    _avg?: ChatSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChatSessionSumAggregateInputType
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
    _avg?: ChatSessionAvgAggregateInputType
    _sum?: ChatSessionSumAggregateInputType
    _min?: ChatSessionMinAggregateInputType
    _max?: ChatSessionMaxAggregateInputType
  }

  export type ChatSessionGroupByOutputType = {
    id: string
    title: string
    type: $Enums.SessionType
    order: number
    createdAt: Date
    updatedAt: Date
    config: JsonValue | null
    meta: JsonValue | null
    folderId: string | null
    userId: string
    sshConnectionId: string | null
    _count: ChatSessionCountAggregateOutputType | null
    _avg: ChatSessionAvgAggregateOutputType | null
    _sum: ChatSessionSumAggregateOutputType | null
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
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    config?: boolean
    meta?: boolean
    folderId?: boolean
    userId?: boolean
    sshConnectionId?: boolean
    folder?: boolean | ChatSession$folderArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    sshConnection?: boolean | ChatSession$sshConnectionArgs<ExtArgs>
    messages?: boolean | ChatSession$messagesArgs<ExtArgs>
    _count?: boolean | ChatSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatSession"]>

  export type ChatSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    type?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    config?: boolean
    meta?: boolean
    folderId?: boolean
    userId?: boolean
    sshConnectionId?: boolean
    folder?: boolean | ChatSession$folderArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    sshConnection?: boolean | ChatSession$sshConnectionArgs<ExtArgs>
  }, ExtArgs["result"]["chatSession"]>

  export type ChatSessionSelectScalar = {
    id?: boolean
    title?: boolean
    type?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    config?: boolean
    meta?: boolean
    folderId?: boolean
    userId?: boolean
    sshConnectionId?: boolean
  }

  export type ChatSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    folder?: boolean | ChatSession$folderArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    sshConnection?: boolean | ChatSession$sshConnectionArgs<ExtArgs>
    messages?: boolean | ChatSession$messagesArgs<ExtArgs>
    _count?: boolean | ChatSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChatSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    folder?: boolean | ChatSession$folderArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    sshConnection?: boolean | ChatSession$sshConnectionArgs<ExtArgs>
  }

  export type $ChatSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatSession"
    objects: {
      folder: Prisma.$ChatFolderPayload<ExtArgs> | null
      user: Prisma.$UserPayload<ExtArgs>
      sshConnection: Prisma.$SSHConnectionPayload<ExtArgs> | null
      messages: Prisma.$MessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      type: $Enums.SessionType
      order: number
      createdAt: Date
      updatedAt: Date
      config: Prisma.JsonValue | null
      meta: Prisma.JsonValue | null
      folderId: string | null
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
    folder<T extends ChatSession$folderArgs<ExtArgs> = {}>(args?: Subset<T, ChatSession$folderArgs<ExtArgs>>): Prisma__ChatFolderClient<$Result.GetResult<Prisma.$ChatFolderPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
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
    readonly type: FieldRef<"ChatSession", 'SessionType'>
    readonly order: FieldRef<"ChatSession", 'Int'>
    readonly createdAt: FieldRef<"ChatSession", 'DateTime'>
    readonly updatedAt: FieldRef<"ChatSession", 'DateTime'>
    readonly config: FieldRef<"ChatSession", 'Json'>
    readonly meta: FieldRef<"ChatSession", 'Json'>
    readonly folderId: FieldRef<"ChatSession", 'String'>
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
    skipDuplicates?: boolean
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
    skipDuplicates?: boolean
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
   * ChatSession.folder
   */
  export type ChatSession$folderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatFolder
     */
    select?: ChatFolderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatFolderInclude<ExtArgs> | null
    where?: ChatFolderWhereInput
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
    role: $Enums.MessageRole | null
    createdAt: Date | null
    updatedAt: Date | null
    isDeleted: boolean | null
    isEdited: boolean | null
    sessionId: string | null
    userId: string | null
  }

  export type MessageMaxAggregateOutputType = {
    id: string | null
    content: string | null
    role: $Enums.MessageRole | null
    createdAt: Date | null
    updatedAt: Date | null
    isDeleted: boolean | null
    isEdited: boolean | null
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
    isDeleted?: true
    isEdited?: true
    sessionId?: true
    userId?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    content?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    isDeleted?: true
    isEdited?: true
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
    role: $Enums.MessageRole
    createdAt: Date
    updatedAt: Date
    meta: JsonValue | null
    extra: JsonValue | null
    isDeleted: boolean
    isEdited: boolean
    plugin: JsonValue | null
    pluginState: JsonValue | null
    translate: JsonValue | null
    tts: JsonValue | null
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
      role: $Enums.MessageRole
      createdAt: Date
      updatedAt: Date
      meta: Prisma.JsonValue | null
      extra: Prisma.JsonValue | null
      isDeleted: boolean
      isEdited: boolean
      plugin: Prisma.JsonValue | null
      pluginState: Prisma.JsonValue | null
      translate: Prisma.JsonValue | null
      tts: Prisma.JsonValue | null
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
    readonly role: FieldRef<"Message", 'MessageRole'>
    readonly createdAt: FieldRef<"Message", 'DateTime'>
    readonly updatedAt: FieldRef<"Message", 'DateTime'>
    readonly meta: FieldRef<"Message", 'Json'>
    readonly extra: FieldRef<"Message", 'Json'>
    readonly isDeleted: FieldRef<"Message", 'Boolean'>
    readonly isEdited: FieldRef<"Message", 'Boolean'>
    readonly plugin: FieldRef<"Message", 'Json'>
    readonly pluginState: FieldRef<"Message", 'Json'>
    readonly translate: FieldRef<"Message", 'Json'>
    readonly tts: FieldRef<"Message", 'Json'>
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
    skipDuplicates?: boolean
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
    skipDuplicates?: boolean
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
    safetyLevel: $Enums.SafetyLevel | null
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
    safetyLevel: $Enums.SafetyLevel | null
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
    safetyLevel: $Enums.SafetyLevel
    metadata: JsonValue | null
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
      safetyLevel: $Enums.SafetyLevel
      metadata: Prisma.JsonValue | null
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
    readonly safetyLevel: FieldRef<"CommandLog", 'SafetyLevel'>
    readonly metadata: FieldRef<"CommandLog", 'Json'>
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
    skipDuplicates?: boolean
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
    skipDuplicates?: boolean
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
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
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


  export const ChatFolderScalarFieldEnum: {
    id: 'id',
    name: 'name',
    order: 'order',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    parentId: 'parentId',
    userId: 'userId'
  };

  export type ChatFolderScalarFieldEnum = (typeof ChatFolderScalarFieldEnum)[keyof typeof ChatFolderScalarFieldEnum]


  export const ChatSessionScalarFieldEnum: {
    id: 'id',
    title: 'title',
    type: 'type',
    order: 'order',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    config: 'config',
    meta: 'meta',
    folderId: 'folderId',
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


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


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
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'SSHAuthType'
   */
  export type EnumSSHAuthTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SSHAuthType'>
    


  /**
   * Reference to a field of type 'SSHAuthType[]'
   */
  export type ListEnumSSHAuthTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SSHAuthType[]'>
    


  /**
   * Reference to a field of type 'ConnectionStatus'
   */
  export type EnumConnectionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConnectionStatus'>
    


  /**
   * Reference to a field of type 'ConnectionStatus[]'
   */
  export type ListEnumConnectionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConnectionStatus[]'>
    


  /**
   * Reference to a field of type 'SessionType'
   */
  export type EnumSessionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionType'>
    


  /**
   * Reference to a field of type 'SessionType[]'
   */
  export type ListEnumSessionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionType[]'>
    


  /**
   * Reference to a field of type 'MessageRole'
   */
  export type EnumMessageRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageRole'>
    


  /**
   * Reference to a field of type 'MessageRole[]'
   */
  export type ListEnumMessageRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageRole[]'>
    


  /**
   * Reference to a field of type 'SafetyLevel'
   */
  export type EnumSafetyLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SafetyLevel'>
    


  /**
   * Reference to a field of type 'SafetyLevel[]'
   */
  export type ListEnumSafetyLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SafetyLevel[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
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
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    settings?: JsonNullableFilter<"User">
    sshFolders?: SSHFolderListRelationFilter
    sshConnections?: SSHConnectionListRelationFilter
    chatFolders?: ChatFolderListRelationFilter
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
    sshFolders?: SSHFolderOrderByRelationAggregateInput
    sshConnections?: SSHConnectionOrderByRelationAggregateInput
    chatFolders?: ChatFolderOrderByRelationAggregateInput
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
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    settings?: JsonNullableFilter<"User">
    sshFolders?: SSHFolderListRelationFilter
    sshConnections?: SSHConnectionListRelationFilter
    chatFolders?: ChatFolderListRelationFilter
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
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    settings?: JsonNullableWithAggregatesFilter<"User">
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
    authType?: EnumSSHAuthTypeFilter<"SSHConnection"> | $Enums.SSHAuthType
    password?: StringNullableFilter<"SSHConnection"> | string | null
    privateKey?: StringNullableFilter<"SSHConnection"> | string | null
    publicKey?: StringNullableFilter<"SSHConnection"> | string | null
    passphrase?: StringNullableFilter<"SSHConnection"> | string | null
    status?: EnumConnectionStatusFilter<"SSHConnection"> | $Enums.ConnectionStatus
    lastUsed?: DateTimeNullableFilter<"SSHConnection"> | Date | string | null
    isActive?: BoolFilter<"SSHConnection"> | boolean
    createdAt?: DateTimeFilter<"SSHConnection"> | Date | string
    updatedAt?: DateTimeFilter<"SSHConnection"> | Date | string
    meta?: JsonNullableFilter<"SSHConnection">
    folderId?: StringNullableFilter<"SSHConnection"> | string | null
    userId?: StringFilter<"SSHConnection"> | string
    folder?: XOR<SSHFolderNullableRelationFilter, SSHFolderWhereInput> | null
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
    order?: IntFilter<"SSHConnection"> | number
    authType?: EnumSSHAuthTypeFilter<"SSHConnection"> | $Enums.SSHAuthType
    password?: StringNullableFilter<"SSHConnection"> | string | null
    privateKey?: StringNullableFilter<"SSHConnection"> | string | null
    publicKey?: StringNullableFilter<"SSHConnection"> | string | null
    passphrase?: StringNullableFilter<"SSHConnection"> | string | null
    status?: EnumConnectionStatusFilter<"SSHConnection"> | $Enums.ConnectionStatus
    lastUsed?: DateTimeNullableFilter<"SSHConnection"> | Date | string | null
    isActive?: BoolFilter<"SSHConnection"> | boolean
    createdAt?: DateTimeFilter<"SSHConnection"> | Date | string
    updatedAt?: DateTimeFilter<"SSHConnection"> | Date | string
    meta?: JsonNullableFilter<"SSHConnection">
    folderId?: StringNullableFilter<"SSHConnection"> | string | null
    userId?: StringFilter<"SSHConnection"> | string
    folder?: XOR<SSHFolderNullableRelationFilter, SSHFolderWhereInput> | null
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
    authType?: EnumSSHAuthTypeWithAggregatesFilter<"SSHConnection"> | $Enums.SSHAuthType
    password?: StringNullableWithAggregatesFilter<"SSHConnection"> | string | null
    privateKey?: StringNullableWithAggregatesFilter<"SSHConnection"> | string | null
    publicKey?: StringNullableWithAggregatesFilter<"SSHConnection"> | string | null
    passphrase?: StringNullableWithAggregatesFilter<"SSHConnection"> | string | null
    status?: EnumConnectionStatusWithAggregatesFilter<"SSHConnection"> | $Enums.ConnectionStatus
    lastUsed?: DateTimeNullableWithAggregatesFilter<"SSHConnection"> | Date | string | null
    isActive?: BoolWithAggregatesFilter<"SSHConnection"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"SSHConnection"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SSHConnection"> | Date | string
    meta?: JsonNullableWithAggregatesFilter<"SSHConnection">
    folderId?: StringNullableWithAggregatesFilter<"SSHConnection"> | string | null
    userId?: StringWithAggregatesFilter<"SSHConnection"> | string
  }

  export type ChatFolderWhereInput = {
    AND?: ChatFolderWhereInput | ChatFolderWhereInput[]
    OR?: ChatFolderWhereInput[]
    NOT?: ChatFolderWhereInput | ChatFolderWhereInput[]
    id?: StringFilter<"ChatFolder"> | string
    name?: StringFilter<"ChatFolder"> | string
    order?: IntFilter<"ChatFolder"> | number
    isActive?: BoolFilter<"ChatFolder"> | boolean
    createdAt?: DateTimeFilter<"ChatFolder"> | Date | string
    updatedAt?: DateTimeFilter<"ChatFolder"> | Date | string
    parentId?: StringNullableFilter<"ChatFolder"> | string | null
    userId?: StringFilter<"ChatFolder"> | string
    parent?: XOR<ChatFolderNullableRelationFilter, ChatFolderWhereInput> | null
    children?: ChatFolderListRelationFilter
    user?: XOR<UserRelationFilter, UserWhereInput>
    sessions?: ChatSessionListRelationFilter
  }

  export type ChatFolderOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    order?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    parentId?: SortOrderInput | SortOrder
    userId?: SortOrder
    parent?: ChatFolderOrderByWithRelationInput
    children?: ChatFolderOrderByRelationAggregateInput
    user?: UserOrderByWithRelationInput
    sessions?: ChatSessionOrderByRelationAggregateInput
  }

  export type ChatFolderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatFolderWhereInput | ChatFolderWhereInput[]
    OR?: ChatFolderWhereInput[]
    NOT?: ChatFolderWhereInput | ChatFolderWhereInput[]
    name?: StringFilter<"ChatFolder"> | string
    order?: IntFilter<"ChatFolder"> | number
    isActive?: BoolFilter<"ChatFolder"> | boolean
    createdAt?: DateTimeFilter<"ChatFolder"> | Date | string
    updatedAt?: DateTimeFilter<"ChatFolder"> | Date | string
    parentId?: StringNullableFilter<"ChatFolder"> | string | null
    userId?: StringFilter<"ChatFolder"> | string
    parent?: XOR<ChatFolderNullableRelationFilter, ChatFolderWhereInput> | null
    children?: ChatFolderListRelationFilter
    user?: XOR<UserRelationFilter, UserWhereInput>
    sessions?: ChatSessionListRelationFilter
  }, "id">

  export type ChatFolderOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    order?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    parentId?: SortOrderInput | SortOrder
    userId?: SortOrder
    _count?: ChatFolderCountOrderByAggregateInput
    _avg?: ChatFolderAvgOrderByAggregateInput
    _max?: ChatFolderMaxOrderByAggregateInput
    _min?: ChatFolderMinOrderByAggregateInput
    _sum?: ChatFolderSumOrderByAggregateInput
  }

  export type ChatFolderScalarWhereWithAggregatesInput = {
    AND?: ChatFolderScalarWhereWithAggregatesInput | ChatFolderScalarWhereWithAggregatesInput[]
    OR?: ChatFolderScalarWhereWithAggregatesInput[]
    NOT?: ChatFolderScalarWhereWithAggregatesInput | ChatFolderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatFolder"> | string
    name?: StringWithAggregatesFilter<"ChatFolder"> | string
    order?: IntWithAggregatesFilter<"ChatFolder"> | number
    isActive?: BoolWithAggregatesFilter<"ChatFolder"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ChatFolder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ChatFolder"> | Date | string
    parentId?: StringNullableWithAggregatesFilter<"ChatFolder"> | string | null
    userId?: StringWithAggregatesFilter<"ChatFolder"> | string
  }

  export type ChatSessionWhereInput = {
    AND?: ChatSessionWhereInput | ChatSessionWhereInput[]
    OR?: ChatSessionWhereInput[]
    NOT?: ChatSessionWhereInput | ChatSessionWhereInput[]
    id?: StringFilter<"ChatSession"> | string
    title?: StringFilter<"ChatSession"> | string
    type?: EnumSessionTypeFilter<"ChatSession"> | $Enums.SessionType
    order?: IntFilter<"ChatSession"> | number
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
    config?: JsonNullableFilter<"ChatSession">
    meta?: JsonNullableFilter<"ChatSession">
    folderId?: StringNullableFilter<"ChatSession"> | string | null
    userId?: StringFilter<"ChatSession"> | string
    sshConnectionId?: StringNullableFilter<"ChatSession"> | string | null
    folder?: XOR<ChatFolderNullableRelationFilter, ChatFolderWhereInput> | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    sshConnection?: XOR<SSHConnectionNullableRelationFilter, SSHConnectionWhereInput> | null
    messages?: MessageListRelationFilter
  }

  export type ChatSessionOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    type?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    config?: SortOrderInput | SortOrder
    meta?: SortOrderInput | SortOrder
    folderId?: SortOrderInput | SortOrder
    userId?: SortOrder
    sshConnectionId?: SortOrderInput | SortOrder
    folder?: ChatFolderOrderByWithRelationInput
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
    type?: EnumSessionTypeFilter<"ChatSession"> | $Enums.SessionType
    order?: IntFilter<"ChatSession"> | number
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
    config?: JsonNullableFilter<"ChatSession">
    meta?: JsonNullableFilter<"ChatSession">
    folderId?: StringNullableFilter<"ChatSession"> | string | null
    userId?: StringFilter<"ChatSession"> | string
    sshConnectionId?: StringNullableFilter<"ChatSession"> | string | null
    folder?: XOR<ChatFolderNullableRelationFilter, ChatFolderWhereInput> | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    sshConnection?: XOR<SSHConnectionNullableRelationFilter, SSHConnectionWhereInput> | null
    messages?: MessageListRelationFilter
  }, "id">

  export type ChatSessionOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    type?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    config?: SortOrderInput | SortOrder
    meta?: SortOrderInput | SortOrder
    folderId?: SortOrderInput | SortOrder
    userId?: SortOrder
    sshConnectionId?: SortOrderInput | SortOrder
    _count?: ChatSessionCountOrderByAggregateInput
    _avg?: ChatSessionAvgOrderByAggregateInput
    _max?: ChatSessionMaxOrderByAggregateInput
    _min?: ChatSessionMinOrderByAggregateInput
    _sum?: ChatSessionSumOrderByAggregateInput
  }

  export type ChatSessionScalarWhereWithAggregatesInput = {
    AND?: ChatSessionScalarWhereWithAggregatesInput | ChatSessionScalarWhereWithAggregatesInput[]
    OR?: ChatSessionScalarWhereWithAggregatesInput[]
    NOT?: ChatSessionScalarWhereWithAggregatesInput | ChatSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatSession"> | string
    title?: StringWithAggregatesFilter<"ChatSession"> | string
    type?: EnumSessionTypeWithAggregatesFilter<"ChatSession"> | $Enums.SessionType
    order?: IntWithAggregatesFilter<"ChatSession"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ChatSession"> | Date | string
    config?: JsonNullableWithAggregatesFilter<"ChatSession">
    meta?: JsonNullableWithAggregatesFilter<"ChatSession">
    folderId?: StringNullableWithAggregatesFilter<"ChatSession"> | string | null
    userId?: StringWithAggregatesFilter<"ChatSession"> | string
    sshConnectionId?: StringNullableWithAggregatesFilter<"ChatSession"> | string | null
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    role?: EnumMessageRoleFilter<"Message"> | $Enums.MessageRole
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
    meta?: JsonNullableFilter<"Message">
    extra?: JsonNullableFilter<"Message">
    isDeleted?: BoolFilter<"Message"> | boolean
    isEdited?: BoolFilter<"Message"> | boolean
    plugin?: JsonNullableFilter<"Message">
    pluginState?: JsonNullableFilter<"Message">
    translate?: JsonNullableFilter<"Message">
    tts?: JsonNullableFilter<"Message">
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
    role?: EnumMessageRoleFilter<"Message"> | $Enums.MessageRole
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
    meta?: JsonNullableFilter<"Message">
    extra?: JsonNullableFilter<"Message">
    isDeleted?: BoolFilter<"Message"> | boolean
    isEdited?: BoolFilter<"Message"> | boolean
    plugin?: JsonNullableFilter<"Message">
    pluginState?: JsonNullableFilter<"Message">
    translate?: JsonNullableFilter<"Message">
    tts?: JsonNullableFilter<"Message">
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
    role?: EnumMessageRoleWithAggregatesFilter<"Message"> | $Enums.MessageRole
    createdAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
    meta?: JsonNullableWithAggregatesFilter<"Message">
    extra?: JsonNullableWithAggregatesFilter<"Message">
    isDeleted?: BoolWithAggregatesFilter<"Message"> | boolean
    isEdited?: BoolWithAggregatesFilter<"Message"> | boolean
    plugin?: JsonNullableWithAggregatesFilter<"Message">
    pluginState?: JsonNullableWithAggregatesFilter<"Message">
    translate?: JsonNullableWithAggregatesFilter<"Message">
    tts?: JsonNullableWithAggregatesFilter<"Message">
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
    safetyLevel?: EnumSafetyLevelFilter<"CommandLog"> | $Enums.SafetyLevel
    metadata?: JsonNullableFilter<"CommandLog">
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
    safetyLevel?: EnumSafetyLevelFilter<"CommandLog"> | $Enums.SafetyLevel
    metadata?: JsonNullableFilter<"CommandLog">
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
    safetyLevel?: EnumSafetyLevelWithAggregatesFilter<"CommandLog"> | $Enums.SafetyLevel
    metadata?: JsonNullableWithAggregatesFilter<"CommandLog">
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
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderCreateNestedManyWithoutUserInput
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    chatFolders?: ChatFolderCreateNestedManyWithoutUserInput
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
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderUncheckedCreateNestedManyWithoutUserInput
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    chatFolders?: ChatFolderUncheckedCreateNestedManyWithoutUserInput
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
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderUpdateManyWithoutUserNestedInput
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    chatFolders?: ChatFolderUpdateManyWithoutUserNestedInput
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
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderUncheckedUpdateManyWithoutUserNestedInput
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    chatFolders?: ChatFolderUncheckedUpdateManyWithoutUserNestedInput
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
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
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

  export type SSHFolderCreateManyInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parentId?: string | null
    userId: string
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
    authType: $Enums.SSHAuthType
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: $Enums.ConnectionStatus
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folder?: SSHFolderCreateNestedOneWithoutConnectionsInput
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
    order?: number
    authType: $Enums.SSHAuthType
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: $Enums.ConnectionStatus
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: string | null
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
    order?: IntFieldUpdateOperationsInput | number
    authType?: EnumSSHAuthTypeFieldUpdateOperationsInput | $Enums.SSHAuthType
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumConnectionStatusFieldUpdateOperationsInput | $Enums.ConnectionStatus
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folder?: SSHFolderUpdateOneWithoutConnectionsNestedInput
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
    order?: IntFieldUpdateOperationsInput | number
    authType?: EnumSSHAuthTypeFieldUpdateOperationsInput | $Enums.SSHAuthType
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumConnectionStatusFieldUpdateOperationsInput | $Enums.ConnectionStatus
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
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
    order?: number
    authType: $Enums.SSHAuthType
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: $Enums.ConnectionStatus
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: string | null
    userId: string
  }

  export type SSHConnectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: EnumSSHAuthTypeFieldUpdateOperationsInput | $Enums.SSHAuthType
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumConnectionStatusFieldUpdateOperationsInput | $Enums.ConnectionStatus
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
  }

  export type SSHConnectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: EnumSSHAuthTypeFieldUpdateOperationsInput | $Enums.SSHAuthType
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumConnectionStatusFieldUpdateOperationsInput | $Enums.ConnectionStatus
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type ChatFolderCreateInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: ChatFolderCreateNestedOneWithoutChildrenInput
    children?: ChatFolderCreateNestedManyWithoutParentInput
    user: UserCreateNestedOneWithoutChatFoldersInput
    sessions?: ChatSessionCreateNestedManyWithoutFolderInput
  }

  export type ChatFolderUncheckedCreateInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parentId?: string | null
    userId: string
    children?: ChatFolderUncheckedCreateNestedManyWithoutParentInput
    sessions?: ChatSessionUncheckedCreateNestedManyWithoutFolderInput
  }

  export type ChatFolderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: ChatFolderUpdateOneWithoutChildrenNestedInput
    children?: ChatFolderUpdateManyWithoutParentNestedInput
    user?: UserUpdateOneRequiredWithoutChatFoldersNestedInput
    sessions?: ChatSessionUpdateManyWithoutFolderNestedInput
  }

  export type ChatFolderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    children?: ChatFolderUncheckedUpdateManyWithoutParentNestedInput
    sessions?: ChatSessionUncheckedUpdateManyWithoutFolderNestedInput
  }

  export type ChatFolderCreateManyInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parentId?: string | null
    userId: string
  }

  export type ChatFolderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatFolderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type ChatSessionCreateInput = {
    id?: string
    title: string
    type?: $Enums.SessionType
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folder?: ChatFolderCreateNestedOneWithoutSessionsInput
    user: UserCreateNestedOneWithoutChatSessionsInput
    sshConnection?: SSHConnectionCreateNestedOneWithoutChatSessionsInput
    messages?: MessageCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUncheckedCreateInput = {
    id?: string
    title: string
    type?: $Enums.SessionType
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: string | null
    userId: string
    sshConnectionId?: string | null
    messages?: MessageUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folder?: ChatFolderUpdateOneWithoutSessionsNestedInput
    user?: UserUpdateOneRequiredWithoutChatSessionsNestedInput
    sshConnection?: SSHConnectionUpdateOneWithoutChatSessionsNestedInput
    messages?: MessageUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    sshConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
    messages?: MessageUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionCreateManyInput = {
    id?: string
    title: string
    type?: $Enums.SessionType
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: string | null
    userId: string
    sshConnectionId?: string | null
  }

  export type ChatSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ChatSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    sshConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MessageCreateInput = {
    id?: string
    content: string
    role: $Enums.MessageRole
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    extra?: NullableJsonNullValueInput | InputJsonValue
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: NullableJsonNullValueInput | InputJsonValue
    pluginState?: NullableJsonNullValueInput | InputJsonValue
    translate?: NullableJsonNullValueInput | InputJsonValue
    tts?: NullableJsonNullValueInput | InputJsonValue
    session: ChatSessionCreateNestedOneWithoutMessagesInput
    user: UserCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateInput = {
    id?: string
    content: string
    role: $Enums.MessageRole
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    extra?: NullableJsonNullValueInput | InputJsonValue
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: NullableJsonNullValueInput | InputJsonValue
    pluginState?: NullableJsonNullValueInput | InputJsonValue
    translate?: NullableJsonNullValueInput | InputJsonValue
    tts?: NullableJsonNullValueInput | InputJsonValue
    sessionId: string
    userId: string
  }

  export type MessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    extra?: NullableJsonNullValueInput | InputJsonValue
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableJsonNullValueInput | InputJsonValue
    pluginState?: NullableJsonNullValueInput | InputJsonValue
    translate?: NullableJsonNullValueInput | InputJsonValue
    tts?: NullableJsonNullValueInput | InputJsonValue
    session?: ChatSessionUpdateOneRequiredWithoutMessagesNestedInput
    user?: UserUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    extra?: NullableJsonNullValueInput | InputJsonValue
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableJsonNullValueInput | InputJsonValue
    pluginState?: NullableJsonNullValueInput | InputJsonValue
    translate?: NullableJsonNullValueInput | InputJsonValue
    tts?: NullableJsonNullValueInput | InputJsonValue
    sessionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type MessageCreateManyInput = {
    id?: string
    content: string
    role: $Enums.MessageRole
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    extra?: NullableJsonNullValueInput | InputJsonValue
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: NullableJsonNullValueInput | InputJsonValue
    pluginState?: NullableJsonNullValueInput | InputJsonValue
    translate?: NullableJsonNullValueInput | InputJsonValue
    tts?: NullableJsonNullValueInput | InputJsonValue
    sessionId: string
    userId: string
  }

  export type MessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    extra?: NullableJsonNullValueInput | InputJsonValue
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableJsonNullValueInput | InputJsonValue
    pluginState?: NullableJsonNullValueInput | InputJsonValue
    translate?: NullableJsonNullValueInput | InputJsonValue
    tts?: NullableJsonNullValueInput | InputJsonValue
  }

  export type MessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    extra?: NullableJsonNullValueInput | InputJsonValue
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableJsonNullValueInput | InputJsonValue
    pluginState?: NullableJsonNullValueInput | InputJsonValue
    translate?: NullableJsonNullValueInput | InputJsonValue
    tts?: NullableJsonNullValueInput | InputJsonValue
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
    safetyLevel?: $Enums.SafetyLevel
    metadata?: NullableJsonNullValueInput | InputJsonValue
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
    safetyLevel?: $Enums.SafetyLevel
    metadata?: NullableJsonNullValueInput | InputJsonValue
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
    safetyLevel?: EnumSafetyLevelFieldUpdateOperationsInput | $Enums.SafetyLevel
    metadata?: NullableJsonNullValueInput | InputJsonValue
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
    safetyLevel?: EnumSafetyLevelFieldUpdateOperationsInput | $Enums.SafetyLevel
    metadata?: NullableJsonNullValueInput | InputJsonValue
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
    safetyLevel?: $Enums.SafetyLevel
    metadata?: NullableJsonNullValueInput | InputJsonValue
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
    safetyLevel?: EnumSafetyLevelFieldUpdateOperationsInput | $Enums.SafetyLevel
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type CommandLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    exitCode?: NullableIntFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    safetyLevel?: EnumSafetyLevelFieldUpdateOperationsInput | $Enums.SafetyLevel
    metadata?: NullableJsonNullValueInput | InputJsonValue
    userId?: StringFieldUpdateOperationsInput | string
    sshConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
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

  export type ChatFolderListRelationFilter = {
    every?: ChatFolderWhereInput
    some?: ChatFolderWhereInput
    none?: ChatFolderWhereInput
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

  export type SSHFolderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SSHConnectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatFolderOrderByRelationAggregateInput = {
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
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
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
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
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

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
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
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
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

  export type EnumSSHAuthTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SSHAuthType | EnumSSHAuthTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SSHAuthType[] | ListEnumSSHAuthTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SSHAuthType[] | ListEnumSSHAuthTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSSHAuthTypeFilter<$PrismaModel> | $Enums.SSHAuthType
  }

  export type EnumConnectionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ConnectionStatus | EnumConnectionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConnectionStatus[] | ListEnumConnectionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConnectionStatus[] | ListEnumConnectionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConnectionStatusFilter<$PrismaModel> | $Enums.ConnectionStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
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
    folderId?: SortOrder
    userId?: SortOrder
  }

  export type SSHConnectionSumOrderByAggregateInput = {
    port?: SortOrder
    order?: SortOrder
  }

  export type EnumSSHAuthTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SSHAuthType | EnumSSHAuthTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SSHAuthType[] | ListEnumSSHAuthTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SSHAuthType[] | ListEnumSSHAuthTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSSHAuthTypeWithAggregatesFilter<$PrismaModel> | $Enums.SSHAuthType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSSHAuthTypeFilter<$PrismaModel>
    _max?: NestedEnumSSHAuthTypeFilter<$PrismaModel>
  }

  export type EnumConnectionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConnectionStatus | EnumConnectionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConnectionStatus[] | ListEnumConnectionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConnectionStatus[] | ListEnumConnectionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConnectionStatusWithAggregatesFilter<$PrismaModel> | $Enums.ConnectionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConnectionStatusFilter<$PrismaModel>
    _max?: NestedEnumConnectionStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ChatFolderNullableRelationFilter = {
    is?: ChatFolderWhereInput | null
    isNot?: ChatFolderWhereInput | null
  }

  export type ChatFolderCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    order?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    parentId?: SortOrder
    userId?: SortOrder
  }

  export type ChatFolderAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type ChatFolderMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    order?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    parentId?: SortOrder
    userId?: SortOrder
  }

  export type ChatFolderMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    order?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    parentId?: SortOrder
    userId?: SortOrder
  }

  export type ChatFolderSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type EnumSessionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionType | EnumSessionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionTypeFilter<$PrismaModel> | $Enums.SessionType
  }

  export type SSHConnectionNullableRelationFilter = {
    is?: SSHConnectionWhereInput | null
    isNot?: SSHConnectionWhereInput | null
  }

  export type ChatSessionCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    type?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    config?: SortOrder
    meta?: SortOrder
    folderId?: SortOrder
    userId?: SortOrder
    sshConnectionId?: SortOrder
  }

  export type ChatSessionAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type ChatSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    type?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    folderId?: SortOrder
    userId?: SortOrder
    sshConnectionId?: SortOrder
  }

  export type ChatSessionMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    type?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    folderId?: SortOrder
    userId?: SortOrder
    sshConnectionId?: SortOrder
  }

  export type ChatSessionSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type EnumSessionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionType | EnumSessionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionTypeWithAggregatesFilter<$PrismaModel> | $Enums.SessionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionTypeFilter<$PrismaModel>
    _max?: NestedEnumSessionTypeFilter<$PrismaModel>
  }

  export type EnumMessageRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleFilter<$PrismaModel> | $Enums.MessageRole
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
    isDeleted?: SortOrder
    isEdited?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isDeleted?: SortOrder
    isEdited?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
  }

  export type EnumMessageRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleWithAggregatesFilter<$PrismaModel> | $Enums.MessageRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageRoleFilter<$PrismaModel>
    _max?: NestedEnumMessageRoleFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EnumSafetyLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyLevel | EnumSafetyLevelFieldRefInput<$PrismaModel>
    in?: $Enums.SafetyLevel[] | ListEnumSafetyLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.SafetyLevel[] | ListEnumSafetyLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumSafetyLevelFilter<$PrismaModel> | $Enums.SafetyLevel
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
    userId?: SortOrder
    sshConnectionId?: SortOrder
  }

  export type CommandLogSumOrderByAggregateInput = {
    exitCode?: SortOrder
    duration?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
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

  export type EnumSafetyLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyLevel | EnumSafetyLevelFieldRefInput<$PrismaModel>
    in?: $Enums.SafetyLevel[] | ListEnumSafetyLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.SafetyLevel[] | ListEnumSafetyLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumSafetyLevelWithAggregatesFilter<$PrismaModel> | $Enums.SafetyLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSafetyLevelFilter<$PrismaModel>
    _max?: NestedEnumSafetyLevelFilter<$PrismaModel>
  }

  export type SSHFolderCreateNestedManyWithoutUserInput = {
    create?: XOR<SSHFolderCreateWithoutUserInput, SSHFolderUncheckedCreateWithoutUserInput> | SSHFolderCreateWithoutUserInput[] | SSHFolderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SSHFolderCreateOrConnectWithoutUserInput | SSHFolderCreateOrConnectWithoutUserInput[]
    createMany?: SSHFolderCreateManyUserInputEnvelope
    connect?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
  }

  export type SSHConnectionCreateNestedManyWithoutUserInput = {
    create?: XOR<SSHConnectionCreateWithoutUserInput, SSHConnectionUncheckedCreateWithoutUserInput> | SSHConnectionCreateWithoutUserInput[] | SSHConnectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutUserInput | SSHConnectionCreateOrConnectWithoutUserInput[]
    createMany?: SSHConnectionCreateManyUserInputEnvelope
    connect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
  }

  export type ChatFolderCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatFolderCreateWithoutUserInput, ChatFolderUncheckedCreateWithoutUserInput> | ChatFolderCreateWithoutUserInput[] | ChatFolderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatFolderCreateOrConnectWithoutUserInput | ChatFolderCreateOrConnectWithoutUserInput[]
    createMany?: ChatFolderCreateManyUserInputEnvelope
    connect?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
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

  export type SSHFolderUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SSHFolderCreateWithoutUserInput, SSHFolderUncheckedCreateWithoutUserInput> | SSHFolderCreateWithoutUserInput[] | SSHFolderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SSHFolderCreateOrConnectWithoutUserInput | SSHFolderCreateOrConnectWithoutUserInput[]
    createMany?: SSHFolderCreateManyUserInputEnvelope
    connect?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
  }

  export type SSHConnectionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SSHConnectionCreateWithoutUserInput, SSHConnectionUncheckedCreateWithoutUserInput> | SSHConnectionCreateWithoutUserInput[] | SSHConnectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutUserInput | SSHConnectionCreateOrConnectWithoutUserInput[]
    createMany?: SSHConnectionCreateManyUserInputEnvelope
    connect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
  }

  export type ChatFolderUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatFolderCreateWithoutUserInput, ChatFolderUncheckedCreateWithoutUserInput> | ChatFolderCreateWithoutUserInput[] | ChatFolderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatFolderCreateOrConnectWithoutUserInput | ChatFolderCreateOrConnectWithoutUserInput[]
    createMany?: ChatFolderCreateManyUserInputEnvelope
    connect?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
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

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
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
    createMany?: SSHFolderCreateManyUserInputEnvelope
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
    createMany?: SSHConnectionCreateManyUserInputEnvelope
    set?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    disconnect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    delete?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    connect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    update?: SSHConnectionUpdateWithWhereUniqueWithoutUserInput | SSHConnectionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SSHConnectionUpdateManyWithWhereWithoutUserInput | SSHConnectionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SSHConnectionScalarWhereInput | SSHConnectionScalarWhereInput[]
  }

  export type ChatFolderUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatFolderCreateWithoutUserInput, ChatFolderUncheckedCreateWithoutUserInput> | ChatFolderCreateWithoutUserInput[] | ChatFolderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatFolderCreateOrConnectWithoutUserInput | ChatFolderCreateOrConnectWithoutUserInput[]
    upsert?: ChatFolderUpsertWithWhereUniqueWithoutUserInput | ChatFolderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatFolderCreateManyUserInputEnvelope
    set?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
    disconnect?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
    delete?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
    connect?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
    update?: ChatFolderUpdateWithWhereUniqueWithoutUserInput | ChatFolderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatFolderUpdateManyWithWhereWithoutUserInput | ChatFolderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatFolderScalarWhereInput | ChatFolderScalarWhereInput[]
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

  export type SSHFolderUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SSHFolderCreateWithoutUserInput, SSHFolderUncheckedCreateWithoutUserInput> | SSHFolderCreateWithoutUserInput[] | SSHFolderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SSHFolderCreateOrConnectWithoutUserInput | SSHFolderCreateOrConnectWithoutUserInput[]
    upsert?: SSHFolderUpsertWithWhereUniqueWithoutUserInput | SSHFolderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SSHFolderCreateManyUserInputEnvelope
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
    createMany?: SSHConnectionCreateManyUserInputEnvelope
    set?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    disconnect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    delete?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    connect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
    update?: SSHConnectionUpdateWithWhereUniqueWithoutUserInput | SSHConnectionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SSHConnectionUpdateManyWithWhereWithoutUserInput | SSHConnectionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SSHConnectionScalarWhereInput | SSHConnectionScalarWhereInput[]
  }

  export type ChatFolderUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatFolderCreateWithoutUserInput, ChatFolderUncheckedCreateWithoutUserInput> | ChatFolderCreateWithoutUserInput[] | ChatFolderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatFolderCreateOrConnectWithoutUserInput | ChatFolderCreateOrConnectWithoutUserInput[]
    upsert?: ChatFolderUpsertWithWhereUniqueWithoutUserInput | ChatFolderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatFolderCreateManyUserInputEnvelope
    set?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
    disconnect?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
    delete?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
    connect?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
    update?: ChatFolderUpdateWithWhereUniqueWithoutUserInput | ChatFolderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatFolderUpdateManyWithWhereWithoutUserInput | ChatFolderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatFolderScalarWhereInput | ChatFolderScalarWhereInput[]
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

  export type SSHFolderCreateNestedOneWithoutChildrenInput = {
    create?: XOR<SSHFolderCreateWithoutChildrenInput, SSHFolderUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: SSHFolderCreateOrConnectWithoutChildrenInput
    connect?: SSHFolderWhereUniqueInput
  }

  export type SSHFolderCreateNestedManyWithoutParentInput = {
    create?: XOR<SSHFolderCreateWithoutParentInput, SSHFolderUncheckedCreateWithoutParentInput> | SSHFolderCreateWithoutParentInput[] | SSHFolderUncheckedCreateWithoutParentInput[]
    connectOrCreate?: SSHFolderCreateOrConnectWithoutParentInput | SSHFolderCreateOrConnectWithoutParentInput[]
    createMany?: SSHFolderCreateManyParentInputEnvelope
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
    createMany?: SSHConnectionCreateManyFolderInputEnvelope
    connect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
  }

  export type SSHFolderUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<SSHFolderCreateWithoutParentInput, SSHFolderUncheckedCreateWithoutParentInput> | SSHFolderCreateWithoutParentInput[] | SSHFolderUncheckedCreateWithoutParentInput[]
    connectOrCreate?: SSHFolderCreateOrConnectWithoutParentInput | SSHFolderCreateOrConnectWithoutParentInput[]
    createMany?: SSHFolderCreateManyParentInputEnvelope
    connect?: SSHFolderWhereUniqueInput | SSHFolderWhereUniqueInput[]
  }

  export type SSHConnectionUncheckedCreateNestedManyWithoutFolderInput = {
    create?: XOR<SSHConnectionCreateWithoutFolderInput, SSHConnectionUncheckedCreateWithoutFolderInput> | SSHConnectionCreateWithoutFolderInput[] | SSHConnectionUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutFolderInput | SSHConnectionCreateOrConnectWithoutFolderInput[]
    createMany?: SSHConnectionCreateManyFolderInputEnvelope
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
    createMany?: SSHFolderCreateManyParentInputEnvelope
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
    createMany?: SSHConnectionCreateManyFolderInputEnvelope
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
    createMany?: SSHFolderCreateManyParentInputEnvelope
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
    createMany?: SSHConnectionCreateManyFolderInputEnvelope
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

  export type EnumSSHAuthTypeFieldUpdateOperationsInput = {
    set?: $Enums.SSHAuthType
  }

  export type EnumConnectionStatusFieldUpdateOperationsInput = {
    set?: $Enums.ConnectionStatus
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

  export type ChatFolderCreateNestedOneWithoutChildrenInput = {
    create?: XOR<ChatFolderCreateWithoutChildrenInput, ChatFolderUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: ChatFolderCreateOrConnectWithoutChildrenInput
    connect?: ChatFolderWhereUniqueInput
  }

  export type ChatFolderCreateNestedManyWithoutParentInput = {
    create?: XOR<ChatFolderCreateWithoutParentInput, ChatFolderUncheckedCreateWithoutParentInput> | ChatFolderCreateWithoutParentInput[] | ChatFolderUncheckedCreateWithoutParentInput[]
    connectOrCreate?: ChatFolderCreateOrConnectWithoutParentInput | ChatFolderCreateOrConnectWithoutParentInput[]
    createMany?: ChatFolderCreateManyParentInputEnvelope
    connect?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutChatFoldersInput = {
    create?: XOR<UserCreateWithoutChatFoldersInput, UserUncheckedCreateWithoutChatFoldersInput>
    connectOrCreate?: UserCreateOrConnectWithoutChatFoldersInput
    connect?: UserWhereUniqueInput
  }

  export type ChatSessionCreateNestedManyWithoutFolderInput = {
    create?: XOR<ChatSessionCreateWithoutFolderInput, ChatSessionUncheckedCreateWithoutFolderInput> | ChatSessionCreateWithoutFolderInput[] | ChatSessionUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutFolderInput | ChatSessionCreateOrConnectWithoutFolderInput[]
    createMany?: ChatSessionCreateManyFolderInputEnvelope
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
  }

  export type ChatFolderUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<ChatFolderCreateWithoutParentInput, ChatFolderUncheckedCreateWithoutParentInput> | ChatFolderCreateWithoutParentInput[] | ChatFolderUncheckedCreateWithoutParentInput[]
    connectOrCreate?: ChatFolderCreateOrConnectWithoutParentInput | ChatFolderCreateOrConnectWithoutParentInput[]
    createMany?: ChatFolderCreateManyParentInputEnvelope
    connect?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
  }

  export type ChatSessionUncheckedCreateNestedManyWithoutFolderInput = {
    create?: XOR<ChatSessionCreateWithoutFolderInput, ChatSessionUncheckedCreateWithoutFolderInput> | ChatSessionCreateWithoutFolderInput[] | ChatSessionUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutFolderInput | ChatSessionCreateOrConnectWithoutFolderInput[]
    createMany?: ChatSessionCreateManyFolderInputEnvelope
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
  }

  export type ChatFolderUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<ChatFolderCreateWithoutChildrenInput, ChatFolderUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: ChatFolderCreateOrConnectWithoutChildrenInput
    upsert?: ChatFolderUpsertWithoutChildrenInput
    disconnect?: ChatFolderWhereInput | boolean
    delete?: ChatFolderWhereInput | boolean
    connect?: ChatFolderWhereUniqueInput
    update?: XOR<XOR<ChatFolderUpdateToOneWithWhereWithoutChildrenInput, ChatFolderUpdateWithoutChildrenInput>, ChatFolderUncheckedUpdateWithoutChildrenInput>
  }

  export type ChatFolderUpdateManyWithoutParentNestedInput = {
    create?: XOR<ChatFolderCreateWithoutParentInput, ChatFolderUncheckedCreateWithoutParentInput> | ChatFolderCreateWithoutParentInput[] | ChatFolderUncheckedCreateWithoutParentInput[]
    connectOrCreate?: ChatFolderCreateOrConnectWithoutParentInput | ChatFolderCreateOrConnectWithoutParentInput[]
    upsert?: ChatFolderUpsertWithWhereUniqueWithoutParentInput | ChatFolderUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: ChatFolderCreateManyParentInputEnvelope
    set?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
    disconnect?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
    delete?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
    connect?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
    update?: ChatFolderUpdateWithWhereUniqueWithoutParentInput | ChatFolderUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: ChatFolderUpdateManyWithWhereWithoutParentInput | ChatFolderUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: ChatFolderScalarWhereInput | ChatFolderScalarWhereInput[]
  }

  export type UserUpdateOneRequiredWithoutChatFoldersNestedInput = {
    create?: XOR<UserCreateWithoutChatFoldersInput, UserUncheckedCreateWithoutChatFoldersInput>
    connectOrCreate?: UserCreateOrConnectWithoutChatFoldersInput
    upsert?: UserUpsertWithoutChatFoldersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutChatFoldersInput, UserUpdateWithoutChatFoldersInput>, UserUncheckedUpdateWithoutChatFoldersInput>
  }

  export type ChatSessionUpdateManyWithoutFolderNestedInput = {
    create?: XOR<ChatSessionCreateWithoutFolderInput, ChatSessionUncheckedCreateWithoutFolderInput> | ChatSessionCreateWithoutFolderInput[] | ChatSessionUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutFolderInput | ChatSessionCreateOrConnectWithoutFolderInput[]
    upsert?: ChatSessionUpsertWithWhereUniqueWithoutFolderInput | ChatSessionUpsertWithWhereUniqueWithoutFolderInput[]
    createMany?: ChatSessionCreateManyFolderInputEnvelope
    set?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    disconnect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    delete?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    update?: ChatSessionUpdateWithWhereUniqueWithoutFolderInput | ChatSessionUpdateWithWhereUniqueWithoutFolderInput[]
    updateMany?: ChatSessionUpdateManyWithWhereWithoutFolderInput | ChatSessionUpdateManyWithWhereWithoutFolderInput[]
    deleteMany?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
  }

  export type ChatFolderUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<ChatFolderCreateWithoutParentInput, ChatFolderUncheckedCreateWithoutParentInput> | ChatFolderCreateWithoutParentInput[] | ChatFolderUncheckedCreateWithoutParentInput[]
    connectOrCreate?: ChatFolderCreateOrConnectWithoutParentInput | ChatFolderCreateOrConnectWithoutParentInput[]
    upsert?: ChatFolderUpsertWithWhereUniqueWithoutParentInput | ChatFolderUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: ChatFolderCreateManyParentInputEnvelope
    set?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
    disconnect?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
    delete?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
    connect?: ChatFolderWhereUniqueInput | ChatFolderWhereUniqueInput[]
    update?: ChatFolderUpdateWithWhereUniqueWithoutParentInput | ChatFolderUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: ChatFolderUpdateManyWithWhereWithoutParentInput | ChatFolderUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: ChatFolderScalarWhereInput | ChatFolderScalarWhereInput[]
  }

  export type ChatSessionUncheckedUpdateManyWithoutFolderNestedInput = {
    create?: XOR<ChatSessionCreateWithoutFolderInput, ChatSessionUncheckedCreateWithoutFolderInput> | ChatSessionCreateWithoutFolderInput[] | ChatSessionUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutFolderInput | ChatSessionCreateOrConnectWithoutFolderInput[]
    upsert?: ChatSessionUpsertWithWhereUniqueWithoutFolderInput | ChatSessionUpsertWithWhereUniqueWithoutFolderInput[]
    createMany?: ChatSessionCreateManyFolderInputEnvelope
    set?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    disconnect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    delete?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    update?: ChatSessionUpdateWithWhereUniqueWithoutFolderInput | ChatSessionUpdateWithWhereUniqueWithoutFolderInput[]
    updateMany?: ChatSessionUpdateManyWithWhereWithoutFolderInput | ChatSessionUpdateManyWithWhereWithoutFolderInput[]
    deleteMany?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
  }

  export type ChatFolderCreateNestedOneWithoutSessionsInput = {
    create?: XOR<ChatFolderCreateWithoutSessionsInput, ChatFolderUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: ChatFolderCreateOrConnectWithoutSessionsInput
    connect?: ChatFolderWhereUniqueInput
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

  export type EnumSessionTypeFieldUpdateOperationsInput = {
    set?: $Enums.SessionType
  }

  export type ChatFolderUpdateOneWithoutSessionsNestedInput = {
    create?: XOR<ChatFolderCreateWithoutSessionsInput, ChatFolderUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: ChatFolderCreateOrConnectWithoutSessionsInput
    upsert?: ChatFolderUpsertWithoutSessionsInput
    disconnect?: ChatFolderWhereInput | boolean
    delete?: ChatFolderWhereInput | boolean
    connect?: ChatFolderWhereUniqueInput
    update?: XOR<XOR<ChatFolderUpdateToOneWithWhereWithoutSessionsInput, ChatFolderUpdateWithoutSessionsInput>, ChatFolderUncheckedUpdateWithoutSessionsInput>
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

  export type EnumMessageRoleFieldUpdateOperationsInput = {
    set?: $Enums.MessageRole
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

  export type EnumSafetyLevelFieldUpdateOperationsInput = {
    set?: $Enums.SafetyLevel
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
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
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
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
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
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
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
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
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
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
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
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumSSHAuthTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SSHAuthType | EnumSSHAuthTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SSHAuthType[] | ListEnumSSHAuthTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SSHAuthType[] | ListEnumSSHAuthTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSSHAuthTypeFilter<$PrismaModel> | $Enums.SSHAuthType
  }

  export type NestedEnumConnectionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ConnectionStatus | EnumConnectionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConnectionStatus[] | ListEnumConnectionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConnectionStatus[] | ListEnumConnectionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConnectionStatusFilter<$PrismaModel> | $Enums.ConnectionStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumSSHAuthTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SSHAuthType | EnumSSHAuthTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SSHAuthType[] | ListEnumSSHAuthTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SSHAuthType[] | ListEnumSSHAuthTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSSHAuthTypeWithAggregatesFilter<$PrismaModel> | $Enums.SSHAuthType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSSHAuthTypeFilter<$PrismaModel>
    _max?: NestedEnumSSHAuthTypeFilter<$PrismaModel>
  }

  export type NestedEnumConnectionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConnectionStatus | EnumConnectionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConnectionStatus[] | ListEnumConnectionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConnectionStatus[] | ListEnumConnectionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConnectionStatusWithAggregatesFilter<$PrismaModel> | $Enums.ConnectionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConnectionStatusFilter<$PrismaModel>
    _max?: NestedEnumConnectionStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumSessionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionType | EnumSessionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionTypeFilter<$PrismaModel> | $Enums.SessionType
  }

  export type NestedEnumSessionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionType | EnumSessionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionType[] | ListEnumSessionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionTypeWithAggregatesFilter<$PrismaModel> | $Enums.SessionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionTypeFilter<$PrismaModel>
    _max?: NestedEnumSessionTypeFilter<$PrismaModel>
  }

  export type NestedEnumMessageRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleFilter<$PrismaModel> | $Enums.MessageRole
  }

  export type NestedEnumMessageRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleWithAggregatesFilter<$PrismaModel> | $Enums.MessageRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageRoleFilter<$PrismaModel>
    _max?: NestedEnumMessageRoleFilter<$PrismaModel>
  }

  export type NestedEnumSafetyLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyLevel | EnumSafetyLevelFieldRefInput<$PrismaModel>
    in?: $Enums.SafetyLevel[] | ListEnumSafetyLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.SafetyLevel[] | ListEnumSafetyLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumSafetyLevelFilter<$PrismaModel> | $Enums.SafetyLevel
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
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
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumSafetyLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyLevel | EnumSafetyLevelFieldRefInput<$PrismaModel>
    in?: $Enums.SafetyLevel[] | ListEnumSafetyLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.SafetyLevel[] | ListEnumSafetyLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumSafetyLevelWithAggregatesFilter<$PrismaModel> | $Enums.SafetyLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSafetyLevelFilter<$PrismaModel>
    _max?: NestedEnumSafetyLevelFilter<$PrismaModel>
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

  export type SSHFolderCreateManyUserInputEnvelope = {
    data: SSHFolderCreateManyUserInput | SSHFolderCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SSHConnectionCreateWithoutUserInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
    order?: number
    authType: $Enums.SSHAuthType
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: $Enums.ConnectionStatus
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folder?: SSHFolderCreateNestedOneWithoutConnectionsInput
    chatSessions?: ChatSessionCreateNestedManyWithoutSshConnectionInput
    commandLogs?: CommandLogCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
    order?: number
    authType: $Enums.SSHAuthType
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: $Enums.ConnectionStatus
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: string | null
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutSshConnectionInput
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionCreateOrConnectWithoutUserInput = {
    where: SSHConnectionWhereUniqueInput
    create: XOR<SSHConnectionCreateWithoutUserInput, SSHConnectionUncheckedCreateWithoutUserInput>
  }

  export type SSHConnectionCreateManyUserInputEnvelope = {
    data: SSHConnectionCreateManyUserInput | SSHConnectionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ChatFolderCreateWithoutUserInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: ChatFolderCreateNestedOneWithoutChildrenInput
    children?: ChatFolderCreateNestedManyWithoutParentInput
    sessions?: ChatSessionCreateNestedManyWithoutFolderInput
  }

  export type ChatFolderUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parentId?: string | null
    children?: ChatFolderUncheckedCreateNestedManyWithoutParentInput
    sessions?: ChatSessionUncheckedCreateNestedManyWithoutFolderInput
  }

  export type ChatFolderCreateOrConnectWithoutUserInput = {
    where: ChatFolderWhereUniqueInput
    create: XOR<ChatFolderCreateWithoutUserInput, ChatFolderUncheckedCreateWithoutUserInput>
  }

  export type ChatFolderCreateManyUserInputEnvelope = {
    data: ChatFolderCreateManyUserInput | ChatFolderCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ChatSessionCreateWithoutUserInput = {
    id?: string
    title: string
    type?: $Enums.SessionType
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folder?: ChatFolderCreateNestedOneWithoutSessionsInput
    sshConnection?: SSHConnectionCreateNestedOneWithoutChatSessionsInput
    messages?: MessageCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    type?: $Enums.SessionType
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: string | null
    sshConnectionId?: string | null
    messages?: MessageUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionCreateOrConnectWithoutUserInput = {
    where: ChatSessionWhereUniqueInput
    create: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput>
  }

  export type ChatSessionCreateManyUserInputEnvelope = {
    data: ChatSessionCreateManyUserInput | ChatSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutUserInput = {
    id?: string
    content: string
    role: $Enums.MessageRole
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    extra?: NullableJsonNullValueInput | InputJsonValue
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: NullableJsonNullValueInput | InputJsonValue
    pluginState?: NullableJsonNullValueInput | InputJsonValue
    translate?: NullableJsonNullValueInput | InputJsonValue
    tts?: NullableJsonNullValueInput | InputJsonValue
    session: ChatSessionCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateWithoutUserInput = {
    id?: string
    content: string
    role: $Enums.MessageRole
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    extra?: NullableJsonNullValueInput | InputJsonValue
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: NullableJsonNullValueInput | InputJsonValue
    pluginState?: NullableJsonNullValueInput | InputJsonValue
    translate?: NullableJsonNullValueInput | InputJsonValue
    tts?: NullableJsonNullValueInput | InputJsonValue
    sessionId: string
  }

  export type MessageCreateOrConnectWithoutUserInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutUserInput, MessageUncheckedCreateWithoutUserInput>
  }

  export type MessageCreateManyUserInputEnvelope = {
    data: MessageCreateManyUserInput | MessageCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CommandLogCreateWithoutUserInput = {
    id?: string
    command: string
    output?: string | null
    exitCode?: number | null
    duration?: number | null
    createdAt?: Date | string
    safetyLevel?: $Enums.SafetyLevel
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sshConnection?: SSHConnectionCreateNestedOneWithoutCommandLogsInput
  }

  export type CommandLogUncheckedCreateWithoutUserInput = {
    id?: string
    command: string
    output?: string | null
    exitCode?: number | null
    duration?: number | null
    createdAt?: Date | string
    safetyLevel?: $Enums.SafetyLevel
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sshConnectionId?: string | null
  }

  export type CommandLogCreateOrConnectWithoutUserInput = {
    where: CommandLogWhereUniqueInput
    create: XOR<CommandLogCreateWithoutUserInput, CommandLogUncheckedCreateWithoutUserInput>
  }

  export type CommandLogCreateManyUserInputEnvelope = {
    data: CommandLogCreateManyUserInput | CommandLogCreateManyUserInput[]
    skipDuplicates?: boolean
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
    authType?: EnumSSHAuthTypeFilter<"SSHConnection"> | $Enums.SSHAuthType
    password?: StringNullableFilter<"SSHConnection"> | string | null
    privateKey?: StringNullableFilter<"SSHConnection"> | string | null
    publicKey?: StringNullableFilter<"SSHConnection"> | string | null
    passphrase?: StringNullableFilter<"SSHConnection"> | string | null
    status?: EnumConnectionStatusFilter<"SSHConnection"> | $Enums.ConnectionStatus
    lastUsed?: DateTimeNullableFilter<"SSHConnection"> | Date | string | null
    isActive?: BoolFilter<"SSHConnection"> | boolean
    createdAt?: DateTimeFilter<"SSHConnection"> | Date | string
    updatedAt?: DateTimeFilter<"SSHConnection"> | Date | string
    meta?: JsonNullableFilter<"SSHConnection">
    folderId?: StringNullableFilter<"SSHConnection"> | string | null
    userId?: StringFilter<"SSHConnection"> | string
  }

  export type ChatFolderUpsertWithWhereUniqueWithoutUserInput = {
    where: ChatFolderWhereUniqueInput
    update: XOR<ChatFolderUpdateWithoutUserInput, ChatFolderUncheckedUpdateWithoutUserInput>
    create: XOR<ChatFolderCreateWithoutUserInput, ChatFolderUncheckedCreateWithoutUserInput>
  }

  export type ChatFolderUpdateWithWhereUniqueWithoutUserInput = {
    where: ChatFolderWhereUniqueInput
    data: XOR<ChatFolderUpdateWithoutUserInput, ChatFolderUncheckedUpdateWithoutUserInput>
  }

  export type ChatFolderUpdateManyWithWhereWithoutUserInput = {
    where: ChatFolderScalarWhereInput
    data: XOR<ChatFolderUpdateManyMutationInput, ChatFolderUncheckedUpdateManyWithoutUserInput>
  }

  export type ChatFolderScalarWhereInput = {
    AND?: ChatFolderScalarWhereInput | ChatFolderScalarWhereInput[]
    OR?: ChatFolderScalarWhereInput[]
    NOT?: ChatFolderScalarWhereInput | ChatFolderScalarWhereInput[]
    id?: StringFilter<"ChatFolder"> | string
    name?: StringFilter<"ChatFolder"> | string
    order?: IntFilter<"ChatFolder"> | number
    isActive?: BoolFilter<"ChatFolder"> | boolean
    createdAt?: DateTimeFilter<"ChatFolder"> | Date | string
    updatedAt?: DateTimeFilter<"ChatFolder"> | Date | string
    parentId?: StringNullableFilter<"ChatFolder"> | string | null
    userId?: StringFilter<"ChatFolder"> | string
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
    type?: EnumSessionTypeFilter<"ChatSession"> | $Enums.SessionType
    order?: IntFilter<"ChatSession"> | number
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
    config?: JsonNullableFilter<"ChatSession">
    meta?: JsonNullableFilter<"ChatSession">
    folderId?: StringNullableFilter<"ChatSession"> | string | null
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
    role?: EnumMessageRoleFilter<"Message"> | $Enums.MessageRole
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
    meta?: JsonNullableFilter<"Message">
    extra?: JsonNullableFilter<"Message">
    isDeleted?: BoolFilter<"Message"> | boolean
    isEdited?: BoolFilter<"Message"> | boolean
    plugin?: JsonNullableFilter<"Message">
    pluginState?: JsonNullableFilter<"Message">
    translate?: JsonNullableFilter<"Message">
    tts?: JsonNullableFilter<"Message">
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
    safetyLevel?: EnumSafetyLevelFilter<"CommandLog"> | $Enums.SafetyLevel
    metadata?: JsonNullableFilter<"CommandLog">
    userId?: StringFilter<"CommandLog"> | string
    sshConnectionId?: StringNullableFilter<"CommandLog"> | string | null
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

  export type SSHFolderCreateManyParentInputEnvelope = {
    data: SSHFolderCreateManyParentInput | SSHFolderCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutSshFoldersInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    chatFolders?: ChatFolderCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSshFoldersInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    chatFolders?: ChatFolderUncheckedCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutUserInput
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
    authType: $Enums.SSHAuthType
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: $Enums.ConnectionStatus
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutSshConnectionsInput
    chatSessions?: ChatSessionCreateNestedManyWithoutSshConnectionInput
    commandLogs?: CommandLogCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionUncheckedCreateWithoutFolderInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
    order?: number
    authType: $Enums.SSHAuthType
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: $Enums.ConnectionStatus
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    userId: string
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutSshConnectionInput
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionCreateOrConnectWithoutFolderInput = {
    where: SSHConnectionWhereUniqueInput
    create: XOR<SSHConnectionCreateWithoutFolderInput, SSHConnectionUncheckedCreateWithoutFolderInput>
  }

  export type SSHConnectionCreateManyFolderInputEnvelope = {
    data: SSHConnectionCreateManyFolderInput | SSHConnectionCreateManyFolderInput[]
    skipDuplicates?: boolean
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
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    chatFolders?: ChatFolderUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSshFoldersInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    chatFolders?: ChatFolderUncheckedUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUncheckedUpdateManyWithoutUserNestedInput
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
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderCreateNestedManyWithoutUserInput
    chatFolders?: ChatFolderCreateNestedManyWithoutUserInput
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
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderUncheckedCreateNestedManyWithoutUserInput
    chatFolders?: ChatFolderUncheckedCreateNestedManyWithoutUserInput
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
    type?: $Enums.SessionType
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folder?: ChatFolderCreateNestedOneWithoutSessionsInput
    user: UserCreateNestedOneWithoutChatSessionsInput
    messages?: MessageCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUncheckedCreateWithoutSshConnectionInput = {
    id?: string
    title: string
    type?: $Enums.SessionType
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: string | null
    userId: string
    messages?: MessageUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionCreateOrConnectWithoutSshConnectionInput = {
    where: ChatSessionWhereUniqueInput
    create: XOR<ChatSessionCreateWithoutSshConnectionInput, ChatSessionUncheckedCreateWithoutSshConnectionInput>
  }

  export type ChatSessionCreateManySshConnectionInputEnvelope = {
    data: ChatSessionCreateManySshConnectionInput | ChatSessionCreateManySshConnectionInput[]
    skipDuplicates?: boolean
  }

  export type CommandLogCreateWithoutSshConnectionInput = {
    id?: string
    command: string
    output?: string | null
    exitCode?: number | null
    duration?: number | null
    createdAt?: Date | string
    safetyLevel?: $Enums.SafetyLevel
    metadata?: NullableJsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutCommandLogsInput
  }

  export type CommandLogUncheckedCreateWithoutSshConnectionInput = {
    id?: string
    command: string
    output?: string | null
    exitCode?: number | null
    duration?: number | null
    createdAt?: Date | string
    safetyLevel?: $Enums.SafetyLevel
    metadata?: NullableJsonNullValueInput | InputJsonValue
    userId: string
  }

  export type CommandLogCreateOrConnectWithoutSshConnectionInput = {
    where: CommandLogWhereUniqueInput
    create: XOR<CommandLogCreateWithoutSshConnectionInput, CommandLogUncheckedCreateWithoutSshConnectionInput>
  }

  export type CommandLogCreateManySshConnectionInputEnvelope = {
    data: CommandLogCreateManySshConnectionInput | CommandLogCreateManySshConnectionInput[]
    skipDuplicates?: boolean
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
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderUpdateManyWithoutUserNestedInput
    chatFolders?: ChatFolderUpdateManyWithoutUserNestedInput
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
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderUncheckedUpdateManyWithoutUserNestedInput
    chatFolders?: ChatFolderUncheckedUpdateManyWithoutUserNestedInput
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

  export type ChatFolderCreateWithoutChildrenInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: ChatFolderCreateNestedOneWithoutChildrenInput
    user: UserCreateNestedOneWithoutChatFoldersInput
    sessions?: ChatSessionCreateNestedManyWithoutFolderInput
  }

  export type ChatFolderUncheckedCreateWithoutChildrenInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parentId?: string | null
    userId: string
    sessions?: ChatSessionUncheckedCreateNestedManyWithoutFolderInput
  }

  export type ChatFolderCreateOrConnectWithoutChildrenInput = {
    where: ChatFolderWhereUniqueInput
    create: XOR<ChatFolderCreateWithoutChildrenInput, ChatFolderUncheckedCreateWithoutChildrenInput>
  }

  export type ChatFolderCreateWithoutParentInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: ChatFolderCreateNestedManyWithoutParentInput
    user: UserCreateNestedOneWithoutChatFoldersInput
    sessions?: ChatSessionCreateNestedManyWithoutFolderInput
  }

  export type ChatFolderUncheckedCreateWithoutParentInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    children?: ChatFolderUncheckedCreateNestedManyWithoutParentInput
    sessions?: ChatSessionUncheckedCreateNestedManyWithoutFolderInput
  }

  export type ChatFolderCreateOrConnectWithoutParentInput = {
    where: ChatFolderWhereUniqueInput
    create: XOR<ChatFolderCreateWithoutParentInput, ChatFolderUncheckedCreateWithoutParentInput>
  }

  export type ChatFolderCreateManyParentInputEnvelope = {
    data: ChatFolderCreateManyParentInput | ChatFolderCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutChatFoldersInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderCreateNestedManyWithoutUserInput
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutChatFoldersInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderUncheckedCreateNestedManyWithoutUserInput
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutChatFoldersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutChatFoldersInput, UserUncheckedCreateWithoutChatFoldersInput>
  }

  export type ChatSessionCreateWithoutFolderInput = {
    id?: string
    title: string
    type?: $Enums.SessionType
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutChatSessionsInput
    sshConnection?: SSHConnectionCreateNestedOneWithoutChatSessionsInput
    messages?: MessageCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUncheckedCreateWithoutFolderInput = {
    id?: string
    title: string
    type?: $Enums.SessionType
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    userId: string
    sshConnectionId?: string | null
    messages?: MessageUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionCreateOrConnectWithoutFolderInput = {
    where: ChatSessionWhereUniqueInput
    create: XOR<ChatSessionCreateWithoutFolderInput, ChatSessionUncheckedCreateWithoutFolderInput>
  }

  export type ChatSessionCreateManyFolderInputEnvelope = {
    data: ChatSessionCreateManyFolderInput | ChatSessionCreateManyFolderInput[]
    skipDuplicates?: boolean
  }

  export type ChatFolderUpsertWithoutChildrenInput = {
    update: XOR<ChatFolderUpdateWithoutChildrenInput, ChatFolderUncheckedUpdateWithoutChildrenInput>
    create: XOR<ChatFolderCreateWithoutChildrenInput, ChatFolderUncheckedCreateWithoutChildrenInput>
    where?: ChatFolderWhereInput
  }

  export type ChatFolderUpdateToOneWithWhereWithoutChildrenInput = {
    where?: ChatFolderWhereInput
    data: XOR<ChatFolderUpdateWithoutChildrenInput, ChatFolderUncheckedUpdateWithoutChildrenInput>
  }

  export type ChatFolderUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: ChatFolderUpdateOneWithoutChildrenNestedInput
    user?: UserUpdateOneRequiredWithoutChatFoldersNestedInput
    sessions?: ChatSessionUpdateManyWithoutFolderNestedInput
  }

  export type ChatFolderUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    sessions?: ChatSessionUncheckedUpdateManyWithoutFolderNestedInput
  }

  export type ChatFolderUpsertWithWhereUniqueWithoutParentInput = {
    where: ChatFolderWhereUniqueInput
    update: XOR<ChatFolderUpdateWithoutParentInput, ChatFolderUncheckedUpdateWithoutParentInput>
    create: XOR<ChatFolderCreateWithoutParentInput, ChatFolderUncheckedCreateWithoutParentInput>
  }

  export type ChatFolderUpdateWithWhereUniqueWithoutParentInput = {
    where: ChatFolderWhereUniqueInput
    data: XOR<ChatFolderUpdateWithoutParentInput, ChatFolderUncheckedUpdateWithoutParentInput>
  }

  export type ChatFolderUpdateManyWithWhereWithoutParentInput = {
    where: ChatFolderScalarWhereInput
    data: XOR<ChatFolderUpdateManyMutationInput, ChatFolderUncheckedUpdateManyWithoutParentInput>
  }

  export type UserUpsertWithoutChatFoldersInput = {
    update: XOR<UserUpdateWithoutChatFoldersInput, UserUncheckedUpdateWithoutChatFoldersInput>
    create: XOR<UserCreateWithoutChatFoldersInput, UserUncheckedCreateWithoutChatFoldersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutChatFoldersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutChatFoldersInput, UserUncheckedUpdateWithoutChatFoldersInput>
  }

  export type UserUpdateWithoutChatFoldersInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderUpdateManyWithoutUserNestedInput
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutChatFoldersInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderUncheckedUpdateManyWithoutUserNestedInput
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChatSessionUpsertWithWhereUniqueWithoutFolderInput = {
    where: ChatSessionWhereUniqueInput
    update: XOR<ChatSessionUpdateWithoutFolderInput, ChatSessionUncheckedUpdateWithoutFolderInput>
    create: XOR<ChatSessionCreateWithoutFolderInput, ChatSessionUncheckedCreateWithoutFolderInput>
  }

  export type ChatSessionUpdateWithWhereUniqueWithoutFolderInput = {
    where: ChatSessionWhereUniqueInput
    data: XOR<ChatSessionUpdateWithoutFolderInput, ChatSessionUncheckedUpdateWithoutFolderInput>
  }

  export type ChatSessionUpdateManyWithWhereWithoutFolderInput = {
    where: ChatSessionScalarWhereInput
    data: XOR<ChatSessionUpdateManyMutationInput, ChatSessionUncheckedUpdateManyWithoutFolderInput>
  }

  export type ChatFolderCreateWithoutSessionsInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: ChatFolderCreateNestedOneWithoutChildrenInput
    children?: ChatFolderCreateNestedManyWithoutParentInput
    user: UserCreateNestedOneWithoutChatFoldersInput
  }

  export type ChatFolderUncheckedCreateWithoutSessionsInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parentId?: string | null
    userId: string
    children?: ChatFolderUncheckedCreateNestedManyWithoutParentInput
  }

  export type ChatFolderCreateOrConnectWithoutSessionsInput = {
    where: ChatFolderWhereUniqueInput
    create: XOR<ChatFolderCreateWithoutSessionsInput, ChatFolderUncheckedCreateWithoutSessionsInput>
  }

  export type UserCreateWithoutChatSessionsInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderCreateNestedManyWithoutUserInput
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    chatFolders?: ChatFolderCreateNestedManyWithoutUserInput
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
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderUncheckedCreateNestedManyWithoutUserInput
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    chatFolders?: ChatFolderUncheckedCreateNestedManyWithoutUserInput
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
    order?: number
    authType: $Enums.SSHAuthType
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: $Enums.ConnectionStatus
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folder?: SSHFolderCreateNestedOneWithoutConnectionsInput
    user: UserCreateNestedOneWithoutSshConnectionsInput
    commandLogs?: CommandLogCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionUncheckedCreateWithoutChatSessionsInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
    order?: number
    authType: $Enums.SSHAuthType
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: $Enums.ConnectionStatus
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: string | null
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
    role: $Enums.MessageRole
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    extra?: NullableJsonNullValueInput | InputJsonValue
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: NullableJsonNullValueInput | InputJsonValue
    pluginState?: NullableJsonNullValueInput | InputJsonValue
    translate?: NullableJsonNullValueInput | InputJsonValue
    tts?: NullableJsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateWithoutSessionInput = {
    id?: string
    content: string
    role: $Enums.MessageRole
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    extra?: NullableJsonNullValueInput | InputJsonValue
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: NullableJsonNullValueInput | InputJsonValue
    pluginState?: NullableJsonNullValueInput | InputJsonValue
    translate?: NullableJsonNullValueInput | InputJsonValue
    tts?: NullableJsonNullValueInput | InputJsonValue
    userId: string
  }

  export type MessageCreateOrConnectWithoutSessionInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutSessionInput, MessageUncheckedCreateWithoutSessionInput>
  }

  export type MessageCreateManySessionInputEnvelope = {
    data: MessageCreateManySessionInput | MessageCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type ChatFolderUpsertWithoutSessionsInput = {
    update: XOR<ChatFolderUpdateWithoutSessionsInput, ChatFolderUncheckedUpdateWithoutSessionsInput>
    create: XOR<ChatFolderCreateWithoutSessionsInput, ChatFolderUncheckedCreateWithoutSessionsInput>
    where?: ChatFolderWhereInput
  }

  export type ChatFolderUpdateToOneWithWhereWithoutSessionsInput = {
    where?: ChatFolderWhereInput
    data: XOR<ChatFolderUpdateWithoutSessionsInput, ChatFolderUncheckedUpdateWithoutSessionsInput>
  }

  export type ChatFolderUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: ChatFolderUpdateOneWithoutChildrenNestedInput
    children?: ChatFolderUpdateManyWithoutParentNestedInput
    user?: UserUpdateOneRequiredWithoutChatFoldersNestedInput
  }

  export type ChatFolderUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    children?: ChatFolderUncheckedUpdateManyWithoutParentNestedInput
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
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderUpdateManyWithoutUserNestedInput
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    chatFolders?: ChatFolderUpdateManyWithoutUserNestedInput
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
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderUncheckedUpdateManyWithoutUserNestedInput
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    chatFolders?: ChatFolderUncheckedUpdateManyWithoutUserNestedInput
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
    order?: IntFieldUpdateOperationsInput | number
    authType?: EnumSSHAuthTypeFieldUpdateOperationsInput | $Enums.SSHAuthType
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumConnectionStatusFieldUpdateOperationsInput | $Enums.ConnectionStatus
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folder?: SSHFolderUpdateOneWithoutConnectionsNestedInput
    user?: UserUpdateOneRequiredWithoutSshConnectionsNestedInput
    commandLogs?: CommandLogUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionUncheckedUpdateWithoutChatSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: EnumSSHAuthTypeFieldUpdateOperationsInput | $Enums.SSHAuthType
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumConnectionStatusFieldUpdateOperationsInput | $Enums.ConnectionStatus
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
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
    type?: $Enums.SessionType
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folder?: ChatFolderCreateNestedOneWithoutSessionsInput
    user: UserCreateNestedOneWithoutChatSessionsInput
    sshConnection?: SSHConnectionCreateNestedOneWithoutChatSessionsInput
  }

  export type ChatSessionUncheckedCreateWithoutMessagesInput = {
    id?: string
    title: string
    type?: $Enums.SessionType
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: string | null
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
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderCreateNestedManyWithoutUserInput
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    chatFolders?: ChatFolderCreateNestedManyWithoutUserInput
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
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderUncheckedCreateNestedManyWithoutUserInput
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    chatFolders?: ChatFolderUncheckedCreateNestedManyWithoutUserInput
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
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folder?: ChatFolderUpdateOneWithoutSessionsNestedInput
    user?: UserUpdateOneRequiredWithoutChatSessionsNestedInput
    sshConnection?: SSHConnectionUpdateOneWithoutChatSessionsNestedInput
  }

  export type ChatSessionUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
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
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderUpdateManyWithoutUserNestedInput
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    chatFolders?: ChatFolderUpdateManyWithoutUserNestedInput
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
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderUncheckedUpdateManyWithoutUserNestedInput
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    chatFolders?: ChatFolderUncheckedUpdateManyWithoutUserNestedInput
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
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderCreateNestedManyWithoutUserInput
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    chatFolders?: ChatFolderCreateNestedManyWithoutUserInput
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
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderUncheckedCreateNestedManyWithoutUserInput
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    chatFolders?: ChatFolderUncheckedCreateNestedManyWithoutUserInput
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
    order?: number
    authType: $Enums.SSHAuthType
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: $Enums.ConnectionStatus
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folder?: SSHFolderCreateNestedOneWithoutConnectionsInput
    user: UserCreateNestedOneWithoutSshConnectionsInput
    chatSessions?: ChatSessionCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionUncheckedCreateWithoutCommandLogsInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
    order?: number
    authType: $Enums.SSHAuthType
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: $Enums.ConnectionStatus
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: string | null
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
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderUpdateManyWithoutUserNestedInput
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    chatFolders?: ChatFolderUpdateManyWithoutUserNestedInput
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
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    sshFolders?: SSHFolderUncheckedUpdateManyWithoutUserNestedInput
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    chatFolders?: ChatFolderUncheckedUpdateManyWithoutUserNestedInput
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
    order?: IntFieldUpdateOperationsInput | number
    authType?: EnumSSHAuthTypeFieldUpdateOperationsInput | $Enums.SSHAuthType
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumConnectionStatusFieldUpdateOperationsInput | $Enums.ConnectionStatus
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folder?: SSHFolderUpdateOneWithoutConnectionsNestedInput
    user?: UserUpdateOneRequiredWithoutSshConnectionsNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionUncheckedUpdateWithoutCommandLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: EnumSSHAuthTypeFieldUpdateOperationsInput | $Enums.SSHAuthType
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumConnectionStatusFieldUpdateOperationsInput | $Enums.ConnectionStatus
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHFolderCreateManyUserInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parentId?: string | null
  }

  export type SSHConnectionCreateManyUserInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
    order?: number
    authType: $Enums.SSHAuthType
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: $Enums.ConnectionStatus
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: string | null
  }

  export type ChatFolderCreateManyUserInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parentId?: string | null
  }

  export type ChatSessionCreateManyUserInput = {
    id?: string
    title: string
    type?: $Enums.SessionType
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: string | null
    sshConnectionId?: string | null
  }

  export type MessageCreateManyUserInput = {
    id?: string
    content: string
    role: $Enums.MessageRole
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    extra?: NullableJsonNullValueInput | InputJsonValue
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: NullableJsonNullValueInput | InputJsonValue
    pluginState?: NullableJsonNullValueInput | InputJsonValue
    translate?: NullableJsonNullValueInput | InputJsonValue
    tts?: NullableJsonNullValueInput | InputJsonValue
    sessionId: string
  }

  export type CommandLogCreateManyUserInput = {
    id?: string
    command: string
    output?: string | null
    exitCode?: number | null
    duration?: number | null
    createdAt?: Date | string
    safetyLevel?: $Enums.SafetyLevel
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sshConnectionId?: string | null
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
    authType?: EnumSSHAuthTypeFieldUpdateOperationsInput | $Enums.SSHAuthType
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumConnectionStatusFieldUpdateOperationsInput | $Enums.ConnectionStatus
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folder?: SSHFolderUpdateOneWithoutConnectionsNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutSshConnectionNestedInput
    commandLogs?: CommandLogUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: EnumSSHAuthTypeFieldUpdateOperationsInput | $Enums.SSHAuthType
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumConnectionStatusFieldUpdateOperationsInput | $Enums.ConnectionStatus
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutSshConnectionNestedInput
    commandLogs?: CommandLogUncheckedUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: EnumSSHAuthTypeFieldUpdateOperationsInput | $Enums.SSHAuthType
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumConnectionStatusFieldUpdateOperationsInput | $Enums.ConnectionStatus
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ChatFolderUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: ChatFolderUpdateOneWithoutChildrenNestedInput
    children?: ChatFolderUpdateManyWithoutParentNestedInput
    sessions?: ChatSessionUpdateManyWithoutFolderNestedInput
  }

  export type ChatFolderUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    children?: ChatFolderUncheckedUpdateManyWithoutParentNestedInput
    sessions?: ChatSessionUncheckedUpdateManyWithoutFolderNestedInput
  }

  export type ChatFolderUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ChatSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folder?: ChatFolderUpdateOneWithoutSessionsNestedInput
    sshConnection?: SSHConnectionUpdateOneWithoutChatSessionsNestedInput
    messages?: MessageUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
    sshConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
    messages?: MessageUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
    sshConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MessageUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    extra?: NullableJsonNullValueInput | InputJsonValue
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableJsonNullValueInput | InputJsonValue
    pluginState?: NullableJsonNullValueInput | InputJsonValue
    translate?: NullableJsonNullValueInput | InputJsonValue
    tts?: NullableJsonNullValueInput | InputJsonValue
    session?: ChatSessionUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    extra?: NullableJsonNullValueInput | InputJsonValue
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableJsonNullValueInput | InputJsonValue
    pluginState?: NullableJsonNullValueInput | InputJsonValue
    translate?: NullableJsonNullValueInput | InputJsonValue
    tts?: NullableJsonNullValueInput | InputJsonValue
    sessionId?: StringFieldUpdateOperationsInput | string
  }

  export type MessageUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    extra?: NullableJsonNullValueInput | InputJsonValue
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableJsonNullValueInput | InputJsonValue
    pluginState?: NullableJsonNullValueInput | InputJsonValue
    translate?: NullableJsonNullValueInput | InputJsonValue
    tts?: NullableJsonNullValueInput | InputJsonValue
    sessionId?: StringFieldUpdateOperationsInput | string
  }

  export type CommandLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    exitCode?: NullableIntFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    safetyLevel?: EnumSafetyLevelFieldUpdateOperationsInput | $Enums.SafetyLevel
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sshConnection?: SSHConnectionUpdateOneWithoutCommandLogsNestedInput
  }

  export type CommandLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    exitCode?: NullableIntFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    safetyLevel?: EnumSafetyLevelFieldUpdateOperationsInput | $Enums.SafetyLevel
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sshConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommandLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    exitCode?: NullableIntFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    safetyLevel?: EnumSafetyLevelFieldUpdateOperationsInput | $Enums.SafetyLevel
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sshConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SSHFolderCreateManyParentInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type SSHConnectionCreateManyFolderInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
    order?: number
    authType: $Enums.SSHAuthType
    password?: string | null
    privateKey?: string | null
    publicKey?: string | null
    passphrase?: string | null
    status?: $Enums.ConnectionStatus
    lastUsed?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    userId: string
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
    authType?: EnumSSHAuthTypeFieldUpdateOperationsInput | $Enums.SSHAuthType
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumConnectionStatusFieldUpdateOperationsInput | $Enums.ConnectionStatus
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutSshConnectionsNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutSshConnectionNestedInput
    commandLogs?: CommandLogUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionUncheckedUpdateWithoutFolderInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: EnumSSHAuthTypeFieldUpdateOperationsInput | $Enums.SSHAuthType
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumConnectionStatusFieldUpdateOperationsInput | $Enums.ConnectionStatus
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    userId?: StringFieldUpdateOperationsInput | string
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutSshConnectionNestedInput
    commandLogs?: CommandLogUncheckedUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionUncheckedUpdateManyWithoutFolderInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    authType?: EnumSSHAuthTypeFieldUpdateOperationsInput | $Enums.SSHAuthType
    password?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumConnectionStatusFieldUpdateOperationsInput | $Enums.ConnectionStatus
    lastUsed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type ChatSessionCreateManySshConnectionInput = {
    id?: string
    title: string
    type?: $Enums.SessionType
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: string | null
    userId: string
  }

  export type CommandLogCreateManySshConnectionInput = {
    id?: string
    command: string
    output?: string | null
    exitCode?: number | null
    duration?: number | null
    createdAt?: Date | string
    safetyLevel?: $Enums.SafetyLevel
    metadata?: NullableJsonNullValueInput | InputJsonValue
    userId: string
  }

  export type ChatSessionUpdateWithoutSshConnectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folder?: ChatFolderUpdateOneWithoutSessionsNestedInput
    user?: UserUpdateOneRequiredWithoutChatSessionsNestedInput
    messages?: MessageUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateWithoutSshConnectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    messages?: MessageUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateManyWithoutSshConnectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type CommandLogUpdateWithoutSshConnectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    exitCode?: NullableIntFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    safetyLevel?: EnumSafetyLevelFieldUpdateOperationsInput | $Enums.SafetyLevel
    metadata?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutCommandLogsNestedInput
  }

  export type CommandLogUncheckedUpdateWithoutSshConnectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    exitCode?: NullableIntFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    safetyLevel?: EnumSafetyLevelFieldUpdateOperationsInput | $Enums.SafetyLevel
    metadata?: NullableJsonNullValueInput | InputJsonValue
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type CommandLogUncheckedUpdateManyWithoutSshConnectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    exitCode?: NullableIntFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    safetyLevel?: EnumSafetyLevelFieldUpdateOperationsInput | $Enums.SafetyLevel
    metadata?: NullableJsonNullValueInput | InputJsonValue
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type ChatFolderCreateManyParentInput = {
    id?: string
    name: string
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type ChatSessionCreateManyFolderInput = {
    id?: string
    title: string
    type?: $Enums.SessionType
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    userId: string
    sshConnectionId?: string | null
  }

  export type ChatFolderUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ChatFolderUpdateManyWithoutParentNestedInput
    user?: UserUpdateOneRequiredWithoutChatFoldersNestedInput
    sessions?: ChatSessionUpdateManyWithoutFolderNestedInput
  }

  export type ChatFolderUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    children?: ChatFolderUncheckedUpdateManyWithoutParentNestedInput
    sessions?: ChatSessionUncheckedUpdateManyWithoutFolderNestedInput
  }

  export type ChatFolderUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type ChatSessionUpdateWithoutFolderInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutChatSessionsNestedInput
    sshConnection?: SSHConnectionUpdateOneWithoutChatSessionsNestedInput
    messages?: MessageUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateWithoutFolderInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    userId?: StringFieldUpdateOperationsInput | string
    sshConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
    messages?: MessageUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateManyWithoutFolderInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: EnumSessionTypeFieldUpdateOperationsInput | $Enums.SessionType
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableJsonNullValueInput | InputJsonValue
    meta?: NullableJsonNullValueInput | InputJsonValue
    userId?: StringFieldUpdateOperationsInput | string
    sshConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MessageCreateManySessionInput = {
    id?: string
    content: string
    role: $Enums.MessageRole
    createdAt?: Date | string
    updatedAt?: Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    extra?: NullableJsonNullValueInput | InputJsonValue
    isDeleted?: boolean
    isEdited?: boolean
    plugin?: NullableJsonNullValueInput | InputJsonValue
    pluginState?: NullableJsonNullValueInput | InputJsonValue
    translate?: NullableJsonNullValueInput | InputJsonValue
    tts?: NullableJsonNullValueInput | InputJsonValue
    userId: string
  }

  export type MessageUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    extra?: NullableJsonNullValueInput | InputJsonValue
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableJsonNullValueInput | InputJsonValue
    pluginState?: NullableJsonNullValueInput | InputJsonValue
    translate?: NullableJsonNullValueInput | InputJsonValue
    tts?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    extra?: NullableJsonNullValueInput | InputJsonValue
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableJsonNullValueInput | InputJsonValue
    pluginState?: NullableJsonNullValueInput | InputJsonValue
    translate?: NullableJsonNullValueInput | InputJsonValue
    tts?: NullableJsonNullValueInput | InputJsonValue
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type MessageUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    extra?: NullableJsonNullValueInput | InputJsonValue
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    plugin?: NullableJsonNullValueInput | InputJsonValue
    pluginState?: NullableJsonNullValueInput | InputJsonValue
    translate?: NullableJsonNullValueInput | InputJsonValue
    tts?: NullableJsonNullValueInput | InputJsonValue
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
     * @deprecated Use ChatFolderCountOutputTypeDefaultArgs instead
     */
    export type ChatFolderCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChatFolderCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChatSessionCountOutputTypeDefaultArgs instead
     */
    export type ChatSessionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChatSessionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SSHFolderDefaultArgs instead
     */
    export type SSHFolderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SSHFolderDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SSHConnectionDefaultArgs instead
     */
    export type SSHConnectionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SSHConnectionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChatFolderDefaultArgs instead
     */
    export type ChatFolderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChatFolderDefaultArgs<ExtArgs>
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