
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
 * Model UserSubscription
 * 
 */
export type UserSubscription = $Result.DefaultSelection<Prisma.$UserSubscriptionPayload>
/**
 * Model PaymentOrder
 * 
 */
export type PaymentOrder = $Result.DefaultSelection<Prisma.$PaymentOrderPayload>
/**
 * Model ManagedAiUsage
 * 
 */
export type ManagedAiUsage = $Result.DefaultSelection<Prisma.$ManagedAiUsagePayload>

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


export const SafetyLevel: {
  SAFE: 'SAFE',
  CAUTION: 'CAUTION',
  DANGEROUS: 'DANGEROUS'
};

export type SafetyLevel = (typeof SafetyLevel)[keyof typeof SafetyLevel]


export const SubscriptionPlanType: {
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
  LIFETIME: 'LIFETIME'
};

export type SubscriptionPlanType = (typeof SubscriptionPlanType)[keyof typeof SubscriptionPlanType]


export const SubscriptionPlanCode: {
  BASE_MONTHLY: 'BASE_MONTHLY',
  BASE_YEARLY: 'BASE_YEARLY',
  BASE_LIFETIME: 'BASE_LIFETIME',
  AI_MONTHLY: 'AI_MONTHLY',
  FULL_MONTHLY: 'FULL_MONTHLY',
  FULL_YEARLY: 'FULL_YEARLY',
  FULL_LIFETIME: 'FULL_LIFETIME'
};

export type SubscriptionPlanCode = (typeof SubscriptionPlanCode)[keyof typeof SubscriptionPlanCode]


export const PaymentOrderStatus: {
  PENDING: 'PENDING',
  PAID: 'PAID',
  ACTIVATED: 'ACTIVATED',
  EXPIRED: 'EXPIRED',
  CLOSED: 'CLOSED',
  FAILED: 'FAILED'
};

export type PaymentOrderStatus = (typeof PaymentOrderStatus)[keyof typeof PaymentOrderStatus]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type SSHAuthType = $Enums.SSHAuthType

export const SSHAuthType: typeof $Enums.SSHAuthType

export type ConnectionStatus = $Enums.ConnectionStatus

export const ConnectionStatus: typeof $Enums.ConnectionStatus

export type SafetyLevel = $Enums.SafetyLevel

export const SafetyLevel: typeof $Enums.SafetyLevel

export type SubscriptionPlanType = $Enums.SubscriptionPlanType

export const SubscriptionPlanType: typeof $Enums.SubscriptionPlanType

export type SubscriptionPlanCode = $Enums.SubscriptionPlanCode

export const SubscriptionPlanCode: typeof $Enums.SubscriptionPlanCode

export type PaymentOrderStatus = $Enums.PaymentOrderStatus

export const PaymentOrderStatus: typeof $Enums.PaymentOrderStatus

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

  /**
   * `prisma.userSubscription`: Exposes CRUD operations for the **UserSubscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserSubscriptions
    * const userSubscriptions = await prisma.userSubscription.findMany()
    * ```
    */
  get userSubscription(): Prisma.UserSubscriptionDelegate<ExtArgs>;

  /**
   * `prisma.paymentOrder`: Exposes CRUD operations for the **PaymentOrder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PaymentOrders
    * const paymentOrders = await prisma.paymentOrder.findMany()
    * ```
    */
  get paymentOrder(): Prisma.PaymentOrderDelegate<ExtArgs>;

  /**
   * `prisma.managedAiUsage`: Exposes CRUD operations for the **ManagedAiUsage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ManagedAiUsages
    * const managedAiUsages = await prisma.managedAiUsage.findMany()
    * ```
    */
  get managedAiUsage(): Prisma.ManagedAiUsageDelegate<ExtArgs>;
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
    SSHConnection: 'SSHConnection',
    CommandLog: 'CommandLog',
    UserSubscription: 'UserSubscription',
    PaymentOrder: 'PaymentOrder',
    ManagedAiUsage: 'ManagedAiUsage'
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
      modelProps: 'user' | 'userSettings' | 'sSHConnection' | 'commandLog' | 'userSubscription' | 'paymentOrder' | 'managedAiUsage'
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
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
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
          createMany: {
            args: Prisma.UserSettingsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
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
          createMany: {
            args: Prisma.SSHConnectionCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
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
          createMany: {
            args: Prisma.CommandLogCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
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
      UserSubscription: {
        payload: Prisma.$UserSubscriptionPayload<ExtArgs>
        fields: Prisma.UserSubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserSubscriptionFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserSubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserSubscriptionFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserSubscriptionPayload>
          }
          findFirst: {
            args: Prisma.UserSubscriptionFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserSubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserSubscriptionFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserSubscriptionPayload>
          }
          findMany: {
            args: Prisma.UserSubscriptionFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserSubscriptionPayload>[]
          }
          create: {
            args: Prisma.UserSubscriptionCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserSubscriptionPayload>
          }
          createMany: {
            args: Prisma.UserSubscriptionCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.UserSubscriptionDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserSubscriptionPayload>
          }
          update: {
            args: Prisma.UserSubscriptionUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserSubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.UserSubscriptionDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.UserSubscriptionUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.UserSubscriptionUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserSubscriptionPayload>
          }
          aggregate: {
            args: Prisma.UserSubscriptionAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUserSubscription>
          }
          groupBy: {
            args: Prisma.UserSubscriptionGroupByArgs<ExtArgs>,
            result: $Utils.Optional<UserSubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserSubscriptionCountArgs<ExtArgs>,
            result: $Utils.Optional<UserSubscriptionCountAggregateOutputType> | number
          }
        }
      }
      PaymentOrder: {
        payload: Prisma.$PaymentOrderPayload<ExtArgs>
        fields: Prisma.PaymentOrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentOrderFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PaymentOrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentOrderFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PaymentOrderPayload>
          }
          findFirst: {
            args: Prisma.PaymentOrderFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PaymentOrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentOrderFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PaymentOrderPayload>
          }
          findMany: {
            args: Prisma.PaymentOrderFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PaymentOrderPayload>[]
          }
          create: {
            args: Prisma.PaymentOrderCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PaymentOrderPayload>
          }
          createMany: {
            args: Prisma.PaymentOrderCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.PaymentOrderDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PaymentOrderPayload>
          }
          update: {
            args: Prisma.PaymentOrderUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PaymentOrderPayload>
          }
          deleteMany: {
            args: Prisma.PaymentOrderDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentOrderUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.PaymentOrderUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PaymentOrderPayload>
          }
          aggregate: {
            args: Prisma.PaymentOrderAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregatePaymentOrder>
          }
          groupBy: {
            args: Prisma.PaymentOrderGroupByArgs<ExtArgs>,
            result: $Utils.Optional<PaymentOrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentOrderCountArgs<ExtArgs>,
            result: $Utils.Optional<PaymentOrderCountAggregateOutputType> | number
          }
        }
      }
      ManagedAiUsage: {
        payload: Prisma.$ManagedAiUsagePayload<ExtArgs>
        fields: Prisma.ManagedAiUsageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ManagedAiUsageFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ManagedAiUsagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ManagedAiUsageFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ManagedAiUsagePayload>
          }
          findFirst: {
            args: Prisma.ManagedAiUsageFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ManagedAiUsagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ManagedAiUsageFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ManagedAiUsagePayload>
          }
          findMany: {
            args: Prisma.ManagedAiUsageFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ManagedAiUsagePayload>[]
          }
          create: {
            args: Prisma.ManagedAiUsageCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ManagedAiUsagePayload>
          }
          createMany: {
            args: Prisma.ManagedAiUsageCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.ManagedAiUsageDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ManagedAiUsagePayload>
          }
          update: {
            args: Prisma.ManagedAiUsageUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ManagedAiUsagePayload>
          }
          deleteMany: {
            args: Prisma.ManagedAiUsageDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.ManagedAiUsageUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.ManagedAiUsageUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ManagedAiUsagePayload>
          }
          aggregate: {
            args: Prisma.ManagedAiUsageAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateManagedAiUsage>
          }
          groupBy: {
            args: Prisma.ManagedAiUsageGroupByArgs<ExtArgs>,
            result: $Utils.Optional<ManagedAiUsageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ManagedAiUsageCountArgs<ExtArgs>,
            result: $Utils.Optional<ManagedAiUsageCountAggregateOutputType> | number
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
    sshConnections: number
    commandLogs: number
    paymentOrders: number
    managedAiUsages: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sshConnections?: boolean | UserCountOutputTypeCountSshConnectionsArgs
    commandLogs?: boolean | UserCountOutputTypeCountCommandLogsArgs
    paymentOrders?: boolean | UserCountOutputTypeCountPaymentOrdersArgs
    managedAiUsages?: boolean | UserCountOutputTypeCountManagedAiUsagesArgs
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
  export type UserCountOutputTypeCountCommandLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommandLogWhereInput
  }


  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPaymentOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentOrderWhereInput
  }


  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountManagedAiUsagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ManagedAiUsageWhereInput
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
    wechatOpenId: string | null
    wechatUnionId: string | null
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
    wechatOpenId: string | null
    wechatUnionId: string | null
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
    wechatOpenId: number
    wechatUnionId: number
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
    wechatOpenId?: true
    wechatUnionId?: true
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
    wechatOpenId?: true
    wechatUnionId?: true
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
    wechatOpenId?: true
    wechatUnionId?: true
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
    wechatOpenId: string | null
    wechatUnionId: string | null
    role: $Enums.UserRole
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
    wechatOpenId?: boolean
    wechatUnionId?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sshConnections?: boolean | User$sshConnectionsArgs<ExtArgs>
    commandLogs?: boolean | User$commandLogsArgs<ExtArgs>
    userSettings?: boolean | User$userSettingsArgs<ExtArgs>
    subscription?: boolean | User$subscriptionArgs<ExtArgs>
    paymentOrders?: boolean | User$paymentOrdersArgs<ExtArgs>
    managedAiUsages?: boolean | User$managedAiUsagesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    uuid?: boolean
    email?: boolean
    username?: boolean
    password?: boolean
    avatar?: boolean
    wechatOpenId?: boolean
    wechatUnionId?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sshConnections?: boolean | User$sshConnectionsArgs<ExtArgs>
    commandLogs?: boolean | User$commandLogsArgs<ExtArgs>
    userSettings?: boolean | User$userSettingsArgs<ExtArgs>
    subscription?: boolean | User$subscriptionArgs<ExtArgs>
    paymentOrders?: boolean | User$paymentOrdersArgs<ExtArgs>
    managedAiUsages?: boolean | User$managedAiUsagesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sshConnections: Prisma.$SSHConnectionPayload<ExtArgs>[]
      commandLogs: Prisma.$CommandLogPayload<ExtArgs>[]
      userSettings: Prisma.$UserSettingsPayload<ExtArgs> | null
      subscription: Prisma.$UserSubscriptionPayload<ExtArgs> | null
      paymentOrders: Prisma.$PaymentOrderPayload<ExtArgs>[]
      managedAiUsages: Prisma.$ManagedAiUsagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      uuid: string
      email: string | null
      username: string | null
      password: string | null
      avatar: string | null
      wechatOpenId: string | null
      wechatUnionId: string | null
      role: $Enums.UserRole
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
     * Create many Users.
     *     @param {UserCreateManyArgs} args - Arguments to create many Users.
     *     @example
     *     // Create many Users
     *     const user = await prisma.user.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UserCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

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

    sshConnections<T extends User$sshConnectionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sshConnectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SSHConnectionPayload<ExtArgs>, T, 'findMany'> | Null>;

    commandLogs<T extends User$commandLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$commandLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommandLogPayload<ExtArgs>, T, 'findMany'> | Null>;

    userSettings<T extends User$userSettingsArgs<ExtArgs> = {}>(args?: Subset<T, User$userSettingsArgs<ExtArgs>>): Prisma__UserSettingsClient<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, 'findUniqueOrThrow'> | null, null, ExtArgs>;

    subscription<T extends User$subscriptionArgs<ExtArgs> = {}>(args?: Subset<T, User$subscriptionArgs<ExtArgs>>): Prisma__UserSubscriptionClient<$Result.GetResult<Prisma.$UserSubscriptionPayload<ExtArgs>, T, 'findUniqueOrThrow'> | null, null, ExtArgs>;

    paymentOrders<T extends User$paymentOrdersArgs<ExtArgs> = {}>(args?: Subset<T, User$paymentOrdersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, 'findMany'> | Null>;

    managedAiUsages<T extends User$managedAiUsagesArgs<ExtArgs> = {}>(args?: Subset<T, User$managedAiUsagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ManagedAiUsagePayload<ExtArgs>, T, 'findMany'> | Null>;

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
    readonly wechatOpenId: FieldRef<"User", 'String'>
    readonly wechatUnionId: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
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
   * User.subscription
   */
  export type User$subscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSubscription
     */
    select?: UserSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSubscriptionInclude<ExtArgs> | null
    where?: UserSubscriptionWhereInput
  }


  /**
   * User.paymentOrders
   */
  export type User$paymentOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentOrderInclude<ExtArgs> | null
    where?: PaymentOrderWhereInput
    orderBy?: PaymentOrderOrderByWithRelationInput | PaymentOrderOrderByWithRelationInput[]
    cursor?: PaymentOrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentOrderScalarFieldEnum | PaymentOrderScalarFieldEnum[]
  }


  /**
   * User.managedAiUsages
   */
  export type User$managedAiUsagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagedAiUsage
     */
    select?: ManagedAiUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ManagedAiUsageInclude<ExtArgs> | null
    where?: ManagedAiUsageWhereInput
    orderBy?: ManagedAiUsageOrderByWithRelationInput | ManagedAiUsageOrderByWithRelationInput[]
    cursor?: ManagedAiUsageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ManagedAiUsageScalarFieldEnum | ManagedAiUsageScalarFieldEnum[]
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
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserSettingsMaxAggregateOutputType = {
    id: string | null
    userId: string | null
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
    createdAt?: true
    updatedAt?: true
  }

  export type UserSettingsMaxAggregateInputType = {
    id?: true
    userId?: true
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
    data: JsonValue
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
      data: Prisma.JsonValue
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
     * Create many UserSettings.
     *     @param {UserSettingsCreateManyArgs} args - Arguments to create many UserSettings.
     *     @example
     *     // Create many UserSettings
     *     const userSettings = await prisma.userSettings.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UserSettingsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserSettingsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

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
    readonly data: FieldRef<"UserSettings", 'Json'>
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
   * UserSettings createMany
   */
  export type UserSettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserSettings.
     */
    data: UserSettingsCreateManyInput | UserSettingsCreateManyInput[]
    skipDuplicates?: boolean
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
    userId: string | null
  }

  export type SSHConnectionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    host: string | null
    port: number | null
    username: string | null
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
    commandLogs?: boolean | SSHConnection$commandLogsArgs<ExtArgs>
    _count?: boolean | SSHConnectionCountOutputTypeDefaultArgs<ExtArgs>
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
    commandLogs?: boolean | SSHConnection$commandLogsArgs<ExtArgs>
    _count?: boolean | SSHConnectionCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $SSHConnectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SSHConnection"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      commandLogs: Prisma.$CommandLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      host: string
      port: number
      username: string
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
     * Create many SSHConnections.
     *     @param {SSHConnectionCreateManyArgs} args - Arguments to create many SSHConnections.
     *     @example
     *     // Create many SSHConnections
     *     const sSHConnection = await prisma.sSHConnection.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends SSHConnectionCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SSHConnectionCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

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
      safetyLevel: $Enums.SafetyLevel
      metadata: Prisma.JsonValue | null
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
     * Create many CommandLogs.
     *     @param {CommandLogCreateManyArgs} args - Arguments to create many CommandLogs.
     *     @example
     *     // Create many CommandLogs
     *     const commandLog = await prisma.commandLog.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends CommandLogCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CommandLogCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

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
   * Model UserSubscription
   */

  export type AggregateUserSubscription = {
    _count: UserSubscriptionCountAggregateOutputType | null
    _min: UserSubscriptionMinAggregateOutputType | null
    _max: UserSubscriptionMaxAggregateOutputType | null
  }

  export type UserSubscriptionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    trialExpiresAt: Date | null
    basePlanType: $Enums.SubscriptionPlanType | null
    baseExpiresAt: Date | null
    aiPlanType: $Enums.SubscriptionPlanType | null
    aiExpiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserSubscriptionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    trialExpiresAt: Date | null
    basePlanType: $Enums.SubscriptionPlanType | null
    baseExpiresAt: Date | null
    aiPlanType: $Enums.SubscriptionPlanType | null
    aiExpiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserSubscriptionCountAggregateOutputType = {
    id: number
    userId: number
    trialExpiresAt: number
    basePlanType: number
    baseExpiresAt: number
    aiPlanType: number
    aiExpiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserSubscriptionMinAggregateInputType = {
    id?: true
    userId?: true
    trialExpiresAt?: true
    basePlanType?: true
    baseExpiresAt?: true
    aiPlanType?: true
    aiExpiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserSubscriptionMaxAggregateInputType = {
    id?: true
    userId?: true
    trialExpiresAt?: true
    basePlanType?: true
    baseExpiresAt?: true
    aiPlanType?: true
    aiExpiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserSubscriptionCountAggregateInputType = {
    id?: true
    userId?: true
    trialExpiresAt?: true
    basePlanType?: true
    baseExpiresAt?: true
    aiPlanType?: true
    aiExpiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserSubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSubscription to aggregate.
     */
    where?: UserSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSubscriptions to fetch.
     */
    orderBy?: UserSubscriptionOrderByWithRelationInput | UserSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserSubscriptions
    **/
    _count?: true | UserSubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserSubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserSubscriptionMaxAggregateInputType
  }

  export type GetUserSubscriptionAggregateType<T extends UserSubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateUserSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserSubscription[P]>
      : GetScalarType<T[P], AggregateUserSubscription[P]>
  }




  export type UserSubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSubscriptionWhereInput
    orderBy?: UserSubscriptionOrderByWithAggregationInput | UserSubscriptionOrderByWithAggregationInput[]
    by: UserSubscriptionScalarFieldEnum[] | UserSubscriptionScalarFieldEnum
    having?: UserSubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserSubscriptionCountAggregateInputType | true
    _min?: UserSubscriptionMinAggregateInputType
    _max?: UserSubscriptionMaxAggregateInputType
  }

  export type UserSubscriptionGroupByOutputType = {
    id: string
    userId: string
    trialExpiresAt: Date | null
    basePlanType: $Enums.SubscriptionPlanType | null
    baseExpiresAt: Date | null
    aiPlanType: $Enums.SubscriptionPlanType | null
    aiExpiresAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserSubscriptionCountAggregateOutputType | null
    _min: UserSubscriptionMinAggregateOutputType | null
    _max: UserSubscriptionMaxAggregateOutputType | null
  }

  type GetUserSubscriptionGroupByPayload<T extends UserSubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserSubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserSubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserSubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], UserSubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type UserSubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    trialExpiresAt?: boolean
    basePlanType?: boolean
    baseExpiresAt?: boolean
    aiPlanType?: boolean
    aiExpiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSubscription"]>

  export type UserSubscriptionSelectScalar = {
    id?: boolean
    userId?: boolean
    trialExpiresAt?: boolean
    basePlanType?: boolean
    baseExpiresAt?: boolean
    aiPlanType?: boolean
    aiExpiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserSubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }


  export type $UserSubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserSubscription"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      trialExpiresAt: Date | null
      basePlanType: $Enums.SubscriptionPlanType | null
      baseExpiresAt: Date | null
      aiPlanType: $Enums.SubscriptionPlanType | null
      aiExpiresAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userSubscription"]>
    composites: {}
  }


  type UserSubscriptionGetPayload<S extends boolean | null | undefined | UserSubscriptionDefaultArgs> = $Result.GetResult<Prisma.$UserSubscriptionPayload, S>

  type UserSubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserSubscriptionFindManyArgs, 'select' | 'include' | 'distinct' > & {
      select?: UserSubscriptionCountAggregateInputType | true
    }

  export interface UserSubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserSubscription'], meta: { name: 'UserSubscription' } }
    /**
     * Find zero or one UserSubscription that matches the filter.
     * @param {UserSubscriptionFindUniqueArgs} args - Arguments to find a UserSubscription
     * @example
     * // Get one UserSubscription
     * const userSubscription = await prisma.userSubscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UserSubscriptionFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, UserSubscriptionFindUniqueArgs<ExtArgs>>
    ): Prisma__UserSubscriptionClient<$Result.GetResult<Prisma.$UserSubscriptionPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one UserSubscription that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {UserSubscriptionFindUniqueOrThrowArgs} args - Arguments to find a UserSubscription
     * @example
     * // Get one UserSubscription
     * const userSubscription = await prisma.userSubscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UserSubscriptionFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UserSubscriptionFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UserSubscriptionClient<$Result.GetResult<Prisma.$UserSubscriptionPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first UserSubscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSubscriptionFindFirstArgs} args - Arguments to find a UserSubscription
     * @example
     * // Get one UserSubscription
     * const userSubscription = await prisma.userSubscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UserSubscriptionFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, UserSubscriptionFindFirstArgs<ExtArgs>>
    ): Prisma__UserSubscriptionClient<$Result.GetResult<Prisma.$UserSubscriptionPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first UserSubscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSubscriptionFindFirstOrThrowArgs} args - Arguments to find a UserSubscription
     * @example
     * // Get one UserSubscription
     * const userSubscription = await prisma.userSubscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UserSubscriptionFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UserSubscriptionFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UserSubscriptionClient<$Result.GetResult<Prisma.$UserSubscriptionPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more UserSubscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSubscriptionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserSubscriptions
     * const userSubscriptions = await prisma.userSubscription.findMany()
     * 
     * // Get first 10 UserSubscriptions
     * const userSubscriptions = await prisma.userSubscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userSubscriptionWithIdOnly = await prisma.userSubscription.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends UserSubscriptionFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserSubscriptionFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSubscriptionPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a UserSubscription.
     * @param {UserSubscriptionCreateArgs} args - Arguments to create a UserSubscription.
     * @example
     * // Create one UserSubscription
     * const UserSubscription = await prisma.userSubscription.create({
     *   data: {
     *     // ... data to create a UserSubscription
     *   }
     * })
     * 
    **/
    create<T extends UserSubscriptionCreateArgs<ExtArgs>>(
      args: SelectSubset<T, UserSubscriptionCreateArgs<ExtArgs>>
    ): Prisma__UserSubscriptionClient<$Result.GetResult<Prisma.$UserSubscriptionPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many UserSubscriptions.
     *     @param {UserSubscriptionCreateManyArgs} args - Arguments to create many UserSubscriptions.
     *     @example
     *     // Create many UserSubscriptions
     *     const userSubscription = await prisma.userSubscription.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UserSubscriptionCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserSubscriptionCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a UserSubscription.
     * @param {UserSubscriptionDeleteArgs} args - Arguments to delete one UserSubscription.
     * @example
     * // Delete one UserSubscription
     * const UserSubscription = await prisma.userSubscription.delete({
     *   where: {
     *     // ... filter to delete one UserSubscription
     *   }
     * })
     * 
    **/
    delete<T extends UserSubscriptionDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, UserSubscriptionDeleteArgs<ExtArgs>>
    ): Prisma__UserSubscriptionClient<$Result.GetResult<Prisma.$UserSubscriptionPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one UserSubscription.
     * @param {UserSubscriptionUpdateArgs} args - Arguments to update one UserSubscription.
     * @example
     * // Update one UserSubscription
     * const userSubscription = await prisma.userSubscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UserSubscriptionUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, UserSubscriptionUpdateArgs<ExtArgs>>
    ): Prisma__UserSubscriptionClient<$Result.GetResult<Prisma.$UserSubscriptionPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more UserSubscriptions.
     * @param {UserSubscriptionDeleteManyArgs} args - Arguments to filter UserSubscriptions to delete.
     * @example
     * // Delete a few UserSubscriptions
     * const { count } = await prisma.userSubscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UserSubscriptionDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserSubscriptionDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserSubscriptions
     * const userSubscription = await prisma.userSubscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UserSubscriptionUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, UserSubscriptionUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserSubscription.
     * @param {UserSubscriptionUpsertArgs} args - Arguments to update or create a UserSubscription.
     * @example
     * // Update or create a UserSubscription
     * const userSubscription = await prisma.userSubscription.upsert({
     *   create: {
     *     // ... data to create a UserSubscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserSubscription we want to update
     *   }
     * })
    **/
    upsert<T extends UserSubscriptionUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, UserSubscriptionUpsertArgs<ExtArgs>>
    ): Prisma__UserSubscriptionClient<$Result.GetResult<Prisma.$UserSubscriptionPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of UserSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSubscriptionCountArgs} args - Arguments to filter UserSubscriptions to count.
     * @example
     * // Count the number of UserSubscriptions
     * const count = await prisma.userSubscription.count({
     *   where: {
     *     // ... the filter for the UserSubscriptions we want to count
     *   }
     * })
    **/
    count<T extends UserSubscriptionCountArgs>(
      args?: Subset<T, UserSubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserSubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserSubscriptionAggregateArgs>(args: Subset<T, UserSubscriptionAggregateArgs>): Prisma.PrismaPromise<GetUserSubscriptionAggregateType<T>>

    /**
     * Group by UserSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSubscriptionGroupByArgs} args - Group by arguments.
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
      T extends UserSubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserSubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: UserSubscriptionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserSubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserSubscription model
   */
  readonly fields: UserSubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserSubscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserSubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the UserSubscription model
   */ 
  interface UserSubscriptionFieldRefs {
    readonly id: FieldRef<"UserSubscription", 'String'>
    readonly userId: FieldRef<"UserSubscription", 'String'>
    readonly trialExpiresAt: FieldRef<"UserSubscription", 'DateTime'>
    readonly basePlanType: FieldRef<"UserSubscription", 'SubscriptionPlanType'>
    readonly baseExpiresAt: FieldRef<"UserSubscription", 'DateTime'>
    readonly aiPlanType: FieldRef<"UserSubscription", 'SubscriptionPlanType'>
    readonly aiExpiresAt: FieldRef<"UserSubscription", 'DateTime'>
    readonly createdAt: FieldRef<"UserSubscription", 'DateTime'>
    readonly updatedAt: FieldRef<"UserSubscription", 'DateTime'>
  }
    

  // Custom InputTypes

  /**
   * UserSubscription findUnique
   */
  export type UserSubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSubscription
     */
    select?: UserSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which UserSubscription to fetch.
     */
    where: UserSubscriptionWhereUniqueInput
  }


  /**
   * UserSubscription findUniqueOrThrow
   */
  export type UserSubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSubscription
     */
    select?: UserSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which UserSubscription to fetch.
     */
    where: UserSubscriptionWhereUniqueInput
  }


  /**
   * UserSubscription findFirst
   */
  export type UserSubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSubscription
     */
    select?: UserSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which UserSubscription to fetch.
     */
    where?: UserSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSubscriptions to fetch.
     */
    orderBy?: UserSubscriptionOrderByWithRelationInput | UserSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSubscriptions.
     */
    cursor?: UserSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSubscriptions.
     */
    distinct?: UserSubscriptionScalarFieldEnum | UserSubscriptionScalarFieldEnum[]
  }


  /**
   * UserSubscription findFirstOrThrow
   */
  export type UserSubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSubscription
     */
    select?: UserSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which UserSubscription to fetch.
     */
    where?: UserSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSubscriptions to fetch.
     */
    orderBy?: UserSubscriptionOrderByWithRelationInput | UserSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSubscriptions.
     */
    cursor?: UserSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSubscriptions.
     */
    distinct?: UserSubscriptionScalarFieldEnum | UserSubscriptionScalarFieldEnum[]
  }


  /**
   * UserSubscription findMany
   */
  export type UserSubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSubscription
     */
    select?: UserSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which UserSubscriptions to fetch.
     */
    where?: UserSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSubscriptions to fetch.
     */
    orderBy?: UserSubscriptionOrderByWithRelationInput | UserSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserSubscriptions.
     */
    cursor?: UserSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSubscriptions.
     */
    skip?: number
    distinct?: UserSubscriptionScalarFieldEnum | UserSubscriptionScalarFieldEnum[]
  }


  /**
   * UserSubscription create
   */
  export type UserSubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSubscription
     */
    select?: UserSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a UserSubscription.
     */
    data: XOR<UserSubscriptionCreateInput, UserSubscriptionUncheckedCreateInput>
  }


  /**
   * UserSubscription createMany
   */
  export type UserSubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserSubscriptions.
     */
    data: UserSubscriptionCreateManyInput | UserSubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * UserSubscription update
   */
  export type UserSubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSubscription
     */
    select?: UserSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a UserSubscription.
     */
    data: XOR<UserSubscriptionUpdateInput, UserSubscriptionUncheckedUpdateInput>
    /**
     * Choose, which UserSubscription to update.
     */
    where: UserSubscriptionWhereUniqueInput
  }


  /**
   * UserSubscription updateMany
   */
  export type UserSubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserSubscriptions.
     */
    data: XOR<UserSubscriptionUpdateManyMutationInput, UserSubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which UserSubscriptions to update
     */
    where?: UserSubscriptionWhereInput
  }


  /**
   * UserSubscription upsert
   */
  export type UserSubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSubscription
     */
    select?: UserSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the UserSubscription to update in case it exists.
     */
    where: UserSubscriptionWhereUniqueInput
    /**
     * In case the UserSubscription found by the `where` argument doesn't exist, create a new UserSubscription with this data.
     */
    create: XOR<UserSubscriptionCreateInput, UserSubscriptionUncheckedCreateInput>
    /**
     * In case the UserSubscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserSubscriptionUpdateInput, UserSubscriptionUncheckedUpdateInput>
  }


  /**
   * UserSubscription delete
   */
  export type UserSubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSubscription
     */
    select?: UserSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSubscriptionInclude<ExtArgs> | null
    /**
     * Filter which UserSubscription to delete.
     */
    where: UserSubscriptionWhereUniqueInput
  }


  /**
   * UserSubscription deleteMany
   */
  export type UserSubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSubscriptions to delete
     */
    where?: UserSubscriptionWhereInput
  }


  /**
   * UserSubscription without action
   */
  export type UserSubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSubscription
     */
    select?: UserSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserSubscriptionInclude<ExtArgs> | null
  }



  /**
   * Model PaymentOrder
   */

  export type AggregatePaymentOrder = {
    _count: PaymentOrderCountAggregateOutputType | null
    _avg: PaymentOrderAvgAggregateOutputType | null
    _sum: PaymentOrderSumAggregateOutputType | null
    _min: PaymentOrderMinAggregateOutputType | null
    _max: PaymentOrderMaxAggregateOutputType | null
  }

  export type PaymentOrderAvgAggregateOutputType = {
    amount: number | null
  }

  export type PaymentOrderSumAggregateOutputType = {
    amount: number | null
  }

  export type PaymentOrderMinAggregateOutputType = {
    id: string | null
    bizId: string | null
    sessionId: string | null
    userId: string | null
    planCode: $Enums.SubscriptionPlanCode | null
    paymentProductId: string | null
    amount: number | null
    status: $Enums.PaymentOrderStatus | null
    paidAt: Date | null
    activatedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PaymentOrderMaxAggregateOutputType = {
    id: string | null
    bizId: string | null
    sessionId: string | null
    userId: string | null
    planCode: $Enums.SubscriptionPlanCode | null
    paymentProductId: string | null
    amount: number | null
    status: $Enums.PaymentOrderStatus | null
    paidAt: Date | null
    activatedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PaymentOrderCountAggregateOutputType = {
    id: number
    bizId: number
    sessionId: number
    userId: number
    planCode: number
    paymentProductId: number
    amount: number
    status: number
    paidAt: number
    activatedAt: number
    rawPlatformPayload: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PaymentOrderAvgAggregateInputType = {
    amount?: true
  }

  export type PaymentOrderSumAggregateInputType = {
    amount?: true
  }

  export type PaymentOrderMinAggregateInputType = {
    id?: true
    bizId?: true
    sessionId?: true
    userId?: true
    planCode?: true
    paymentProductId?: true
    amount?: true
    status?: true
    paidAt?: true
    activatedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PaymentOrderMaxAggregateInputType = {
    id?: true
    bizId?: true
    sessionId?: true
    userId?: true
    planCode?: true
    paymentProductId?: true
    amount?: true
    status?: true
    paidAt?: true
    activatedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PaymentOrderCountAggregateInputType = {
    id?: true
    bizId?: true
    sessionId?: true
    userId?: true
    planCode?: true
    paymentProductId?: true
    amount?: true
    status?: true
    paidAt?: true
    activatedAt?: true
    rawPlatformPayload?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PaymentOrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentOrder to aggregate.
     */
    where?: PaymentOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentOrders to fetch.
     */
    orderBy?: PaymentOrderOrderByWithRelationInput | PaymentOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PaymentOrders
    **/
    _count?: true | PaymentOrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentOrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentOrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentOrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentOrderMaxAggregateInputType
  }

  export type GetPaymentOrderAggregateType<T extends PaymentOrderAggregateArgs> = {
        [P in keyof T & keyof AggregatePaymentOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePaymentOrder[P]>
      : GetScalarType<T[P], AggregatePaymentOrder[P]>
  }




  export type PaymentOrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentOrderWhereInput
    orderBy?: PaymentOrderOrderByWithAggregationInput | PaymentOrderOrderByWithAggregationInput[]
    by: PaymentOrderScalarFieldEnum[] | PaymentOrderScalarFieldEnum
    having?: PaymentOrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentOrderCountAggregateInputType | true
    _avg?: PaymentOrderAvgAggregateInputType
    _sum?: PaymentOrderSumAggregateInputType
    _min?: PaymentOrderMinAggregateInputType
    _max?: PaymentOrderMaxAggregateInputType
  }

  export type PaymentOrderGroupByOutputType = {
    id: string
    bizId: string
    sessionId: string
    userId: string
    planCode: $Enums.SubscriptionPlanCode
    paymentProductId: string
    amount: number
    status: $Enums.PaymentOrderStatus
    paidAt: Date | null
    activatedAt: Date | null
    rawPlatformPayload: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: PaymentOrderCountAggregateOutputType | null
    _avg: PaymentOrderAvgAggregateOutputType | null
    _sum: PaymentOrderSumAggregateOutputType | null
    _min: PaymentOrderMinAggregateOutputType | null
    _max: PaymentOrderMaxAggregateOutputType | null
  }

  type GetPaymentOrderGroupByPayload<T extends PaymentOrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentOrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentOrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentOrderGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentOrderGroupByOutputType[P]>
        }
      >
    >


  export type PaymentOrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bizId?: boolean
    sessionId?: boolean
    userId?: boolean
    planCode?: boolean
    paymentProductId?: boolean
    amount?: boolean
    status?: boolean
    paidAt?: boolean
    activatedAt?: boolean
    rawPlatformPayload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentOrder"]>

  export type PaymentOrderSelectScalar = {
    id?: boolean
    bizId?: boolean
    sessionId?: boolean
    userId?: boolean
    planCode?: boolean
    paymentProductId?: boolean
    amount?: boolean
    status?: boolean
    paidAt?: boolean
    activatedAt?: boolean
    rawPlatformPayload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PaymentOrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }


  export type $PaymentOrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PaymentOrder"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bizId: string
      sessionId: string
      userId: string
      planCode: $Enums.SubscriptionPlanCode
      paymentProductId: string
      amount: number
      status: $Enums.PaymentOrderStatus
      paidAt: Date | null
      activatedAt: Date | null
      rawPlatformPayload: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["paymentOrder"]>
    composites: {}
  }


  type PaymentOrderGetPayload<S extends boolean | null | undefined | PaymentOrderDefaultArgs> = $Result.GetResult<Prisma.$PaymentOrderPayload, S>

  type PaymentOrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PaymentOrderFindManyArgs, 'select' | 'include' | 'distinct' > & {
      select?: PaymentOrderCountAggregateInputType | true
    }

  export interface PaymentOrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PaymentOrder'], meta: { name: 'PaymentOrder' } }
    /**
     * Find zero or one PaymentOrder that matches the filter.
     * @param {PaymentOrderFindUniqueArgs} args - Arguments to find a PaymentOrder
     * @example
     * // Get one PaymentOrder
     * const paymentOrder = await prisma.paymentOrder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends PaymentOrderFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, PaymentOrderFindUniqueArgs<ExtArgs>>
    ): Prisma__PaymentOrderClient<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one PaymentOrder that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {PaymentOrderFindUniqueOrThrowArgs} args - Arguments to find a PaymentOrder
     * @example
     * // Get one PaymentOrder
     * const paymentOrder = await prisma.paymentOrder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends PaymentOrderFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, PaymentOrderFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__PaymentOrderClient<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first PaymentOrder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOrderFindFirstArgs} args - Arguments to find a PaymentOrder
     * @example
     * // Get one PaymentOrder
     * const paymentOrder = await prisma.paymentOrder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends PaymentOrderFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, PaymentOrderFindFirstArgs<ExtArgs>>
    ): Prisma__PaymentOrderClient<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first PaymentOrder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOrderFindFirstOrThrowArgs} args - Arguments to find a PaymentOrder
     * @example
     * // Get one PaymentOrder
     * const paymentOrder = await prisma.paymentOrder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends PaymentOrderFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, PaymentOrderFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__PaymentOrderClient<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more PaymentOrders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOrderFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaymentOrders
     * const paymentOrders = await prisma.paymentOrder.findMany()
     * 
     * // Get first 10 PaymentOrders
     * const paymentOrders = await prisma.paymentOrder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentOrderWithIdOnly = await prisma.paymentOrder.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends PaymentOrderFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, PaymentOrderFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a PaymentOrder.
     * @param {PaymentOrderCreateArgs} args - Arguments to create a PaymentOrder.
     * @example
     * // Create one PaymentOrder
     * const PaymentOrder = await prisma.paymentOrder.create({
     *   data: {
     *     // ... data to create a PaymentOrder
     *   }
     * })
     * 
    **/
    create<T extends PaymentOrderCreateArgs<ExtArgs>>(
      args: SelectSubset<T, PaymentOrderCreateArgs<ExtArgs>>
    ): Prisma__PaymentOrderClient<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many PaymentOrders.
     *     @param {PaymentOrderCreateManyArgs} args - Arguments to create many PaymentOrders.
     *     @example
     *     // Create many PaymentOrders
     *     const paymentOrder = await prisma.paymentOrder.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends PaymentOrderCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, PaymentOrderCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PaymentOrder.
     * @param {PaymentOrderDeleteArgs} args - Arguments to delete one PaymentOrder.
     * @example
     * // Delete one PaymentOrder
     * const PaymentOrder = await prisma.paymentOrder.delete({
     *   where: {
     *     // ... filter to delete one PaymentOrder
     *   }
     * })
     * 
    **/
    delete<T extends PaymentOrderDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, PaymentOrderDeleteArgs<ExtArgs>>
    ): Prisma__PaymentOrderClient<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one PaymentOrder.
     * @param {PaymentOrderUpdateArgs} args - Arguments to update one PaymentOrder.
     * @example
     * // Update one PaymentOrder
     * const paymentOrder = await prisma.paymentOrder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends PaymentOrderUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, PaymentOrderUpdateArgs<ExtArgs>>
    ): Prisma__PaymentOrderClient<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more PaymentOrders.
     * @param {PaymentOrderDeleteManyArgs} args - Arguments to filter PaymentOrders to delete.
     * @example
     * // Delete a few PaymentOrders
     * const { count } = await prisma.paymentOrder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends PaymentOrderDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, PaymentOrderDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaymentOrders
     * const paymentOrder = await prisma.paymentOrder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends PaymentOrderUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, PaymentOrderUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PaymentOrder.
     * @param {PaymentOrderUpsertArgs} args - Arguments to update or create a PaymentOrder.
     * @example
     * // Update or create a PaymentOrder
     * const paymentOrder = await prisma.paymentOrder.upsert({
     *   create: {
     *     // ... data to create a PaymentOrder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaymentOrder we want to update
     *   }
     * })
    **/
    upsert<T extends PaymentOrderUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, PaymentOrderUpsertArgs<ExtArgs>>
    ): Prisma__PaymentOrderClient<$Result.GetResult<Prisma.$PaymentOrderPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of PaymentOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOrderCountArgs} args - Arguments to filter PaymentOrders to count.
     * @example
     * // Count the number of PaymentOrders
     * const count = await prisma.paymentOrder.count({
     *   where: {
     *     // ... the filter for the PaymentOrders we want to count
     *   }
     * })
    **/
    count<T extends PaymentOrderCountArgs>(
      args?: Subset<T, PaymentOrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentOrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PaymentOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PaymentOrderAggregateArgs>(args: Subset<T, PaymentOrderAggregateArgs>): Prisma.PrismaPromise<GetPaymentOrderAggregateType<T>>

    /**
     * Group by PaymentOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOrderGroupByArgs} args - Group by arguments.
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
      T extends PaymentOrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentOrderGroupByArgs['orderBy'] }
        : { orderBy?: PaymentOrderGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PaymentOrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PaymentOrder model
   */
  readonly fields: PaymentOrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PaymentOrder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentOrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the PaymentOrder model
   */ 
  interface PaymentOrderFieldRefs {
    readonly id: FieldRef<"PaymentOrder", 'String'>
    readonly bizId: FieldRef<"PaymentOrder", 'String'>
    readonly sessionId: FieldRef<"PaymentOrder", 'String'>
    readonly userId: FieldRef<"PaymentOrder", 'String'>
    readonly planCode: FieldRef<"PaymentOrder", 'SubscriptionPlanCode'>
    readonly paymentProductId: FieldRef<"PaymentOrder", 'String'>
    readonly amount: FieldRef<"PaymentOrder", 'Int'>
    readonly status: FieldRef<"PaymentOrder", 'PaymentOrderStatus'>
    readonly paidAt: FieldRef<"PaymentOrder", 'DateTime'>
    readonly activatedAt: FieldRef<"PaymentOrder", 'DateTime'>
    readonly rawPlatformPayload: FieldRef<"PaymentOrder", 'Json'>
    readonly createdAt: FieldRef<"PaymentOrder", 'DateTime'>
    readonly updatedAt: FieldRef<"PaymentOrder", 'DateTime'>
  }
    

  // Custom InputTypes

  /**
   * PaymentOrder findUnique
   */
  export type PaymentOrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentOrderInclude<ExtArgs> | null
    /**
     * Filter, which PaymentOrder to fetch.
     */
    where: PaymentOrderWhereUniqueInput
  }


  /**
   * PaymentOrder findUniqueOrThrow
   */
  export type PaymentOrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentOrderInclude<ExtArgs> | null
    /**
     * Filter, which PaymentOrder to fetch.
     */
    where: PaymentOrderWhereUniqueInput
  }


  /**
   * PaymentOrder findFirst
   */
  export type PaymentOrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentOrderInclude<ExtArgs> | null
    /**
     * Filter, which PaymentOrder to fetch.
     */
    where?: PaymentOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentOrders to fetch.
     */
    orderBy?: PaymentOrderOrderByWithRelationInput | PaymentOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentOrders.
     */
    cursor?: PaymentOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentOrders.
     */
    distinct?: PaymentOrderScalarFieldEnum | PaymentOrderScalarFieldEnum[]
  }


  /**
   * PaymentOrder findFirstOrThrow
   */
  export type PaymentOrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentOrderInclude<ExtArgs> | null
    /**
     * Filter, which PaymentOrder to fetch.
     */
    where?: PaymentOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentOrders to fetch.
     */
    orderBy?: PaymentOrderOrderByWithRelationInput | PaymentOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentOrders.
     */
    cursor?: PaymentOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentOrders.
     */
    distinct?: PaymentOrderScalarFieldEnum | PaymentOrderScalarFieldEnum[]
  }


  /**
   * PaymentOrder findMany
   */
  export type PaymentOrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentOrderInclude<ExtArgs> | null
    /**
     * Filter, which PaymentOrders to fetch.
     */
    where?: PaymentOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentOrders to fetch.
     */
    orderBy?: PaymentOrderOrderByWithRelationInput | PaymentOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PaymentOrders.
     */
    cursor?: PaymentOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentOrders.
     */
    skip?: number
    distinct?: PaymentOrderScalarFieldEnum | PaymentOrderScalarFieldEnum[]
  }


  /**
   * PaymentOrder create
   */
  export type PaymentOrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentOrderInclude<ExtArgs> | null
    /**
     * The data needed to create a PaymentOrder.
     */
    data: XOR<PaymentOrderCreateInput, PaymentOrderUncheckedCreateInput>
  }


  /**
   * PaymentOrder createMany
   */
  export type PaymentOrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PaymentOrders.
     */
    data: PaymentOrderCreateManyInput | PaymentOrderCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * PaymentOrder update
   */
  export type PaymentOrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentOrderInclude<ExtArgs> | null
    /**
     * The data needed to update a PaymentOrder.
     */
    data: XOR<PaymentOrderUpdateInput, PaymentOrderUncheckedUpdateInput>
    /**
     * Choose, which PaymentOrder to update.
     */
    where: PaymentOrderWhereUniqueInput
  }


  /**
   * PaymentOrder updateMany
   */
  export type PaymentOrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PaymentOrders.
     */
    data: XOR<PaymentOrderUpdateManyMutationInput, PaymentOrderUncheckedUpdateManyInput>
    /**
     * Filter which PaymentOrders to update
     */
    where?: PaymentOrderWhereInput
  }


  /**
   * PaymentOrder upsert
   */
  export type PaymentOrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentOrderInclude<ExtArgs> | null
    /**
     * The filter to search for the PaymentOrder to update in case it exists.
     */
    where: PaymentOrderWhereUniqueInput
    /**
     * In case the PaymentOrder found by the `where` argument doesn't exist, create a new PaymentOrder with this data.
     */
    create: XOR<PaymentOrderCreateInput, PaymentOrderUncheckedCreateInput>
    /**
     * In case the PaymentOrder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentOrderUpdateInput, PaymentOrderUncheckedUpdateInput>
  }


  /**
   * PaymentOrder delete
   */
  export type PaymentOrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentOrderInclude<ExtArgs> | null
    /**
     * Filter which PaymentOrder to delete.
     */
    where: PaymentOrderWhereUniqueInput
  }


  /**
   * PaymentOrder deleteMany
   */
  export type PaymentOrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentOrders to delete
     */
    where?: PaymentOrderWhereInput
  }


  /**
   * PaymentOrder without action
   */
  export type PaymentOrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOrder
     */
    select?: PaymentOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentOrderInclude<ExtArgs> | null
  }



  /**
   * Model ManagedAiUsage
   */

  export type AggregateManagedAiUsage = {
    _count: ManagedAiUsageCountAggregateOutputType | null
    _avg: ManagedAiUsageAvgAggregateOutputType | null
    _sum: ManagedAiUsageSumAggregateOutputType | null
    _min: ManagedAiUsageMinAggregateOutputType | null
    _max: ManagedAiUsageMaxAggregateOutputType | null
  }

  export type ManagedAiUsageAvgAggregateOutputType = {
    usedCount: number | null
    limitCount: number | null
  }

  export type ManagedAiUsageSumAggregateOutputType = {
    usedCount: number | null
    limitCount: number | null
  }

  export type ManagedAiUsageMinAggregateOutputType = {
    id: string | null
    userId: string | null
    featureKey: string | null
    periodKey: string | null
    usedCount: number | null
    limitCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ManagedAiUsageMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    featureKey: string | null
    periodKey: string | null
    usedCount: number | null
    limitCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ManagedAiUsageCountAggregateOutputType = {
    id: number
    userId: number
    featureKey: number
    periodKey: number
    usedCount: number
    limitCount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ManagedAiUsageAvgAggregateInputType = {
    usedCount?: true
    limitCount?: true
  }

  export type ManagedAiUsageSumAggregateInputType = {
    usedCount?: true
    limitCount?: true
  }

  export type ManagedAiUsageMinAggregateInputType = {
    id?: true
    userId?: true
    featureKey?: true
    periodKey?: true
    usedCount?: true
    limitCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ManagedAiUsageMaxAggregateInputType = {
    id?: true
    userId?: true
    featureKey?: true
    periodKey?: true
    usedCount?: true
    limitCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ManagedAiUsageCountAggregateInputType = {
    id?: true
    userId?: true
    featureKey?: true
    periodKey?: true
    usedCount?: true
    limitCount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ManagedAiUsageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ManagedAiUsage to aggregate.
     */
    where?: ManagedAiUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManagedAiUsages to fetch.
     */
    orderBy?: ManagedAiUsageOrderByWithRelationInput | ManagedAiUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ManagedAiUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManagedAiUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManagedAiUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ManagedAiUsages
    **/
    _count?: true | ManagedAiUsageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ManagedAiUsageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ManagedAiUsageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ManagedAiUsageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ManagedAiUsageMaxAggregateInputType
  }

  export type GetManagedAiUsageAggregateType<T extends ManagedAiUsageAggregateArgs> = {
        [P in keyof T & keyof AggregateManagedAiUsage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateManagedAiUsage[P]>
      : GetScalarType<T[P], AggregateManagedAiUsage[P]>
  }




  export type ManagedAiUsageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ManagedAiUsageWhereInput
    orderBy?: ManagedAiUsageOrderByWithAggregationInput | ManagedAiUsageOrderByWithAggregationInput[]
    by: ManagedAiUsageScalarFieldEnum[] | ManagedAiUsageScalarFieldEnum
    having?: ManagedAiUsageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ManagedAiUsageCountAggregateInputType | true
    _avg?: ManagedAiUsageAvgAggregateInputType
    _sum?: ManagedAiUsageSumAggregateInputType
    _min?: ManagedAiUsageMinAggregateInputType
    _max?: ManagedAiUsageMaxAggregateInputType
  }

  export type ManagedAiUsageGroupByOutputType = {
    id: string
    userId: string
    featureKey: string
    periodKey: string
    usedCount: number
    limitCount: number
    createdAt: Date
    updatedAt: Date
    _count: ManagedAiUsageCountAggregateOutputType | null
    _avg: ManagedAiUsageAvgAggregateOutputType | null
    _sum: ManagedAiUsageSumAggregateOutputType | null
    _min: ManagedAiUsageMinAggregateOutputType | null
    _max: ManagedAiUsageMaxAggregateOutputType | null
  }

  type GetManagedAiUsageGroupByPayload<T extends ManagedAiUsageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ManagedAiUsageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ManagedAiUsageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ManagedAiUsageGroupByOutputType[P]>
            : GetScalarType<T[P], ManagedAiUsageGroupByOutputType[P]>
        }
      >
    >


  export type ManagedAiUsageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    featureKey?: boolean
    periodKey?: boolean
    usedCount?: boolean
    limitCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["managedAiUsage"]>

  export type ManagedAiUsageSelectScalar = {
    id?: boolean
    userId?: boolean
    featureKey?: boolean
    periodKey?: boolean
    usedCount?: boolean
    limitCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ManagedAiUsageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }


  export type $ManagedAiUsagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ManagedAiUsage"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      featureKey: string
      periodKey: string
      usedCount: number
      limitCount: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["managedAiUsage"]>
    composites: {}
  }


  type ManagedAiUsageGetPayload<S extends boolean | null | undefined | ManagedAiUsageDefaultArgs> = $Result.GetResult<Prisma.$ManagedAiUsagePayload, S>

  type ManagedAiUsageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ManagedAiUsageFindManyArgs, 'select' | 'include' | 'distinct' > & {
      select?: ManagedAiUsageCountAggregateInputType | true
    }

  export interface ManagedAiUsageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ManagedAiUsage'], meta: { name: 'ManagedAiUsage' } }
    /**
     * Find zero or one ManagedAiUsage that matches the filter.
     * @param {ManagedAiUsageFindUniqueArgs} args - Arguments to find a ManagedAiUsage
     * @example
     * // Get one ManagedAiUsage
     * const managedAiUsage = await prisma.managedAiUsage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ManagedAiUsageFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, ManagedAiUsageFindUniqueArgs<ExtArgs>>
    ): Prisma__ManagedAiUsageClient<$Result.GetResult<Prisma.$ManagedAiUsagePayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one ManagedAiUsage that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {ManagedAiUsageFindUniqueOrThrowArgs} args - Arguments to find a ManagedAiUsage
     * @example
     * // Get one ManagedAiUsage
     * const managedAiUsage = await prisma.managedAiUsage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ManagedAiUsageFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ManagedAiUsageFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ManagedAiUsageClient<$Result.GetResult<Prisma.$ManagedAiUsagePayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first ManagedAiUsage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagedAiUsageFindFirstArgs} args - Arguments to find a ManagedAiUsage
     * @example
     * // Get one ManagedAiUsage
     * const managedAiUsage = await prisma.managedAiUsage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ManagedAiUsageFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, ManagedAiUsageFindFirstArgs<ExtArgs>>
    ): Prisma__ManagedAiUsageClient<$Result.GetResult<Prisma.$ManagedAiUsagePayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first ManagedAiUsage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagedAiUsageFindFirstOrThrowArgs} args - Arguments to find a ManagedAiUsage
     * @example
     * // Get one ManagedAiUsage
     * const managedAiUsage = await prisma.managedAiUsage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ManagedAiUsageFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ManagedAiUsageFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ManagedAiUsageClient<$Result.GetResult<Prisma.$ManagedAiUsagePayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more ManagedAiUsages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagedAiUsageFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ManagedAiUsages
     * const managedAiUsages = await prisma.managedAiUsage.findMany()
     * 
     * // Get first 10 ManagedAiUsages
     * const managedAiUsages = await prisma.managedAiUsage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const managedAiUsageWithIdOnly = await prisma.managedAiUsage.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ManagedAiUsageFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ManagedAiUsageFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ManagedAiUsagePayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a ManagedAiUsage.
     * @param {ManagedAiUsageCreateArgs} args - Arguments to create a ManagedAiUsage.
     * @example
     * // Create one ManagedAiUsage
     * const ManagedAiUsage = await prisma.managedAiUsage.create({
     *   data: {
     *     // ... data to create a ManagedAiUsage
     *   }
     * })
     * 
    **/
    create<T extends ManagedAiUsageCreateArgs<ExtArgs>>(
      args: SelectSubset<T, ManagedAiUsageCreateArgs<ExtArgs>>
    ): Prisma__ManagedAiUsageClient<$Result.GetResult<Prisma.$ManagedAiUsagePayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many ManagedAiUsages.
     *     @param {ManagedAiUsageCreateManyArgs} args - Arguments to create many ManagedAiUsages.
     *     @example
     *     // Create many ManagedAiUsages
     *     const managedAiUsage = await prisma.managedAiUsage.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ManagedAiUsageCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ManagedAiUsageCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ManagedAiUsage.
     * @param {ManagedAiUsageDeleteArgs} args - Arguments to delete one ManagedAiUsage.
     * @example
     * // Delete one ManagedAiUsage
     * const ManagedAiUsage = await prisma.managedAiUsage.delete({
     *   where: {
     *     // ... filter to delete one ManagedAiUsage
     *   }
     * })
     * 
    **/
    delete<T extends ManagedAiUsageDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, ManagedAiUsageDeleteArgs<ExtArgs>>
    ): Prisma__ManagedAiUsageClient<$Result.GetResult<Prisma.$ManagedAiUsagePayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one ManagedAiUsage.
     * @param {ManagedAiUsageUpdateArgs} args - Arguments to update one ManagedAiUsage.
     * @example
     * // Update one ManagedAiUsage
     * const managedAiUsage = await prisma.managedAiUsage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ManagedAiUsageUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, ManagedAiUsageUpdateArgs<ExtArgs>>
    ): Prisma__ManagedAiUsageClient<$Result.GetResult<Prisma.$ManagedAiUsagePayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more ManagedAiUsages.
     * @param {ManagedAiUsageDeleteManyArgs} args - Arguments to filter ManagedAiUsages to delete.
     * @example
     * // Delete a few ManagedAiUsages
     * const { count } = await prisma.managedAiUsage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ManagedAiUsageDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ManagedAiUsageDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ManagedAiUsages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagedAiUsageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ManagedAiUsages
     * const managedAiUsage = await prisma.managedAiUsage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ManagedAiUsageUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, ManagedAiUsageUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ManagedAiUsage.
     * @param {ManagedAiUsageUpsertArgs} args - Arguments to update or create a ManagedAiUsage.
     * @example
     * // Update or create a ManagedAiUsage
     * const managedAiUsage = await prisma.managedAiUsage.upsert({
     *   create: {
     *     // ... data to create a ManagedAiUsage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ManagedAiUsage we want to update
     *   }
     * })
    **/
    upsert<T extends ManagedAiUsageUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, ManagedAiUsageUpsertArgs<ExtArgs>>
    ): Prisma__ManagedAiUsageClient<$Result.GetResult<Prisma.$ManagedAiUsagePayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of ManagedAiUsages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagedAiUsageCountArgs} args - Arguments to filter ManagedAiUsages to count.
     * @example
     * // Count the number of ManagedAiUsages
     * const count = await prisma.managedAiUsage.count({
     *   where: {
     *     // ... the filter for the ManagedAiUsages we want to count
     *   }
     * })
    **/
    count<T extends ManagedAiUsageCountArgs>(
      args?: Subset<T, ManagedAiUsageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ManagedAiUsageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ManagedAiUsage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagedAiUsageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ManagedAiUsageAggregateArgs>(args: Subset<T, ManagedAiUsageAggregateArgs>): Prisma.PrismaPromise<GetManagedAiUsageAggregateType<T>>

    /**
     * Group by ManagedAiUsage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagedAiUsageGroupByArgs} args - Group by arguments.
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
      T extends ManagedAiUsageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ManagedAiUsageGroupByArgs['orderBy'] }
        : { orderBy?: ManagedAiUsageGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ManagedAiUsageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetManagedAiUsageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ManagedAiUsage model
   */
  readonly fields: ManagedAiUsageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ManagedAiUsage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ManagedAiUsageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ManagedAiUsage model
   */ 
  interface ManagedAiUsageFieldRefs {
    readonly id: FieldRef<"ManagedAiUsage", 'String'>
    readonly userId: FieldRef<"ManagedAiUsage", 'String'>
    readonly featureKey: FieldRef<"ManagedAiUsage", 'String'>
    readonly periodKey: FieldRef<"ManagedAiUsage", 'String'>
    readonly usedCount: FieldRef<"ManagedAiUsage", 'Int'>
    readonly limitCount: FieldRef<"ManagedAiUsage", 'Int'>
    readonly createdAt: FieldRef<"ManagedAiUsage", 'DateTime'>
    readonly updatedAt: FieldRef<"ManagedAiUsage", 'DateTime'>
  }
    

  // Custom InputTypes

  /**
   * ManagedAiUsage findUnique
   */
  export type ManagedAiUsageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagedAiUsage
     */
    select?: ManagedAiUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ManagedAiUsageInclude<ExtArgs> | null
    /**
     * Filter, which ManagedAiUsage to fetch.
     */
    where: ManagedAiUsageWhereUniqueInput
  }


  /**
   * ManagedAiUsage findUniqueOrThrow
   */
  export type ManagedAiUsageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagedAiUsage
     */
    select?: ManagedAiUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ManagedAiUsageInclude<ExtArgs> | null
    /**
     * Filter, which ManagedAiUsage to fetch.
     */
    where: ManagedAiUsageWhereUniqueInput
  }


  /**
   * ManagedAiUsage findFirst
   */
  export type ManagedAiUsageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagedAiUsage
     */
    select?: ManagedAiUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ManagedAiUsageInclude<ExtArgs> | null
    /**
     * Filter, which ManagedAiUsage to fetch.
     */
    where?: ManagedAiUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManagedAiUsages to fetch.
     */
    orderBy?: ManagedAiUsageOrderByWithRelationInput | ManagedAiUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ManagedAiUsages.
     */
    cursor?: ManagedAiUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManagedAiUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManagedAiUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ManagedAiUsages.
     */
    distinct?: ManagedAiUsageScalarFieldEnum | ManagedAiUsageScalarFieldEnum[]
  }


  /**
   * ManagedAiUsage findFirstOrThrow
   */
  export type ManagedAiUsageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagedAiUsage
     */
    select?: ManagedAiUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ManagedAiUsageInclude<ExtArgs> | null
    /**
     * Filter, which ManagedAiUsage to fetch.
     */
    where?: ManagedAiUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManagedAiUsages to fetch.
     */
    orderBy?: ManagedAiUsageOrderByWithRelationInput | ManagedAiUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ManagedAiUsages.
     */
    cursor?: ManagedAiUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManagedAiUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManagedAiUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ManagedAiUsages.
     */
    distinct?: ManagedAiUsageScalarFieldEnum | ManagedAiUsageScalarFieldEnum[]
  }


  /**
   * ManagedAiUsage findMany
   */
  export type ManagedAiUsageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagedAiUsage
     */
    select?: ManagedAiUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ManagedAiUsageInclude<ExtArgs> | null
    /**
     * Filter, which ManagedAiUsages to fetch.
     */
    where?: ManagedAiUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManagedAiUsages to fetch.
     */
    orderBy?: ManagedAiUsageOrderByWithRelationInput | ManagedAiUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ManagedAiUsages.
     */
    cursor?: ManagedAiUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManagedAiUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManagedAiUsages.
     */
    skip?: number
    distinct?: ManagedAiUsageScalarFieldEnum | ManagedAiUsageScalarFieldEnum[]
  }


  /**
   * ManagedAiUsage create
   */
  export type ManagedAiUsageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagedAiUsage
     */
    select?: ManagedAiUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ManagedAiUsageInclude<ExtArgs> | null
    /**
     * The data needed to create a ManagedAiUsage.
     */
    data: XOR<ManagedAiUsageCreateInput, ManagedAiUsageUncheckedCreateInput>
  }


  /**
   * ManagedAiUsage createMany
   */
  export type ManagedAiUsageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ManagedAiUsages.
     */
    data: ManagedAiUsageCreateManyInput | ManagedAiUsageCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * ManagedAiUsage update
   */
  export type ManagedAiUsageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagedAiUsage
     */
    select?: ManagedAiUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ManagedAiUsageInclude<ExtArgs> | null
    /**
     * The data needed to update a ManagedAiUsage.
     */
    data: XOR<ManagedAiUsageUpdateInput, ManagedAiUsageUncheckedUpdateInput>
    /**
     * Choose, which ManagedAiUsage to update.
     */
    where: ManagedAiUsageWhereUniqueInput
  }


  /**
   * ManagedAiUsage updateMany
   */
  export type ManagedAiUsageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ManagedAiUsages.
     */
    data: XOR<ManagedAiUsageUpdateManyMutationInput, ManagedAiUsageUncheckedUpdateManyInput>
    /**
     * Filter which ManagedAiUsages to update
     */
    where?: ManagedAiUsageWhereInput
  }


  /**
   * ManagedAiUsage upsert
   */
  export type ManagedAiUsageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagedAiUsage
     */
    select?: ManagedAiUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ManagedAiUsageInclude<ExtArgs> | null
    /**
     * The filter to search for the ManagedAiUsage to update in case it exists.
     */
    where: ManagedAiUsageWhereUniqueInput
    /**
     * In case the ManagedAiUsage found by the `where` argument doesn't exist, create a new ManagedAiUsage with this data.
     */
    create: XOR<ManagedAiUsageCreateInput, ManagedAiUsageUncheckedCreateInput>
    /**
     * In case the ManagedAiUsage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ManagedAiUsageUpdateInput, ManagedAiUsageUncheckedUpdateInput>
  }


  /**
   * ManagedAiUsage delete
   */
  export type ManagedAiUsageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagedAiUsage
     */
    select?: ManagedAiUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ManagedAiUsageInclude<ExtArgs> | null
    /**
     * Filter which ManagedAiUsage to delete.
     */
    where: ManagedAiUsageWhereUniqueInput
  }


  /**
   * ManagedAiUsage deleteMany
   */
  export type ManagedAiUsageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ManagedAiUsages to delete
     */
    where?: ManagedAiUsageWhereInput
  }


  /**
   * ManagedAiUsage without action
   */
  export type ManagedAiUsageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagedAiUsage
     */
    select?: ManagedAiUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ManagedAiUsageInclude<ExtArgs> | null
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
    wechatOpenId: 'wechatOpenId',
    wechatUnionId: 'wechatUnionId',
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


  export const UserSubscriptionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    trialExpiresAt: 'trialExpiresAt',
    basePlanType: 'basePlanType',
    baseExpiresAt: 'baseExpiresAt',
    aiPlanType: 'aiPlanType',
    aiExpiresAt: 'aiExpiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserSubscriptionScalarFieldEnum = (typeof UserSubscriptionScalarFieldEnum)[keyof typeof UserSubscriptionScalarFieldEnum]


  export const PaymentOrderScalarFieldEnum: {
    id: 'id',
    bizId: 'bizId',
    sessionId: 'sessionId',
    userId: 'userId',
    planCode: 'planCode',
    paymentProductId: 'paymentProductId',
    amount: 'amount',
    status: 'status',
    paidAt: 'paidAt',
    activatedAt: 'activatedAt',
    rawPlatformPayload: 'rawPlatformPayload',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PaymentOrderScalarFieldEnum = (typeof PaymentOrderScalarFieldEnum)[keyof typeof PaymentOrderScalarFieldEnum]


  export const ManagedAiUsageScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    featureKey: 'featureKey',
    periodKey: 'periodKey',
    usedCount: 'usedCount',
    limitCount: 'limitCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ManagedAiUsageScalarFieldEnum = (typeof ManagedAiUsageScalarFieldEnum)[keyof typeof ManagedAiUsageScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


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


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


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
   * Reference to a field of type 'SafetyLevel'
   */
  export type EnumSafetyLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SafetyLevel'>
    


  /**
   * Reference to a field of type 'SafetyLevel[]'
   */
  export type ListEnumSafetyLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SafetyLevel[]'>
    


  /**
   * Reference to a field of type 'SubscriptionPlanType'
   */
  export type EnumSubscriptionPlanTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionPlanType'>
    


  /**
   * Reference to a field of type 'SubscriptionPlanType[]'
   */
  export type ListEnumSubscriptionPlanTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionPlanType[]'>
    


  /**
   * Reference to a field of type 'SubscriptionPlanCode'
   */
  export type EnumSubscriptionPlanCodeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionPlanCode'>
    


  /**
   * Reference to a field of type 'SubscriptionPlanCode[]'
   */
  export type ListEnumSubscriptionPlanCodeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionPlanCode[]'>
    


  /**
   * Reference to a field of type 'PaymentOrderStatus'
   */
  export type EnumPaymentOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentOrderStatus'>
    


  /**
   * Reference to a field of type 'PaymentOrderStatus[]'
   */
  export type ListEnumPaymentOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentOrderStatus[]'>
    


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
    wechatOpenId?: StringNullableFilter<"User"> | string | null
    wechatUnionId?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sshConnections?: SSHConnectionListRelationFilter
    commandLogs?: CommandLogListRelationFilter
    userSettings?: XOR<UserSettingsNullableRelationFilter, UserSettingsWhereInput> | null
    subscription?: XOR<UserSubscriptionNullableRelationFilter, UserSubscriptionWhereInput> | null
    paymentOrders?: PaymentOrderListRelationFilter
    managedAiUsages?: ManagedAiUsageListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    email?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    wechatOpenId?: SortOrderInput | SortOrder
    wechatUnionId?: SortOrderInput | SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sshConnections?: SSHConnectionOrderByRelationAggregateInput
    commandLogs?: CommandLogOrderByRelationAggregateInput
    userSettings?: UserSettingsOrderByWithRelationInput
    subscription?: UserSubscriptionOrderByWithRelationInput
    paymentOrders?: PaymentOrderOrderByRelationAggregateInput
    managedAiUsages?: ManagedAiUsageOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    uuid?: string
    email?: string
    username?: string
    wechatOpenId?: string
    wechatUnionId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sshConnections?: SSHConnectionListRelationFilter
    commandLogs?: CommandLogListRelationFilter
    userSettings?: XOR<UserSettingsNullableRelationFilter, UserSettingsWhereInput> | null
    subscription?: XOR<UserSubscriptionNullableRelationFilter, UserSubscriptionWhereInput> | null
    paymentOrders?: PaymentOrderListRelationFilter
    managedAiUsages?: ManagedAiUsageListRelationFilter
  }, "id" | "uuid" | "email" | "username" | "wechatOpenId" | "wechatUnionId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    email?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    wechatOpenId?: SortOrderInput | SortOrder
    wechatUnionId?: SortOrderInput | SortOrder
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
    wechatOpenId?: StringNullableWithAggregatesFilter<"User"> | string | null
    wechatUnionId?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
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
    data?: JsonFilter<"UserSettings">
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
    data?: JsonFilter<"UserSettings">
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
    data?: JsonWithAggregatesFilter<"UserSettings">
    createdAt?: DateTimeWithAggregatesFilter<"UserSettings"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserSettings"> | Date | string
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
    userId?: StringFilter<"SSHConnection"> | string
    user?: XOR<UserRelationFilter, UserWhereInput>
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
    userId?: StringFilter<"SSHConnection"> | string
    user?: XOR<UserRelationFilter, UserWhereInput>
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

  export type UserSubscriptionWhereInput = {
    AND?: UserSubscriptionWhereInput | UserSubscriptionWhereInput[]
    OR?: UserSubscriptionWhereInput[]
    NOT?: UserSubscriptionWhereInput | UserSubscriptionWhereInput[]
    id?: StringFilter<"UserSubscription"> | string
    userId?: StringFilter<"UserSubscription"> | string
    trialExpiresAt?: DateTimeNullableFilter<"UserSubscription"> | Date | string | null
    basePlanType?: EnumSubscriptionPlanTypeNullableFilter<"UserSubscription"> | $Enums.SubscriptionPlanType | null
    baseExpiresAt?: DateTimeNullableFilter<"UserSubscription"> | Date | string | null
    aiPlanType?: EnumSubscriptionPlanTypeNullableFilter<"UserSubscription"> | $Enums.SubscriptionPlanType | null
    aiExpiresAt?: DateTimeNullableFilter<"UserSubscription"> | Date | string | null
    createdAt?: DateTimeFilter<"UserSubscription"> | Date | string
    updatedAt?: DateTimeFilter<"UserSubscription"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type UserSubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    trialExpiresAt?: SortOrderInput | SortOrder
    basePlanType?: SortOrderInput | SortOrder
    baseExpiresAt?: SortOrderInput | SortOrder
    aiPlanType?: SortOrderInput | SortOrder
    aiExpiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserSubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserSubscriptionWhereInput | UserSubscriptionWhereInput[]
    OR?: UserSubscriptionWhereInput[]
    NOT?: UserSubscriptionWhereInput | UserSubscriptionWhereInput[]
    trialExpiresAt?: DateTimeNullableFilter<"UserSubscription"> | Date | string | null
    basePlanType?: EnumSubscriptionPlanTypeNullableFilter<"UserSubscription"> | $Enums.SubscriptionPlanType | null
    baseExpiresAt?: DateTimeNullableFilter<"UserSubscription"> | Date | string | null
    aiPlanType?: EnumSubscriptionPlanTypeNullableFilter<"UserSubscription"> | $Enums.SubscriptionPlanType | null
    aiExpiresAt?: DateTimeNullableFilter<"UserSubscription"> | Date | string | null
    createdAt?: DateTimeFilter<"UserSubscription"> | Date | string
    updatedAt?: DateTimeFilter<"UserSubscription"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type UserSubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    trialExpiresAt?: SortOrderInput | SortOrder
    basePlanType?: SortOrderInput | SortOrder
    baseExpiresAt?: SortOrderInput | SortOrder
    aiPlanType?: SortOrderInput | SortOrder
    aiExpiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserSubscriptionCountOrderByAggregateInput
    _max?: UserSubscriptionMaxOrderByAggregateInput
    _min?: UserSubscriptionMinOrderByAggregateInput
  }

  export type UserSubscriptionScalarWhereWithAggregatesInput = {
    AND?: UserSubscriptionScalarWhereWithAggregatesInput | UserSubscriptionScalarWhereWithAggregatesInput[]
    OR?: UserSubscriptionScalarWhereWithAggregatesInput[]
    NOT?: UserSubscriptionScalarWhereWithAggregatesInput | UserSubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserSubscription"> | string
    userId?: StringWithAggregatesFilter<"UserSubscription"> | string
    trialExpiresAt?: DateTimeNullableWithAggregatesFilter<"UserSubscription"> | Date | string | null
    basePlanType?: EnumSubscriptionPlanTypeNullableWithAggregatesFilter<"UserSubscription"> | $Enums.SubscriptionPlanType | null
    baseExpiresAt?: DateTimeNullableWithAggregatesFilter<"UserSubscription"> | Date | string | null
    aiPlanType?: EnumSubscriptionPlanTypeNullableWithAggregatesFilter<"UserSubscription"> | $Enums.SubscriptionPlanType | null
    aiExpiresAt?: DateTimeNullableWithAggregatesFilter<"UserSubscription"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"UserSubscription"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserSubscription"> | Date | string
  }

  export type PaymentOrderWhereInput = {
    AND?: PaymentOrderWhereInput | PaymentOrderWhereInput[]
    OR?: PaymentOrderWhereInput[]
    NOT?: PaymentOrderWhereInput | PaymentOrderWhereInput[]
    id?: StringFilter<"PaymentOrder"> | string
    bizId?: StringFilter<"PaymentOrder"> | string
    sessionId?: StringFilter<"PaymentOrder"> | string
    userId?: StringFilter<"PaymentOrder"> | string
    planCode?: EnumSubscriptionPlanCodeFilter<"PaymentOrder"> | $Enums.SubscriptionPlanCode
    paymentProductId?: StringFilter<"PaymentOrder"> | string
    amount?: IntFilter<"PaymentOrder"> | number
    status?: EnumPaymentOrderStatusFilter<"PaymentOrder"> | $Enums.PaymentOrderStatus
    paidAt?: DateTimeNullableFilter<"PaymentOrder"> | Date | string | null
    activatedAt?: DateTimeNullableFilter<"PaymentOrder"> | Date | string | null
    rawPlatformPayload?: JsonNullableFilter<"PaymentOrder">
    createdAt?: DateTimeFilter<"PaymentOrder"> | Date | string
    updatedAt?: DateTimeFilter<"PaymentOrder"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type PaymentOrderOrderByWithRelationInput = {
    id?: SortOrder
    bizId?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    planCode?: SortOrder
    paymentProductId?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paidAt?: SortOrderInput | SortOrder
    activatedAt?: SortOrderInput | SortOrder
    rawPlatformPayload?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PaymentOrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    bizId?: string
    sessionId?: string
    AND?: PaymentOrderWhereInput | PaymentOrderWhereInput[]
    OR?: PaymentOrderWhereInput[]
    NOT?: PaymentOrderWhereInput | PaymentOrderWhereInput[]
    userId?: StringFilter<"PaymentOrder"> | string
    planCode?: EnumSubscriptionPlanCodeFilter<"PaymentOrder"> | $Enums.SubscriptionPlanCode
    paymentProductId?: StringFilter<"PaymentOrder"> | string
    amount?: IntFilter<"PaymentOrder"> | number
    status?: EnumPaymentOrderStatusFilter<"PaymentOrder"> | $Enums.PaymentOrderStatus
    paidAt?: DateTimeNullableFilter<"PaymentOrder"> | Date | string | null
    activatedAt?: DateTimeNullableFilter<"PaymentOrder"> | Date | string | null
    rawPlatformPayload?: JsonNullableFilter<"PaymentOrder">
    createdAt?: DateTimeFilter<"PaymentOrder"> | Date | string
    updatedAt?: DateTimeFilter<"PaymentOrder"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "bizId" | "sessionId">

  export type PaymentOrderOrderByWithAggregationInput = {
    id?: SortOrder
    bizId?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    planCode?: SortOrder
    paymentProductId?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paidAt?: SortOrderInput | SortOrder
    activatedAt?: SortOrderInput | SortOrder
    rawPlatformPayload?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PaymentOrderCountOrderByAggregateInput
    _avg?: PaymentOrderAvgOrderByAggregateInput
    _max?: PaymentOrderMaxOrderByAggregateInput
    _min?: PaymentOrderMinOrderByAggregateInput
    _sum?: PaymentOrderSumOrderByAggregateInput
  }

  export type PaymentOrderScalarWhereWithAggregatesInput = {
    AND?: PaymentOrderScalarWhereWithAggregatesInput | PaymentOrderScalarWhereWithAggregatesInput[]
    OR?: PaymentOrderScalarWhereWithAggregatesInput[]
    NOT?: PaymentOrderScalarWhereWithAggregatesInput | PaymentOrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PaymentOrder"> | string
    bizId?: StringWithAggregatesFilter<"PaymentOrder"> | string
    sessionId?: StringWithAggregatesFilter<"PaymentOrder"> | string
    userId?: StringWithAggregatesFilter<"PaymentOrder"> | string
    planCode?: EnumSubscriptionPlanCodeWithAggregatesFilter<"PaymentOrder"> | $Enums.SubscriptionPlanCode
    paymentProductId?: StringWithAggregatesFilter<"PaymentOrder"> | string
    amount?: IntWithAggregatesFilter<"PaymentOrder"> | number
    status?: EnumPaymentOrderStatusWithAggregatesFilter<"PaymentOrder"> | $Enums.PaymentOrderStatus
    paidAt?: DateTimeNullableWithAggregatesFilter<"PaymentOrder"> | Date | string | null
    activatedAt?: DateTimeNullableWithAggregatesFilter<"PaymentOrder"> | Date | string | null
    rawPlatformPayload?: JsonNullableWithAggregatesFilter<"PaymentOrder">
    createdAt?: DateTimeWithAggregatesFilter<"PaymentOrder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PaymentOrder"> | Date | string
  }

  export type ManagedAiUsageWhereInput = {
    AND?: ManagedAiUsageWhereInput | ManagedAiUsageWhereInput[]
    OR?: ManagedAiUsageWhereInput[]
    NOT?: ManagedAiUsageWhereInput | ManagedAiUsageWhereInput[]
    id?: StringFilter<"ManagedAiUsage"> | string
    userId?: StringFilter<"ManagedAiUsage"> | string
    featureKey?: StringFilter<"ManagedAiUsage"> | string
    periodKey?: StringFilter<"ManagedAiUsage"> | string
    usedCount?: IntFilter<"ManagedAiUsage"> | number
    limitCount?: IntFilter<"ManagedAiUsage"> | number
    createdAt?: DateTimeFilter<"ManagedAiUsage"> | Date | string
    updatedAt?: DateTimeFilter<"ManagedAiUsage"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type ManagedAiUsageOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    featureKey?: SortOrder
    periodKey?: SortOrder
    usedCount?: SortOrder
    limitCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ManagedAiUsageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_featureKey_periodKey?: ManagedAiUsageUserIdFeatureKeyPeriodKeyCompoundUniqueInput
    AND?: ManagedAiUsageWhereInput | ManagedAiUsageWhereInput[]
    OR?: ManagedAiUsageWhereInput[]
    NOT?: ManagedAiUsageWhereInput | ManagedAiUsageWhereInput[]
    userId?: StringFilter<"ManagedAiUsage"> | string
    featureKey?: StringFilter<"ManagedAiUsage"> | string
    periodKey?: StringFilter<"ManagedAiUsage"> | string
    usedCount?: IntFilter<"ManagedAiUsage"> | number
    limitCount?: IntFilter<"ManagedAiUsage"> | number
    createdAt?: DateTimeFilter<"ManagedAiUsage"> | Date | string
    updatedAt?: DateTimeFilter<"ManagedAiUsage"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "userId_featureKey_periodKey">

  export type ManagedAiUsageOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    featureKey?: SortOrder
    periodKey?: SortOrder
    usedCount?: SortOrder
    limitCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ManagedAiUsageCountOrderByAggregateInput
    _avg?: ManagedAiUsageAvgOrderByAggregateInput
    _max?: ManagedAiUsageMaxOrderByAggregateInput
    _min?: ManagedAiUsageMinOrderByAggregateInput
    _sum?: ManagedAiUsageSumOrderByAggregateInput
  }

  export type ManagedAiUsageScalarWhereWithAggregatesInput = {
    AND?: ManagedAiUsageScalarWhereWithAggregatesInput | ManagedAiUsageScalarWhereWithAggregatesInput[]
    OR?: ManagedAiUsageScalarWhereWithAggregatesInput[]
    NOT?: ManagedAiUsageScalarWhereWithAggregatesInput | ManagedAiUsageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ManagedAiUsage"> | string
    userId?: StringWithAggregatesFilter<"ManagedAiUsage"> | string
    featureKey?: StringWithAggregatesFilter<"ManagedAiUsage"> | string
    periodKey?: StringWithAggregatesFilter<"ManagedAiUsage"> | string
    usedCount?: IntWithAggregatesFilter<"ManagedAiUsage"> | number
    limitCount?: IntWithAggregatesFilter<"ManagedAiUsage"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ManagedAiUsage"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ManagedAiUsage"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsCreateNestedOneWithoutUserInput
    subscription?: UserSubscriptionCreateNestedOneWithoutUserInput
    paymentOrders?: PaymentOrderCreateNestedManyWithoutUserInput
    managedAiUsages?: ManagedAiUsageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsUncheckedCreateNestedOneWithoutUserInput
    subscription?: UserSubscriptionUncheckedCreateNestedOneWithoutUserInput
    paymentOrders?: PaymentOrderUncheckedCreateNestedManyWithoutUserInput
    managedAiUsages?: ManagedAiUsageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUpdateOneWithoutUserNestedInput
    subscription?: UserSubscriptionUpdateOneWithoutUserNestedInput
    paymentOrders?: PaymentOrderUpdateManyWithoutUserNestedInput
    managedAiUsages?: ManagedAiUsageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUncheckedUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUncheckedUpdateOneWithoutUserNestedInput
    subscription?: UserSubscriptionUncheckedUpdateOneWithoutUserNestedInput
    paymentOrders?: PaymentOrderUncheckedUpdateManyWithoutUserNestedInput
    managedAiUsages?: ManagedAiUsageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
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
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSettingsCreateInput = {
    id?: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutUserSettingsInput
  }

  export type UserSettingsUncheckedCreateInput = {
    id?: string
    userId: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUserSettingsNestedInput
  }

  export type UserSettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSettingsCreateManyInput = {
    id?: string
    userId: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SSHConnectionCreateInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
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
    commandLogs?: CommandLogCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionUncheckedCreateInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
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
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
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
    commandLogs?: CommandLogUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
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
    commandLogs?: CommandLogUncheckedUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionCreateManyInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
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

  export type SSHConnectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
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

  export type UserSubscriptionCreateInput = {
    id?: string
    trialExpiresAt?: Date | string | null
    basePlanType?: $Enums.SubscriptionPlanType | null
    baseExpiresAt?: Date | string | null
    aiPlanType?: $Enums.SubscriptionPlanType | null
    aiExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSubscriptionInput
  }

  export type UserSubscriptionUncheckedCreateInput = {
    id?: string
    userId: string
    trialExpiresAt?: Date | string | null
    basePlanType?: $Enums.SubscriptionPlanType | null
    baseExpiresAt?: Date | string | null
    aiPlanType?: $Enums.SubscriptionPlanType | null
    aiExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    trialExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    basePlanType?: NullableEnumSubscriptionPlanTypeFieldUpdateOperationsInput | $Enums.SubscriptionPlanType | null
    baseExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    aiPlanType?: NullableEnumSubscriptionPlanTypeFieldUpdateOperationsInput | $Enums.SubscriptionPlanType | null
    aiExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSubscriptionNestedInput
  }

  export type UserSubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    trialExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    basePlanType?: NullableEnumSubscriptionPlanTypeFieldUpdateOperationsInput | $Enums.SubscriptionPlanType | null
    baseExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    aiPlanType?: NullableEnumSubscriptionPlanTypeFieldUpdateOperationsInput | $Enums.SubscriptionPlanType | null
    aiExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSubscriptionCreateManyInput = {
    id?: string
    userId: string
    trialExpiresAt?: Date | string | null
    basePlanType?: $Enums.SubscriptionPlanType | null
    baseExpiresAt?: Date | string | null
    aiPlanType?: $Enums.SubscriptionPlanType | null
    aiExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    trialExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    basePlanType?: NullableEnumSubscriptionPlanTypeFieldUpdateOperationsInput | $Enums.SubscriptionPlanType | null
    baseExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    aiPlanType?: NullableEnumSubscriptionPlanTypeFieldUpdateOperationsInput | $Enums.SubscriptionPlanType | null
    aiExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    trialExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    basePlanType?: NullableEnumSubscriptionPlanTypeFieldUpdateOperationsInput | $Enums.SubscriptionPlanType | null
    baseExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    aiPlanType?: NullableEnumSubscriptionPlanTypeFieldUpdateOperationsInput | $Enums.SubscriptionPlanType | null
    aiExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentOrderCreateInput = {
    id?: string
    bizId: string
    sessionId: string
    planCode: $Enums.SubscriptionPlanCode
    paymentProductId: string
    amount: number
    status?: $Enums.PaymentOrderStatus
    paidAt?: Date | string | null
    activatedAt?: Date | string | null
    rawPlatformPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPaymentOrdersInput
  }

  export type PaymentOrderUncheckedCreateInput = {
    id?: string
    bizId: string
    sessionId: string
    userId: string
    planCode: $Enums.SubscriptionPlanCode
    paymentProductId: string
    amount: number
    status?: $Enums.PaymentOrderStatus
    paidAt?: Date | string | null
    activatedAt?: Date | string | null
    rawPlatformPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentOrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bizId?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    planCode?: EnumSubscriptionPlanCodeFieldUpdateOperationsInput | $Enums.SubscriptionPlanCode
    paymentProductId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    status?: EnumPaymentOrderStatusFieldUpdateOperationsInput | $Enums.PaymentOrderStatus
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawPlatformPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPaymentOrdersNestedInput
  }

  export type PaymentOrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bizId?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    planCode?: EnumSubscriptionPlanCodeFieldUpdateOperationsInput | $Enums.SubscriptionPlanCode
    paymentProductId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    status?: EnumPaymentOrderStatusFieldUpdateOperationsInput | $Enums.PaymentOrderStatus
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawPlatformPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentOrderCreateManyInput = {
    id?: string
    bizId: string
    sessionId: string
    userId: string
    planCode: $Enums.SubscriptionPlanCode
    paymentProductId: string
    amount: number
    status?: $Enums.PaymentOrderStatus
    paidAt?: Date | string | null
    activatedAt?: Date | string | null
    rawPlatformPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentOrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    bizId?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    planCode?: EnumSubscriptionPlanCodeFieldUpdateOperationsInput | $Enums.SubscriptionPlanCode
    paymentProductId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    status?: EnumPaymentOrderStatusFieldUpdateOperationsInput | $Enums.PaymentOrderStatus
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawPlatformPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentOrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    bizId?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    planCode?: EnumSubscriptionPlanCodeFieldUpdateOperationsInput | $Enums.SubscriptionPlanCode
    paymentProductId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    status?: EnumPaymentOrderStatusFieldUpdateOperationsInput | $Enums.PaymentOrderStatus
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawPlatformPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManagedAiUsageCreateInput = {
    id?: string
    featureKey: string
    periodKey: string
    usedCount?: number
    limitCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutManagedAiUsagesInput
  }

  export type ManagedAiUsageUncheckedCreateInput = {
    id?: string
    userId: string
    featureKey: string
    periodKey: string
    usedCount?: number
    limitCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ManagedAiUsageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    featureKey?: StringFieldUpdateOperationsInput | string
    periodKey?: StringFieldUpdateOperationsInput | string
    usedCount?: IntFieldUpdateOperationsInput | number
    limitCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutManagedAiUsagesNestedInput
  }

  export type ManagedAiUsageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    featureKey?: StringFieldUpdateOperationsInput | string
    periodKey?: StringFieldUpdateOperationsInput | string
    usedCount?: IntFieldUpdateOperationsInput | number
    limitCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManagedAiUsageCreateManyInput = {
    id?: string
    userId: string
    featureKey: string
    periodKey: string
    usedCount?: number
    limitCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ManagedAiUsageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    featureKey?: StringFieldUpdateOperationsInput | string
    periodKey?: StringFieldUpdateOperationsInput | string
    usedCount?: IntFieldUpdateOperationsInput | number
    limitCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManagedAiUsageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    featureKey?: StringFieldUpdateOperationsInput | string
    periodKey?: StringFieldUpdateOperationsInput | string
    usedCount?: IntFieldUpdateOperationsInput | number
    limitCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type UserSubscriptionNullableRelationFilter = {
    is?: UserSubscriptionWhereInput | null
    isNot?: UserSubscriptionWhereInput | null
  }

  export type PaymentOrderListRelationFilter = {
    every?: PaymentOrderWhereInput
    some?: PaymentOrderWhereInput
    none?: PaymentOrderWhereInput
  }

  export type ManagedAiUsageListRelationFilter = {
    every?: ManagedAiUsageWhereInput
    some?: ManagedAiUsageWhereInput
    none?: ManagedAiUsageWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SSHConnectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CommandLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PaymentOrderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ManagedAiUsageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    email?: SortOrder
    username?: SortOrder
    password?: SortOrder
    avatar?: SortOrder
    wechatOpenId?: SortOrder
    wechatUnionId?: SortOrder
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
    wechatOpenId?: SortOrder
    wechatUnionId?: SortOrder
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
    wechatOpenId?: SortOrder
    wechatUnionId?: SortOrder
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
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
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
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSettingsMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
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
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
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
    userId?: SortOrder
  }

  export type SSHConnectionSumOrderByAggregateInput = {
    port?: SortOrder
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

  export type EnumSubscriptionPlanTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionPlanType | EnumSubscriptionPlanTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.SubscriptionPlanType[] | ListEnumSubscriptionPlanTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.SubscriptionPlanType[] | ListEnumSubscriptionPlanTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSubscriptionPlanTypeNullableFilter<$PrismaModel> | $Enums.SubscriptionPlanType | null
  }

  export type UserSubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    trialExpiresAt?: SortOrder
    basePlanType?: SortOrder
    baseExpiresAt?: SortOrder
    aiPlanType?: SortOrder
    aiExpiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    trialExpiresAt?: SortOrder
    basePlanType?: SortOrder
    baseExpiresAt?: SortOrder
    aiPlanType?: SortOrder
    aiExpiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    trialExpiresAt?: SortOrder
    basePlanType?: SortOrder
    baseExpiresAt?: SortOrder
    aiPlanType?: SortOrder
    aiExpiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumSubscriptionPlanTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionPlanType | EnumSubscriptionPlanTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.SubscriptionPlanType[] | ListEnumSubscriptionPlanTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.SubscriptionPlanType[] | ListEnumSubscriptionPlanTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSubscriptionPlanTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionPlanType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionPlanTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionPlanTypeNullableFilter<$PrismaModel>
  }

  export type EnumSubscriptionPlanCodeFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionPlanCode | EnumSubscriptionPlanCodeFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionPlanCode[] | ListEnumSubscriptionPlanCodeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionPlanCode[] | ListEnumSubscriptionPlanCodeFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionPlanCodeFilter<$PrismaModel> | $Enums.SubscriptionPlanCode
  }

  export type EnumPaymentOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentOrderStatus | EnumPaymentOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentOrderStatus[] | ListEnumPaymentOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentOrderStatus[] | ListEnumPaymentOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentOrderStatusFilter<$PrismaModel> | $Enums.PaymentOrderStatus
  }

  export type PaymentOrderCountOrderByAggregateInput = {
    id?: SortOrder
    bizId?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    planCode?: SortOrder
    paymentProductId?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paidAt?: SortOrder
    activatedAt?: SortOrder
    rawPlatformPayload?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentOrderAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PaymentOrderMaxOrderByAggregateInput = {
    id?: SortOrder
    bizId?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    planCode?: SortOrder
    paymentProductId?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paidAt?: SortOrder
    activatedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentOrderMinOrderByAggregateInput = {
    id?: SortOrder
    bizId?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    planCode?: SortOrder
    paymentProductId?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paidAt?: SortOrder
    activatedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentOrderSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type EnumSubscriptionPlanCodeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionPlanCode | EnumSubscriptionPlanCodeFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionPlanCode[] | ListEnumSubscriptionPlanCodeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionPlanCode[] | ListEnumSubscriptionPlanCodeFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionPlanCodeWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionPlanCode
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionPlanCodeFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionPlanCodeFilter<$PrismaModel>
  }

  export type EnumPaymentOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentOrderStatus | EnumPaymentOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentOrderStatus[] | ListEnumPaymentOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentOrderStatus[] | ListEnumPaymentOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentOrderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentOrderStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentOrderStatusFilter<$PrismaModel>
  }

  export type ManagedAiUsageUserIdFeatureKeyPeriodKeyCompoundUniqueInput = {
    userId: string
    featureKey: string
    periodKey: string
  }

  export type ManagedAiUsageCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    featureKey?: SortOrder
    periodKey?: SortOrder
    usedCount?: SortOrder
    limitCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ManagedAiUsageAvgOrderByAggregateInput = {
    usedCount?: SortOrder
    limitCount?: SortOrder
  }

  export type ManagedAiUsageMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    featureKey?: SortOrder
    periodKey?: SortOrder
    usedCount?: SortOrder
    limitCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ManagedAiUsageMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    featureKey?: SortOrder
    periodKey?: SortOrder
    usedCount?: SortOrder
    limitCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ManagedAiUsageSumOrderByAggregateInput = {
    usedCount?: SortOrder
    limitCount?: SortOrder
  }

  export type SSHConnectionCreateNestedManyWithoutUserInput = {
    create?: XOR<SSHConnectionCreateWithoutUserInput, SSHConnectionUncheckedCreateWithoutUserInput> | SSHConnectionCreateWithoutUserInput[] | SSHConnectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutUserInput | SSHConnectionCreateOrConnectWithoutUserInput[]
    createMany?: SSHConnectionCreateManyUserInputEnvelope
    connect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
  }

  export type CommandLogCreateNestedManyWithoutUserInput = {
    create?: XOR<CommandLogCreateWithoutUserInput, CommandLogUncheckedCreateWithoutUserInput> | CommandLogCreateWithoutUserInput[] | CommandLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommandLogCreateOrConnectWithoutUserInput | CommandLogCreateOrConnectWithoutUserInput[]
    createMany?: CommandLogCreateManyUserInputEnvelope
    connect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
  }

  export type UserSettingsCreateNestedOneWithoutUserInput = {
    create?: XOR<UserSettingsCreateWithoutUserInput, UserSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSettingsCreateOrConnectWithoutUserInput
    connect?: UserSettingsWhereUniqueInput
  }

  export type UserSubscriptionCreateNestedOneWithoutUserInput = {
    create?: XOR<UserSubscriptionCreateWithoutUserInput, UserSubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSubscriptionCreateOrConnectWithoutUserInput
    connect?: UserSubscriptionWhereUniqueInput
  }

  export type PaymentOrderCreateNestedManyWithoutUserInput = {
    create?: XOR<PaymentOrderCreateWithoutUserInput, PaymentOrderUncheckedCreateWithoutUserInput> | PaymentOrderCreateWithoutUserInput[] | PaymentOrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentOrderCreateOrConnectWithoutUserInput | PaymentOrderCreateOrConnectWithoutUserInput[]
    createMany?: PaymentOrderCreateManyUserInputEnvelope
    connect?: PaymentOrderWhereUniqueInput | PaymentOrderWhereUniqueInput[]
  }

  export type ManagedAiUsageCreateNestedManyWithoutUserInput = {
    create?: XOR<ManagedAiUsageCreateWithoutUserInput, ManagedAiUsageUncheckedCreateWithoutUserInput> | ManagedAiUsageCreateWithoutUserInput[] | ManagedAiUsageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ManagedAiUsageCreateOrConnectWithoutUserInput | ManagedAiUsageCreateOrConnectWithoutUserInput[]
    createMany?: ManagedAiUsageCreateManyUserInputEnvelope
    connect?: ManagedAiUsageWhereUniqueInput | ManagedAiUsageWhereUniqueInput[]
  }

  export type SSHConnectionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SSHConnectionCreateWithoutUserInput, SSHConnectionUncheckedCreateWithoutUserInput> | SSHConnectionCreateWithoutUserInput[] | SSHConnectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SSHConnectionCreateOrConnectWithoutUserInput | SSHConnectionCreateOrConnectWithoutUserInput[]
    createMany?: SSHConnectionCreateManyUserInputEnvelope
    connect?: SSHConnectionWhereUniqueInput | SSHConnectionWhereUniqueInput[]
  }

  export type CommandLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CommandLogCreateWithoutUserInput, CommandLogUncheckedCreateWithoutUserInput> | CommandLogCreateWithoutUserInput[] | CommandLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommandLogCreateOrConnectWithoutUserInput | CommandLogCreateOrConnectWithoutUserInput[]
    createMany?: CommandLogCreateManyUserInputEnvelope
    connect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
  }

  export type UserSettingsUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UserSettingsCreateWithoutUserInput, UserSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSettingsCreateOrConnectWithoutUserInput
    connect?: UserSettingsWhereUniqueInput
  }

  export type UserSubscriptionUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UserSubscriptionCreateWithoutUserInput, UserSubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSubscriptionCreateOrConnectWithoutUserInput
    connect?: UserSubscriptionWhereUniqueInput
  }

  export type PaymentOrderUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PaymentOrderCreateWithoutUserInput, PaymentOrderUncheckedCreateWithoutUserInput> | PaymentOrderCreateWithoutUserInput[] | PaymentOrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentOrderCreateOrConnectWithoutUserInput | PaymentOrderCreateOrConnectWithoutUserInput[]
    createMany?: PaymentOrderCreateManyUserInputEnvelope
    connect?: PaymentOrderWhereUniqueInput | PaymentOrderWhereUniqueInput[]
  }

  export type ManagedAiUsageUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ManagedAiUsageCreateWithoutUserInput, ManagedAiUsageUncheckedCreateWithoutUserInput> | ManagedAiUsageCreateWithoutUserInput[] | ManagedAiUsageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ManagedAiUsageCreateOrConnectWithoutUserInput | ManagedAiUsageCreateOrConnectWithoutUserInput[]
    createMany?: ManagedAiUsageCreateManyUserInputEnvelope
    connect?: ManagedAiUsageWhereUniqueInput | ManagedAiUsageWhereUniqueInput[]
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

  export type UserSettingsUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserSettingsCreateWithoutUserInput, UserSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSettingsCreateOrConnectWithoutUserInput
    upsert?: UserSettingsUpsertWithoutUserInput
    disconnect?: UserSettingsWhereInput | boolean
    delete?: UserSettingsWhereInput | boolean
    connect?: UserSettingsWhereUniqueInput
    update?: XOR<XOR<UserSettingsUpdateToOneWithWhereWithoutUserInput, UserSettingsUpdateWithoutUserInput>, UserSettingsUncheckedUpdateWithoutUserInput>
  }

  export type UserSubscriptionUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserSubscriptionCreateWithoutUserInput, UserSubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSubscriptionCreateOrConnectWithoutUserInput
    upsert?: UserSubscriptionUpsertWithoutUserInput
    disconnect?: UserSubscriptionWhereInput | boolean
    delete?: UserSubscriptionWhereInput | boolean
    connect?: UserSubscriptionWhereUniqueInput
    update?: XOR<XOR<UserSubscriptionUpdateToOneWithWhereWithoutUserInput, UserSubscriptionUpdateWithoutUserInput>, UserSubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type PaymentOrderUpdateManyWithoutUserNestedInput = {
    create?: XOR<PaymentOrderCreateWithoutUserInput, PaymentOrderUncheckedCreateWithoutUserInput> | PaymentOrderCreateWithoutUserInput[] | PaymentOrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentOrderCreateOrConnectWithoutUserInput | PaymentOrderCreateOrConnectWithoutUserInput[]
    upsert?: PaymentOrderUpsertWithWhereUniqueWithoutUserInput | PaymentOrderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PaymentOrderCreateManyUserInputEnvelope
    set?: PaymentOrderWhereUniqueInput | PaymentOrderWhereUniqueInput[]
    disconnect?: PaymentOrderWhereUniqueInput | PaymentOrderWhereUniqueInput[]
    delete?: PaymentOrderWhereUniqueInput | PaymentOrderWhereUniqueInput[]
    connect?: PaymentOrderWhereUniqueInput | PaymentOrderWhereUniqueInput[]
    update?: PaymentOrderUpdateWithWhereUniqueWithoutUserInput | PaymentOrderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PaymentOrderUpdateManyWithWhereWithoutUserInput | PaymentOrderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PaymentOrderScalarWhereInput | PaymentOrderScalarWhereInput[]
  }

  export type ManagedAiUsageUpdateManyWithoutUserNestedInput = {
    create?: XOR<ManagedAiUsageCreateWithoutUserInput, ManagedAiUsageUncheckedCreateWithoutUserInput> | ManagedAiUsageCreateWithoutUserInput[] | ManagedAiUsageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ManagedAiUsageCreateOrConnectWithoutUserInput | ManagedAiUsageCreateOrConnectWithoutUserInput[]
    upsert?: ManagedAiUsageUpsertWithWhereUniqueWithoutUserInput | ManagedAiUsageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ManagedAiUsageCreateManyUserInputEnvelope
    set?: ManagedAiUsageWhereUniqueInput | ManagedAiUsageWhereUniqueInput[]
    disconnect?: ManagedAiUsageWhereUniqueInput | ManagedAiUsageWhereUniqueInput[]
    delete?: ManagedAiUsageWhereUniqueInput | ManagedAiUsageWhereUniqueInput[]
    connect?: ManagedAiUsageWhereUniqueInput | ManagedAiUsageWhereUniqueInput[]
    update?: ManagedAiUsageUpdateWithWhereUniqueWithoutUserInput | ManagedAiUsageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ManagedAiUsageUpdateManyWithWhereWithoutUserInput | ManagedAiUsageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ManagedAiUsageScalarWhereInput | ManagedAiUsageScalarWhereInput[]
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

  export type UserSettingsUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserSettingsCreateWithoutUserInput, UserSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSettingsCreateOrConnectWithoutUserInput
    upsert?: UserSettingsUpsertWithoutUserInput
    disconnect?: UserSettingsWhereInput | boolean
    delete?: UserSettingsWhereInput | boolean
    connect?: UserSettingsWhereUniqueInput
    update?: XOR<XOR<UserSettingsUpdateToOneWithWhereWithoutUserInput, UserSettingsUpdateWithoutUserInput>, UserSettingsUncheckedUpdateWithoutUserInput>
  }

  export type UserSubscriptionUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserSubscriptionCreateWithoutUserInput, UserSubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSubscriptionCreateOrConnectWithoutUserInput
    upsert?: UserSubscriptionUpsertWithoutUserInput
    disconnect?: UserSubscriptionWhereInput | boolean
    delete?: UserSubscriptionWhereInput | boolean
    connect?: UserSubscriptionWhereUniqueInput
    update?: XOR<XOR<UserSubscriptionUpdateToOneWithWhereWithoutUserInput, UserSubscriptionUpdateWithoutUserInput>, UserSubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type PaymentOrderUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PaymentOrderCreateWithoutUserInput, PaymentOrderUncheckedCreateWithoutUserInput> | PaymentOrderCreateWithoutUserInput[] | PaymentOrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentOrderCreateOrConnectWithoutUserInput | PaymentOrderCreateOrConnectWithoutUserInput[]
    upsert?: PaymentOrderUpsertWithWhereUniqueWithoutUserInput | PaymentOrderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PaymentOrderCreateManyUserInputEnvelope
    set?: PaymentOrderWhereUniqueInput | PaymentOrderWhereUniqueInput[]
    disconnect?: PaymentOrderWhereUniqueInput | PaymentOrderWhereUniqueInput[]
    delete?: PaymentOrderWhereUniqueInput | PaymentOrderWhereUniqueInput[]
    connect?: PaymentOrderWhereUniqueInput | PaymentOrderWhereUniqueInput[]
    update?: PaymentOrderUpdateWithWhereUniqueWithoutUserInput | PaymentOrderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PaymentOrderUpdateManyWithWhereWithoutUserInput | PaymentOrderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PaymentOrderScalarWhereInput | PaymentOrderScalarWhereInput[]
  }

  export type ManagedAiUsageUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ManagedAiUsageCreateWithoutUserInput, ManagedAiUsageUncheckedCreateWithoutUserInput> | ManagedAiUsageCreateWithoutUserInput[] | ManagedAiUsageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ManagedAiUsageCreateOrConnectWithoutUserInput | ManagedAiUsageCreateOrConnectWithoutUserInput[]
    upsert?: ManagedAiUsageUpsertWithWhereUniqueWithoutUserInput | ManagedAiUsageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ManagedAiUsageCreateManyUserInputEnvelope
    set?: ManagedAiUsageWhereUniqueInput | ManagedAiUsageWhereUniqueInput[]
    disconnect?: ManagedAiUsageWhereUniqueInput | ManagedAiUsageWhereUniqueInput[]
    delete?: ManagedAiUsageWhereUniqueInput | ManagedAiUsageWhereUniqueInput[]
    connect?: ManagedAiUsageWhereUniqueInput | ManagedAiUsageWhereUniqueInput[]
    update?: ManagedAiUsageUpdateWithWhereUniqueWithoutUserInput | ManagedAiUsageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ManagedAiUsageUpdateManyWithWhereWithoutUserInput | ManagedAiUsageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ManagedAiUsageScalarWhereInput | ManagedAiUsageScalarWhereInput[]
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

  export type UserCreateNestedOneWithoutSshConnectionsInput = {
    create?: XOR<UserCreateWithoutSshConnectionsInput, UserUncheckedCreateWithoutSshConnectionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSshConnectionsInput
    connect?: UserWhereUniqueInput
  }

  export type CommandLogCreateNestedManyWithoutSshConnectionInput = {
    create?: XOR<CommandLogCreateWithoutSshConnectionInput, CommandLogUncheckedCreateWithoutSshConnectionInput> | CommandLogCreateWithoutSshConnectionInput[] | CommandLogUncheckedCreateWithoutSshConnectionInput[]
    connectOrCreate?: CommandLogCreateOrConnectWithoutSshConnectionInput | CommandLogCreateOrConnectWithoutSshConnectionInput[]
    createMany?: CommandLogCreateManySshConnectionInputEnvelope
    connect?: CommandLogWhereUniqueInput | CommandLogWhereUniqueInput[]
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

  export type EnumSSHAuthTypeFieldUpdateOperationsInput = {
    set?: $Enums.SSHAuthType
  }

  export type EnumConnectionStatusFieldUpdateOperationsInput = {
    set?: $Enums.ConnectionStatus
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

  export type UserCreateNestedOneWithoutSubscriptionInput = {
    create?: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionInput
    connect?: UserWhereUniqueInput
  }

  export type NullableEnumSubscriptionPlanTypeFieldUpdateOperationsInput = {
    set?: $Enums.SubscriptionPlanType | null
  }

  export type UserUpdateOneRequiredWithoutSubscriptionNestedInput = {
    create?: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionInput
    upsert?: UserUpsertWithoutSubscriptionInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSubscriptionInput, UserUpdateWithoutSubscriptionInput>, UserUncheckedUpdateWithoutSubscriptionInput>
  }

  export type UserCreateNestedOneWithoutPaymentOrdersInput = {
    create?: XOR<UserCreateWithoutPaymentOrdersInput, UserUncheckedCreateWithoutPaymentOrdersInput>
    connectOrCreate?: UserCreateOrConnectWithoutPaymentOrdersInput
    connect?: UserWhereUniqueInput
  }

  export type EnumSubscriptionPlanCodeFieldUpdateOperationsInput = {
    set?: $Enums.SubscriptionPlanCode
  }

  export type EnumPaymentOrderStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaymentOrderStatus
  }

  export type UserUpdateOneRequiredWithoutPaymentOrdersNestedInput = {
    create?: XOR<UserCreateWithoutPaymentOrdersInput, UserUncheckedCreateWithoutPaymentOrdersInput>
    connectOrCreate?: UserCreateOrConnectWithoutPaymentOrdersInput
    upsert?: UserUpsertWithoutPaymentOrdersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPaymentOrdersInput, UserUpdateWithoutPaymentOrdersInput>, UserUncheckedUpdateWithoutPaymentOrdersInput>
  }

  export type UserCreateNestedOneWithoutManagedAiUsagesInput = {
    create?: XOR<UserCreateWithoutManagedAiUsagesInput, UserUncheckedCreateWithoutManagedAiUsagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutManagedAiUsagesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutManagedAiUsagesNestedInput = {
    create?: XOR<UserCreateWithoutManagedAiUsagesInput, UserUncheckedCreateWithoutManagedAiUsagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutManagedAiUsagesInput
    upsert?: UserUpsertWithoutManagedAiUsagesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutManagedAiUsagesInput, UserUpdateWithoutManagedAiUsagesInput>, UserUncheckedUpdateWithoutManagedAiUsagesInput>
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
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
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

  export type NestedEnumSubscriptionPlanTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionPlanType | EnumSubscriptionPlanTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.SubscriptionPlanType[] | ListEnumSubscriptionPlanTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.SubscriptionPlanType[] | ListEnumSubscriptionPlanTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSubscriptionPlanTypeNullableFilter<$PrismaModel> | $Enums.SubscriptionPlanType | null
  }

  export type NestedEnumSubscriptionPlanTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionPlanType | EnumSubscriptionPlanTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.SubscriptionPlanType[] | ListEnumSubscriptionPlanTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.SubscriptionPlanType[] | ListEnumSubscriptionPlanTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSubscriptionPlanTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionPlanType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionPlanTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionPlanTypeNullableFilter<$PrismaModel>
  }

  export type NestedEnumSubscriptionPlanCodeFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionPlanCode | EnumSubscriptionPlanCodeFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionPlanCode[] | ListEnumSubscriptionPlanCodeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionPlanCode[] | ListEnumSubscriptionPlanCodeFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionPlanCodeFilter<$PrismaModel> | $Enums.SubscriptionPlanCode
  }

  export type NestedEnumPaymentOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentOrderStatus | EnumPaymentOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentOrderStatus[] | ListEnumPaymentOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentOrderStatus[] | ListEnumPaymentOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentOrderStatusFilter<$PrismaModel> | $Enums.PaymentOrderStatus
  }

  export type NestedEnumSubscriptionPlanCodeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionPlanCode | EnumSubscriptionPlanCodeFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionPlanCode[] | ListEnumSubscriptionPlanCodeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionPlanCode[] | ListEnumSubscriptionPlanCodeFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionPlanCodeWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionPlanCode
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionPlanCodeFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionPlanCodeFilter<$PrismaModel>
  }

  export type NestedEnumPaymentOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentOrderStatus | EnumPaymentOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentOrderStatus[] | ListEnumPaymentOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentOrderStatus[] | ListEnumPaymentOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentOrderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentOrderStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentOrderStatusFilter<$PrismaModel>
  }

  export type SSHConnectionCreateWithoutUserInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
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
    commandLogs?: CommandLogCreateNestedManyWithoutSshConnectionInput
  }

  export type SSHConnectionUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
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

  export type UserSettingsCreateWithoutUserInput = {
    id?: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSettingsUncheckedCreateWithoutUserInput = {
    id?: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSettingsCreateOrConnectWithoutUserInput = {
    where: UserSettingsWhereUniqueInput
    create: XOR<UserSettingsCreateWithoutUserInput, UserSettingsUncheckedCreateWithoutUserInput>
  }

  export type UserSubscriptionCreateWithoutUserInput = {
    id?: string
    trialExpiresAt?: Date | string | null
    basePlanType?: $Enums.SubscriptionPlanType | null
    baseExpiresAt?: Date | string | null
    aiPlanType?: $Enums.SubscriptionPlanType | null
    aiExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSubscriptionUncheckedCreateWithoutUserInput = {
    id?: string
    trialExpiresAt?: Date | string | null
    basePlanType?: $Enums.SubscriptionPlanType | null
    baseExpiresAt?: Date | string | null
    aiPlanType?: $Enums.SubscriptionPlanType | null
    aiExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSubscriptionCreateOrConnectWithoutUserInput = {
    where: UserSubscriptionWhereUniqueInput
    create: XOR<UserSubscriptionCreateWithoutUserInput, UserSubscriptionUncheckedCreateWithoutUserInput>
  }

  export type PaymentOrderCreateWithoutUserInput = {
    id?: string
    bizId: string
    sessionId: string
    planCode: $Enums.SubscriptionPlanCode
    paymentProductId: string
    amount: number
    status?: $Enums.PaymentOrderStatus
    paidAt?: Date | string | null
    activatedAt?: Date | string | null
    rawPlatformPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentOrderUncheckedCreateWithoutUserInput = {
    id?: string
    bizId: string
    sessionId: string
    planCode: $Enums.SubscriptionPlanCode
    paymentProductId: string
    amount: number
    status?: $Enums.PaymentOrderStatus
    paidAt?: Date | string | null
    activatedAt?: Date | string | null
    rawPlatformPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentOrderCreateOrConnectWithoutUserInput = {
    where: PaymentOrderWhereUniqueInput
    create: XOR<PaymentOrderCreateWithoutUserInput, PaymentOrderUncheckedCreateWithoutUserInput>
  }

  export type PaymentOrderCreateManyUserInputEnvelope = {
    data: PaymentOrderCreateManyUserInput | PaymentOrderCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ManagedAiUsageCreateWithoutUserInput = {
    id?: string
    featureKey: string
    periodKey: string
    usedCount?: number
    limitCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ManagedAiUsageUncheckedCreateWithoutUserInput = {
    id?: string
    featureKey: string
    periodKey: string
    usedCount?: number
    limitCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ManagedAiUsageCreateOrConnectWithoutUserInput = {
    where: ManagedAiUsageWhereUniqueInput
    create: XOR<ManagedAiUsageCreateWithoutUserInput, ManagedAiUsageUncheckedCreateWithoutUserInput>
  }

  export type ManagedAiUsageCreateManyUserInputEnvelope = {
    data: ManagedAiUsageCreateManyUserInput | ManagedAiUsageCreateManyUserInput[]
    skipDuplicates?: boolean
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
    safetyLevel?: EnumSafetyLevelFilter<"CommandLog"> | $Enums.SafetyLevel
    metadata?: JsonNullableFilter<"CommandLog">
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
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSettingsUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSubscriptionUpsertWithoutUserInput = {
    update: XOR<UserSubscriptionUpdateWithoutUserInput, UserSubscriptionUncheckedUpdateWithoutUserInput>
    create: XOR<UserSubscriptionCreateWithoutUserInput, UserSubscriptionUncheckedCreateWithoutUserInput>
    where?: UserSubscriptionWhereInput
  }

  export type UserSubscriptionUpdateToOneWithWhereWithoutUserInput = {
    where?: UserSubscriptionWhereInput
    data: XOR<UserSubscriptionUpdateWithoutUserInput, UserSubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type UserSubscriptionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    trialExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    basePlanType?: NullableEnumSubscriptionPlanTypeFieldUpdateOperationsInput | $Enums.SubscriptionPlanType | null
    baseExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    aiPlanType?: NullableEnumSubscriptionPlanTypeFieldUpdateOperationsInput | $Enums.SubscriptionPlanType | null
    aiExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSubscriptionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    trialExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    basePlanType?: NullableEnumSubscriptionPlanTypeFieldUpdateOperationsInput | $Enums.SubscriptionPlanType | null
    baseExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    aiPlanType?: NullableEnumSubscriptionPlanTypeFieldUpdateOperationsInput | $Enums.SubscriptionPlanType | null
    aiExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentOrderUpsertWithWhereUniqueWithoutUserInput = {
    where: PaymentOrderWhereUniqueInput
    update: XOR<PaymentOrderUpdateWithoutUserInput, PaymentOrderUncheckedUpdateWithoutUserInput>
    create: XOR<PaymentOrderCreateWithoutUserInput, PaymentOrderUncheckedCreateWithoutUserInput>
  }

  export type PaymentOrderUpdateWithWhereUniqueWithoutUserInput = {
    where: PaymentOrderWhereUniqueInput
    data: XOR<PaymentOrderUpdateWithoutUserInput, PaymentOrderUncheckedUpdateWithoutUserInput>
  }

  export type PaymentOrderUpdateManyWithWhereWithoutUserInput = {
    where: PaymentOrderScalarWhereInput
    data: XOR<PaymentOrderUpdateManyMutationInput, PaymentOrderUncheckedUpdateManyWithoutUserInput>
  }

  export type PaymentOrderScalarWhereInput = {
    AND?: PaymentOrderScalarWhereInput | PaymentOrderScalarWhereInput[]
    OR?: PaymentOrderScalarWhereInput[]
    NOT?: PaymentOrderScalarWhereInput | PaymentOrderScalarWhereInput[]
    id?: StringFilter<"PaymentOrder"> | string
    bizId?: StringFilter<"PaymentOrder"> | string
    sessionId?: StringFilter<"PaymentOrder"> | string
    userId?: StringFilter<"PaymentOrder"> | string
    planCode?: EnumSubscriptionPlanCodeFilter<"PaymentOrder"> | $Enums.SubscriptionPlanCode
    paymentProductId?: StringFilter<"PaymentOrder"> | string
    amount?: IntFilter<"PaymentOrder"> | number
    status?: EnumPaymentOrderStatusFilter<"PaymentOrder"> | $Enums.PaymentOrderStatus
    paidAt?: DateTimeNullableFilter<"PaymentOrder"> | Date | string | null
    activatedAt?: DateTimeNullableFilter<"PaymentOrder"> | Date | string | null
    rawPlatformPayload?: JsonNullableFilter<"PaymentOrder">
    createdAt?: DateTimeFilter<"PaymentOrder"> | Date | string
    updatedAt?: DateTimeFilter<"PaymentOrder"> | Date | string
  }

  export type ManagedAiUsageUpsertWithWhereUniqueWithoutUserInput = {
    where: ManagedAiUsageWhereUniqueInput
    update: XOR<ManagedAiUsageUpdateWithoutUserInput, ManagedAiUsageUncheckedUpdateWithoutUserInput>
    create: XOR<ManagedAiUsageCreateWithoutUserInput, ManagedAiUsageUncheckedCreateWithoutUserInput>
  }

  export type ManagedAiUsageUpdateWithWhereUniqueWithoutUserInput = {
    where: ManagedAiUsageWhereUniqueInput
    data: XOR<ManagedAiUsageUpdateWithoutUserInput, ManagedAiUsageUncheckedUpdateWithoutUserInput>
  }

  export type ManagedAiUsageUpdateManyWithWhereWithoutUserInput = {
    where: ManagedAiUsageScalarWhereInput
    data: XOR<ManagedAiUsageUpdateManyMutationInput, ManagedAiUsageUncheckedUpdateManyWithoutUserInput>
  }

  export type ManagedAiUsageScalarWhereInput = {
    AND?: ManagedAiUsageScalarWhereInput | ManagedAiUsageScalarWhereInput[]
    OR?: ManagedAiUsageScalarWhereInput[]
    NOT?: ManagedAiUsageScalarWhereInput | ManagedAiUsageScalarWhereInput[]
    id?: StringFilter<"ManagedAiUsage"> | string
    userId?: StringFilter<"ManagedAiUsage"> | string
    featureKey?: StringFilter<"ManagedAiUsage"> | string
    periodKey?: StringFilter<"ManagedAiUsage"> | string
    usedCount?: IntFilter<"ManagedAiUsage"> | number
    limitCount?: IntFilter<"ManagedAiUsage"> | number
    createdAt?: DateTimeFilter<"ManagedAiUsage"> | Date | string
    updatedAt?: DateTimeFilter<"ManagedAiUsage"> | Date | string
  }

  export type UserCreateWithoutUserSettingsInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogCreateNestedManyWithoutUserInput
    subscription?: UserSubscriptionCreateNestedOneWithoutUserInput
    paymentOrders?: PaymentOrderCreateNestedManyWithoutUserInput
    managedAiUsages?: ManagedAiUsageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUserSettingsInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutUserInput
    subscription?: UserSubscriptionUncheckedCreateNestedOneWithoutUserInput
    paymentOrders?: PaymentOrderUncheckedCreateNestedManyWithoutUserInput
    managedAiUsages?: ManagedAiUsageUncheckedCreateNestedManyWithoutUserInput
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
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUpdateManyWithoutUserNestedInput
    subscription?: UserSubscriptionUpdateOneWithoutUserNestedInput
    paymentOrders?: PaymentOrderUpdateManyWithoutUserNestedInput
    managedAiUsages?: ManagedAiUsageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUserSettingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUncheckedUpdateManyWithoutUserNestedInput
    subscription?: UserSubscriptionUncheckedUpdateOneWithoutUserNestedInput
    paymentOrders?: PaymentOrderUncheckedUpdateManyWithoutUserNestedInput
    managedAiUsages?: ManagedAiUsageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSshConnectionsInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    commandLogs?: CommandLogCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsCreateNestedOneWithoutUserInput
    subscription?: UserSubscriptionCreateNestedOneWithoutUserInput
    paymentOrders?: PaymentOrderCreateNestedManyWithoutUserInput
    managedAiUsages?: ManagedAiUsageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSshConnectionsInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsUncheckedCreateNestedOneWithoutUserInput
    subscription?: UserSubscriptionUncheckedCreateNestedOneWithoutUserInput
    paymentOrders?: PaymentOrderUncheckedCreateNestedManyWithoutUserInput
    managedAiUsages?: ManagedAiUsageUncheckedCreateNestedManyWithoutUserInput
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
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commandLogs?: CommandLogUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUpdateOneWithoutUserNestedInput
    subscription?: UserSubscriptionUpdateOneWithoutUserNestedInput
    paymentOrders?: PaymentOrderUpdateManyWithoutUserNestedInput
    managedAiUsages?: ManagedAiUsageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSshConnectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commandLogs?: CommandLogUncheckedUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUncheckedUpdateOneWithoutUserNestedInput
    subscription?: UserSubscriptionUncheckedUpdateOneWithoutUserNestedInput
    paymentOrders?: PaymentOrderUncheckedUpdateManyWithoutUserNestedInput
    managedAiUsages?: ManagedAiUsageUncheckedUpdateManyWithoutUserNestedInput
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
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsCreateNestedOneWithoutUserInput
    subscription?: UserSubscriptionCreateNestedOneWithoutUserInput
    paymentOrders?: PaymentOrderCreateNestedManyWithoutUserInput
    managedAiUsages?: ManagedAiUsageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCommandLogsInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsUncheckedCreateNestedOneWithoutUserInput
    subscription?: UserSubscriptionUncheckedCreateNestedOneWithoutUserInput
    paymentOrders?: PaymentOrderUncheckedCreateNestedManyWithoutUserInput
    managedAiUsages?: ManagedAiUsageUncheckedCreateNestedManyWithoutUserInput
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
  }

  export type SSHConnectionUncheckedCreateWithoutCommandLogsInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
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
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUpdateOneWithoutUserNestedInput
    subscription?: UserSubscriptionUpdateOneWithoutUserNestedInput
    paymentOrders?: PaymentOrderUpdateManyWithoutUserNestedInput
    managedAiUsages?: ManagedAiUsageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCommandLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUncheckedUpdateOneWithoutUserNestedInput
    subscription?: UserSubscriptionUncheckedUpdateOneWithoutUserNestedInput
    paymentOrders?: PaymentOrderUncheckedUpdateManyWithoutUserNestedInput
    managedAiUsages?: ManagedAiUsageUncheckedUpdateManyWithoutUserNestedInput
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
  }

  export type SSHConnectionUncheckedUpdateWithoutCommandLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
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

  export type UserCreateWithoutSubscriptionInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsCreateNestedOneWithoutUserInput
    paymentOrders?: PaymentOrderCreateNestedManyWithoutUserInput
    managedAiUsages?: ManagedAiUsageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSubscriptionInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsUncheckedCreateNestedOneWithoutUserInput
    paymentOrders?: PaymentOrderUncheckedCreateNestedManyWithoutUserInput
    managedAiUsages?: ManagedAiUsageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSubscriptionInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
  }

  export type UserUpsertWithoutSubscriptionInput = {
    update: XOR<UserUpdateWithoutSubscriptionInput, UserUncheckedUpdateWithoutSubscriptionInput>
    create: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSubscriptionInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSubscriptionInput, UserUncheckedUpdateWithoutSubscriptionInput>
  }

  export type UserUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUpdateOneWithoutUserNestedInput
    paymentOrders?: PaymentOrderUpdateManyWithoutUserNestedInput
    managedAiUsages?: ManagedAiUsageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUncheckedUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUncheckedUpdateOneWithoutUserNestedInput
    paymentOrders?: PaymentOrderUncheckedUpdateManyWithoutUserNestedInput
    managedAiUsages?: ManagedAiUsageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutPaymentOrdersInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsCreateNestedOneWithoutUserInput
    subscription?: UserSubscriptionCreateNestedOneWithoutUserInput
    managedAiUsages?: ManagedAiUsageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPaymentOrdersInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsUncheckedCreateNestedOneWithoutUserInput
    subscription?: UserSubscriptionUncheckedCreateNestedOneWithoutUserInput
    managedAiUsages?: ManagedAiUsageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPaymentOrdersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPaymentOrdersInput, UserUncheckedCreateWithoutPaymentOrdersInput>
  }

  export type UserUpsertWithoutPaymentOrdersInput = {
    update: XOR<UserUpdateWithoutPaymentOrdersInput, UserUncheckedUpdateWithoutPaymentOrdersInput>
    create: XOR<UserCreateWithoutPaymentOrdersInput, UserUncheckedCreateWithoutPaymentOrdersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPaymentOrdersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPaymentOrdersInput, UserUncheckedUpdateWithoutPaymentOrdersInput>
  }

  export type UserUpdateWithoutPaymentOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUpdateOneWithoutUserNestedInput
    subscription?: UserSubscriptionUpdateOneWithoutUserNestedInput
    managedAiUsages?: ManagedAiUsageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPaymentOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUncheckedUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUncheckedUpdateOneWithoutUserNestedInput
    subscription?: UserSubscriptionUncheckedUpdateOneWithoutUserNestedInput
    managedAiUsages?: ManagedAiUsageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutManagedAiUsagesInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshConnections?: SSHConnectionCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsCreateNestedOneWithoutUserInput
    subscription?: UserSubscriptionCreateNestedOneWithoutUserInput
    paymentOrders?: PaymentOrderCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutManagedAiUsagesInput = {
    id?: string
    uuid?: string
    email?: string | null
    username?: string | null
    password?: string | null
    avatar?: string | null
    wechatOpenId?: string | null
    wechatUnionId?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sshConnections?: SSHConnectionUncheckedCreateNestedManyWithoutUserInput
    commandLogs?: CommandLogUncheckedCreateNestedManyWithoutUserInput
    userSettings?: UserSettingsUncheckedCreateNestedOneWithoutUserInput
    subscription?: UserSubscriptionUncheckedCreateNestedOneWithoutUserInput
    paymentOrders?: PaymentOrderUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutManagedAiUsagesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutManagedAiUsagesInput, UserUncheckedCreateWithoutManagedAiUsagesInput>
  }

  export type UserUpsertWithoutManagedAiUsagesInput = {
    update: XOR<UserUpdateWithoutManagedAiUsagesInput, UserUncheckedUpdateWithoutManagedAiUsagesInput>
    create: XOR<UserCreateWithoutManagedAiUsagesInput, UserUncheckedCreateWithoutManagedAiUsagesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutManagedAiUsagesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutManagedAiUsagesInput, UserUncheckedUpdateWithoutManagedAiUsagesInput>
  }

  export type UserUpdateWithoutManagedAiUsagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshConnections?: SSHConnectionUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUpdateOneWithoutUserNestedInput
    subscription?: UserSubscriptionUpdateOneWithoutUserNestedInput
    paymentOrders?: PaymentOrderUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutManagedAiUsagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sshConnections?: SSHConnectionUncheckedUpdateManyWithoutUserNestedInput
    commandLogs?: CommandLogUncheckedUpdateManyWithoutUserNestedInput
    userSettings?: UserSettingsUncheckedUpdateOneWithoutUserNestedInput
    subscription?: UserSubscriptionUncheckedUpdateOneWithoutUserNestedInput
    paymentOrders?: PaymentOrderUncheckedUpdateManyWithoutUserNestedInput
  }

  export type SSHConnectionCreateManyUserInput = {
    id?: string
    name: string
    host: string
    port?: number
    username: string
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

  export type PaymentOrderCreateManyUserInput = {
    id?: string
    bizId: string
    sessionId: string
    planCode: $Enums.SubscriptionPlanCode
    paymentProductId: string
    amount: number
    status?: $Enums.PaymentOrderStatus
    paidAt?: Date | string | null
    activatedAt?: Date | string | null
    rawPlatformPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ManagedAiUsageCreateManyUserInput = {
    id?: string
    featureKey: string
    periodKey: string
    usedCount?: number
    limitCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SSHConnectionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
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
    commandLogs?: CommandLogUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
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
    commandLogs?: CommandLogUncheckedUpdateManyWithoutSshConnectionNestedInput
  }

  export type SSHConnectionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
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

  export type PaymentOrderUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    bizId?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    planCode?: EnumSubscriptionPlanCodeFieldUpdateOperationsInput | $Enums.SubscriptionPlanCode
    paymentProductId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    status?: EnumPaymentOrderStatusFieldUpdateOperationsInput | $Enums.PaymentOrderStatus
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawPlatformPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentOrderUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    bizId?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    planCode?: EnumSubscriptionPlanCodeFieldUpdateOperationsInput | $Enums.SubscriptionPlanCode
    paymentProductId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    status?: EnumPaymentOrderStatusFieldUpdateOperationsInput | $Enums.PaymentOrderStatus
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawPlatformPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentOrderUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    bizId?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    planCode?: EnumSubscriptionPlanCodeFieldUpdateOperationsInput | $Enums.SubscriptionPlanCode
    paymentProductId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    status?: EnumPaymentOrderStatusFieldUpdateOperationsInput | $Enums.PaymentOrderStatus
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawPlatformPayload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManagedAiUsageUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    featureKey?: StringFieldUpdateOperationsInput | string
    periodKey?: StringFieldUpdateOperationsInput | string
    usedCount?: IntFieldUpdateOperationsInput | number
    limitCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManagedAiUsageUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    featureKey?: StringFieldUpdateOperationsInput | string
    periodKey?: StringFieldUpdateOperationsInput | string
    usedCount?: IntFieldUpdateOperationsInput | number
    limitCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManagedAiUsageUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    featureKey?: StringFieldUpdateOperationsInput | string
    periodKey?: StringFieldUpdateOperationsInput | string
    usedCount?: IntFieldUpdateOperationsInput | number
    limitCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserSettingsDefaultArgs instead
     */
    export type UserSettingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserSettingsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SSHConnectionDefaultArgs instead
     */
    export type SSHConnectionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SSHConnectionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommandLogDefaultArgs instead
     */
    export type CommandLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommandLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserSubscriptionDefaultArgs instead
     */
    export type UserSubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserSubscriptionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PaymentOrderDefaultArgs instead
     */
    export type PaymentOrderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PaymentOrderDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ManagedAiUsageDefaultArgs instead
     */
    export type ManagedAiUsageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ManagedAiUsageDefaultArgs<ExtArgs>

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