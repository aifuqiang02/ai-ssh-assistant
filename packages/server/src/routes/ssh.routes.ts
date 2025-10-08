import { FastifyPluginAsync } from 'fastify'
import { SSHService } from '../services/ssh.service.js'
import Database from '../config/database.js'
import { successResponseSchema } from '../schemas/common.schema.js'

export const sshRoutes: FastifyPluginAsync = async (fastify) => {
  const prisma = Database.getInstance()
  const sshService = new SSHService(prisma)

  // 获取用户的 SSH 树形结构
  fastify.get('/tree', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['SSH'],
      summary: '获取用户的 SSH 树形结构',
      response: successResponseSchema
    }
  }, async (request, reply) => {
    const userId = (request.user as any).userId
    const tree = await sshService.getUserSSHTree(userId)
    
    return reply.send({
      success: true,
      data: tree
    })
  })

  // 创建文件夹
  fastify.post('/folders', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['SSH'],
      summary: '创建 SSH 文件夹',
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          parentId: { type: 'string', nullable: true },
          order: { type: 'number' }
        }
      },
      response: successResponseSchema
    }
  }, async (request, reply) => {
    const userId = (request.user as any).userId
    const data = request.body as any
    
    const folder = await sshService.createFolder(userId, data)
    
    // 手动构造返回对象，确保所有字段都被正确序列化
    const folderData = {
      id: folder.id,
      name: folder.name,
      order: folder.order,
      isActive: folder.isActive,
      parentId: folder.parentId,
      userId: folder.userId,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt
    }
    
    return reply.status(201).send({
      success: true,
      message: '文件夹创建成功',
      data: folderData
    })
  })

  // 更新文件夹
  fastify.put('/folders/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['SSH'],
      summary: '更新 SSH 文件夹',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          parentId: { type: 'string', nullable: true },
          order: { type: 'number' }
        }
      }
    }
  }, async (request, reply) => {
    const userId = (request.user as any).userId
    const { id } = request.params as any
    const data = request.body as any
    
    const folder = await sshService.updateFolder(id, userId, data)
    
    return reply.send({
      success: true,
      message: '文件夹更新成功',
      data: folder
    })
  })

  // 删除文件夹
  fastify.delete('/folders/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['SSH'],
      summary: '删除 SSH 文件夹',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const userId = (request.user as any).userId
    const { id } = request.params as any
    
    await sshService.deleteFolder(id, userId)
    
    return reply.send({
      success: true,
      message: '文件夹删除成功'
    })
  })

  // 创建 SSH 连接
  fastify.post('/connections', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['SSH'],
      summary: '创建 SSH 连接',
      body: {
        type: 'object',
        required: ['name', 'host', 'username', 'authType'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          host: { type: 'string' },
          port: { type: 'number' },
          username: { type: 'string' },
          authType: { type: 'string', enum: ['PASSWORD', 'PRIVATE_KEY', 'SSH_AGENT'] },
          password: { type: 'string', nullable: true },
          privateKey: { type: 'string', nullable: true },
          publicKey: { type: 'string', nullable: true },
          passphrase: { type: 'string', nullable: true },
          folderId: { type: 'string', nullable: true },
          order: { type: 'number' },
          meta: { type: 'object', nullable: true }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const userId = (request.user as any).userId
    const data = request.body as any
    
    const connection = await sshService.createConnection(userId, data)
    
    return reply.status(201).send({
      success: true,
      message: 'SSH 连接创建成功',
      data: connection
    })
  })

  // 更新 SSH 连接
  fastify.put('/connections/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['SSH'],
      summary: '更新 SSH 连接',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          host: { type: 'string' },
          port: { type: 'number' },
          username: { type: 'string' },
          authType: { type: 'string', enum: ['PASSWORD', 'PRIVATE_KEY', 'SSH_AGENT'] },
          password: { type: 'string', nullable: true },
          privateKey: { type: 'string', nullable: true },
          publicKey: { type: 'string', nullable: true },
          passphrase: { type: 'string', nullable: true },
          folderId: { type: 'string', nullable: true },
          order: { type: 'number' },
          meta: { type: 'object', nullable: true }
        }
      }
    }
  }, async (request, reply) => {
    const userId = (request.user as any).userId
    const { id } = request.params as any
    const data = request.body as any
    
    const connection = await sshService.updateConnection(id, userId, data)
    
    return reply.send({
      success: true,
      message: 'SSH 连接更新成功',
      data: connection
    })
  })

  // 删除 SSH 连接
  fastify.delete('/connections/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['SSH'],
      summary: '删除 SSH 连接',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const userId = (request.user as any).userId
    const { id } = request.params as any
    
    await sshService.deleteConnection(id, userId)
    
    return reply.send({
      success: true,
      message: 'SSH 连接删除成功'
    })
  })

  // 移动节点
  fastify.post('/move', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['SSH'],
      summary: '移动文件夹或连接',
      body: {
        type: 'object',
        required: ['nodeId', 'nodeType'],
        properties: {
          nodeId: { type: 'string' },
          nodeType: { type: 'string', enum: ['folder', 'connection'] },
          targetFolderId: { type: 'string', nullable: true },
          order: { type: 'number' }
        }
      }
    }
  }, async (request, reply) => {
    const userId = (request.user as any).userId
    const data = request.body as any
    
    await sshService.moveNode(userId, data)
    
    return reply.send({
      success: true,
      message: '移动成功'
    })
  })

  // 测试 SSH 连接
  fastify.post('/test-connection', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['SSH'],
      summary: '测试 SSH 连接',
      body: {
        type: 'object',
        required: ['host', 'username', 'authType'],
        properties: {
          host: { type: 'string' },
          port: { type: 'number' },
          username: { type: 'string' },
          authType: { type: 'string', enum: ['PASSWORD', 'PRIVATE_KEY', 'SSH_AGENT'] },
          password: { type: 'string', nullable: true },
          privateKey: { type: 'string', nullable: true },
          passphrase: { type: 'string', nullable: true }
        }
      },
      response: successResponseSchema
    }
  }, async (request, reply) => {
    const data = request.body as any
    
    const result = await sshService.testConnection(data)
    
    return reply.send({
      success: true,
      message: result.connected ? '连接测试成功' : '连接测试失败',
      data: result
    })
  })
}
