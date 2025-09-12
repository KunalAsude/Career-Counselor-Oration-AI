import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearAllChats() {
  console.log('🧹 Clearing all chat sessions and messages...')

  try {
    // Delete all messages first (due to foreign key constraints)
    const deletedMessages = await prisma.message.deleteMany({})
    console.log(`✅ Deleted ${deletedMessages.count} messages`)

    // Delete all chat sessions
    const deletedSessions = await prisma.chatSession.deleteMany({})
    console.log(`✅ Deleted ${deletedSessions.count} chat sessions`)

    console.log('🎉 All chat data cleared successfully!')
  } catch (error) {
    console.error('❌ Error clearing chat data:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

clearAllChats()