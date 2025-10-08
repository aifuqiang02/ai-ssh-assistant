import { FastifyPluginAsync } from 'fastify'
import { ChatService } from '../services/chat.service.js'
import Database from '../config/database.js'
import { successResponseSchema } from '../schemas/common.schema.js'

export const chatRoutes: FastifyPluginAsync = async (fastify) => {
  const prisma = Database.getInstance()
  const chatService = new ChatService(prisma)

  // 获取用户的聊天树形结构
  fastify.get('/tree', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Chat'],
      summary: '获取用户的聊天树形结构',
      response: successResponseSchema
    }
  }, async (request, reply) => {
    const userId = (request.user as any).userId
    const tree = await chatService.getUserChatTree(userId)
    
    return reply.send({
      success: true,
      data: tree
    })
  })

  // 创建文件夹
  fastify.post('/folders', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Chat'],
      summary: '创建聊天文件夹',
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
    
    const folder = await chatService.createFolder(userId, data)
    
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
      tags: ['Chat'],
      summary: '更新聊天文件夹',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          parentId: { type: 'string', nullable: true },
          order: { type: 'number' }
        }
      },
      response: successResponseSchema
    }
  }, async (request, reply) => {
    const userId = (request.user as any).userId
    const folderId = (request.params as any).id
    const data = request.body as any
    
    const folder = await chatService.updateFolder(userId, folderId, data)
    
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
      tags: ['Chat'],
      summary: '删除聊天文件夹',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      response: successResponseSchema
    }
  }, async (request, reply) => {
    const userId = (request.user as any).userId
    const folderId = (request.params as any).id
    
    await chatService.deleteFolder(userId, folderId)
    
    return reply.send({
      success: true,
      message: '文件夹删除成功'
    })
  })

  // 创建会话
  fastify.post('/sessions', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Chat'],
      summary: '创建聊天会话',
      body: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 200 },
          folderId: { type: 'string', nullable: true },
          order: { type: 'number' },
          model: { type: 'string' }
        }
      },
      response: successResponseSchema
    }
  }, async (request, reply) => {
    const userId = (request.user as any).userId
    const data = request.body as any
    
    const session = await chatService.createSession(userId, data)
    
    return reply.status(201).send({
      success: true,
      message: '会话创建成功',
      data: session
    })
  })

  // 更新会话
  fastify.put('/sessions/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Chat'],
      summary: '更新聊天会话',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          folderId: { type: 'string', nullable: true },
          order: { type: 'number' },
          model: { type: 'string' }
        }
      },
      response: successResponseSchema
    }
  }, async (request, reply) => {
    const userId = (request.user as any).userId
    const sessionId = (request.params as any).id
    const data = request.body as any
    
    const session = await chatService.updateSession(userId, sessionId, data)
    
    return reply.send({
      success: true,
      message: '会话更新成功',
      data: session
    })
  })

  // 删除会话
  fastify.delete('/sessions/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Chat'],
      summary: '删除聊天会话',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      response: successResponseSchema
    }
  }, async (request, reply) => {
    const userId = (request.user as any).userId
    const sessionId = (request.params as any).id
    
    await chatService.deleteSession(userId, sessionId)
    
    return reply.send({
      success: true,
      message: '会话删除成功'
    })
  })

  // 移动节点
  fastify.post('/move', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Chat'],
      summary: '移动聊天节点（文件夹或会话）',
      body: {
        type: 'object',
        required: ['nodeId'],
        properties: {
          nodeId: { type: 'string' },
          targetFolderId: { type: 'string', nullable: true },
          order: { type: 'number' }
        }
      },
      response: successResponseSchema
    }
  }, async (request, reply) => {
    const userId = (request.user as any).userId
    const data = request.body as any
    
    const result = await chatService.moveNode(userId, data)
    
    return reply.send({
      success: true,
      message: '节点移动成功',
      data: result
    })
  })
}
