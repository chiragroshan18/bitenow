const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ---------- Utility helpers ----------
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max, decimals = 0) => {
  const val = Math.random() * (max - min) + min;
  return decimals === 0 ? Math.round(val) : parseFloat(val.toFixed(decimals));
};
const randomItem = (arr) => arr[randomInt(0, arr.length - 1)];
const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
const randomDateWithinLastNDays = (days) => {
  const now = Date.now();
  const past = now - randomInt(0, days) * 24 * 60 * 60 * 1000;
  return new Date(past);
};
const indianPhone = () => `9${randomInt(100000000, 999999999)}`;

// ---------- Chennai area data (real areas, real pincodes, approx coords) ----------
const AREAS = [
  { area: 'T Nagar', pincode: '600017', lat: 13.0418, lng: 80.2341 },
  { area: 'Adyar', pincode: '600020', lat: 13.0067, lng: 80.257 },
  { area: 'Anna Nagar', pincode: '600040', lat: 13.085, lng: 80.2101 },
  { area: 'Velachery', pincode: '600042', lat: 12.975, lng: 80.2209 },
  { area: 'Nungambakkam', pincode: '600034', lat: 13.0569, lng: 80.2425 },
  { area: 'Mylapore', pincode: '600004', lat: 13.0339, lng: 80.2619 },
  { area: 'Besant Nagar', pincode: '600090', lat: 13.0002, lng: 80.2668 },
  { area: 'Kilpauk', pincode: '600010', lat: 13.0813, lng: 80.241 },
  { area: 'Royapettah', pincode: '600014', lat: 13.0508, lng: 80.2645 },
  { area: 'Egmore', pincode: '600008', lat: 13.0732, lng: 80.2609 },
  { area: 'Perambur', pincode: '600011', lat: 13.1143, lng: 80.2329 },
  { area: 'Guindy', pincode: '600032', lat: 13.0067, lng: 80.2206 },
  { area: 'Tambaram', pincode: '600045', lat: 12.9249, lng: 80.1 },
  { area: 'Porur', pincode: '600116', lat: 13.0381, lng: 80.1564 },
  { area: 'Thoraipakkam', pincode: '600097', lat: 12.943, lng: 80.234 },
  { area: 'Vadapalani', pincode: '600026', lat: 13.0503, lng: 80.2121 },
  { area: 'Ashok Nagar', pincode: '600083', lat: 13.0369, lng: 80.2076 },
  { area: 'Chromepet', pincode: '600044', lat: 12.9516, lng: 80.1462 },
  { area: 'Pallavaram', pincode: '600043', lat: 12.9675, lng: 80.1491 },
  { area: 'Alwarpet', pincode: '600018', lat: 13.0338, lng: 80.2547 },
  { area: 'Kotturpuram', pincode: '600085', lat: 13.0225, lng: 80.2467 },
  { area: 'Saidapet', pincode: '600015', lat: 13.0212, lng: 80.2226 },
  { area: 'West Mambalam', pincode: '600033', lat: 13.0403, lng: 80.2179 },
  { area: 'Triplicane', pincode: '600005', lat: 13.0569, lng: 80.2777 },
  { area: 'Purasaiwalkam', pincode: '600007', lat: 13.0844, lng: 80.2528 },
];

const STREET_NAMES = [
  'Anna Salai', 'GN Chetty Road', 'Cathedral Road', 'Radhakrishnan Salai',
  'TTK Road', 'Kutchery Road', 'Eldams Road', 'Sardar Patel Road',
  '100 Feet Road', 'Poonamallee High Road', 'Velachery Main Road',
  'Arcot Road', 'East Coast Road', 'LB Road', 'Kamarajar Salai',
  'North Usman Road', 'Chamiers Road', 'Lattice Bridge Road',
  'Rajiv Gandhi Salai', 'Bazullah Road',
];

// ---------- Cuisines and restaurant name pools ----------
const RESTAURANT_NAMES = {
  'South Indian': ['Saravana Bhavan', 'Murugan Idli Shop', 'Sangeetha Veg Restaurant', 'Ratna Cafe', 'Ponnusamy Hotel', 'Ananda Bhavan'],
  'North Indian': ['Punjabi Tadka', 'Delhi Darbar', 'Copper Chimney', 'Kwality Restaurant', 'Moti Mahal Delux'],
  'Chinese': ['Mainland China', 'China Town', 'Chung Fa', 'Wok On Fire', 'Beijing Bites'],
  'Arabian': ['Arabian Nights', 'Al Baik Express', 'Shalimar Restaurant', 'Barbeque Arabia'],
  'Beverages': ['Chennai Filter Coffee Co.', 'Cool Point Juice Center', 'Cafe Fresca', 'Sarvana Juice Corner'],
  'Desserts': ['Grand Sweets & Snacks', 'Aavin Ice Cream Parlour', 'Naturals Ice Cream', 'Anjappar Sweets'],
  'Fast Food': ['Burger Junction', 'Pizza Corner', 'Chennai Sandwich Co.', 'Snack Attack'],
  'Healthy Bowls': ['The Green Bowl', 'FitFoods Chennai', 'Salad Days', 'NourishMe Kitchen'],
  'Street Food': ['Chennai Chaat Corner', 'Marina Beach Bhel Stall', 'Kothu Parotta Junction', 'Sowcarpet Snacks'],
};
const CUISINES = Object.keys(RESTAURANT_NAMES);

// ---------- Dish pools per cuisine: {name, priceMin, priceMax} ----------
const DISH_POOLS = {
  'South Indian': [
    ['Plain Dosa', 40, 70], ['Masala Dosa', 60, 100], ['Ghee Roast Dosa', 80, 130],
    ['Idli (2 pcs)', 30, 60], ['Medu Vada', 30, 60], ['Pongal', 50, 90],
    ['Uttapam', 60, 100], ['Sambar Rice', 80, 130], ['Curd Rice', 60, 100],
    ['Chettinad Chicken Curry', 180, 280], ['Meen Kuzhambu', 160, 260],
    ['Bisi Bele Bath', 90, 140], ['Rasam', 40, 70], ['Payasam', 50, 90],
    ['Appam (2 pcs)', 60, 100], ['Chicken 65', 160, 240], ['Mutton Chukka', 220, 320],
    ['Kothu Parotta', 100, 160],
  ],
  'North Indian': [
    ['Butter Chicken', 220, 320], ['Paneer Butter Masala', 180, 260], ['Dal Makhani', 140, 200],
    ['Chole Bhature', 100, 160], ['Butter Naan', 40, 60], ['Tandoori Roti', 20, 40],
    ['Rogan Josh', 240, 340], ['Hyderabadi Biryani', 200, 320], ['Palak Paneer', 160, 220],
    ['Malai Kofta', 180, 260], ['Kadai Paneer', 170, 240], ['Chicken Tikka', 220, 300],
    ['Seekh Kebab', 200, 280], ['Aloo Gobi', 120, 170], ['Rajma Chawal', 130, 180],
    ['Gulab Jamun (2 pcs)', 40, 70],
  ],
  Chinese: [
    ['Veg Manchurian', 120, 180], ['Chicken Manchurian', 180, 260], ['Hakka Noodles', 130, 190],
    ['Veg Fried Rice', 120, 170], ['Chilli Chicken', 190, 270], ['Spring Rolls', 100, 150],
    ['Schezwan Noodles', 140, 200], ['Honey Chilli Potato', 130, 180], ['Gobi Manchurian', 130, 190],
    ['Chicken Lollipop', 200, 280], ['Sweet Corn Soup', 80, 120], ['Hot & Sour Soup', 90, 130],
    ['Kung Pao Chicken', 210, 290], ['Chow Mein', 130, 190],
  ],
  Arabian: [
    ['Chicken Shawarma', 120, 190], ['Hummus Platter', 100, 160], ['Falafel Plate', 110, 170],
    ['Al Faham Chicken', 260, 380], ['Mutton Mandi', 320, 450], ['Arabian Chicken Biryani', 220, 320],
    ['Kunafa', 130, 190], ['Baklava (4 pcs)', 100, 160], ['Fattoush Salad', 110, 160],
    ['Tabbouleh', 100, 150], ['Grilled Kebab Platter', 240, 340], ['Arabic Bread Basket', 40, 70],
    ['Lamb Kofta', 260, 360],
  ],
  Beverages: [
    ['Filter Coffee', 20, 40], ['Masala Chai', 20, 40], ['Fresh Lime Soda', 30, 60],
    ['Mango Lassi', 50, 90], ['Rose Milk', 40, 70], ['Badam Milk', 60, 100],
    ['Buttermilk', 25, 45], ['Tender Coconut Water', 40, 70], ['Cold Coffee', 60, 110],
    ['Watermelon Juice', 50, 90], ['Iced Tea', 40, 80], ['Chocolate Milkshake', 80, 140],
    ['Sugarcane Juice', 30, 60], ['Jigarthanda', 60, 110],
  ],
  Desserts: [
    ['Gulab Jamun (2 pcs)', 40, 70], ['Rasgulla (2 pcs)', 40, 70], ['Mysore Pak', 50, 90],
    ['Jangiri', 40, 80], ['Kesari', 40, 70], ['Carrot Halwa', 60, 100],
    ['Rava Laddu (2 pcs)', 40, 70], ['Badam Halwa', 70, 120], ['Kaju Katli (100g)', 120, 200],
    ['Vanilla Ice Cream Scoop', 40, 70], ['Chocolate Ice Cream Scoop', 40, 80],
    ['Butterscotch Ice Cream Scoop', 50, 90], ['Kulfi', 40, 70], ['Chocolate Brownie', 80, 140],
  ],
  'Fast Food': [
    ['Veg Burger', 70, 120], ['Chicken Burger', 100, 160], ['French Fries', 60, 100],
    ['Margherita Pizza', 150, 240], ['Farmhouse Pizza', 200, 320], ['Cheese Sandwich', 60, 110],
    ['Hot Dog', 90, 140], ['Chicken Nuggets', 110, 170], ['Garlic Bread', 70, 110],
    ['Paneer Wrap', 90, 150], ['Chicken Wrap', 110, 170], ['Masala Fries', 80, 130],
    ['Loaded Nachos', 130, 200], ['Veg Puff', 20, 40],
  ],
  'Healthy Bowls': [
    ['Quinoa Salad Bowl', 180, 260], ['Grilled Chicken Bowl', 220, 320], ['Buddha Bowl', 190, 270],
    ['Sprouts Salad', 100, 160], ['Avocado Toast', 160, 240], ['Millet Khichdi', 130, 190],
    ['Paneer Tikka Bowl', 190, 270], ['Greek Yogurt Bowl', 120, 180], ['Fruit & Nut Bowl', 140, 210],
    ['Brown Rice Veg Bowl', 150, 220], ['Protein Power Bowl', 220, 320], ['Oats Porridge', 90, 140],
  ],
  'Street Food': [
    ['Bhel Puri', 40, 70], ['Pani Puri (6 pcs)', 40, 70], ['Sev Puri', 50, 80],
    ['Vada Pav', 30, 50], ['Pav Bhaji', 80, 130], ['Dahi Puri', 50, 90],
    ['Sundal', 30, 50], ['Onion Bajji', 40, 70], ['Bonda (4 pcs)', 40, 70],
    ['Masala Puri', 50, 90], ['Kothu Parotta', 100, 160], ['Egg Bhurji', 60, 100],
    ['Aloo Tikki Chaat', 50, 90], ['Corn Chaat', 50, 90],
  ],
};

const DESCRIPTIONS = [
  'Freshly prepared with authentic spices.', "Chef's special, a customer favorite.",
  'Made fresh daily using quality ingredients.', 'Traditional recipe passed down generations.',
  'Served hot and fresh.', 'House specialty, highly recommended.',
  'A perfect blend of flavors.', 'Prepared using the finest ingredients.',
];

// ---------- Name pools for users ----------
const FIRST_NAMES = [
  'Arun', 'Priya', 'Karthik', 'Divya', 'Suresh', 'Lakshmi', 'Vijay', 'Meena',
  'Ramesh', 'Kavitha', 'Senthil', 'Anitha', 'Prakash', 'Deepa', 'Mohan', 'Revathi',
  'Ganesh', 'Shanthi', 'Bala', 'Vidya', 'Naveen', 'Swathi', 'Dinesh', 'Nithya',
  'Raj', 'Pooja', 'Sathish', 'Geetha', 'Manoj', 'Uma', 'Kumar', 'Vani',
  'Ashok', 'Radha', 'Vinoth', 'Sowmya', 'Elango', 'Bhavani', 'Saravanan', 'Preethi',
];
const LAST_NAMES = [
  'Krishnan', 'Subramaniam', 'Iyer', 'Rajan', 'Murthy', 'Pillai', 'Nair', 'Chettiar',
  'Raman', 'Venkatesan', 'Gopal', 'Natarajan', 'Sundaram', 'Balasubramaniam', 'Krishnamurthy',
  'Shanmugam', 'Rangaswamy', 'Muthu', 'Sivakumar', 'Ravichandran',
];

// ---------- Data builders ----------
const buildAddress = (labelPrefix) => {
  const loc = randomItem(AREAS);
  const houseNo = randomInt(1, 200);
  return {
    label: labelPrefix,
    street: `${houseNo}, ${randomItem(STREET_NAMES)}, ${loc.area}`,
    city: 'Chennai',
    state: 'Tamil Nadu',
    postalCode: loc.pincode,
    latitude: loc.lat + randomFloat(-0.01, 0.01, 4),
    longitude: loc.lng + randomFloat(-0.01, 0.01, 4),
  };
};

const buildMenuItems = (cuisine) => {
  const items = [];
  const mainPool = DISH_POOLS[cuisine];
  const mains = shuffle(mainPool).slice(0, Math.min(18, mainPool.length));
  mains.forEach(([name, min, max]) => {
    items.push({
      name,
      description: randomItem(DESCRIPTIONS),
      price: randomFloat(min, max, 2),
      category: cuisine,
      isAvailable: Math.random() > 0.08, // ~92% available
    });
  });
  if (cuisine !== 'Beverages') {
    shuffle(DISH_POOLS.Beverages).slice(0, 4).forEach(([name, min, max]) => {
      items.push({
        name, description: randomItem(DESCRIPTIONS), price: randomFloat(min, max, 2),
        category: 'Beverages', isAvailable: Math.random() > 0.08,
      });
    });
  }
  if (cuisine !== 'Desserts') {
    shuffle(DISH_POOLS.Desserts).slice(0, 3).forEach(([name, min, max]) => {
      items.push({
        name, description: randomItem(DESCRIPTIONS), price: randomFloat(min, max, 2),
        category: 'Desserts', isAvailable: Math.random() > 0.08,
      });
    });
  }
  return items;
};

const ORDER_STATUS_WEIGHTED = [
  'DELIVERED', 'DELIVERED', 'DELIVERED', 'DELIVERED',
  'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY',
  'PLACED', 'CANCELLED',
];

async function clearDatabase() {
  console.log('Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  await clearDatabase();

  const passwordHash = await bcrypt.hash('password123', 10);
  console.log('All seeded users share the password: password123');

  // ---------- Admin ----------
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@fooddelivery.test',
      password: passwordHash,
      phone: indianPhone(),
      role: 'ADMIN',
    },
  });
  console.log('Created 1 admin');

  // ---------- Restaurant owners + restaurants ----------
  const restaurants = [];
  for (let i = 0; i < 40; i++) {
    const cuisine = CUISINES[i % CUISINES.length];
    const namePool = RESTAURANT_NAMES[cuisine];
    const baseName = namePool[i % namePool.length];
    const loc = AREAS[i % AREAS.length];
    const restaurantName = `${baseName} - ${loc.area}`;

    const owner = await prisma.user.create({
      data: {
        name: `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`,
        email: `owner${i + 1}@fooddelivery.test`,
        password: passwordHash,
        phone: indianPhone(),
        role: 'RESTAURANT_OWNER',
      },
    });

    const houseNo = randomInt(1, 200);
    const restaurant = await prisma.restaurant.create({
      data: {
        name: restaurantName,
        description: `Authentic ${cuisine} restaurant serving Chennai since years.`,
        address: `${houseNo}, ${randomItem(STREET_NAMES)}, ${loc.area}, Chennai, Tamil Nadu ${loc.pincode}`,
        latitude: loc.lat + randomFloat(-0.008, 0.008, 4),
        longitude: loc.lng + randomFloat(-0.008, 0.008, 4),
        isOpen: Math.random() > 0.1,
        ownerId: owner.id,
      },
    });

    const menuData = buildMenuItems(cuisine).map((item) => ({
      ...item,
      restaurantId: restaurant.id,
    }));
    await prisma.menuItem.createMany({ data: menuData });

    restaurants.push({ id: restaurant.id, cuisine, itemCount: menuData.length });
    if ((i + 1) % 10 === 0) console.log(`  ...${i + 1}/40 restaurants created`);
  }
  const totalMenuItems = restaurants.reduce((sum, r) => sum + r.itemCount, 0);
  console.log(`Created 40 restaurants (40 owners) with ${totalMenuItems} menu items total`);

  // ---------- Delivery partners ----------
  const deliveryPartners = [];
  for (let i = 0; i < 4; i++) {
    const dp = await prisma.user.create({
      data: {
        name: `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`,
        email: `rider${i + 1}@fooddelivery.test`,
        password: passwordHash,
        phone: indianPhone(),
        role: 'DELIVERY_PARTNER',
      },
    });
    deliveryPartners.push(dp);
  }
  console.log('Created 4 delivery partners');

  // ---------- Customers + addresses ----------
  const customers = [];
  const addressesByCustomer = {};
  for (let i = 0; i < 40; i++) {
    const customer = await prisma.user.create({
      data: {
        name: `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`,
        email: `customer${i + 1}@fooddelivery.test`,
        password: passwordHash,
        phone: indianPhone(),
        role: 'CUSTOMER',
      },
    });
    customers.push(customer);

    const addrCount = randomInt(1, 2);
    const addrs = [];
    for (let a = 0; a < addrCount; a++) {
      const addrData = buildAddress(a === 0 ? 'Home' : 'Work');
      const addr = await prisma.address.create({
        data: { ...addrData, userId: customer.id, isDefault: a === 0 },
      });
      addrs.push(addr);
    }
    addressesByCustomer[customer.id] = addrs;
  }
  console.log('Created 40 customers with addresses');

  // ---------- Fetch full menu items grouped by restaurant, for order building ----------
  const allMenuItems = await prisma.menuItem.findMany();
  const menuByRestaurant = {};
  for (const item of allMenuItems) {
    if (!menuByRestaurant[item.restaurantId]) menuByRestaurant[item.restaurantId] = [];
    menuByRestaurant[item.restaurantId].push(item);
  }

  // ---------- Orders ----------
  let ordersCreated = 0;
  for (let i = 0; i < 120; i++) {
    const customer = randomItem(customers);
    const custAddresses = addressesByCustomer[customer.id];
    const address = randomItem(custAddresses);

    const restaurantMeta = randomItem(restaurants);
    const menuItems = menuByRestaurant[restaurantMeta.id];
    if (!menuItems || menuItems.length === 0) continue;

    const itemCount = randomInt(1, 4);
    const chosen = shuffle(menuItems).slice(0, itemCount);

    const orderItemsData = chosen.map((mi) => ({
      menuItemId: mi.id,
      quantity: randomInt(1, 3),
      priceAtOrder: mi.price,
    }));
    const totalAmount = orderItemsData.reduce(
      (sum, oi) => sum + oi.priceAtOrder * oi.quantity,
      0
    );

    const status = randomItem(ORDER_STATUS_WEIGHTED);
    const needsDeliveryPartner = ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(status);
    const deliveryPartnerId = needsDeliveryPartner
      ? randomItem(deliveryPartners).id
      : null;

    const createdAt = randomDateWithinLastNDays(30);

    await prisma.order.create({
      data: {
        status,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        customerId: customer.id,
        restaurantId: restaurantMeta.id,
        deliveryPartnerId,
        addressId: address.id,
        createdAt,
        updatedAt: createdAt,
        items: { create: orderItemsData },
      },
    });
    ordersCreated++;
    if (ordersCreated % 30 === 0) console.log(`  ...${ordersCreated}/120 orders created`);
  }
  console.log(`Created ${ordersCreated} orders`);

  console.log('\n=== SEED SUMMARY ===');
  console.log('Admin:', 1);
  console.log('Restaurant owners:', 40);
  console.log('Restaurants:', 40);
  console.log('Menu items:', totalMenuItems);
  console.log('Delivery partners:', 4);
  console.log('Customers:', 40);
  console.log('Orders:', ordersCreated);
  console.log('Total users:', 1 + 40 + 4 + 40);
  console.log('\nAll users\' password: password123');
  console.log('Example logins: admin@fooddelivery.test, owner1@fooddelivery.test, customer1@fooddelivery.test, rider1@fooddelivery.test');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });