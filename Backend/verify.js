#!/usr/bin/env node

/**
 * Verification Script for BookLedger Backend
 * Checks if all components are properly configured
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checks = {
  files: [],
  configs: [],
  dependencies: [],
};

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  const exists = fs.existsSync(fullPath);
  checks.files.push({
    path: filePath,
    description,
    status: exists ? "✓" : "✗",
  });
  return exists;
}

function checkConfig(configKey, description) {
  const configPath = path.join(__dirname, "config/config.env");
  const configContent = fs.readFileSync(configPath, "utf8");
  const exists = configContent.includes(configKey);
  checks.configs.push({
    key: configKey,
    description,
    status: exists ? "✓" : "✗",
  });
  return exists;
}

function checkDependencies() {
  try {
    const packagePath = path.join(__dirname, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    const dependencies = packageJson.dependencies || {};

    const required = [
      "express",
      "mongoose",
      "jsonwebtoken",
      "bcryptjs",
      "dotenv",
      "cors",
      "cookie-parser",
    ];

    required.forEach((dep) => {
      const installed = dep in dependencies;
      checks.dependencies.push({
        name: dep,
        version: dependencies[dep] || "Not installed",
        status: installed ? "✓" : "✗",
      });
    });
  } catch (error) {
    console.error("Error reading package.json:", error.message);
  }
}

function printResults() {
  console.log(`\n${colors.blue}========== BookLedger Backend Verification ==========${colors.reset}\n`);

  // Files Check
  console.log(`${colors.blue}📁 Required Files:${colors.reset}`);
  console.log("─".repeat(60));
  checks.files.forEach((file) => {
    const color = file.status === "✓" ? colors.green : colors.red;
    console.log(
      `${color}${file.status}${colors.reset} ${file.description.padEnd(40)} [${file.path}]`
    );
  });

  // Configuration Check
  console.log(
    `\n${colors.blue}⚙️  Configuration:${colors.reset}`
  );
  console.log("─".repeat(60));
  checks.configs.forEach((config) => {
    const color = config.status === "✓" ? colors.green : colors.red;
    console.log(
      `${color}${config.status}${colors.reset} ${config.description.padEnd(40)} [${config.key}]`
    );
  });

  // Dependencies Check
  console.log(
    `\n${colors.blue}📦 Dependencies:${colors.reset}`
  );
  console.log("─".repeat(60));
  checks.dependencies.forEach((dep) => {
    const color = dep.status === "✓" ? colors.green : colors.red;
    console.log(
      `${color}${dep.status}${colors.reset} ${dep.name.padEnd(25)} ${dep.version.padEnd(20)}`
    );
  });

  // Summary
  const totalChecks = checks.files.length + checks.configs.length + checks.dependencies.length;
  const passedChecks =
    checks.files.filter((f) => f.status === "✓").length +
    checks.configs.filter((c) => c.status === "✓").length +
    checks.dependencies.filter((d) => d.status === "✓").length;

  console.log("\n" + "─".repeat(60));
  if (passedChecks === totalChecks) {
    console.log(
      `${colors.green}✓ All checks passed! Backend is ready.${colors.reset}`
    );
    console.log("\n📋 Next Steps:");
    console.log("   1. Run: npm install");
    console.log("   2. Run: node seed.js (to populate sample data)");
    console.log("   3. Run: npm run dev (to start development server)");
    console.log("   4. Visit: http://localhost:4000/api/health\n");
  } else {
    console.log(
      `${colors.yellow}⚠  Some checks failed (${passedChecks}/${totalChecks})${colors.reset}`
    );
    console.log(
      "\n🔧 To fix issues:"
    );
    console.log("   - Ensure all files are in correct locations");
    console.log("   - Check config/config.env is properly set");
    console.log("   - Run: npm install\n");
  }
}

// Run all checks
console.log(`${colors.blue}Running verification checks...${colors.reset}`);

// Check Models
checkFile("models/bookModel.js", "Book Model");
checkFile("models/userModel.js", "User Model");
checkFile("models/customerModel.js", "Customer Model");
checkFile("models/saleModel.js", "Sale Model");
checkFile("models/auditLogModel.js", "Audit Log Model");

// Check Services
checkFile("services/authService.js", "Auth Service");
checkFile("services/transactionService.js", "Transaction Service");
checkFile("services/pricingService.js", "Pricing Service");
checkFile("services/auditService.js", "Audit Service");

// Check Middleware
checkFile("middlewares/authMiddleware.js", "Auth Middleware");
checkFile("middlewares/errorMiddleware.js", "Error Middleware");

// Check Controllers
checkFile("controller/userController.js", "User Controller");
checkFile("controller/bookController.js", "Book Controller");
checkFile("controller/saleController.js", "Sale Controller");
checkFile("controller/inventoryController.js", "Inventory Controller");
checkFile("controller/adminController.js", "Admin Controller");

// Check Routes
checkFile("routes/userRoutes.js", "User Routes");
checkFile("routes/bookRoutes.js", "Book Routes");
checkFile("routes/saleRoutes.js", "Sale Routes");
checkFile("routes/inventoryRoutes.js", "Inventory Routes");
checkFile("routes/adminRoutes.js", "Admin Routes");

// Check Main Files
checkFile("app.js", "Express App");
checkFile("server.js", "Server Entry Point");
checkFile("config/config.env", "Environment Config");
checkFile("package.json", "Package Configuration");

// Check Configuration
console.log("\nChecking configuration...");
checkConfig("PORT", "PORT configuration");
checkConfig("MONGODB_URL", "MongoDB URL");
checkConfig("JWT_SECRET", "JWT Secret");
checkConfig("FRONTEND_URL", "Frontend URL");

// Check Dependencies
console.log("Checking dependencies...");
checkDependencies();

// Print Results
printResults();
