import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import RentalOrder from '../models/RentalOrder.js';
import MaintenanceRequest from '../models/MaintenanceRequest.js';

dotenv.config();

// Connect Database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rentease');
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const usersData = [
  {
    name: 'Admin User',
    email: 'admin@rentease.com',
    password: 'password123',
    phone: '1234567890',
    address: '123 Main St, Admin City',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@gmail.com',
    password: 'password123',
    phone: '9876543210',
    address: '456 Elm St, New York, NY',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@gmail.com',
    password: 'password123',
    phone: '8765432109',
    address: '789 Oak Ave, Los Angeles, CA',
    role: 'user'
  },
  {
    name: 'Robert Johnson',
    email: 'robert@gmail.com',
    password: 'password123',
    phone: '7654321098',
    address: '101 Pine Rd, Chicago, IL',
    role: 'user'
  },
  {
    name: 'Emily Davis',
    email: 'emily@gmail.com',
    password: 'password123',
    phone: '6543210987',
    address: '202 Maple Dr, San Francisco, CA',
    role: 'user'
  },
  {
    name: 'Michael Brown',
    email: 'michael@gmail.com',
    password: 'password123',
    phone: '5432109876',
    address: '303 Birch Ln, Seattle, WA',
    role: 'user'
  },
  {
    name: 'William Jones',
    email: 'william@gmail.com',
    password: 'password123',
    phone: '4321098765',
    address: '404 Cedar St, Boston, MA',
    role: 'user'
  },
  {
    name: 'Olivia Miller',
    email: 'olivia@gmail.com',
    password: 'password123',
    phone: '3210987654',
    address: '505 Redwood Hwy, Portland, OR',
    role: 'user'
  },
  {
    name: 'James Wilson',
    email: 'james@gmail.com',
    password: 'password123',
    phone: '2109876543',
    address: '606 Cypress Ave, Austin, TX',
    role: 'user'
  },
  {
    name: 'Sophia Moore',
    email: 'sophia@gmail.com',
    password: 'password123',
    phone: '1098765432',
    address: '707 Magnolia Way, Miami, FL',
    role: 'user'
  }
];

const productsData = [
  // 1. Bed
  {
    name: 'King Size Wooden Bed Frame',
    description: 'Elegant solid teak wood king-sized bed frame with headboard storage and hydraulic lifting mechanism for under-bed storage.',
    category: 'Bed',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 35,
    securityDeposit: 150,
    tenureOptions: [3, 6, 9, 12],
    stock: 8,
    availability: true
  },
  {
    name: 'Queen Size Fabric Platform Bed',
    description: 'Modern upholstered fabric platform bed frame with sturdy wooden slats. Premium look with soft touch.',
    category: 'Bed',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 25,
    securityDeposit: 100,
    tenureOptions: [3, 6, 12],
    stock: 12,
    availability: true
  },
  // 2. Sofa
  {
    name: 'L-Shaped Sectional Fabric Sofa',
    description: 'Luxurious L-shaped sectional couch with thick fabric cushioning. Fits 5 people comfortably. Perfect for family lounges.',
    category: 'Sofa',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 45,
    securityDeposit: 200,
    tenureOptions: [3, 6, 9, 12],
    stock: 6,
    availability: true
  },
  {
    name: 'Classic 3-Seater Leatherette Sofa',
    description: 'Sleek black faux leather 3-seater sofa. Water-resistant, easy to clean, and extremely professional.',
    category: 'Sofa',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 30,
    securityDeposit: 120,
    tenureOptions: [3, 6, 12],
    stock: 10,
    availability: true
  },
  // 3. Table
  {
    name: '4-Seater Wooden Dining Table Set',
    description: 'Classic hardwood dining table accompanied by four cushioned matching chairs. Cozy and rustic.',
    category: 'Table',
    image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 22,
    securityDeposit: 90,
    tenureOptions: [3, 6, 12],
    stock: 5,
    availability: true
  },
  {
    name: 'Ergonomic Height-Adjustable Desk',
    description: 'Modern office desk with smart motorized height adjustment. Programmable height presets for sit-stand flexibility.',
    category: 'Table',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 18,
    securityDeposit: 80,
    tenureOptions: [3, 6, 9, 12],
    stock: 15,
    availability: true
  },
  // 4. Chair
  {
    name: 'High-Back Ergonomic Office Chair',
    description: 'Premium mesh computer chair with lumbar support, 3D adjustable armrests, and headrest.',
    category: 'Chair',
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 12,
    securityDeposit: 50,
    tenureOptions: [3, 6, 12],
    stock: 20,
    availability: true
  },
  {
    name: 'Solid Wood Accent Armchair',
    description: 'Beautiful Mid-Century Modern armchair with wooden legs and high-density foam cushions in mustard yellow.',
    category: 'Chair',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 15,
    securityDeposit: 60,
    tenureOptions: [3, 6, 12],
    stock: 8,
    availability: true
  },
  // 5. Wardrobe
  {
    name: '3-Door Sliding Wardrobe with Mirror',
    description: 'Spacious engineered wood wardrobe with sliding doors, premium mirror facade, hanging rods, and secure drawers.',
    category: 'Wardrobe',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 28,
    securityDeposit: 130,
    tenureOptions: [3, 6, 9, 12],
    stock: 7,
    availability: true
  },
  {
    name: 'Compact 2-Door Steel Wardrobe',
    description: 'Heavy-duty iron wardrobe with corrosion-resistant powder coating. Includes lockers and drawers for security.',
    category: 'Wardrobe',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 18,
    securityDeposit: 80,
    tenureOptions: [3, 6, 12],
    stock: 12,
    availability: true
  },
  // 6. Refrigerator
  {
    name: 'Double Door Refrigerator 260L',
    description: 'Energy-efficient frost-free double door refrigerator with smart inverter technology. Curated cooling zones.',
    category: 'Refrigerator',
    image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 26,
    securityDeposit: 120,
    tenureOptions: [3, 6, 9, 12],
    stock: 10,
    availability: true
  },
  {
    name: 'Single Door Mini Refrigerator 95L',
    description: 'Compact refrigerator ideal for student bedrooms, hostels, or offices. Low noise and quick ice making.',
    category: 'Refrigerator',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 14,
    securityDeposit: 60,
    tenureOptions: [3, 6, 12],
    stock: 14,
    availability: true
  },
  // 7. Washing Machine
  {
    name: 'Fully Automatic Front Load Washing Machine 7Kg',
    description: 'Inverter-driven front load washing machine with steam wash and hygiene refresh. 14 wash programs.',
    category: 'Washing Machine',
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 28,
    securityDeposit: 140,
    tenureOptions: [3, 6, 9, 12],
    stock: 8,
    availability: true
  },
  {
    name: 'Top Load Semi-Automatic Washing Machine 6.5Kg',
    description: 'Economical top load washing machine with dual tubs for washing and spin drying. Fast, tough on stains.',
    category: 'Washing Machine',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 16,
    securityDeposit: 80,
    tenureOptions: [3, 6, 12],
    stock: 11,
    availability: true
  },
  // 8. Television
  {
    name: '55" Ultra HD 4K Smart LED TV',
    description: 'Android Smart TV featuring Dolby Vision, HDR10+, 30W speaker output, and hands-free Google Assistant support.',
    category: 'Television',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 35,
    securityDeposit: 180,
    tenureOptions: [3, 6, 9, 12],
    stock: 6,
    availability: true
  },
  {
    name: '32" HD Ready Smart TV',
    description: 'Perfect bedroom smart TV with built-in Wi-Fi, screen mirroring, and preloaded streaming applications.',
    category: 'Television',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 18,
    securityDeposit: 90,
    tenureOptions: [3, 6, 12],
    stock: 15,
    availability: true
  },
  // 9. Microwave
  {
    name: '28L Convection Microwave Oven',
    description: 'All-in-one convection microwave with baking, grilling, reheating, and defrosting features. Touch control panel.',
    category: 'Microwave',
    image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 15,
    securityDeposit: 70,
    tenureOptions: [3, 6, 12],
    stock: 12,
    availability: true
  },
  {
    name: '20L Solo Microwave Oven',
    description: 'Standard solo microwave ideal for fast reheating, cooking noodles, defrosting foods. Dial control system.',
    category: 'Microwave',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 10,
    securityDeposit: 40,
    tenureOptions: [3, 6, 12],
    stock: 16,
    availability: true
  },
  // 10. Air Conditioner
  {
    name: '1.5 Ton 5 Star Inverter Split AC',
    description: 'High-speed cooling inverter split air conditioner. 5-star energy rating with active air filters.',
    category: 'Air Conditioner',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 40,
    securityDeposit: 250,
    tenureOptions: [3, 6, 9, 12],
    stock: 5,
    availability: true
  },
  {
    name: '1 Ton Window AC',
    description: 'Quick-installation window air conditioner with rotary compressor, multi-fan speed levels, and remote controller.',
    category: 'Air Conditioner',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    monthlyRent: 25,
    securityDeposit: 150,
    tenureOptions: [3, 6, 12],
    stock: 9,
    availability: true
  }
];

const seedDB = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clean current database
    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await RentalOrder.deleteMany();
    await MaintenanceRequest.deleteMany();
    console.log('Existing database collections wiped.');

    // 1. Seed Users (will hash passwords via pre-save hook)
    const seededUsers = [];
    for (const u of usersData) {
      const userDoc = new User(u);
      await userDoc.save();
      seededUsers.push(userDoc);
      // Initialize an empty cart for each user
      await Cart.create({ user: userDoc._id, products: [] });
    }
    console.log(`Successfully seeded ${seededUsers.length} users and initialized empty carts.`);

    // 2. Seed Products
    const seededProducts = await Product.insertMany(productsData);
    console.log(`Successfully seeded ${seededProducts.length} products.`);

    // 3. Create 15 Rental Orders
    // We'll distribute these among users (skip admin user which is index 0)
    // Statuses: 'Pending', 'Active', 'Returned', 'Cancelled'
    const orderStatuses = [
      'Active', 'Active', 'Pending', 'Active', 'Returned',
      'Active', 'Cancelled', 'Active', 'Returned', 'Active',
      'Pending', 'Active', 'Active', 'Returned', 'Active'
    ];

    const seededOrders = [];
    for (let i = 0; i < 15; i++) {
      // Pick a user (index 1 to 9)
      const userIndex = (i % 9) + 1;
      const user = seededUsers[userIndex];

      // Pick a product (index 0 to 19)
      const productIndex = (i * 3) % seededProducts.length;
      const product = seededProducts[productIndex];

      const tenure = product.tenureOptions[i % product.tenureOptions.length];
      const quantity = (i % 2) + 1; // 1 or 2
      const rentAmount = product.monthlyRent * quantity;
      const securityDeposit = product.securityDeposit * quantity;

      // Delivery date in the past for active/returned, in the future/recent for pending
      const deliveryDate = new Date();
      if (orderStatuses[i] === 'Returned' || orderStatuses[i] === 'Cancelled') {
        deliveryDate.setMonth(deliveryDate.getMonth() - 4);
      } else if (orderStatuses[i] === 'Active') {
        deliveryDate.setMonth(deliveryDate.getMonth() - 2);
      } else {
        deliveryDate.setDate(deliveryDate.getDate() + 5); // Future delivery for Pending
      }

      const returnDate = new Date(deliveryDate);
      returnDate.setMonth(returnDate.getMonth() + tenure);

      const order = new RentalOrder({
        user: user._id,
        product: product._id,
        quantity,
        selectedTenure: tenure,
        rentAmount,
        securityDeposit,
        deliveryDate,
        returnDate,
        status: orderStatuses[i]
      });

      await order.save();
      seededOrders.push(order);

      // Decrement stock for Active or Pending orders
      if (order.status === 'Active' || order.status === 'Pending') {
        product.stock = Math.max(0, product.stock - quantity);
        if (product.stock === 0) {
          product.availability = false;
        }
        await product.save();
      }
    }
    console.log(`Successfully seeded ${seededOrders.length} rental orders.`);

    // 4. Create 3 Maintenance Requests for active orders
    const activeOrders = seededOrders.filter(o => o.status === 'Active');
    const issueDescriptions = [
      'The bed frames squeaks loudly whenever sitting down. Requires check-up and tightening.',
      'The refrigerator cooling is inconsistent, milk is spoiling in the upper chamber.',
      'AC is blowing air but not cooling. Might need a gas refill or filter cleanup.'
    ];
    const maintenanceStatuses = ['Open', 'In Progress', 'Resolved'];

    for (let i = 0; i < Math.min(3, activeOrders.length); i++) {
      const order = activeOrders[i];
      const reqDoc = new MaintenanceRequest({
        user: order.user,
        rentalOrder: order._id,
        issueDescription: issueDescriptions[i],
        status: maintenanceStatuses[i]
      });
      await reqDoc.save();
    }
    console.log('Successfully seeded maintenance requests.');

    console.log('Seeding completed successfully!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDB();
