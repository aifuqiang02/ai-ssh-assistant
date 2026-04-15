
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
} = require('./runtime/library')


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


  const path = require('path')

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
  PaymentOrder: 'PaymentOrder'
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
      "value": "D:\\git-projects\\ai-ssh-assistant\\packages\\database\\src\\generated\\client-postgresql",
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
        "fromEnvVar": "CLOUD_DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "Ly8gVGhpcyBpcyB5b3VyIFByaXNtYSBzY2hlbWEgZmlsZSwNCi8vIGxlYXJuIG1vcmUgYWJvdXQgaXQgaW4gdGhlIGRvY3M6IGh0dHBzOi8vcHJpcy5seS9kL3ByaXNtYS1zY2hlbWENCg0KZ2VuZXJhdG9yIGNsaWVudCB7DQogIHByb3ZpZGVyID0gInByaXNtYS1jbGllbnQtanMiDQogIG91dHB1dCAgID0gIi4uL3NyYy9nZW5lcmF0ZWQvY2xpZW50LXBvc3RncmVzcWwiDQp9DQoNCmRhdGFzb3VyY2UgZGIgew0KICBwcm92aWRlciA9ICJwb3N0Z3Jlc3FsIg0KICB1cmwgICAgICA9IGVudigiQ0xPVURfREFUQUJBU0VfVVJMIikNCn0NCg0KLy8gPT09PT09PT09PT09PT09PT09PT0g55So5oi355u45YWz6KGoID09PT09PT09PT09PT09PT09PT09DQoNCi8vIOeUqOaIt+ihqCAtIFBvc3RncmVTUUwg54mI5pys77yM5pSv5oyB5a6M5pW05Yqf6IO9DQptb2RlbCBVc2VyIHsKICBpZCAgICAgICAgU3RyaW5nICAgQGlkIEBkZWZhdWx0KGN1aWQoKSkKICB1dWlkICAgICAgU3RyaW5nICAgQHVuaXF1ZSBAZGVmYXVsdChjdWlkKCkpIC8vIOWFvOWuuSBsb2JlLWNoYXQg55qEIHV1aWQg6K6+6K6hCiAgZW1haWwgICAgIFN0cmluZz8gIEB1bmlxdWUNCiAgdXNlcm5hbWUgIFN0cmluZz8gIEB1bmlxdWUNCiAgcGFzc3dvcmQgIFN0cmluZz8gIC8vIOWPr+mAie+8jOaUr+aMgeesrOS4ieaWueeZu+W9lQ0KICBhdmF0YXIgICAgU3RyaW5nPw0KICB3ZWNoYXRPcGVuSWQgIFN0cmluZz8gQHVuaXF1ZQ0KICB3ZWNoYXRVbmlvbklkIFN0cmluZz8gQHVuaXF1ZQ0KICByb2xlICAgICAgVXNlclJvbGUgQGRlZmF1bHQoVVNFUikgLy8g5L2/55So5p6a5Li+DQogIGlzQWN0aXZlICBCb29sZWFuICBAZGVmYXVsdCh0cnVlKQ0KICBjcmVhdGVkQXQgRGF0ZVRpbWUgQGRlZmF1bHQobm93KCkpDQogIHVwZGF0ZWRBdCBEYXRlVGltZSBAdXBkYXRlZEF0DQoNCiAgLy8g5YWz6IGU5YWz57O7CiAgc3NoQ29ubmVjdGlvbnMgU1NIQ29ubmVjdGlvbltdCiAgY29tbWFuZExvZ3MgICAgQ29tbWFuZExvZ1tdCiAgdXNlclNldHRpbmdzICAgVXNlclNldHRpbmdzPwogIHN1YnNjcmlwdGlvbiAgIFVzZXJTdWJzY3JpcHRpb24/CiAgcGF5bWVudE9yZGVycyAgUGF5bWVudE9yZGVyW10KDQogIEBAbWFwKCJ1c2VycyIpDQp9DQoNCi8vIOeUqOaIt+iuvue9ruihqA0KbW9kZWwgVXNlclNldHRpbmdzIHsNCiAgaWQgICAgICAgIFN0cmluZyAgIEBpZCBAZGVmYXVsdChjdWlkKCkpDQogIHVzZXJJZCAgICBTdHJpbmcgICBAdW5pcXVlDQogIGRhdGEgICAgICBKc29uICAgICAvLyDlrZjlgqjmiYDmnInnlKjmiLforr7nva7vvIhKU09O5qC85byP77yJDQogIGNyZWF0ZWRBdCBEYXRlVGltZSBAZGVmYXVsdChub3coKSkNCiAgdXBkYXRlZEF0IERhdGVUaW1lIEB1cGRhdGVkQXQNCg0KICAvLyDlhbPogZTnlKjmiLcNCiAgdXNlciBVc2VyIEByZWxhdGlvbihmaWVsZHM6IFt1c2VySWRdLCByZWZlcmVuY2VzOiBbaWRdLCBvbkRlbGV0ZTogQ2FzY2FkZSkNCg0KICBAQG1hcCgidXNlcl9zZXR0aW5ncyIpDQp9DQoNCmVudW0gVXNlclJvbGUgew0KICBVU0VSDQogIEFETUlODQogIFBSRU1JVU0NCn0NCg0KLy8gU1NIIOi/nuaOpemFjee9ruihqA0KbW9kZWwgU1NIQ29ubmVjdGlvbiB7DQogIGlkICAgICAgIFN0cmluZyBAaWQgQGRlZmF1bHQoY3VpZCgpKQ0KICBuYW1lICAgICBTdHJpbmcgLy8g6L+e5o6l5ZCN56ewDQogIGhvc3QgICAgIFN0cmluZyAvLyDkuLvmnLrlnLDlnYANCiAgcG9ydCAgICAgSW50ICAgIEBkZWZhdWx0KDIyKSAvLyDnq6/lj6MNCiAgdXNlcm5hbWUgU3RyaW5nIC8vIOeUqOaIt+WQjQ0KDQogIC8vIOiupOivgeS/oeaBrw0KICBhdXRoVHlwZSAgICBTU0hBdXRoVHlwZSAgLy8g6K6k6K+B57G75Z6L5p6a5Li+DQogIHBhc3N3b3JkICAgIFN0cmluZz8gLy8g5a+G56CB77yI5Yqg5a+G5a2Y5YKo77yJDQogIHByaXZhdGVLZXkgIFN0cmluZz8gLy8g56eB6ZKl6Lev5b6E5oiW5YaF5a65DQogIHB1YmxpY0tleSAgIFN0cmluZz8gLy8g5YWs6ZKl5YaF5a65DQogIHBhc3NwaHJhc2UgIFN0cmluZz8gLy8g56eB6ZKl5a+G56CB77yI5Yqg5a+G5a2Y5YKo77yJDQoNCiAgLy8g6L+e5o6l54q25oCBDQogIHN0YXR1cyAgICAgICBDb25uZWN0aW9uU3RhdHVzICAgQGRlZmF1bHQoRElTQ09OTkVDVEVEKSAvLyDov57mjqXnirbmgIHmnprkuL4NCiAgbGFzdFVzZWQgICAgIERhdGVUaW1lPw0KICBpc0FjdGl2ZSAgICAgQm9vbGVhbiAgQGRlZmF1bHQodHJ1ZSkNCiAgY3JlYXRlZEF0ICAgIERhdGVUaW1lIEBkZWZhdWx0KG5vdygpKQ0KICB1cGRhdGVkQXQgICAgRGF0ZVRpbWUgQHVwZGF0ZWRBdA0KDQogIC8vIOi/nuaOpeWFg+aVsOaNriAtIEpTT04g5qC85byPDQogIG1ldGEgICAgICAgIEpzb24/ICAgICAgICAgICAgIC8vIOWtmOWCqOmineWklueahOWFg+aVsOaNruS/oeaBrw0KDQogIC8vIOWFs+iBlOeUqOaItw0KICB1c2VySWQgU3RyaW5nDQogIHVzZXIgICBVc2VyICAgQHJlbGF0aW9uKGZpZWxkczogW3VzZXJJZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlKQ0KDQogIC8vIOWFs+iBlOWFs+ezuw0KICBjb21tYW5kTG9ncyAgQ29tbWFuZExvZ1tdDQoNCiAgQEBtYXAoInNzaF9jb25uZWN0aW9ucyIpDQp9DQoNCmVudW0gU1NIQXV0aFR5cGUgew0KICBQQVNTV09SRA0KICBQUklWQVRFX0tFWQ0KICBTU0hfQUdFTlQNCn0NCg0KZW51bSBDb25uZWN0aW9uU3RhdHVzIHsNCiAgQ09OTkVDVEVEDQogIERJU0NPTk5FQ1RFRA0KICBDT05ORUNUSU5HDQogIEVSUk9SDQp9DQoNCi8vIOWRveS7pOaXpeW/l+ihqA0KbW9kZWwgQ29tbWFuZExvZyB7CiAgaWQgICAgICAgIFN0cmluZyAgIEBpZCBAZGVmYXVsdChjdWlkKCkpDQogIGNvbW1hbmQgICBTdHJpbmcgICAvLyDmiafooYznmoTlkb3ku6QNCiAgb3V0cHV0ICAgIFN0cmluZz8gIC8vIOWRveS7pOi+k+WHug0KICBleGl0Q29kZSAgSW50PyAgICAgLy8g6YCA5Ye656CBDQogIGR1cmF0aW9uICBJbnQ/ICAgICAvLyDmiafooYzml7bpl7TvvIjmr6vnp5LvvIkNCiAgY3JlYXRlZEF0IERhdGVUaW1lIEBkZWZhdWx0KG5vdygpKQ0KDQogIC8vIOWuieWFqOe6p+WIqw0KICBzYWZldHlMZXZlbCBTYWZldHlMZXZlbCBAZGVmYXVsdChTQUZFKSAvLyDlronlhajnuqfliKvmnprkuL4NCg0KICAvLyDlkb3ku6TlhYPmlbDmja4NCiAgbWV0YWRhdGEgICAgICBKc29uPyAgICAgICAvLyDpop3lpJbnmoTlhYPmlbDmja7kv6Hmga8NCg0KICAvLyDlhbPogZTnlKjmiLflkowgU1NIIOi/nuaOpQ0KICB1c2VySWQgU3RyaW5nDQogIHVzZXIgICBVc2VyICAgQHJlbGF0aW9uKGZpZWxkczogW3VzZXJJZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlKQ0KDQogIHNzaENvbm5lY3Rpb25JZCBTdHJpbmc/DQogIHNzaENvbm5lY3Rpb24gICBTU0hDb25uZWN0aW9uPyBAcmVsYXRpb24oZmllbGRzOiBbc3NoQ29ubmVjdGlvbklkXSwgcmVmZXJlbmNlczogW2lkXSkNCg0KICBAQG1hcCgiY29tbWFuZF9sb2dzIikKfQoKbW9kZWwgVXNlclN1YnNjcmlwdGlvbiB7CiAgaWQgICAgICAgICAgICAgU3RyaW5nICAgICAgICAgICAgICAgIEBpZCBAZGVmYXVsdChjdWlkKCkpCiAgdXNlcklkICAgICAgICAgU3RyaW5nICAgICAgICAgICAgICAgIEB1bmlxdWUKICB0cmlhbEV4cGlyZXNBdCBEYXRlVGltZT8KICBiYXNlUGxhblR5cGUgICBTdWJzY3JpcHRpb25QbGFuVHlwZT8KICBiYXNlRXhwaXJlc0F0ICBEYXRlVGltZT8KICBhaVBsYW5UeXBlICAgICBTdWJzY3JpcHRpb25QbGFuVHlwZT8KICBhaUV4cGlyZXNBdCAgICBEYXRlVGltZT8KICBjcmVhdGVkQXQgICAgICBEYXRlVGltZSAgICAgICAgICAgICAgQGRlZmF1bHQobm93KCkpCiAgdXBkYXRlZEF0ICAgICAgRGF0ZVRpbWUgICAgICAgICAgICAgIEB1cGRhdGVkQXQKCiAgdXNlciBVc2VyIEByZWxhdGlvbihmaWVsZHM6IFt1c2VySWRdLCByZWZlcmVuY2VzOiBbaWRdLCBvbkRlbGV0ZTogQ2FzY2FkZSkKCiAgQEBtYXAoInVzZXJfc3Vic2NyaXB0aW9ucyIpCn0KCm1vZGVsIFBheW1lbnRPcmRlciB7CiAgaWQgICAgICAgICAgICAgICAgIFN0cmluZyAgICAgICAgICAgICAgIEBpZCBAZGVmYXVsdChjdWlkKCkpCiAgYml6SWQgICAgICAgICAgICAgIFN0cmluZyAgICAgICAgICAgICAgIEB1bmlxdWUKICBzZXNzaW9uSWQgICAgICAgICAgU3RyaW5nICAgICAgICAgICAgICAgQHVuaXF1ZQogIHVzZXJJZCAgICAgICAgICAgICBTdHJpbmcKICBwbGFuQ29kZSAgICAgICAgICAgU3Vic2NyaXB0aW9uUGxhbkNvZGUKICBwYXltZW50UHJvZHVjdElkICAgU3RyaW5nCiAgYW1vdW50ICAgICAgICAgICAgIEludAogIHN0YXR1cyAgICAgICAgICAgICBQYXltZW50T3JkZXJTdGF0dXMgICBAZGVmYXVsdChQRU5ESU5HKQogIHBhaWRBdCAgICAgICAgICAgICBEYXRlVGltZT8KICBhY3RpdmF0ZWRBdCAgICAgICAgRGF0ZVRpbWU/CiAgcmF3UGxhdGZvcm1QYXlsb2FkIEpzb24/CiAgY3JlYXRlZEF0ICAgICAgICAgIERhdGVUaW1lICAgICAgICAgICAgIEBkZWZhdWx0KG5vdygpKQogIHVwZGF0ZWRBdCAgICAgICAgICBEYXRlVGltZSAgICAgICAgICAgICBAdXBkYXRlZEF0CgogIHVzZXIgVXNlciBAcmVsYXRpb24oZmllbGRzOiBbdXNlcklkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IENhc2NhZGUpCgogIEBAbWFwKCJwYXltZW50X29yZGVycyIpCn0KCmVudW0gU3Vic2NyaXB0aW9uUGxhblR5cGUgewogIE1PTlRITFkKICBZRUFSTFkKICBMSUZFVElNRQp9CgplbnVtIFN1YnNjcmlwdGlvblBsYW5Db2RlIHsKICBCQVNFX01PTlRITFkKICBCQVNFX1lFQVJMWQogIEJBU0VfTElGRVRJTUUKICBBSV9NT05USExZCiAgRlVMTF9NT05USExZCiAgRlVMTF9ZRUFSTFkKICBGVUxMX0xJRkVUSU1FCn0KCmVudW0gUGF5bWVudE9yZGVyU3RhdHVzIHsKICBQRU5ESU5HCiAgUEFJRAogIEFDVElWQVRFRAogIEVYUElSRUQKICBDTE9TRUQKICBGQUlMRUQKfQoNCmVudW0gU2FmZXR5TGV2ZWwgew0KICBTQUZFDQogIENBVVRJT04NCiAgREFOR0VST1VTDQp9DQo=",
  "inlineSchemaHash": "f4147c57c8d245429a70b49f292fa05abe6d1ddaccf8bce0a4c07358c74fc39e",
  "noEngine": false
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "src/generated/client-postgresql",
    "generated/client-postgresql",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"dbName\":\"users\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"uuid\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"username\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"password\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"avatar\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wechatOpenId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wechatUnionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"UserRole\",\"default\":\"USER\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"sshConnections\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SSHConnection\",\"relationName\":\"SSHConnectionToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"commandLogs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CommandLog\",\"relationName\":\"CommandLogToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userSettings\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserSettings\",\"relationName\":\"UserToUserSettings\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"subscription\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserSubscription\",\"relationName\":\"UserToUserSubscription\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paymentOrders\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PaymentOrder\",\"relationName\":\"PaymentOrderToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"UserSettings\":{\"dbName\":\"user_settings\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"UserToUserSettings\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SSHConnection\":{\"dbName\":\"ssh_connections\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"host\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"port\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":22,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"username\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"authType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SSHAuthType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"password\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"privateKey\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"publicKey\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"passphrase\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ConnectionStatus\",\"default\":\"DISCONNECTED\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastUsed\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"meta\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"SSHConnectionToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"commandLogs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CommandLog\",\"relationName\":\"CommandLogToSSHConnection\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CommandLog\":{\"dbName\":\"command_logs\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"command\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"output\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"exitCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"duration\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"safetyLevel\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"SafetyLevel\",\"default\":\"SAFE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"CommandLogToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sshConnectionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sshConnection\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SSHConnection\",\"relationName\":\"CommandLogToSSHConnection\",\"relationFromFields\":[\"sshConnectionId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"UserSubscription\":{\"dbName\":\"user_subscriptions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trialExpiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"basePlanType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SubscriptionPlanType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"baseExpiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aiPlanType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SubscriptionPlanType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aiExpiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"UserToUserSubscription\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PaymentOrder\":{\"dbName\":\"payment_orders\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bizId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"planCode\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SubscriptionPlanCode\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paymentProductId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"PaymentOrderStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paidAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"activatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rawPlatformPayload\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"PaymentOrderToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"UserRole\":{\"values\":[{\"name\":\"USER\",\"dbName\":null},{\"name\":\"ADMIN\",\"dbName\":null},{\"name\":\"PREMIUM\",\"dbName\":null}],\"dbName\":null},\"SSHAuthType\":{\"values\":[{\"name\":\"PASSWORD\",\"dbName\":null},{\"name\":\"PRIVATE_KEY\",\"dbName\":null},{\"name\":\"SSH_AGENT\",\"dbName\":null}],\"dbName\":null},\"ConnectionStatus\":{\"values\":[{\"name\":\"CONNECTED\",\"dbName\":null},{\"name\":\"DISCONNECTED\",\"dbName\":null},{\"name\":\"CONNECTING\",\"dbName\":null},{\"name\":\"ERROR\",\"dbName\":null}],\"dbName\":null},\"SubscriptionPlanType\":{\"values\":[{\"name\":\"MONTHLY\",\"dbName\":null},{\"name\":\"YEARLY\",\"dbName\":null},{\"name\":\"LIFETIME\",\"dbName\":null}],\"dbName\":null},\"SubscriptionPlanCode\":{\"values\":[{\"name\":\"BASE_MONTHLY\",\"dbName\":null},{\"name\":\"BASE_YEARLY\",\"dbName\":null},{\"name\":\"BASE_LIFETIME\",\"dbName\":null},{\"name\":\"AI_MONTHLY\",\"dbName\":null},{\"name\":\"FULL_MONTHLY\",\"dbName\":null},{\"name\":\"FULL_YEARLY\",\"dbName\":null},{\"name\":\"FULL_LIFETIME\",\"dbName\":null}],\"dbName\":null},\"PaymentOrderStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"PAID\",\"dbName\":null},{\"name\":\"ACTIVATED\",\"dbName\":null},{\"name\":\"EXPIRED\",\"dbName\":null},{\"name\":\"CLOSED\",\"dbName\":null},{\"name\":\"FAILED\",\"dbName\":null}],\"dbName\":null},\"SafetyLevel\":{\"values\":[{\"name\":\"SAFE\",\"dbName\":null},{\"name\":\"CAUTION\",\"dbName\":null},{\"name\":\"DANGEROUS\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.getQueryEngineWasmModule = undefined


const { warnEnvConflicts } = require('./runtime/library')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "query_engine-windows.dll.node");
path.join(process.cwd(), "src/generated/client-postgresql/query_engine-windows.dll.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "src/generated/client-postgresql/schema.prisma")
