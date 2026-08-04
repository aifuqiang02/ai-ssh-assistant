
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  detectRuntime,
} = require('./runtime/edge')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.7.0
 * Query Engine version: 79fb5193cf0a8fdbef536e4b4a159cad677ab1b9
 */
Prisma.prismaVersion = {
  client: "5.7.0",
  engine: "79fb5193cf0a8fdbef536e4b4a159cad677ab1b9"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
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

exports.Prisma.UserSettingsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  data: 'data',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SSHConnectionScalarFieldEnum = {
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

exports.Prisma.CommandLogScalarFieldEnum = {
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

exports.Prisma.UserSubscriptionScalarFieldEnum = {
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

exports.Prisma.PaymentOrderScalarFieldEnum = {
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

exports.Prisma.ManagedAiUsageScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  featureKey: 'featureKey',
  periodKey: 'periodKey',
  usedCount: 'usedCount',
  limitCount: 'limitCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.UserRole = exports.$Enums.UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  PREMIUM: 'PREMIUM'
};

exports.SSHAuthType = exports.$Enums.SSHAuthType = {
  PASSWORD: 'PASSWORD',
  PRIVATE_KEY: 'PRIVATE_KEY',
  SSH_AGENT: 'SSH_AGENT'
};

exports.ConnectionStatus = exports.$Enums.ConnectionStatus = {
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  CONNECTING: 'CONNECTING',
  ERROR: 'ERROR'
};

exports.SafetyLevel = exports.$Enums.SafetyLevel = {
  SAFE: 'SAFE',
  CAUTION: 'CAUTION',
  DANGEROUS: 'DANGEROUS'
};

exports.SubscriptionPlanType = exports.$Enums.SubscriptionPlanType = {
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
  LIFETIME: 'LIFETIME'
};

exports.SubscriptionPlanCode = exports.$Enums.SubscriptionPlanCode = {
  BASE_MONTHLY: 'BASE_MONTHLY',
  BASE_YEARLY: 'BASE_YEARLY',
  BASE_LIFETIME: 'BASE_LIFETIME',
  AI_MONTHLY: 'AI_MONTHLY',
  FULL_MONTHLY: 'FULL_MONTHLY',
  FULL_YEARLY: 'FULL_YEARLY',
  FULL_LIFETIME: 'FULL_LIFETIME'
};

exports.PaymentOrderStatus = exports.$Enums.PaymentOrderStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  ACTIVATED: 'ACTIVATED',
  EXPIRED: 'EXPIRED',
  CLOSED: 'CLOSED',
  FAILED: 'FAILED'
};

exports.Prisma.ModelName = {
  User: 'User',
  UserSettings: 'UserSettings',
  SSHConnection: 'SSHConnection',
  CommandLog: 'CommandLog',
  UserSubscription: 'UserSubscription',
  PaymentOrder: 'PaymentOrder',
  ManagedAiUsage: 'ManagedAiUsage'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "D:\\git-projects\\ai-ssh-assistant\\packages\\database\\src\\generated\\client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      },
      {
        "fromEnvVar": null,
        "value": "debian-openssl-3.0.x"
      }
    ],
    "previewFeatures": [],
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": "../../../.env",
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../../../prisma",
  "clientVersion": "5.7.0",
  "engineVersion": "79fb5193cf0a8fdbef536e4b4a159cad677ab1b9",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "Ly8gVGhpcyBpcyB5b3VyIFByaXNtYSBzY2hlbWEgZmlsZSwNCi8vIGxlYXJuIG1vcmUgYWJvdXQgaXQgaW4gdGhlIGRvY3M6IGh0dHBzOi8vcHJpcy5seS9kL3ByaXNtYS1zY2hlbWENCg0KZ2VuZXJhdG9yIGNsaWVudCB7DQogIHByb3ZpZGVyICAgICAgPSAicHJpc21hLWNsaWVudC1qcyINCiAgb3V0cHV0ICAgICAgICA9ICIuLi9zcmMvZ2VuZXJhdGVkL2NsaWVudCINCiAgYmluYXJ5VGFyZ2V0cyA9IFsibmF0aXZlIiwgImRlYmlhbi1vcGVuc3NsLTMuMC54Il0NCn0NCg0KZGF0YXNvdXJjZSBkYiB7DQogIHByb3ZpZGVyID0gInBvc3RncmVzcWwiDQogIHVybCAgICAgID0gZW52KCJEQVRBQkFTRV9VUkwiKQ0KfQ0KDQovLyA9PT09PT09PT09PT09PT09PT09PSDnlKjmiLfnm7jlhbPooaggPT09PT09PT09PT09PT09PT09PT0NCg0KLy8g55So5oi36KGoIC0gUG9zdGdyZVNRTCDniYjmnKzvvIzmlK/mjIHlrozmlbTlip/og70NCm1vZGVsIFVzZXIgew0KICBpZCAgICAgICAgU3RyaW5nICAgQGlkIEBkZWZhdWx0KGN1aWQoKSkNCiAgdXVpZCAgICAgIFN0cmluZyAgIEB1bmlxdWUgQGRlZmF1bHQoY3VpZCgpKSAvLyDlhbzlrrkgbG9iZS1jaGF0IOeahCB1dWlkIOiuvuiuoQ0KICBlbWFpbCAgICAgU3RyaW5nPyAgQHVuaXF1ZQ0KICB1c2VybmFtZSAgU3RyaW5nPyAgQHVuaXF1ZQ0KICBwYXNzd29yZCAgU3RyaW5nPyAgLy8g5Y+v6YCJ77yM5pSv5oyB56ys5LiJ5pa555m75b2VDQogIGF2YXRhciAgICBTdHJpbmc/DQogIHdlY2hhdE9wZW5JZCAgU3RyaW5nPyBAdW5pcXVlDQogIHdlY2hhdFVuaW9uSWQgU3RyaW5nPyBAdW5pcXVlDQogIHJvbGUgICAgICBVc2VyUm9sZSBAZGVmYXVsdChVU0VSKSAvLyDkvb/nlKjmnprkuL4NCiAgaXNBY3RpdmUgIEJvb2xlYW4gIEBkZWZhdWx0KHRydWUpDQogIGNyZWF0ZWRBdCBEYXRlVGltZSBAZGVmYXVsdChub3coKSkNCiAgdXBkYXRlZEF0IERhdGVUaW1lIEB1cGRhdGVkQXQNCg0KICAvLyDlhbPogZTlhbPns7sNCiAgc3NoQ29ubmVjdGlvbnMgU1NIQ29ubmVjdGlvbltdDQogIGNvbW1hbmRMb2dzICAgIENvbW1hbmRMb2dbXQ0KICB1c2VyU2V0dGluZ3MgICBVc2VyU2V0dGluZ3M/DQogIHN1YnNjcmlwdGlvbiAgIFVzZXJTdWJzY3JpcHRpb24/DQogIHBheW1lbnRPcmRlcnMgIFBheW1lbnRPcmRlcltdDQogIG1hbmFnZWRBaVVzYWdlcyBNYW5hZ2VkQWlVc2FnZVtdDQoNCiAgQEBtYXAoInVzZXJzIikNCn0NCg0KLy8g55So5oi36K6+572u6KGoDQptb2RlbCBVc2VyU2V0dGluZ3Mgew0KICBpZCAgICAgICAgU3RyaW5nICAgQGlkIEBkZWZhdWx0KGN1aWQoKSkNCiAgdXNlcklkICAgIFN0cmluZyAgIEB1bmlxdWUNCiAgZGF0YSAgICAgIEpzb24gICAgIC8vIOWtmOWCqOaJgOacieeUqOaIt+iuvue9ru+8iEpTT07moLzlvI/vvIkNCiAgY3JlYXRlZEF0IERhdGVUaW1lIEBkZWZhdWx0KG5vdygpKQ0KICB1cGRhdGVkQXQgRGF0ZVRpbWUgQHVwZGF0ZWRBdA0KDQogIC8vIOWFs+iBlOeUqOaItw0KICB1c2VyIFVzZXIgQHJlbGF0aW9uKGZpZWxkczogW3VzZXJJZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlKQ0KDQogIEBAbWFwKCJ1c2VyX3NldHRpbmdzIikNCn0NCg0KZW51bSBVc2VyUm9sZSB7DQogIFVTRVINCiAgQURNSU4NCiAgUFJFTUlVTQ0KfQ0KDQovLyBTU0gg6L+e5o6l6YWN572u6KGoDQptb2RlbCBTU0hDb25uZWN0aW9uIHsNCiAgaWQgICAgICAgU3RyaW5nIEBpZCBAZGVmYXVsdChjdWlkKCkpDQogIG5hbWUgICAgIFN0cmluZyAvLyDov57mjqXlkI3np7ANCiAgaG9zdCAgICAgU3RyaW5nIC8vIOS4u+acuuWcsOWdgA0KICBwb3J0ICAgICBJbnQgICAgQGRlZmF1bHQoMjIpIC8vIOerr+WPow0KICB1c2VybmFtZSBTdHJpbmcgLy8g55So5oi35ZCNDQoNCiAgLy8g6K6k6K+B5L+h5oGvDQogIGF1dGhUeXBlICAgIFNTSEF1dGhUeXBlICAvLyDorqTor4HnsbvlnovmnprkuL4NCiAgcGFzc3dvcmQgICAgU3RyaW5nPyAvLyDlr4bnoIHvvIjliqDlr4blrZjlgqjvvIkNCiAgcHJpdmF0ZUtleSAgU3RyaW5nPyAvLyDnp4HpkqXot6/lvoTmiJblhoXlrrkNCiAgcHVibGljS2V5ICAgU3RyaW5nPyAvLyDlhazpkqXlhoXlrrkNCiAgcGFzc3BocmFzZSAgU3RyaW5nPyAvLyDnp4HpkqXlr4bnoIHvvIjliqDlr4blrZjlgqjvvIkNCg0KICAvLyDov57mjqXnirbmgIENCiAgc3RhdHVzICAgICAgIENvbm5lY3Rpb25TdGF0dXMgICBAZGVmYXVsdChESVNDT05ORUNURUQpIC8vIOi/nuaOpeeKtuaAgeaemuS4vg0KICBsYXN0VXNlZCAgICAgRGF0ZVRpbWU/DQogIGlzQWN0aXZlICAgICBCb29sZWFuICBAZGVmYXVsdCh0cnVlKQ0KICBjcmVhdGVkQXQgICAgRGF0ZVRpbWUgQGRlZmF1bHQobm93KCkpDQogIHVwZGF0ZWRBdCAgICBEYXRlVGltZSBAdXBkYXRlZEF0DQoNCiAgLy8g6L+e5o6l5YWD5pWw5o2uIC0gSlNPTiDmoLzlvI8NCiAgbWV0YSAgICAgICAgSnNvbj8gICAgICAgICAgICAgLy8g5a2Y5YKo6aKd5aSW55qE5YWD5pWw5o2u5L+h5oGvDQoNCiAgLy8g5YWz6IGU55So5oi3DQogIHVzZXJJZCBTdHJpbmcNCiAgdXNlciAgIFVzZXIgICBAcmVsYXRpb24oZmllbGRzOiBbdXNlcklkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IENhc2NhZGUpDQoNCiAgLy8g5YWz6IGU5YWz57O7DQogIGNvbW1hbmRMb2dzICBDb21tYW5kTG9nW10NCg0KICBAQG1hcCgic3NoX2Nvbm5lY3Rpb25zIikNCn0NCg0KZW51bSBTU0hBdXRoVHlwZSB7DQogIFBBU1NXT1JEDQogIFBSSVZBVEVfS0VZDQogIFNTSF9BR0VOVA0KfQ0KDQplbnVtIENvbm5lY3Rpb25TdGF0dXMgew0KICBDT05ORUNURUQNCiAgRElTQ09OTkVDVEVEDQogIENPTk5FQ1RJTkcNCiAgRVJST1INCn0NCg0KLy8g5ZG95Luk5pel5b+X6KGoDQptb2RlbCBDb21tYW5kTG9nIHsNCiAgaWQgICAgICAgIFN0cmluZyAgIEBpZCBAZGVmYXVsdChjdWlkKCkpDQogIGNvbW1hbmQgICBTdHJpbmcgICAvLyDmiafooYznmoTlkb3ku6QNCiAgb3V0cHV0ICAgIFN0cmluZz8gIC8vIOWRveS7pOi+k+WHug0KICBleGl0Q29kZSAgSW50PyAgICAgLy8g6YCA5Ye656CBDQogIGR1cmF0aW9uICBJbnQ/ICAgICAvLyDmiafooYzml7bpl7TvvIjmr6vnp5LvvIkNCiAgY3JlYXRlZEF0IERhdGVUaW1lIEBkZWZhdWx0KG5vdygpKQ0KDQogIC8vIOWuieWFqOe6p+WIqw0KICBzYWZldHlMZXZlbCBTYWZldHlMZXZlbCBAZGVmYXVsdChTQUZFKSAvLyDlronlhajnuqfliKvmnprkuL4NCg0KICAvLyDlkb3ku6TlhYPmlbDmja4NCiAgbWV0YWRhdGEgICAgICBKc29uPyAgICAgICAvLyDpop3lpJbnmoTlhYPmlbDmja7kv6Hmga8NCg0KICAvLyDlhbPogZTnlKjmiLflkowgU1NIIOi/nuaOpQ0KICB1c2VySWQgU3RyaW5nDQogIHVzZXIgICBVc2VyICAgQHJlbGF0aW9uKGZpZWxkczogW3VzZXJJZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlKQ0KDQogIHNzaENvbm5lY3Rpb25JZCBTdHJpbmc/DQogIHNzaENvbm5lY3Rpb24gICBTU0hDb25uZWN0aW9uPyBAcmVsYXRpb24oZmllbGRzOiBbc3NoQ29ubmVjdGlvbklkXSwgcmVmZXJlbmNlczogW2lkXSkNCg0KICBAQG1hcCgiY29tbWFuZF9sb2dzIikNCn0NCg0KbW9kZWwgVXNlclN1YnNjcmlwdGlvbiB7DQogIGlkICAgICAgICAgICAgIFN0cmluZyAgICAgICAgICAgICAgICBAaWQgQGRlZmF1bHQoY3VpZCgpKQ0KICB1c2VySWQgICAgICAgICBTdHJpbmcgICAgICAgICAgICAgICAgQHVuaXF1ZQ0KICB0cmlhbEV4cGlyZXNBdCBEYXRlVGltZT8NCiAgYmFzZVBsYW5UeXBlICAgU3Vic2NyaXB0aW9uUGxhblR5cGU/DQogIGJhc2VFeHBpcmVzQXQgIERhdGVUaW1lPw0KICBhaVBsYW5UeXBlICAgICBTdWJzY3JpcHRpb25QbGFuVHlwZT8NCiAgYWlFeHBpcmVzQXQgICAgRGF0ZVRpbWU/DQogIGNyZWF0ZWRBdCAgICAgIERhdGVUaW1lICAgICAgICAgICAgICBAZGVmYXVsdChub3coKSkNCiAgdXBkYXRlZEF0ICAgICAgRGF0ZVRpbWUgICAgICAgICAgICAgIEB1cGRhdGVkQXQNCg0KICB1c2VyIFVzZXIgQHJlbGF0aW9uKGZpZWxkczogW3VzZXJJZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlKQ0KDQogIEBAbWFwKCJ1c2VyX3N1YnNjcmlwdGlvbnMiKQ0KfQ0KDQptb2RlbCBQYXltZW50T3JkZXIgew0KICBpZCAgICAgICAgICAgICAgICAgU3RyaW5nICAgICAgICAgICAgICAgQGlkIEBkZWZhdWx0KGN1aWQoKSkNCiAgYml6SWQgICAgICAgICAgICAgIFN0cmluZyAgICAgICAgICAgICAgIEB1bmlxdWUNCiAgc2Vzc2lvbklkICAgICAgICAgIFN0cmluZyAgICAgICAgICAgICAgIEB1bmlxdWUNCiAgdXNlcklkICAgICAgICAgICAgIFN0cmluZw0KICBwbGFuQ29kZSAgICAgICAgICAgU3Vic2NyaXB0aW9uUGxhbkNvZGUNCiAgcGF5bWVudFByb2R1Y3RJZCAgIFN0cmluZw0KICBhbW91bnQgICAgICAgICAgICAgSW50DQogIHN0YXR1cyAgICAgICAgICAgICBQYXltZW50T3JkZXJTdGF0dXMgICBAZGVmYXVsdChQRU5ESU5HKQ0KICBwYWlkQXQgICAgICAgICAgICAgRGF0ZVRpbWU/DQogIGFjdGl2YXRlZEF0ICAgICAgICBEYXRlVGltZT8NCiAgcmF3UGxhdGZvcm1QYXlsb2FkIEpzb24/DQogIGNyZWF0ZWRBdCAgICAgICAgICBEYXRlVGltZSAgICAgICAgICAgICBAZGVmYXVsdChub3coKSkNCiAgdXBkYXRlZEF0ICAgICAgICAgIERhdGVUaW1lICAgICAgICAgICAgIEB1cGRhdGVkQXQNCg0KICB1c2VyIFVzZXIgQHJlbGF0aW9uKGZpZWxkczogW3VzZXJJZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlKQ0KDQogIEBAbWFwKCJwYXltZW50X29yZGVycyIpDQp9DQoNCm1vZGVsIE1hbmFnZWRBaVVzYWdlIHsNCiAgaWQgICAgICAgICBTdHJpbmcgICBAaWQgQGRlZmF1bHQoY3VpZCgpKQ0KICB1c2VySWQgICAgIFN0cmluZw0KICBmZWF0dXJlS2V5IFN0cmluZw0KICBwZXJpb2RLZXkgIFN0cmluZw0KICB1c2VkQ291bnQgIEludCAgICAgIEBkZWZhdWx0KDApDQogIGxpbWl0Q291bnQgSW50DQogIGNyZWF0ZWRBdCAgRGF0ZVRpbWUgQGRlZmF1bHQobm93KCkpDQogIHVwZGF0ZWRBdCAgRGF0ZVRpbWUgQHVwZGF0ZWRBdA0KDQogIHVzZXIgVXNlciBAcmVsYXRpb24oZmllbGRzOiBbdXNlcklkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IENhc2NhZGUpDQoNCiAgQEB1bmlxdWUoW3VzZXJJZCwgZmVhdHVyZUtleSwgcGVyaW9kS2V5XSkNCiAgQEBtYXAoIm1hbmFnZWRfYWlfdXNhZ2UiKQ0KfQ0KDQplbnVtIFN1YnNjcmlwdGlvblBsYW5UeXBlIHsNCiAgTU9OVEhMWQ0KICBZRUFSTFkNCiAgTElGRVRJTUUNCn0NCg0KZW51bSBTdWJzY3JpcHRpb25QbGFuQ29kZSB7DQogIEJBU0VfTU9OVEhMWQ0KICBCQVNFX1lFQVJMWQ0KICBCQVNFX0xJRkVUSU1FDQogIEFJX01PTlRITFkNCiAgRlVMTF9NT05USExZDQogIEZVTExfWUVBUkxZDQogIEZVTExfTElGRVRJTUUNCn0NCg0KZW51bSBQYXltZW50T3JkZXJTdGF0dXMgew0KICBQRU5ESU5HDQogIFBBSUQNCiAgQUNUSVZBVEVEDQogIEVYUElSRUQNCiAgQ0xPU0VEDQogIEZBSUxFRA0KfQ0KDQplbnVtIFNhZmV0eUxldmVsIHsNCiAgU0FGRQ0KICBDQVVUSU9ODQogIERBTkdFUk9VUw0KfQ0K",
  "inlineSchemaHash": "71ed8addac278d0b69f8076a6a4efda274e414c514b01224fcb25a8bb69a6f80",
  "noEngine": false
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"dbName\":\"users\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"uuid\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"username\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"password\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"avatar\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wechatOpenId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wechatUnionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"UserRole\",\"default\":\"USER\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"sshConnections\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SSHConnection\",\"relationName\":\"SSHConnectionToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"commandLogs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CommandLog\",\"relationName\":\"CommandLogToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userSettings\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserSettings\",\"relationName\":\"UserToUserSettings\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"subscription\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserSubscription\",\"relationName\":\"UserToUserSubscription\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paymentOrders\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PaymentOrder\",\"relationName\":\"PaymentOrderToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"managedAiUsages\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ManagedAiUsage\",\"relationName\":\"ManagedAiUsageToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"UserSettings\":{\"dbName\":\"user_settings\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"UserToUserSettings\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SSHConnection\":{\"dbName\":\"ssh_connections\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"host\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"port\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":22,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"username\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"authType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SSHAuthType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"password\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"privateKey\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"publicKey\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"passphrase\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ConnectionStatus\",\"default\":\"DISCONNECTED\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastUsed\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"meta\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"SSHConnectionToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"commandLogs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CommandLog\",\"relationName\":\"CommandLogToSSHConnection\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CommandLog\":{\"dbName\":\"command_logs\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"command\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"output\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"exitCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"duration\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"safetyLevel\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"SafetyLevel\",\"default\":\"SAFE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"CommandLogToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sshConnectionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sshConnection\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SSHConnection\",\"relationName\":\"CommandLogToSSHConnection\",\"relationFromFields\":[\"sshConnectionId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"UserSubscription\":{\"dbName\":\"user_subscriptions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trialExpiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"basePlanType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SubscriptionPlanType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"baseExpiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aiPlanType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SubscriptionPlanType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aiExpiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"UserToUserSubscription\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PaymentOrder\":{\"dbName\":\"payment_orders\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bizId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"planCode\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SubscriptionPlanCode\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paymentProductId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"PaymentOrderStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paidAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"activatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rawPlatformPayload\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"PaymentOrderToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ManagedAiUsage\":{\"dbName\":\"managed_ai_usage\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"featureKey\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodKey\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"usedCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"limitCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ManagedAiUsageToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"userId\",\"featureKey\",\"periodKey\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"userId\",\"featureKey\",\"periodKey\"]}],\"isGenerated\":false}},\"enums\":{\"UserRole\":{\"values\":[{\"name\":\"USER\",\"dbName\":null},{\"name\":\"ADMIN\",\"dbName\":null},{\"name\":\"PREMIUM\",\"dbName\":null}],\"dbName\":null},\"SSHAuthType\":{\"values\":[{\"name\":\"PASSWORD\",\"dbName\":null},{\"name\":\"PRIVATE_KEY\",\"dbName\":null},{\"name\":\"SSH_AGENT\",\"dbName\":null}],\"dbName\":null},\"ConnectionStatus\":{\"values\":[{\"name\":\"CONNECTED\",\"dbName\":null},{\"name\":\"DISCONNECTED\",\"dbName\":null},{\"name\":\"CONNECTING\",\"dbName\":null},{\"name\":\"ERROR\",\"dbName\":null}],\"dbName\":null},\"SubscriptionPlanType\":{\"values\":[{\"name\":\"MONTHLY\",\"dbName\":null},{\"name\":\"YEARLY\",\"dbName\":null},{\"name\":\"LIFETIME\",\"dbName\":null}],\"dbName\":null},\"SubscriptionPlanCode\":{\"values\":[{\"name\":\"BASE_MONTHLY\",\"dbName\":null},{\"name\":\"BASE_YEARLY\",\"dbName\":null},{\"name\":\"BASE_LIFETIME\",\"dbName\":null},{\"name\":\"AI_MONTHLY\",\"dbName\":null},{\"name\":\"FULL_MONTHLY\",\"dbName\":null},{\"name\":\"FULL_YEARLY\",\"dbName\":null},{\"name\":\"FULL_LIFETIME\",\"dbName\":null}],\"dbName\":null},\"PaymentOrderStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"PAID\",\"dbName\":null},{\"name\":\"ACTIVATED\",\"dbName\":null},{\"name\":\"EXPIRED\",\"dbName\":null},{\"name\":\"CLOSED\",\"dbName\":null},{\"name\":\"FAILED\",\"dbName\":null}],\"dbName\":null},\"SafetyLevel\":{\"values\":[{\"name\":\"SAFE\",\"dbName\":null},{\"name\":\"CAUTION\",\"dbName\":null},{\"name\":\"DANGEROUS\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.getQueryEngineWasmModule = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

