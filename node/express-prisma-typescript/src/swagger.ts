// src/swagger.ts
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'
import { Constants } from '@utils'

export function setupSwagger (app: Express): void {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API Documentation for your project'
      },
      servers: [
        {
          url: `https://twitter-backend.up.railway.app:${Constants.PORT || 3000}`,
          description: 'Railway server'
        }
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [
        {
          BearerAuth: []
        }
      ]
    },
    apis: ['./src/domains/**/*.ts']
  }

  const swaggerDocs = swaggerJsDoc(swaggerOptions)

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
}
