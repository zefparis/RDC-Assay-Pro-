import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rdcassay.africa' },
    update: {},
    create: {
      email: 'admin@rdcassay.africa',
      password: adminPassword,
      name: 'System Administrator',
      role: 'ADMIN',
      company: 'RDC Assay Pro',
      isActive: true,
      isVerified: true,
    },
  });

  // Create analyst user
  const analystPassword = await bcrypt.hash('analyst123', 12);
  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@rdcassay.africa' },
    update: {},
    create: {
      email: 'analyst@rdcassay.africa',
      password: analystPassword,
      name: 'Lab Analyst',
      role: 'ANALYST',
      company: 'RDC Assay Pro',
      isActive: true,
      isVerified: true,
    },
  });

  // Create client user
  const clientPassword = await bcrypt.hash('client123', 12);
  const client = await prisma.user.upsert({
    where: { email: 'client@mining-corp.cd' },
    update: {},
    create: {
      email: 'client@mining-corp.cd',
      password: clientPassword,
      name: 'Mining Client',
      role: 'CLIENT',
      company: 'Congo Mining Corp',
      isActive: true,
      isVerified: true,
    },
  });

  console.log('👤 Created users:', { admin: admin.id, analyst: analyst.id, client: client.id });

  // Create sample data
  const samples = await Promise.all([
    prisma.sample.create({
      data: {
        sampleCode: 'RC-240001',
        mineral: 'CU',
        site: 'Kolwezi Mine',
        status: 'REPORTED',
        grade: 3.12,
        unit: 'PERCENT',
        mass: 5.2,
        notes: 'High-grade copper ore from main shaft',
        clientId: client.id,
        priority: 2,
        completedAt: new Date(),
      },
    }),
    prisma.sample.create({
      data: {
        sampleCode: 'RC-240002',
        mineral: 'CO',
        site: 'Likasi Mine',
        status: 'ANALYZING',
        unit: 'PERCENT',
        mass: 3.8,
        notes: 'Cobalt concentrate sample',
        clientId: client.id,
        analystId: analyst.id,
        priority: 1,
      },
    }),
    prisma.sample.create({
      data: {
        sampleCode: 'RC-240003',
        mineral: 'AU',
        site: 'Kibali Mine',
        status: 'PREP',
        unit: 'GRAMS_PER_TON',
        mass: 2.1,
        notes: 'Gold ore from new exploration area',
        clientId: client.id,
        priority: 3,
      },
    }),
    prisma.sample.create({
      data: {
        sampleCode: 'RC-240004',
        mineral: 'LI',
        site: 'Manono Mine',
        status: 'RECEIVED',
        unit: 'PERCENT',
        mass: 4.5,
        notes: 'Lithium pegmatite sample',
        clientId: client.id,
        priority: 1,
      },
    }),
  ]);

  console.log('🧪 Created samples:', samples.map(s => s.sampleCode));

  // Create timeline events for samples
  for (const sample of samples) {
    await prisma.timelineEvent.create({
      data: {
        sampleId: sample.id,
        status: 'RECEIVED',
        notes: 'Sample received and logged into system',
        timestamp: sample.receivedAt,
      },
    });

    if (sample.status !== 'RECEIVED') {
      await prisma.timelineEvent.create({
        data: {
          sampleId: sample.id,
          status: 'PREP',
          notes: 'Sample preparation started',
          timestamp: new Date(sample.receivedAt.getTime() + 24 * 60 * 60 * 1000), // +1 day
        },
      });
    }

    if (sample.status === 'ANALYZING' || sample.status === 'REPORTED') {
      await prisma.timelineEvent.create({
        data: {
          sampleId: sample.id,
          status: 'ANALYZING',
          notes: 'Analysis in progress',
          userId: analyst.id,
          timestamp: new Date(sample.receivedAt.getTime() + 2 * 24 * 60 * 60 * 1000), // +2 days
        },
      });
    }

    if (sample.status === 'REPORTED') {
      await prisma.timelineEvent.create({
        data: {
          sampleId: sample.id,
          status: 'QA_QC',
          notes: 'Quality assurance check completed',
          userId: analyst.id,
          timestamp: new Date(sample.receivedAt.getTime() + 3 * 24 * 60 * 60 * 1000), // +3 days
        },
      });

      await prisma.timelineEvent.create({
        data: {
          sampleId: sample.id,
          status: 'REPORTED',
          notes: 'Report generated and certified',
          userId: analyst.id,
          timestamp: sample.completedAt || new Date(),
        },
      });
    }
  }

  // Create report for completed sample
  const completedSample = samples.find(s => s.status === 'REPORTED');
  if (completedSample) {
    const reportCode = `RPT-${completedSample.sampleCode}`;
    const hash = 'A1B2C3D4E5F6789012345678901234567890ABCDEF1234567890ABCDEF123456';
    
    await prisma.report.create({
      data: {
        sampleId: completedSample.id,
        reportCode,
        grade: completedSample.grade!,
        unit: completedSample.unit,
        certified: true,
        hash,
        notes: 'Certified analysis report',
        issuedBy: analyst.id,
      },
    });

    console.log('📋 Created report:', reportCode);
  }

  // Create system configuration
  await prisma.systemConfig.upsert({
    where: { key: 'system_version' },
    update: { value: '1.0.0' },
    create: {
      key: 'system_version',
      value: '1.0.0',
      description: 'Current system version',
    },
  });

  await prisma.systemConfig.upsert({
    where: { key: 'maintenance_mode' },
    update: { value: 'false' },
    create: {
      key: 'maintenance_mode',
      value: 'false',
      description: 'System maintenance mode flag',
    },
  });

  console.log('⚙️ Created system configuration');

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📝 Test credentials:');
  console.log('Admin: admin@rdcassay.africa / admin123');
  console.log('Analyst: analyst@rdcassay.africa / analyst123');
  console.log('Client: client@mining-corp.cd / client123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
