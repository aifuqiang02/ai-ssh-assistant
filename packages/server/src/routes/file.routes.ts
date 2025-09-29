import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { logger } from '../utils/safe-logger.js'

export async function fileRoutes(fastify: FastifyInstance) {
  // 获取文件列表
  fastify.get('/list', {
    schema: {
      description: '获取远程服务器文件列表',
      tags: ['文件'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        required: ['connectionId'],
        properties: {
          connectionId: { type: 'string' },
          path: { type: 'string', default: '/' },
          showHidden: { type: 'boolean', default: false },
          sortBy: { type: 'string', enum: ['name', 'size', 'modified'], default: 'name' },
          sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'asc' }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{
    Querystring: {
      connectionId: string
      path?: string
      showHidden?: boolean
      sortBy?: string
      sortOrder?: string
    }
  }>, reply: FastifyReply) => {
    try {
      const { connectionId, path = '/', showHidden = false, sortBy = 'name', sortOrder = 'asc' } = request.query

      logger.info(`Getting file list for connection ${connectionId}, path: ${path}`)

      // 模拟文件列表
      const files = [
        {
          name: '..',
          type: 'directory',
          size: 0,
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          modified: new Date('2024-01-01').toISOString(),
          isParent: true
        },
        {
          name: 'home',
          type: 'directory',
          size: 4096,
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          modified: new Date('2024-01-15').toISOString()
        },
        {
          name: 'var',
          type: 'directory',
          size: 4096,
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          modified: new Date('2024-01-10').toISOString()
        },
        {
          name: 'etc',
          type: 'directory',
          size: 4096,
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          modified: new Date('2024-01-20').toISOString()
        },
        {
          name: 'readme.txt',
          type: 'file',
          size: 1024,
          permissions: '-rw-r--r--',
          owner: 'root',
          group: 'root',
          modified: new Date('2024-01-18').toISOString()
        },
        {
          name: '.bashrc',
          type: 'file',
          size: 3072,
          permissions: '-rw-r--r--',
          owner: 'root',
          group: 'root',
          modified: new Date('2024-01-05').toISOString(),
          isHidden: true
        }
      ]

      // 过滤隐藏文件
      const filteredFiles = showHidden 
        ? files 
        : files.filter(f => !f.isHidden && !f.name.startsWith('.') || f.isParent)

      // 排序
      filteredFiles.sort((a, b) => {
        // 目录优先
        if (a.type === 'directory' && b.type !== 'directory') return -1
        if (a.type !== 'directory' && b.type === 'directory') return 1

        let compareValue = 0
        switch (sortBy) {
          case 'size':
            compareValue = a.size - b.size
            break
          case 'modified':
            compareValue = new Date(a.modified).getTime() - new Date(b.modified).getTime()
            break
          default:
            compareValue = a.name.localeCompare(b.name)
        }

        return sortOrder === 'desc' ? -compareValue : compareValue
      })

      return reply.send({
        success: true,
        data: {
          path,
          files: filteredFiles,
          totalSize: filteredFiles.reduce((sum, f) => sum + f.size, 0),
          count: filteredFiles.length
        }
      })
    } catch (error) {
      logger.error('Get file list error:', error)
      return reply.status(500).send({
        success: false,
        message: '获取文件列表失败',
        code: 'GET_FILE_LIST_ERROR'
      })
    }
  })

  // 上传文件
  fastify.post('/upload', {
    schema: {
      description: '上传文件到远程服务器',
      tags: ['文件'],
      security: [{ bearerAuth: [] }],
      consumes: ['multipart/form-data']
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = await request.file()
      
      if (!data) {
        return reply.status(400).send({
          success: false,
          message: '没有上传文件',
          code: 'NO_FILE_UPLOADED'
        })
      }

      const connectionId = (data.fields.connectionId as any)?.value as string
      const remotePath = ((data.fields.remotePath as any)?.value as string) || '/'

      if (!connectionId) {
        return reply.status(400).send({
          success: false,
          message: '缺少连接ID',
          code: 'MISSING_CONNECTION_ID'
        })
      }

      logger.info(`Uploading file ${data.filename} to ${remotePath} on connection ${connectionId}`)

      // 模拟文件上传
      const uploadResult = {
        filename: data.filename,
        size: data.file.bytesRead || 0,
        remotePath: `${remotePath}/${data.filename}`,
        connectionId,
        uploadTime: new Date().toISOString(),
        checksum: 'md5:' + Math.random().toString(36).substring(7)
      }

      return reply.send({
        success: true,
        message: '文件上传成功',
        data: uploadResult
      })
    } catch (error) {
      logger.error('File upload error:', error)
      return reply.status(500).send({
        success: false,
        message: '文件上传失败',
        code: 'FILE_UPLOAD_ERROR'
      })
    }
  })

  // 下载文件
  fastify.get('/download', {
    schema: {
      description: '从远程服务器下载文件',
      tags: ['文件'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        required: ['connectionId', 'filePath'],
        properties: {
          connectionId: { type: 'string' },
          filePath: { type: 'string' }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{
    Querystring: {
      connectionId: string
      filePath: string
    }
  }>, reply: FastifyReply) => {
    try {
      const { connectionId, filePath } = request.query

      logger.info(`Downloading file ${filePath} from connection ${connectionId}`)

      // 模拟文件内容
      const fileContent = `这是来自服务器的文件内容：${filePath}\n生成时间：${new Date().toISOString()}`
      const filename = filePath.split('/').pop() || 'download.txt'

      reply.header('Content-Disposition', `attachment; filename="${filename}"`)
      reply.type('application/octet-stream')
      
      return reply.send(fileContent)
    } catch (error) {
      logger.error('File download error:', error)
      return reply.status(500).send({
        success: false,
        message: '文件下载失败',
        code: 'FILE_DOWNLOAD_ERROR'
      })
    }
  })

  // 删除文件
  fastify.delete('/', {
    schema: {
      description: '删除远程服务器文件',
      tags: ['文件'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['connectionId', 'filePath'],
        properties: {
          connectionId: { type: 'string' },
          filePath: { type: 'string' },
          force: { type: 'boolean', default: false }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{
    Body: {
      connectionId: string
      filePath: string
      force?: boolean
    }
  }>, reply: FastifyReply) => {
    try {
      const { connectionId, filePath, force = false } = request.body

      logger.info(`Deleting file ${filePath} from connection ${connectionId}, force: ${force}`)

      // 模拟删除操作
      const deleteResult = {
        filePath,
        connectionId,
        deleted: true,
        deletedAt: new Date().toISOString()
      }

      return reply.send({
        success: true,
        message: '文件删除成功',
        data: deleteResult
      })
    } catch (error) {
      logger.error('File delete error:', error)
      return reply.status(500).send({
        success: false,
        message: '文件删除失败',
        code: 'FILE_DELETE_ERROR'
      })
    }
  })

  // 创建目录
  fastify.post('/directory', {
    schema: {
      description: '在远程服务器创建目录',
      tags: ['文件'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['connectionId', 'dirPath'],
        properties: {
          connectionId: { type: 'string' },
          dirPath: { type: 'string' },
          permissions: { type: 'string', pattern: '^[0-7]{3,4}$', default: '755' }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{
    Body: {
      connectionId: string
      dirPath: string
      permissions?: string
    }
  }>, reply: FastifyReply) => {
    try {
      const { connectionId, dirPath, permissions = '755' } = request.body

      logger.info(`Creating directory ${dirPath} on connection ${connectionId} with permissions ${permissions}`)

      const createResult = {
        dirPath,
        connectionId,
        permissions,
        created: true,
        createdAt: new Date().toISOString()
      }

      return reply.status(201).send({
        success: true,
        message: '目录创建成功',
        data: createResult
      })
    } catch (error) {
      logger.error('Create directory error:', error)
      return reply.status(500).send({
        success: false,
        message: '目录创建失败',
        code: 'CREATE_DIRECTORY_ERROR'
      })
    }
  })

  // 获取文件内容
  fastify.get('/content', {
    schema: {
      description: '获取远程服务器文件内容',
      tags: ['文件'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        required: ['connectionId', 'filePath'],
        properties: {
          connectionId: { type: 'string' },
          filePath: { type: 'string' },
          encoding: { type: 'string', default: 'utf-8' },
          maxSize: { type: 'integer', default: 1048576 } // 1MB
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{
    Querystring: {
      connectionId: string
      filePath: string
      encoding?: string
      maxSize?: number
    }
  }>, reply: FastifyReply) => {
    try {
      const { connectionId, filePath, encoding = 'utf-8', maxSize = 1048576 } = request.query

      logger.info(`Getting content of file ${filePath} from connection ${connectionId}`)

      // 模拟文件内容
      const content = `# 这是文件 ${filePath} 的内容

这是一个示例文件，用于演示文件内容获取功能。

文件路径：${filePath}
连接ID：${connectionId}
编码：${encoding}
读取时间：${new Date().toISOString()}

## 示例配置
server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    index index.html;
}
`

      return reply.send({
        success: true,
        data: {
          filePath,
          content,
          encoding,
          size: content.length,
          lines: content.split('\n').length,
          lastModified: new Date().toISOString()
        }
      })
    } catch (error) {
      logger.error('Get file content error:', error)
      return reply.status(500).send({
        success: false,
        message: '获取文件内容失败',
        code: 'GET_FILE_CONTENT_ERROR'
      })
    }
  })
}

