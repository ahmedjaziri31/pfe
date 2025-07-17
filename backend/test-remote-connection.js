const http = require("http");

console.log("Testing connection to backend server...");

// Test localhost first
console.log("\n1. Testing localhost:5000...");
http
  .get("http://localhost:5000/api/payment/methods", (res) => {
    console.log("✅ Localhost Status:", res.statusCode);
    res.on("data", (d) => {
      try {
        const data = JSON.parse(d.toString());
        console.log(
          "✅ Localhost Response:",
          data.supported_methods?.length,
          "methods"
        );
      } catch (e) {
        console.log("✅ Localhost Response received");
      }
    });
  })
  .on("error", (err) => {
    console.log("❌ Localhost Error:", err.message);
  });

// Test the IP address the frontend is using
setTimeout(() => {
  console.log("\n2. Testing 192.168.252.72:5000...");
  http
    .get("http://192.168.252.72:5000/api/payment/methods", (res) => {
      console.log("✅ Remote IP Status:", res.statusCode);
      res.on("data", (d) => {
        try {
          const data = JSON.parse(d.toString());
          console.log(
            "✅ Remote IP Response:",
            data.supported_methods?.length,
            "methods"
          );
        } catch (e) {
          console.log("✅ Remote IP Response received");
        }
      });
    })
    .on("error", (err) => {
      console.log("❌ Remote IP Error:", err.message);
      console.log(
        "💡 This means the backend server is not accessible from the IP address the frontend is using"
      );
      console.log(
        '💡 The server needs to be started with host: "0.0.0.0" to accept connections from all interfaces'
      );
    });
}, 1000);

// Test saved payment methods endpoint
setTimeout(() => {
  console.log("\n3. Testing saved payment methods on remote IP...");

  const options = {
    hostname: "192.168.252.72",
    port: 5000,
    path: "/api/payment/saved-methods",
    method: "GET",
    headers: {
      "x-user-id": "test_user_123",
      "Content-Type": "application/json",
    },
  };

  const req = http.request(options, (res) => {
    console.log("✅ Saved methods Status:", res.statusCode);
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      try {
        const response = JSON.parse(data);
        console.log(
          "✅ Saved methods Response:",
          response.payment_methods?.length || 0,
          "saved methods"
        );
      } catch (e) {
        console.log("✅ Saved methods Response received");
      }
    });
  });

  req.on("error", (err) => {
    console.log("❌ Saved methods Error:", err.message);
  });

  req.end();
}, 2000);

setTimeout(() => {
  console.log("\n🎉 Test completed!");
  process.exit();
}, 4000);
