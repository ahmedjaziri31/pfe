# Role-Based AI Query Examples and Limitations

## Database Schema Analysis

Based on your `korpor_dev` database, here's the role hierarchy:

### Role Structure:
1. **Superadmin (role_id: 1)** - Full system access
2. **Admin (role_id: 2)** - Management access 
3. **Agent (role_id: 3)** - Limited support access
4. **User (role_id: 4)** - Basic user access

---

## 🔑 SUPERADMIN Role Examples

**Privileges:** `["all"]` - Unrestricted access to everything

### ✅ Allowed Queries:

**1. Sensitive Financial Data:**
```
Query: "Show me all users with their wallet balances and transaction history"
Response: Full financial details including sensitive payment information
SQL: SELECT u.name, u.email, w.cash_balance, w.rewards_balance, t.amount, t.type 
     FROM users u 
     JOIN wallets w ON u.id = w.user_id 
     JOIN transactions t ON w.user_id = t.user_id 
     ORDER BY w.cash_balance DESC
```

**2. System Administration:**
```
Query: "List all failed login attempts and security events"
Response: Complete security audit information
SQL: SELECT u.email, u.failed_login_attempts, u.locked_until, u.last_login 
     FROM users u 
     WHERE u.failed_login_attempts > 0 OR u.locked_until IS NOT NULL
```

**3. Personal Data Access:**
```
Query: "Show me users' phone numbers and 2FA status"
Response: All personal identifiable information
SQL: SELECT name, email, phone, twoFactorEnabled, twoFactorSecret 
     FROM users 
     WHERE phone IS NOT NULL
```

---

## 👨‍💼 ADMIN Role Examples

**Privileges:** `["manage_users","view_users","edit_users","view_reports","manage_content","view_dashboard","manage_settings","view_investments","manage_projects","view_transactions","ai_business_queries","ai_analytics"]`

### ✅ Allowed Queries:

**1. Business Intelligence:**
```
Query: "What is the total investment amount by project and region?"
Response: Business analytics without sensitive personal data
SQL: SELECT p.title, p.location, SUM(i.amount) as total_investment, COUNT(i.id) as investor_count
     FROM projects p 
     JOIN investments i ON p.id = i.project_id 
     WHERE i.status = 'completed'
     GROUP BY p.id, p.location
```

**2. User Management (Limited):**
```
Query: "Show me users by approval status"
Response: User management data excluding sensitive information
SQL: SELECT u.name, u.email, u.approval_status, u.created_at, u.investment_total
     FROM users u 
     ORDER BY u.created_at DESC
     -- Note: phone, password, tokens are excluded
```

**3. Investment Analytics:**
```
Query: "What are the top performing projects by funding percentage?"
Response: Investment performance metrics
SQL: SELECT p.title, p.funding_goal, p.current_funding, 
            (p.current_funding / p.funding_goal * 100) as funding_percentage
     FROM projects p 
     WHERE p.funding_goal > 0
     ORDER BY funding_percentage DESC
```

### ❌ Denied Queries:

**1. Personal Data Access:**
```
Query: "Show me all users' phone numbers and passwords"
Response: ❌ "Access denied. As an admin, you cannot access sensitive personal data like phone numbers or security credentials."
```

**2. System Administration:**
```
Query: "Show me blockchain transaction hashes and payment tokens"
Response: ❌ "Access denied. Sensitive financial tokens and blockchain data require superadmin privileges."
```

---

## 🎧 AGENT Role Examples

**Privileges:** `["view_dashboard","view_assigned_tasks","manage_own_profile","view_reports","view_assigned_users","manage_assigned_projects","ai_basic_queries","ai_customer_support"]`

### ✅ Allowed Queries:

**1. Customer Support:**
```
Query: "How many users are pending verification?"
Response: Basic user statistics for support tasks
SQL: SELECT COUNT(*) as pending_users 
     FROM users 
     WHERE approval_status = 'pending'
```

**2. Project Information:**
```
Query: "What projects are currently accepting investments?"
Response: Public project information
SQL: SELECT p.title, p.location, p.property_type, p.status, p.funding_goal, p.current_funding
     FROM projects p 
     WHERE p.status = 'active'
```

**3. Basic Investment Stats:**
```
Query: "Show me total investment count by status"
Response: General statistics without financial details
SQL: SELECT i.status, COUNT(*) as investment_count
     FROM investments i 
     GROUP BY i.status
```

### ❌ Denied Queries:

**1. Financial Data:**
```
Query: "Show me transaction amounts and wallet balances"
Response: ❌ "As a support agent, you cannot access financial transaction data. Try asking about user verification status or project information."
```

**2. User Personal Information:**
```
Query: "Give me all user email addresses and phone numbers"
Response: ❌ "Access denied. You can only view basic user statistics and verification status."
```

**3. Investment Details:**
```
Query: "Show me individual investment amounts per user"
Response: ❌ "You cannot access detailed investment information. Ask about general project statistics instead."
```

---

## 👤 USER Role Examples

**Privileges:** `["read:properties","create:investments"]` - Very limited access

### ✅ Allowed Queries:

**1. General Real Estate Questions:**
```
Query: "What are the benefits of real estate investment?"
Response: General educational content about real estate
No database access - informational response only
```

**2. Public Project Information:**
```
Query: "What types of properties are available for investment?"
Response: General information about property types
Limited to public project data only
```

### ❌ Denied Queries:

**1. Any Database Queries:**
```
Query: "Show me user statistics"
Response: ❌ "Regular users cannot access administrative data queries. Please ask general real estate questions instead."
```

**2. Financial Analytics:**
```
Query: "What is the total investment volume?"
Response: ❌ "Access denied. You don't have permission to access financial analytics."
```

---

## 🔒 Security Implementation

### Access Control Matrix:

| Table | Superadmin | Admin | Agent | User |
|-------|------------|-------|-------|------|
| users | FULL | READ (limited columns) | READ (verification only) | NONE |
| investments | FULL | READ | READ (basic stats) | NONE |
| transactions | FULL | READ (no tokens) | NONE | NONE |
| wallets | FULL | READ | NONE | NONE |
| projects | FULL | READ | READ (public info) | NONE |
| payments | FULL | READ (no tokens) | NONE | NONE |

### Column Restrictions:

**Admin denied columns:**
- `password`, `reset_code`, `phone`, `twoFactorSecret`, `refresh_token`
- `blockchain_hash`, `payme_token`, `stripe_payment_intent_id`

**Agent allowed columns:**
- Users: `id`, `name`, `email`, `created_at`, `approval_status`, `investment_total`
- Projects: `id`, `title`, `location`, `property_type`, `status`, `funding_goal`
- Investments: `id`, `user_id`, `project_id`, `amount`, `status`, `created_at`

### Row Filters:

**Agent restrictions:**
- Users: Only `approval_status IN ('pending', 'unverified')`
- Cannot access completed transactions or wallet data

---

## 🚨 Error Handling Examples

### Access Denied Responses:

```json
{
  "success": false,
  "error": "As a support agent, you can only ask basic questions about users and projects. Try asking about user verification status or project information.",
  "timestamp": "2025-06-22T10:30:00Z",
  "role_limitation": true
}
```

### Audit Logging:

Every query is logged with:
- User ID and role
- Query type and content
- Access result (success/denied/error)
- Execution time and tokens used
- Data accessed (tables/columns/row count)

This ensures complete traceability and security compliance. 