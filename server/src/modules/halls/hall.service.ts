import { prisma } from '../../config/db';

export const formatHall = (hall: any) => {
  let images: string[] = [];
  let amenities: string[] = [];

  try {
    images = hall.images ? (typeof hall.images === 'string' ? JSON.parse(hall.images) : hall.images) : [];
  } catch {
    images = [];
  }

  try {
    amenities = hall.amenities ? (typeof hall.amenities === 'string' ? JSON.parse(hall.amenities) : hall.amenities) : [];
  } catch {
    amenities = [];
  }

  return {
    ...hall,
    images,
    amenities,
    timeSlots: hall.timeSlots?.map((hts: any) => ({
      id: hts.timeSlot.id,
      label: hts.timeSlot.label,
      startTime: hts.timeSlot.startTime,
      endTime: hts.timeSlot.endTime,
      price: hts.price ?? hall.pricePerSlot ?? hts.timeSlot.defaultPrice,
    })) || [],
  };
};

export const getHalls = async (filters: {
  search?: string;
  minCapacity?: number;
  maxPrice?: number;
  includeInactive?: boolean;
}) => {
  const where: any = {};

  if (!filters.includeInactive) {
    where.isActive = true;
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { location: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  if (filters.minCapacity) {
    where.capacity = { gte: filters.minCapacity };
  }

  if (filters.maxPrice) {
    where.pricePerSlot = { lte: filters.maxPrice };
  }

  const halls = await prisma.hall.findMany({
    where,
    include: {
      timeSlots: {
        include: {
          timeSlot: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return halls.map(formatHall);
};

export const getHallById = async (id: number) => {
  const hall = await prisma.hall.findUnique({
    where: { id },
    include: {
      timeSlots: {
        include: {
          timeSlot: true,
        },
      },
    },
  });

  if (!hall) return null;
  return formatHall(hall);
};

export const createHall = async (data: {
  name: string;
  description?: string;
  capacity: number;
  location?: string;
  pricePerSlot: number;
  images?: string[];
  amenities?: string[];
  isActive?: boolean;
  timeSlotIds?: number[];
}) => {
  const imagesJson = JSON.stringify(data.images || []);
  const amenitiesJson = JSON.stringify(data.amenities || []);

  const hall = await prisma.hall.create({
    data: {
      name: data.name,
      description: data.description,
      capacity: data.capacity,
      location: data.location,
      pricePerSlot: data.pricePerSlot,
      images: imagesJson,
      amenities: amenitiesJson,
      isActive: data.isActive ?? true,
    },
  });

  // Assign time slots if provided, or default to all existing slots
  const slotIds = data.timeSlotIds?.length
    ? data.timeSlotIds
    : (await prisma.timeSlot.findMany({ select: { id: true } })).map((s) => s.id);

  if (slotIds.length > 0) {
    await prisma.hallTimeSlot.createMany({
      data: slotIds.map((slotId) => ({
        hallId: hall.id,
        timeSlotId: slotId,
        price: data.pricePerSlot,
      })),
    });
  }

  return getHallById(hall.id);
};

export const updateHall = async (
  id: number,
  data: {
    name?: string;
    description?: string;
    capacity?: number;
    location?: string;
    pricePerSlot?: number;
    images?: string[];
    amenities?: string[];
    isActive?: boolean;
    timeSlotIds?: number[];
  }
) => {
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.capacity !== undefined) updateData.capacity = data.capacity;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.pricePerSlot !== undefined) updateData.pricePerSlot = data.pricePerSlot;
  if (data.images !== undefined) updateData.images = JSON.stringify(data.images);
  if (data.amenities !== undefined) updateData.amenities = JSON.stringify(data.amenities);
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  await prisma.hall.update({
    where: { id },
    data: updateData,
  });

  if (data.timeSlotIds) {
    await prisma.hallTimeSlot.deleteMany({ where: { hallId: id } });
    await prisma.hallTimeSlot.createMany({
      data: data.timeSlotIds.map((slotId) => ({
        hallId: id,
        timeSlotId: slotId,
        price: data.pricePerSlot,
      })),
    });
  }

  return getHallById(id);
};

export const deleteHall = async (id: number) => {
  // Soft delete
  return await prisma.hall.update({
    where: { id },
    data: { isActive: false },
  });
};
