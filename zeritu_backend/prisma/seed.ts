import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Cleaning existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.article.deleteMany();
  await prisma.event.deleteMany();
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin User
  console.log('👤 Creating admin user...');
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@zeritu.com',
      name: 'Admin User',
      role: 'ADMIN',
      accounts: {
        create: {
          providerId: 'credential',
          accountId: 'admin@zeritu.com',
          password: adminPassword,
        },
      },
    },
  });
  console.log(`✅ Admin user created: ${admin.email} (password: admin123)`);

  // Create Normal User
  console.log('👤 Creating normal user...');
  const userPassword = await hashPassword('user123');
  const user = await prisma.user.create({
    data: {
      email: 'user@zeritu.com',
      name: 'John Doe',
      role: 'USER',
      accounts: {
        create: {
          providerId: 'credential',
          accountId: 'user@zeritu.com',
          password: userPassword,
        },
      },
    },
  });
  console.log(`✅ Normal user created: ${user.email} (password: user123)`);

  // Create Products
  console.log('📦 Creating products...');
  const products = await Promise.all([
    prisma.product.create({
      data: {
        title: 'The Journey of Life',
        description: 'An inspiring autobiography chronicling the life journey of Zeritu Kebede, filled with personal stories, challenges, and triumphs.',
        price: 299,
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        stock: 50,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Music Collection - Greatest Hits',
        description: 'A compilation of Zeritu Kebede\'s most beloved songs, featuring both classic and contemporary tracks.',
        price: 199,
        category: 'Music',
        image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80',
        stock: 100,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Official T-Shirt',
        description: 'Premium quality cotton t-shirt featuring exclusive Zeritu Kebede branding. Available in multiple sizes.',
        price: 249,
        category: 'Merch',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
        stock: 75,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Signed Book Copy',
        description: 'Limited edition signed copy of "The Journey of Life". A collector\'s item for true fans.',
        price: 499,
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        stock: 20,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Concert DVD',
        description: 'Recorded live performance from the 2023 concert tour. Includes behind-the-scenes footage.',
        price: 159,
        category: 'Music',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
        stock: 60,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Hoodie',
        description: 'Comfortable and stylish hoodie with embroidered logo. Perfect for casual wear.',
        price: 399,
        category: 'Merch',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
        stock: 40,
        isActive: true,
      },
    }),
  ]);
  console.log(`✅ Created ${products.length} products`);

  // Create Articles
  console.log('📝 Creating articles...');
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: 'The Power of Storytelling in Music',
        excerpt: 'Exploring how storytelling transforms music into a powerful medium for connection and inspiration.',
        content: 'Music has always been a universal language, but when combined with storytelling, it becomes something truly extraordinary. In this article, we explore how artists like Zeritu Kebede use narrative elements in their music to create deeper connections with audiences. Storytelling in music allows listeners to not just hear a song, but to experience a journey, to feel emotions, and to see the world through the artist\'s eyes.\n\nThrough carefully crafted lyrics and melodies, musicians can transport us to different times and places, making us feel joy, sorrow, hope, and everything in between. This is the true power of storytelling in music - it creates a bridge between the artist and the listener, fostering understanding and empathy.',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
        published: true,
        publishedAt: new Date(),
        authorId: admin.id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'Upcoming Book Release: Behind the Scenes',
        excerpt: 'Get an exclusive look at the creative process behind the upcoming book release.',
        content: 'The journey of creating a book is never straightforward. It involves countless hours of writing, rewriting, editing, and refining. In this behind-the-scenes look, we share the creative process that went into the upcoming book release.\n\nFrom the initial concept to the final printed pages, every step of the journey has been carefully considered. The book represents not just a collection of words, but a piece of the author\'s soul, shared with the world.',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
        published: true,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        authorId: admin.id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'The Impact of Music on Community',
        excerpt: 'How music brings people together and creates lasting bonds within communities.',
        content: 'Music has an incredible ability to bring people together. In communities around the world, music serves as a common ground where people from different backgrounds can connect, share experiences, and build relationships.\n\nWhether it\'s through concerts, festivals, or simply sharing favorite songs, music creates opportunities for people to come together and celebrate what makes them human. This article explores the various ways music impacts and strengthens communities.',
        image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80',
        published: true,
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        authorId: admin.id,
      },
    }),
  ]);
  console.log(`✅ Created ${articles.length} articles`);

  // Create Events
  console.log('🎉 Creating events...');
  const now = new Date();
  const upcomingEvents = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Book Signing Event - Addis Ababa',
        description: 'Join us for an exclusive book signing event in Addis Ababa. Meet Zeritu Kebede, get your books signed, and enjoy an evening of conversation and music.',
        date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        time: '6:00 PM',
        location: 'Ethiopian National Theatre, Addis Ababa',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        status: 'UPCOMING',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Concert Tour - Dire Dawa',
        description: 'Experience an unforgettable evening of music and performance in Dire Dawa. Featuring all your favorite songs and special guest performances.',
        date: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        time: '7:30 PM',
        location: 'Dire Dawa Cultural Center',
        image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80',
        status: 'UPCOMING',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Music Workshop - Bahir Dar',
        description: 'A special workshop for aspiring musicians. Learn about songwriting, performance, and the music industry from an experienced artist.',
        date: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        time: '2:00 PM',
        location: 'Bahir Dar University, Bahir Dar',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
        status: 'UPCOMING',
      },
    }),
  ]);

  const pastEvents = await Promise.all([
    prisma.event.create({
      data: {
        title: '2023 Annual Concert',
        description: 'A memorable evening celebrating music and community. The concert featured special performances and guest appearances.',
        date: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
        time: '8:00 PM',
        location: 'Millennium Hall, Addis Ababa',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
        status: 'PAST',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Book Launch Event',
        description: 'The official launch of "The Journey of Life" was a huge success, with fans from all over coming to celebrate.',
        date: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
        time: '5:00 PM',
        location: 'Hilton Addis Ababa',
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
        status: 'PAST',
      },
    }),
  ]);
  console.log(`✅ Created ${upcomingEvents.length + pastEvents.length} events`);

  console.log('\n✨ Seed completed successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('   Admin: admin@zeritu.com / admin123');
  console.log('   User:  user@zeritu.com / user123');
  console.log('\n📦 Created:');
  console.log(`   - ${products.length} products`);
  console.log(`   - ${articles.length} articles`);
  console.log(`   - ${upcomingEvents.length} upcoming events`);
  console.log(`   - ${pastEvents.length} past events`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

