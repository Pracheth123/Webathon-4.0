const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId } = require("mongodb");

async function seedTestData() {
  const client = new MongoClient("mongodb://localhost:27017/civic-governance");

  try {
    await client.connect();
    const db = client.db("civic-governance");

    // Create a test admin user first
    const adminUser = {
      name: "Test Admin",
      email: "admin@test.com",
      password: await bcrypt.hash("Admin123456", 10),
      role: "admin",
      phone: "9876543210",
      civicScore: 0,
      reliabilityScore: 0,
      createdAt: new Date()
    };

    const adminResult = await db.collection("users").insertOne(adminUser);
    const adminId = adminResult.insertedId;
    console.log("Admin user created with ID:", adminId.toString());

    // Create a test society with the admin's ID
    const society = {
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
      adminId: adminId,
      totalMembers: 1,
      totalVolunteers: 0,
      communityLeaders: [],
      municipalContacts: [],
      createdAt: new Date()
    };

    const societyResult = await db.collection("societies").insertOne(society);
    const societyId = societyResult.insertedId;
    console.log("Test society created with ID:", societyId.toString());

    // Update admin user with societyId
    await db.collection("users").updateOne(
      { _id: adminId },
      { $set: { societyId: societyId } }
    );
    console.log("Admin user updated with societyId");

    // Create a second test volunteer user
    const volunteerUser = {
      name: "Test Volunteer",
      email: "volunteer@test.com",
      password: await bcrypt.hash("Volunteer123456", 10),
      role: "volunteer",
      societyId: societyId,
      phone: "9876543211",
      civicScore: 0,
      reliabilityScore: 0,
      createdAt: new Date()
    };

    const volunteerResult = await db.collection("users").insertOne(volunteerUser);
    console.log("Test volunteer user created with ID:", volunteerResult.insertedId.toString());

    console.log("\n✅ Test data created successfully!");
    console.log("Admin User - Email: admin@test.com, Password: Admin123456");
    console.log("Test Society ID:", societyId.toString());

  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await client.close();
  }
}

seedTestData();
