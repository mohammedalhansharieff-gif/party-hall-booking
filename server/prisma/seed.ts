import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Admin User
  const adminEmail = 'admin@hallbooking.com';
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 12);
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
      },
    });
    console.log('✅ Admin user created: admin@hallbooking.com / admin123');
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  // 2. Seed Time Slots
  const timeSlotsData = [
    { label: 'Morning', startTime: '09:00', endTime: '14:00', defaultPrice: 20000 },
    { label: 'Evening', startTime: '18:00', endTime: '23:00', defaultPrice: 35000 },
    { label: 'Full Day', startTime: '09:00', endTime: '23:00', defaultPrice: 50000 },
  ];

  const createdTimeSlots = [];
  for (const slot of timeSlotsData) {
    let s = await prisma.timeSlot.findFirst({ where: { label: slot.label } });
    if (!s) {
      s = await prisma.timeSlot.create({ data: slot });
    }
    createdTimeSlots.push(s);
  }
  console.log(`✅ ${createdTimeSlots.length} Time slots ready`);

  // 3. Seed Halls
  const hallsData = [
    {
      name: 'Grand Imperial Ballroom',
      description:
        'A magnificent luxury ballroom featuring crystal chandeliers, Italian marble flooring, and grand stage lighting. Ideal for grand weddings, receptions, and premium galas.',
      capacity: 850,
      location: 'Victoria Boulevard, Central City',
      pricePerSlot: 45000,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      ]),
      amenities: JSON.stringify([
        'Central Air Conditioning',
        'Bridal Suite with Dressing Room',
        'Stage & Ambient Lighting',
        'In-house Sound System',
        'Valet Parking (250+ cars)',
        'Backup Generator',
        'Live Buffet Kitchen Area',
      ]),
      isActive: true,
    },
    {
      name: 'Royal Crystal Banquet',
      description:
        'An elegant contemporary banquet hall suited for engagement ceremonies, corporate celebrations, anniversary dinners, and family milestones.',
      capacity: 450,
      location: 'Lakefront Enclave, North Avenue',
      pricePerSlot: 28000,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
      ]),
      amenities: JSON.stringify([
        'Central AC',
        'LED Projection Screen',
        'Dedicated Buffet Area',
        'Sound & DJ Booth',
        'Ample Free Parking',
        'VIP Green Room',
      ]),
      isActive: true,
    },
    {
      name: 'Emerald Blossom Lawn & Glass Pavilion',
      description:
        'A stunning open-air landscaped lawn paired with a climate-controlled glass pavilion. Perfect for dream fairy-tale weddings, sangeet nights, and open sky receptions.',
      capacity: 1200,
      location: 'Green Valley Hills, Ring Road',
      pricePerSlot: 65000,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=80',
      ]),
      amenities: JSON.stringify([
        'Lush Manicured Green Lawn',
        'Weatherproof Glass Pavilion',
        'Fairy Light Canopy',
        'Gazebo for Mandap / Stage',
        'Dedicated Firework Zone',
        'Private Valet Parking (400 cars)',
        '2 Luxury Changing Rooms',
      ]),
      isActive: true,
    },
    {
      name: 'Sapphire Heritage Convention Hall',
      description:
        'A traditional yet modern hall featuring handcrafted wooden decor, spacious seating, and acoustics tuned for weddings, cultural festivals, and ceremonies.',
      capacity: 350,
      location: 'Heritage Square, Old Town Crossing',
      pricePerSlot: 22000,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80',
      ]),
      amenities: JSON.stringify([
        'Traditional Floral Stage Setup',
        'Dining Hall for 200 seating',
        'Air Conditioning',
        'Audio Equipment & Mics',
        'Spacious Kitchen Facility',
      ]),
      isActive: true,
    },
  ];

  for (const hallData of hallsData) {
    let hall = await prisma.hall.findFirst({ where: { name: hallData.name } });
    if (!hall) {
      hall = await prisma.hall.create({ data: hallData });
      console.log(`✅ Hall created: ${hall.name}`);

      // Link all time slots
      for (const slot of createdTimeSlots) {
        let price = hall.pricePerSlot;
        if (slot.label === 'Full Day') price = hall.pricePerSlot * 1.8;
        if (slot.label === 'Evening') price = hall.pricePerSlot * 1.2;

        await prisma.hallTimeSlot.create({
          data: {
            hallId: hall.id,
            timeSlotId: slot.id,
            price,
          },
        });
      }
    }
  }

  // 4. Seed a few sample bookings for upcoming dates
  const hall1 = await prisma.hall.findFirst({ where: { name: 'Grand Imperial Ballroom' } });
  const eveningSlot = createdTimeSlots.find((s) => s.label === 'Evening');
  const morningSlot = createdTimeSlots.find((s) => s.label === 'Morning');

  if (hall1 && eveningSlot && morningSlot) {
    const existingSample = await prisma.booking.findFirst({ where: { hallId: hall1.id } });
    if (!existingSample) {
      // 3 days from now
      const date1 = new Date();
      date1.setDate(date1.getDate() + 3);
      date1.setHours(0, 0, 0, 0);

      await prisma.booking.create({
        data: {
          bookingRef: 'HALL-2026-EXMP1',
          hallId: hall1.id,
          timeSlotId: eveningSlot.id,
          date: date1,
          status: 'CONFIRMED',
          customerName: 'Rahul Sharma',
          customerEmail: 'rahul.sharma@example.com',
          customerPhone: '9876543210',
          guestCount: 450,
          specialRequests: 'Need stage decorated with white lilies and golden backdrop.',
          totalAmount: 54000,
          paymentStatus: 'PAID',
          paymentId: 'pay_sample_101',
        },
      });

      // 7 days from now (Pending)
      const date2 = new Date();
      date2.setDate(date2.getDate() + 7);
      date2.setHours(0, 0, 0, 0);

      await prisma.booking.create({
        data: {
          bookingRef: 'HALL-2026-EXMP2',
          hallId: hall1.id,
          timeSlotId: morningSlot.id,
          date: date2,
          status: 'PENDING',
          customerName: 'Priya Patel',
          customerEmail: 'priya.patel@example.com',
          customerPhone: '9812345678',
          guestCount: 200,
          specialRequests: 'Vegetarian catering area setup requested.',
          totalAmount: 45000,
          paymentStatus: 'UNPAID',
        },
      });

      console.log('✅ Sample bookings created');
    }
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
