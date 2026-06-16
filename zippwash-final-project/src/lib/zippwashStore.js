const STORAGE_KEY = 'zippwash-demo-db-v2';
const SESSION_KEY = 'zippwash-demo-session-v2';

const money = (value) => Number(value.toFixed(2));

const createId = (prefix = 'id') => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
};

export const ORDER_STATUS = {
  submitted: { label: 'Submitted', progress: 10 },
  washing: { label: 'Washing', progress: 45 },
  drying: { label: 'Drying', progress: 80 },
  ready: { label: 'Ready for Pickup', progress: 100 },
  picked_up: { label: 'Picked Up', progress: 100 },
};

export const MACHINE_STATUS = {
  available: 'available',
  busy: 'busy',
  offline: 'offline',
  reserved: 'reserved',
};

export const statusLabel = (status) => ORDER_STATUS[status]?.label || status;
export const getOrderProgress = (status) => ORDER_STATUS[status]?.progress || 0;

export const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const pricingCatalog = [
  { id: 'item-shirt', name: 'Shirt', price: 40, category: 'Wearables', icon: '👕', description: 'Pressed and folded.' },
  { id: 'item-coat', name: 'Coat', price: 200, category: 'Wearables', icon: '🧥', description: 'Dry-clean premium garment.' },
  { id: 'item-suit', name: 'Suit', price: 400, category: 'Formal', icon: '🕴️', description: 'Two-piece suit care.' },
  { id: 'item-dress', name: 'Dress', price: 250, category: 'Wearables', icon: '👗', description: 'Delicate wash & finish.' },
  { id: 'item-carpets', name: 'Carpets', price: 450, category: 'Home Care', icon: '🏠', description: 'Deep clean rug service.' },
  { id: 'item-blanket', name: 'Blanket', price: 300, category: 'Home Care', icon: '🛏️', description: 'Soft, sanitised finish.' },
];

const now = new Date();
const hoursAgo = (hours) => new Date(now.getTime() - hours * 3600000).toISOString();
const daysAgo = (days) => new Date(now.getTime() - days * 86400000).toISOString();

export const seedDemoData = () => ({
  version: 2,
  ui: { theme: 'light' },
  pricingItems: pricingCatalog,
  students: [
    {
      id: 'student-1',
      role: 'student',
      name: 'Test Student',
      rollNumber: 'TS001',
      phone: '9876543210',
      password: import.meta.env.VITE_STUDENT_PASSWORD || 'student123',
      room: 'A-204',
      points: 320,
      streak: 6,
      joinedAt: daysAgo(45),
      preferredHostel: 'North Block',
    },
  ],
  staff: [
    {
      id: 'staff-1',
      role: 'staff',
      name: 'Admin Staff',
      username: 'admin',
      password: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123',
      joinedAt: daysAgo(200),
    },
  ],
  machines: [
    { id: 'machine-1', code: 'M1', type: 'Washer', status: 'available', currentOrderId: null, updatedAt: hoursAgo(5) },
    { id: 'machine-2', code: 'M2', type: 'Washer', status: 'available', currentOrderId: null, updatedAt: hoursAgo(2) },
    { id: 'machine-3', code: 'M3', type: 'Washer', status: 'available', currentOrderId: null, updatedAt: hoursAgo(2) },
    { id: 'machine-4', code: 'W1', type: 'Washer', status: 'available', currentOrderId: null, updatedAt: hoursAgo(1) },
    { id: 'machine-5', code: 'W2', type: 'Washer', status: 'busy', currentOrderId: 'order-1002', updatedAt: hoursAgo(1) },
  ],
  orders: [
    {
      id: 'order-1001',
      studentId: 'student-1',
      machineId: 'machine-2',
      type: 'wash',
      items: [{ id: 'wash-load', name: 'Laundry Load', quantity: 5, price: 15 }],
      totalItems: 5,
      amount: 75,
      status: 'submitted',
      slotLabel: 'Today · 8:15 PM',
      slotIso: new Date(now.getTime() + 30 * 60000).toISOString(),
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5),
      notes: 'Pickup from main counter after processing.',
    },
    {
      id: 'order-1002',
      studentId: 'student-1',
      machineId: 'machine-5',
      type: 'wash',
      items: [{ id: 'wash-load', name: 'Laundry Load', quantity: 1, price: 15 }],
      totalItems: 1,
      amount: 15,
      status: 'washing',
      slotLabel: 'Today · 5:00 PM',
      slotIso: new Date(now.getTime() - 60 * 60000).toISOString(),
      createdAt: daysAgo(7),
      updatedAt: hoursAgo(2),
      notes: 'Current cycle running on W2.',
    },
    {
      id: 'order-1003',
      studentId: 'student-1',
      machineId: null,
      type: 'dry-clean',
      items: [{ id: 'item-shirt', name: 'Shirt', quantity: 2, price: 40 }],
      totalItems: 2,
      amount: 80,
      status: 'drying',
      slotLabel: 'Today · 5:00 PM',
      slotIso: new Date(now.getTime() - 3 * 3600000).toISOString(),
      createdAt: daysAgo(2),
      updatedAt: hoursAgo(1),
      notes: 'Finishing stage in dry-clean line.',
    },
  ],
  notifications: [
    {
      id: 'notif-1',
      userRole: 'student',
      userId: 'student-1',
      title: 'Ready for Pickup!',
      message: 'Your laundry order is ready for pickup at the main counter.',
      kind: 'success',
      read: false,
      createdAt: hoursAgo(2),
    },
    {
      id: 'notif-2',
      userRole: 'student',
      userId: 'student-1',
      title: 'Happy Hour: 20% Off',
      message: 'Do laundry between 2 PM and 5 PM today to get 20% off.',
      kind: 'promo',
      read: false,
      createdAt: hoursAgo(5),
    },
    {
      id: 'notif-3',
      userRole: 'student',
      userId: 'student-1',
      title: 'Scheduled Maintenance',
      message: 'One machine will be down for maintenance tonight at 12 AM.',
      kind: 'warning',
      read: false,
      createdAt: daysAgo(1),
    },
    {
      id: 'notif-4',
      userRole: 'staff',
      userId: 'staff-1',
      title: 'New submission received',
      message: 'A new laundry order was submitted by Test Student.',
      kind: 'info',
      read: false,
      createdAt: hoursAgo(4),
    },
  ],
  transactions: [],
  rewardEvents: [
    {
      id: 'reward-1',
      studentId: 'student-1',
      type: 'earn',
      points: 120,
      message: 'Weekly consistency bonus unlocked.',
      createdAt: daysAgo(3),
    },
    {
      id: 'reward-2',
      studentId: 'student-1',
      type: 'earn',
      points: 80,
      message: 'Order completion reward credited.',
      createdAt: daysAgo(8),
    },
    {
      id: 'reward-3',
      studentId: 'student-1',
      type: 'redeem',
      points: -40,
      message: 'Redeemed Fresh Offers voucher.',
      createdAt: daysAgo(14),
    },
  ],
  feedback: [
    {
      id: 'feedback-1',
      studentId: 'student-1',
      rating: 5,
      message: 'Clean interface and quick turnaround.',
      createdAt: daysAgo(9),
    },
  ],
  maintenance: [
    {
      id: 'maint-1',
      machineCode: 'W2',
      title: 'Drain pipe inspection',
      priority: 'medium',
      status: 'scheduled',
      createdAt: daysAgo(1),
    },
  ],
});

export function loadDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedDemoData();
      saveDB(seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (!parsed?.version || parsed.version !== 2) {
      const seeded = seedDemoData();
      saveDB(seeded);
      return seeded;
    }
    return parsed;
  } catch {
    const seeded = seedDemoData();
    saveDB(seeded);
    return seeded;
  }
}

export function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function resetDB() {
  const seeded = seedDemoData();
  saveDB(seeded);
  localStorage.removeItem(SESSION_KEY);
  return seeded;
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function sanitizeStudent(student) {
  return {
    id: student.id,
    role: 'student',
    name: student.name,
    rollNumber: student.rollNumber,
    phone: student.phone,
    room: student.room,
    points: student.points,
    streak: student.streak,
    preferredHostel: student.preferredHostel,
  };
}

export function sanitizeStaff(staff) {
  return {
    id: staff.id,
    role: 'staff',
    name: staff.name,
    username: staff.username,
  };
}

export function loginStudentLocal(rollNumber, password) {
  const db = loadDB();
  const student = db.students.find(
    (entry) => entry.rollNumber.toLowerCase() === String(rollNumber).trim().toLowerCase() && entry.password === password,
  );
  if (!student) throw new Error('Invalid student credentials');
  const user = sanitizeStudent(student);
  setSession(user);
  return user;
}

export function loginStaffLocal(username, password) {
  const db = loadDB();
  const staff = db.staff.find(
    (entry) => entry.username.toLowerCase() === String(username).trim().toLowerCase() && entry.password === password,
  );
  if (!staff) throw new Error('Invalid admin credentials');
  const user = sanitizeStaff(staff);
  setSession(user);
  return user;
}

export function registerStudentLocal(payload) {
  const db = loadDB();
  const exists = db.students.some(
    (entry) => entry.rollNumber.toLowerCase() === String(payload.rollNumber).trim().toLowerCase(),
  );
  if (exists) throw new Error('A student with that roll number already exists');
  const student = {
    id: createId('student'),
    role: 'student',
    name: payload.name,
    rollNumber: payload.rollNumber,
    phone: payload.phone,
    password: payload.password,
    room: payload.room || 'A-000',
    points: 0,
    streak: 0,
    joinedAt: new Date().toISOString(),
    preferredHostel: 'North Block',
  };
  db.students.unshift(student);
  saveDB(db);
  return sanitizeStudent(student);
}

export function createNotification({ userRole, userId, title, message, kind = 'info' }) {
  return {
    id: createId('notif'),
    userRole,
    userId,
    title,
    message,
    kind,
    read: false,
    createdAt: new Date().toISOString(),
  };
}

export function createTransaction({ studentId, orderId, description, amount, status = 'submitted' }) {
  return {
    id: createId('txn'),
    studentId,
    orderId,
    description,
    amount: money(amount),
    status,
    createdAt: new Date().toISOString(),
  };
}

export function createRewardEvent({ studentId, points, message, type = 'earn' }) {
  return {
    id: createId('reward'),
    studentId,
    points,
    message,
    type,
    createdAt: new Date().toISOString(),
  };
}

export function awardPoints(db, studentId, points, message) {
  const student = db.students.find((entry) => entry.id === studentId);
  if (!student || !points) return;
  student.points = Number(student.points || 0) + points;
  student.streak = Number(student.streak || 0) + 1;
  db.rewardEvents.unshift(createRewardEvent({ studentId, points, message, type: points >= 0 ? 'earn' : 'redeem' }));
}

export function buildOrderTitle(order) {
  if (order.type === 'dry-clean') return `Dry clean order ${order.id}`;
  return `Laundry order ${order.id}`;
}

export function studentOrderItemsLabel(order) {
  return (order.items || [])
    .map((item) => `${item.name}${item.quantity > 1 ? ` ×${item.quantity}` : ''}`)
    .join(', ');
}

export function createWashOrder({ studentId, machineId, quantity, slotLabel, notes = '' }) {
  const unitPrice = 15;
  return {
    id: createId('order'),
    studentId,
    machineId,
    type: 'wash',
    items: [{ id: 'wash-load', name: 'Laundry Load', quantity, price: unitPrice }],
    totalItems: quantity,
    amount: money(quantity * unitPrice),
    status: 'submitted',
    slotLabel,
    slotIso: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes,
  };
}

export function createDryCleanOrder({ studentId, cartItems }) {
  const items = cartItems.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));
  const amount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return {
    id: createId('order'),
    studentId,
    machineId: null,
    type: 'dry-clean',
    items,
    totalItems,
    amount: money(amount),
    status: 'submitted',
    slotLabel: 'Dry-clean counter drop-off',
    slotIso: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: 'Submitted from pricing cart.',
  };
}
