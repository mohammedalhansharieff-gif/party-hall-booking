import { prisma } from './src/config/db';
import { getHalls, getHallById } from './src/modules/halls/hall.service';
import { getSlotAvailability } from './src/modules/availability/availability.service';
import { createBooking, cancelBookingByCustomer, confirmBookingPayment } from './src/modules/bookings/booking.service';
import { adminLogin, getDashboardStats, confirmBooking } from './src/modules/admin/admin.service';

async function runTests() {
  console.log('🧪 Starting System Verification Tests...\n');

  // Test 1: Fetch halls
  console.log('1️⃣ Testing Hall Retrieval...');
  const halls = await getHalls({});
  console.log(`   Found ${halls.length} active halls.`);
  if (halls.length === 0) throw new Error('No halls found');
  const testHall = halls[0];
  console.log(`   Selected test hall: "${testHall.name}" (ID: ${testHall.id})\n`);

  // Test 2: Check Availability on future date
  console.log('2️⃣ Testing Slot Availability Check...');
  const testDate = '2026-11-20';
  const avail = await getSlotAvailability(testHall.id, testDate);
  console.log(`   Date: ${avail.date}`);
  console.log(`   Total Slots: ${avail.slots.length}`);
  const availableSlots = avail.slots.filter((s) => s.available);
  console.log(`   Available Slots: ${availableSlots.length}`);
  if (availableSlots.length === 0) throw new Error('No available slots');
  const targetSlot = availableSlots[0];
  console.log(`   Chosen slot for booking: "${targetSlot.label}" (Slot ID: ${targetSlot.id})\n`);

  // Test 3: Create Booking
  console.log('3️⃣ Testing Booking Creation & Race-Condition Safe Transaction...');
  const bookingResult = await createBooking({
    hallId: testHall.id,
    timeSlotId: targetSlot.id,
    date: testDate,
    customerName: 'Test Automator',
    customerEmail: 'test.automator@example.com',
    customerPhone: '9988776655',
    guestCount: 250,
    specialRequests: 'Automated test booking request',
  });
  const createdRef = bookingResult.booking.bookingRef;
  console.log(`   ✅ Booking created successfully! Reference: ${createdRef}`);
  console.log(`   Amount: ₹${bookingResult.booking.totalAmount}`);
  console.log(`   Status: ${bookingResult.booking.status}\n`);

  // Test 4: Conflict Guard Test (Trying to book the same slot on the same date)
  console.log('4️⃣ Testing Duplicate Booking Prevention (Conflict Guard)...');
  try {
    await createBooking({
      hallId: testHall.id,
      timeSlotId: targetSlot.id,
      date: testDate,
      customerName: 'Duplicate Attempter',
      customerEmail: 'duplicate@example.com',
      customerPhone: '9988776655',
    });
    throw new Error('❌ Test failed: Duplicate booking was NOT rejected!');
  } catch (err: any) {
    if (err.message.includes('SLOT_ALREADY_BOOKED')) {
      console.log('   ✅ Conflict Guard successfully caught duplicate slot request:', err.message);
    } else {
      throw err;
    }
  }

  // Test 5: Verify Availability updated
  console.log('\n5️⃣ Verifying Slot Availability status has changed to BOOKED/PENDING...');
  const availAfter = await getSlotAvailability(testHall.id, testDate);
  const recheckedSlot = availAfter.slots.find((s) => s.id === targetSlot.id);
  if (!recheckedSlot || recheckedSlot.available) {
    throw new Error('❌ Slot should now be unavailable, but returned available!');
  }
  console.log(`   ✅ Slot "${recheckedSlot.label}" is correctly marked unavailable (Status: ${recheckedSlot.status})\n`);

  // Test 6: Payment Confirmation
  console.log('6️⃣ Testing Payment Confirmation...');
  const paidBooking = await confirmBookingPayment(createdRef, {
    paymentId: 'pay_test_verified_123',
  });
  console.log(`   ✅ Payment status: ${paidBooking.paymentStatus}, Booking status: ${paidBooking.status}\n`);

  // Test 7: Admin Login & Dashboard Stats
  console.log('7️⃣ Testing Admin Authentication & Stats...');
  const auth = await adminLogin('admin@hallbooking.com', 'admin123');
  console.log(`   ✅ Admin authenticated: ${auth.admin.name} (Role: ${auth.admin.role})`);
  const stats = await getDashboardStats();
  console.log(`   Dashboard stats -> Total Bookings: ${stats.totalBookings}, Revenue: ₹${stats.monthlyRevenue}, Occupancy: ${stats.occupancyRate}%\n`);

  // Clean up test booking
  await prisma.booking.delete({ where: { bookingRef: createdRef } });
  console.log('🧹 Test booking cleaned up.\n');

  console.log('🎉 ALL SYSTEM TESTS PASSED SUCCESSFULLY! 🚀');
}

runTests()
  .catch((err) => {
    console.error('Test Failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
