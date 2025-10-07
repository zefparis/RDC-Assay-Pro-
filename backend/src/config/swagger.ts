import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { config } from './environment';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RDC Assay Pro API',
      version: '1.0.0',
      description: 'Professional mineral assay and certification platform API for the Democratic Republic of Congo',
      contact: {
        name: 'RDC Assay Pro Team',
        email: 'api@rdcassay.africa',
        url: 'https://rdcassay.africa',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: config.nodeEnv === 'production' 
          ? 'https://api.rdcassay.africa' 
          : `http://localhost:${config.port}`,
        description: config.nodeEnv === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            error: {
              type: 'string',
              example: 'Detailed error information',
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operation successful',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1,
                },
                limit: {
                  type: 'integer',
                  example: 10,
                },
                total: {
                  type: 'integer',
                  example: 100,
                },
                totalPages: {
                  type: 'integer',
                  example: 10,
                },
                hasNext: {
                  type: 'boolean',
                  example: true,
                },
                hasPrev: {
                  type: 'boolean',
                  example: false,
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            name: {
              type: 'string',
            },
            role: {
              type: 'string',
              enum: ['CLIENT', 'ADMIN', 'ANALYST', 'SUPERVISOR'],
            },
            company: {
              type: 'string',
              nullable: true,
            },
            phone: {
              type: 'string',
              nullable: true,
            },
            avatar: {
              type: 'string',
              format: 'uri',
              nullable: true,
            },
            isActive: {
              type: 'boolean',
            },
            isVerified: {
              type: 'boolean',
            },
            lastLoginAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Sample: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            sampleCode: {
              type: 'string',
              example: 'RC-240001',
            },
            mineral: {
              type: 'string',
              enum: ['CU', 'CO', 'LI', 'AU', 'SN', 'TA', 'W', 'ZN', 'PB', 'NI'],
            },
            site: {
              type: 'string',
              example: 'Kolwezi Mine',
            },
            status: {
              type: 'string',
              enum: ['RECEIVED', 'PREP', 'ANALYZING', 'QA_QC', 'REPORTED', 'CANCELLED'],
            },
            grade: {
              type: 'number',
              nullable: true,
              example: 3.12,
            },
            unit: {
              type: 'string',
              enum: ['PERCENT', 'GRAMS_PER_TON', 'PPM', 'OUNCES_PER_TON'],
            },
            mass: {
              type: 'number',
              example: 5.2,
            },
            notes: {
              type: 'string',
              nullable: true,
            },
            priority: {
              type: 'integer',
              minimum: 1,
              maximum: 3,
              example: 1,
            },
            receivedAt: {
              type: 'string',
              format: 'date-time',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Report: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            reportCode: {
              type: 'string',
              example: 'RPT-RC-240001',
            },
            grade: {
              type: 'number',
              example: 3.12,
            },
            unit: {
              type: 'string',
              enum: ['PERCENT', 'GRAMS_PER_TON', 'PPM', 'OUNCES_PER_TON'],
            },
            certified: {
              type: 'boolean',
            },
            hash: {
              type: 'string',
              example: 'A1B2C3D4E5F6...',
            },
            qrCode: {
              type: 'string',
              description: 'Base64 encoded QR code image',
              nullable: true,
            },
            notes: {
              type: 'string',
              nullable: true,
            },
            issuedAt: {
              type: 'string',
              format: 'date-time',
            },
            validUntil: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and profile management',
      },
      {
        name: 'Samples',
        description: 'Sample management and tracking',
      },
      {
        name: 'Reports',
        description: 'Report generation and certification',
      },
      {
        name: 'Dashboard',
        description: 'Analytics and dashboard data',
      },
      {
        name: 'Upload',
        description: 'File upload and management',
      },
      {
        name: 'Users',
        description: 'User management (admin only)',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API files
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'RDC Assay Pro API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  }));

  // Swagger JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};
