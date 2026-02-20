const { MongoClient } = require("mongodb");

async function seedDatabase() {
  const client = new MongoClient("mongodb://localhost:27017/civic-governance");
  
  try {
    await client.connect();
    const db = client.db("civic-governance");
    
    // Insert test society
    const societyResult = await db.collection("societies").insertOne({
      name: "Test Society",
      description: "A test community for development",
      address: {
        street: "Test Street",
        city: "Delhi",
        state: "Delhi",
        pinCode: "110001",
        country: "India"
      },
      location: {
        type: "Point",
        coordinates: [77.3910, 28.5355]
      },
      totalMembers: 0,
      totalVolunteers: 0,
      createdAt: new Date()
    });
    
    console.log("Society created with ID:", societyResult.insertedId.toString());
    
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await client.close();
  }
}

seedDatabase();
