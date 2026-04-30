const mongoose = require('mongoose');
require('dotenv').config();
const Project = require('./src/models/Project');
const User = require('./src/models/User');

const seedProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_LOCAL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for Seeding');

    // Find or create a default user to act as the owner
    let user = await User.findOne({ email: 'owner@example.com' });
    if (!user) {
      user = new User({
        firstName: 'Eco',
        lastName: 'Owner',
        email: 'owner@example.com',
        password: 'password123', // usually hashed, but this is just for reference
      });
      await user.save();
      console.log('Created dummy user');
    }

    const projects = [
      {
        title: 'Community Solar Array in Downtown',
        description: 'Building a 50kW solar array on the roof of the local community center to provide clean energy to 20 low-income households.',
        category: 'Solar Power',
        targetAmount: 50000,
        fundedAmount: 15000,
        interestRate: 5.5,
        duration: 36,
        owner: user._id,
        status: 'active',
        images: ['https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=1000'],
        location: { city: 'Portland', state: 'OR', country: 'USA' }
      },
      {
        title: 'Urban Rooftop Garden Expansion',
        description: 'Expanding our successful urban farming initiative to three more rooftops, providing fresh produce to food deserts.',
        category: 'Urban Farming',
        targetAmount: 15000,
        fundedAmount: 12500,
        interestRate: 4.0,
        duration: 12,
        owner: user._id,
        status: 'active',
        images: ['https://images.pexels.com/photos/298244/pexels-photo-298244.jpeg?auto=compress&cs=tinysrgb&w=1000'],
        location: { city: 'Chicago', state: 'IL', country: 'USA' }
      },
      {
        title: 'River Cleanup & Waste Management Fleet',
        description: 'Funding the purchase of two autonomous river-cleaning boats to collect plastic waste before it reaches the ocean.',
        category: 'Waste Management',
        targetAmount: 85000,
        fundedAmount: 10000,
        interestRate: 6.0,
        duration: 48,
        owner: user._id,
        status: 'active',
        images: ['https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=1000'],
        location: { city: 'New Orleans', state: 'LA', country: 'USA' }
      },
      {
        title: 'Wind Turbine for Rural School',
        description: 'Installing a small-scale wind turbine to power a rural elementary school and provide educational opportunities about renewable energy.',
        category: 'Renewable Energy',
        targetAmount: 25000,
        fundedAmount: 25000,
        interestRate: 4.5,
        duration: 24,
        owner: user._id,
        status: 'funded',
        images: ['https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=1000'],
        location: { city: 'Lubbock', state: 'TX', country: 'USA' }
      },
      {
        title: 'Smart Irrigation for Local Farms',
        description: 'Deploying IoT-based smart irrigation systems across 5 local farms to reduce water consumption by 30%.',
        category: 'Water Conservation',
        targetAmount: 35000,
        fundedAmount: 5000,
        interestRate: 5.0,
        duration: 36,
        owner: user._id,
        status: 'active',
        images: ['https://images.pexels.com/photos/2100072/pexels-photo-2100072.jpeg?auto=compress&cs=tinysrgb&w=1000'],
        location: { city: 'Fresno', state: 'CA', country: 'USA' }
      }
    ];

    await Project.deleteMany({});
    console.log('Cleared existing projects');
    
    await Project.insertMany(projects);
    console.log(`Successfully seeded ${projects.length} projects`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding projects:', error);
    process.exit(1);
  }
};

seedProjects();
