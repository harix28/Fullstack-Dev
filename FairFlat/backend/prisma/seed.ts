import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const members = [
  { name: 'Hari Sharma',   email: 'hari@roomio.app',   password: 'Hari@123' },
  { name: 'Rahul Verma',   email: 'rahul@roomio.app',  password: 'Rahul@123' },
  { name: 'Priya Singh',   email: 'priya@roomio.app',  password: 'Priya@123' },
  { name: 'Aman Gupta',    email: 'aman@roomio.app',   password: 'Aman@123' },
  { name: 'Neha Patel',    email: 'neha@roomio.app',   password: 'Neha@123' },
];

const categories = ['Food', 'Groceries', 'Utilities', 'Rent', 'Household', 'Entertainment', 'Travel'];

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  console.log('Seeding massive database...\n');
  
  // Clean DB first (optional, but good for fresh seeds)
  await prisma.activityLog.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.shoppingItem.deleteMany({});
  await prisma.choreAssignment.deleteMany({});
  await prisma.chore.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.expenseParticipant.deleteMany({});
  await prisma.itemParticipant.deleteMany({});
  await prisma.expenseItem.deleteMany({});
  await prisma.expense.deleteMany({});
  await prisma.recurringExpense.deleteMany({});
  await prisma.groupMember.deleteMany({});
  await prisma.group.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create users
  const createdUsers = [];
  for (const m of members) {
    const hash = await bcrypt.hash(m.password, 10);
    const user = await prisma.user.create({
      data: { name: m.name, email: m.email, passwordHash: hash }
    });
    createdUsers.push(user);
    console.log(`Created user: ${m.name} | ${m.email} | ${m.password}`);
  }

  // 2. Create Group
  const group = await prisma.group.create({
    data: {
      name: 'Koregaon Park Flat',
      inviteCode: 'ROOMIO2024',
    }
  });
  console.log(`\nGroup: ${group.name}`);

  // 3. Add Members
  for (let i = 0; i < createdUsers.length; i++) {
    await prisma.groupMember.create({
      data: { userId: createdUsers[i].id, groupId: group.id, role: i === 0 ? 'owner' : 'member' }
    });
  }
  console.log('All 5 members added to group\n');

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6); // 6 months of history

  // 4. Generate 100+ Random Expenses
  console.log('Generating 120 expenses...');
  for (let i = 0; i < 120; i++) {
    const payer = createdUsers[randomInt(0, createdUsers.length - 1)];
    const amount = randomInt(500, 5000);
    const category = categories[randomInt(0, categories.length - 1)];
    const date = randomDate(startDate, new Date());
    
    // Split type (80% equal, 20% random custom)
    const splitType = Math.random() > 0.2 ? 'equal' : 'percentage';
    
    const expense = await prisma.expense.create({
      data: {
        title: `${category} Expense #${i + 1}`,
        amount,
        payerId: payer.id,
        groupId: group.id,
        splitType,
        category,
        date,
      }
    });

    if (splitType === 'equal') {
      const share = amount / createdUsers.length;
      for (const u of createdUsers) {
        await prisma.expenseParticipant.create({
          data: {
            expenseId: expense.id,
            userId: u.id,
            share: share,
            calculatedAmount: share,
          }
        });
      }
    } else {
      // Percentage split (rough approximation)
      let remainingPct = 100;
      let remainingAmt = amount;
      
      for (let j = 0; j < createdUsers.length; j++) {
        const isLast = j === createdUsers.length - 1;
        const pct = isLast ? remainingPct : Math.floor(Math.random() * (remainingPct / 2) + 10);
        const calcAmt = isLast ? remainingAmt : (amount * pct) / 100;
        
        remainingPct -= pct;
        remainingAmt -= calcAmt;
        
        await prisma.expenseParticipant.create({
          data: {
            expenseId: expense.id,
            userId: createdUsers[j].id,
            share: pct,
            calculatedAmount: calcAmt,
          }
        });
      }
    }
  }

  // 5. Generate Itemized Expense (Example of complex bill)
  const itemizedExp = await prisma.expense.create({
    data: {
      title: 'Weekend Barbeque Party',
      amount: 4500,
      payerId: createdUsers[0].id,
      groupId: group.id,
      splitType: 'itemized',
      category: 'Food',
      date: new Date(),
      tax: 250,
      serviceCharge: 200,
      taxDistribution: 'proportional'
    }
  });

  const expItems = [
    { name: 'Chicken 2kg', price: 1500, qty: 1 },
    { name: 'Paneer 1kg', price: 600, qty: 1 },
    { name: 'Drinks', price: 1200, qty: 1 },
    { name: 'Charcoal', price: 400, qty: 1 },
    { name: 'Snacks', price: 350, qty: 1 },
  ];

  for (const it of expItems) {
    const ei = await prisma.expenseItem.create({
      data: { expenseId: itemizedExp.id, name: it.name, price: it.price, quantity: it.qty }
    });
    // Add random participants to items
    const numParts = randomInt(2, 5);
    const shuffled = [...createdUsers].sort(() => 0.5 - Math.random());
    for (let j = 0; j < numParts; j++) {
      await prisma.itemParticipant.create({
        data: { expenseItemId: ei.id, userId: shuffled[j].id }
      });
    }
  }

  // Add expense participants for the itemized expense with arbitrary calc amounts
  for (const u of createdUsers) {
    await prisma.expenseParticipant.create({
      data: {
        expenseId: itemizedExp.id,
        userId: u.id,
        calculatedAmount: 4500 / 5, // Simplified
      }
    });
  }

  // 6. Generate Payments (Settlements)
  console.log('Generating 30 payments (settlements)...');
  for (let i = 0; i < 30; i++) {
    const fromUser = createdUsers[randomInt(0, createdUsers.length - 1)];
    let toUser = createdUsers[randomInt(0, createdUsers.length - 1)];
    while(toUser.id === fromUser.id) toUser = createdUsers[randomInt(0, createdUsers.length - 1)];
    
    await prisma.payment.create({
      data: {
        groupId: group.id,
        fromUserId: fromUser.id,
        toUserId: toUser.id,
        amount: randomInt(500, 3000),
        status: 'completed',
        date: randomDate(startDate, new Date())
      }
    });
  }

  // 7. Generate Chores
  console.log('Generating 15 chores and history...');
  const choreList = ['Clean Kitchen', 'Vacuum Living Room', 'Take Out Trash', 'Clean Bathroom', 'Mop Floors', 'Water Plants', 'Clean Windows'];
  
  for (let i = 0; i < 15; i++) {
    const chore = await prisma.chore.create({
      data: {
        title: choreList[randomInt(0, choreList.length - 1)] + ` #${i}`,
        groupId: group.id,
        frequency: 'weekly',
        priority: ['low', 'medium', 'high'][randomInt(0, 2)],
        dueDate: randomDate(startDate, new Date(Date.now() + 7 * 24 * 3600000)),
      }
    });

    // Create assignments
    for (let j = 0; j < 3; j++) {
      const status = Math.random() > 0.5 ? 'completed' : 'pending';
      await prisma.choreAssignment.create({
        data: { 
          choreId: chore.id, 
          userId: createdUsers[randomInt(0, 4)].id, 
          status,
          completedAt: status === 'completed' ? randomDate(startDate, new Date()) : null
        }
      });
    }
  }

  // 8. Generate Shopping Items
  console.log('Generating shopping list...');
  const shopItems = ['Milk', 'Eggs', 'Bread', 'Rice 5kg', 'Dal', 'Tomatoes', 'Onions', 'Cooking Oil', 'Soap', 'Shampoo', 'Toilet Paper', 'Detergent'];
  for (const item of shopItems) {
    const status = Math.random() > 0.5 ? 'purchased' : 'pending';
    const purchaserId = status === 'purchased' ? createdUsers[randomInt(0, 4)].id : null;
    
    await prisma.shoppingItem.create({
      data: {
        name: item,
        groupId: group.id,
        status,
        purchasedBy: purchaserId,
        priority: ['low', 'medium', 'high'][randomInt(0, 2)]
      }
    });
  }

  // 9. Generate Activity Logs
  console.log('Generating activity logs...');
  for(let i=0; i < 50; i++) {
    await prisma.activityLog.create({
      data: {
        groupId: group.id,
        userId: createdUsers[randomInt(0, 4)].id,
        action: ['created', 'updated', 'deleted', 'completed'][randomInt(0, 3)],
        entity: ['expense', 'chore', 'shopping', 'settlement'][randomInt(0, 3)],
        createdAt: randomDate(startDate, new Date())
      }
    });
  }

  console.log('\n=== MASSIVE SEED COMPLETE ===');
  console.log('Group: Koregaon Park Flat | Code: ROOMIO2024');
  console.log('\nCredentials:');
  for (const m of members) {
    console.log(`  Email: ${m.email}  Pass: ${m.password}`);
  }
}

seed().catch(console.error).finally(() => prisma.$disconnect());
