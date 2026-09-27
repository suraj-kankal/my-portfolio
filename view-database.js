const database = require('./database');

console.log('\n╔════════════════════════════════════════╗');
console.log('║       DATABASE VIEWER                  ║');
console.log('╚════════════════════════════════════════╝\n');

// Get statistics
const stats = database.getContactStats();
console.log('📊 STATISTICS:');
console.log(`   Total Contacts: ${stats.total}`);
console.log(`   New Contacts: ${stats.new}`);
console.log(`   Today's Contacts: ${stats.today}\n`);

// Get all contacts
const contacts = database.getAllContacts();
console.log('📋 ALL CONTACTS:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (contacts.length === 0) {
  console.log('   No contacts found in database.\n');
} else {
  contacts.forEach((contact, index) => {
    console.log(`${index + 1}. ID: ${contact.id}`);
    console.log(`   Name: ${contact.name}`);
    console.log(`   Email: ${contact.email}`);
    console.log(`   Subject: ${contact.subject || 'N/A'}`);
    console.log(`   Message: ${contact.message.substring(0, 50)}...`);
    console.log(`   Status: ${contact.status}`);
    console.log(`   IP: ${contact.ip_address}`);
    console.log(`   Received: ${contact.created_at}`);
    console.log('');
  });
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

database.close();
