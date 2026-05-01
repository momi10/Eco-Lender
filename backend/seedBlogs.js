const mongoose = require('mongoose');
require('dotenv').config();
const Blog = require('./src/models/Blog');
const User = require('./src/models/User');

const seedBlogs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_LOCAL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for Seeding Blogs');

    // Find or create a default user to act as the author
    let user = await User.findOne({ email: 'owner@example.com' });
    if (!user) {
      user = new User({
        firstName: 'Eco',
        lastName: 'Owner',
        email: 'owner@example.com',
        password: 'password123',
      });
      await user.save();
      console.log('Created dummy user');
    }

    const blogs = [
      {
        title: 'The Future of Sustainable Micro-Financing',
        content: 'Micro-financing has long been a powerful tool for empowering individuals in developing regions. But when we combine micro-financing with sustainable, eco-friendly initiatives, the potential for positive global impact multiplies. In this post, we explore how small loans are making big changes in renewable energy adoption, sustainable agriculture, and water conservation around the world.',
        excerpt: 'How small loans are making big changes in renewable energy adoption and sustainable agriculture.',
        category: 'Finance',
        tags: ['microfinance', 'sustainability', 'green energy'],
        featured_image: 'https://images.pexels.com/photos/259165/pexels-photo-259165.jpeg?auto=compress&cs=tinysrgb&w=1000',
        author: user._id,
        published: true,
        views: 124
      },
      {
        title: 'Top 5 Renewable Energy Technologies to Watch in 2026',
        content: 'As the world shifts away from fossil fuels, innovation in the renewable energy sector is accelerating. From next-generation perovskite solar cells to advanced grid-scale battery storage and tidal energy solutions, the technology landscape is evolving rapidly. Here are the top five breakthroughs you need to keep an eye on this year.',
        excerpt: 'From next-generation solar cells to advanced grid-scale battery storage, here are the top five breakthroughs.',
        category: 'Technology',
        tags: ['technology', 'solar', 'wind', 'innovation'],
        featured_image: 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=1000',
        author: user._id,
        published: true,
        views: 342
      },
      {
        title: 'Building Resilient Communities Through Local Agriculture',
        content: 'Food security is becoming increasingly challenging in the face of climate change and global supply chain disruptions. Community-supported agriculture (CSA) and urban farming are proving to be resilient alternatives. By keeping food production local, communities can reduce carbon footprints, ensure access to fresh produce, and build stronger neighborhood bonds.',
        excerpt: 'By keeping food production local, communities can reduce carbon footprints and ensure access to fresh produce.',
        category: 'Sustainability',
        tags: ['agriculture', 'community', 'urban farming'],
        featured_image: 'https://images.pexels.com/photos/298244/pexels-photo-298244.jpeg?auto=compress&cs=tinysrgb&w=1000',
        author: user._id,
        published: true,
        views: 89
      }
    ];

    await Blog.deleteMany({});
    console.log('Cleared existing blogs');
    
    for (const blogData of blogs) {
      const blog = new Blog(blogData);
      await blog.save();
    }
    console.log(`Successfully seeded ${blogs.length} blogs`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding blogs:', error);
    process.exit(1);
  }
};

seedBlogs();
