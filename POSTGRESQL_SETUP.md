# PostgreSQL Setup Guide for BU Connect

## 🐘 PostgreSQL Database Setup

Your BU Connect project has been configured to use PostgreSQL instead of SQLite. Follow these steps to complete the setup:

## 1. Install PostgreSQL

### Windows (Recommended)
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. **Remember the password** you set for the `postgres` superuser
4. Default port is `5432` (keep this)
5. Install pgAdmin (database management tool) when prompted

### Alternative: Using Docker
```bash
# Run PostgreSQL in a Docker container
docker run --name buconnect-postgres -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=buconnect_db -p 5432:5432 -d postgres:15

# Or using Docker Compose (create docker-compose.yml)
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: buconnect_user
      POSTGRES_PASSWORD: yourpassword
      POSTGRES_DB: buconnect_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 2. Update Environment Variables

Update your `.env` file with your PostgreSQL connection details:

```env
# Replace with your actual PostgreSQL credentials
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/buconnect_db?schema=public"

# For Docker setup, use:
# DATABASE_URL="postgresql://buconnect_user:yourpassword@localhost:5432/buconnect_db?schema=public"
```

### Environment Variable Format:
```
postgresql://[username]:[password]@[host]:[port]/[database_name]?schema=public
```

- **username**: Your PostgreSQL username (default: `postgres`)
- **password**: Your PostgreSQL password (set during installation)
- **host**: Database host (usually `localhost`)
- **port**: Database port (default: `5432`)
- **database_name**: Database name (we'll use `buconnect_db`)

## 3. Create the Database

### Option A: Using pgAdmin (GUI)
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Databases" → "Create" → "Database..."
4. Database name: `buconnect_db`
5. Click "Save"

### Option B: Using Command Line
```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE buconnect_db;

# Exit psql
\q
```

## 4. Run Prisma Migrations

Once PostgreSQL is set up and running:

```bash
# Create and apply the initial migration
npx prisma migrate dev --name init

# Seed the database with demo data
npm run db:seed
```

## 5. Start the Application

```bash
npm run dev
```

Your BU Connect application will now be running with PostgreSQL! 🎉

## 🔧 Troubleshooting

### Connection Issues
- Ensure PostgreSQL service is running
- Verify your credentials in the `.env` file
- Check if the database `buconnect_db` exists
- Confirm the port 5432 is not blocked

### Migration Errors
If you encounter migration errors:
```bash
# Reset the database (WARNING: This deletes all data)
npx prisma migrate reset

# Or force push the schema
npx prisma db push --force-reset
```

### Common Connection String Examples

**Local PostgreSQL:**
```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/buconnect_db?schema=public"
```

**Docker PostgreSQL:**
```env
DATABASE_URL="postgresql://buconnect_user:mypassword@localhost:5432/buconnect_db?schema=public"
```

**Cloud PostgreSQL (Neon, Supabase, etc.):**
```env
DATABASE_URL="postgresql://user:password@hostname:5432/database?sslmode=require"
```

## 🌟 Benefits of PostgreSQL

- **Production-ready**: Better performance and scalability than SQLite
- **Advanced features**: JSON support, full-text search, advanced indexing
- **Cloud deployment**: Compatible with Vercel, Heroku, Railway, etc.
- **Better concurrency**: Multiple users can access the database simultaneously
- **ACID compliance**: Better data integrity and transactions

## 📊 Database Management Tools

- **pgAdmin**: Full-featured PostgreSQL administration tool
- **Prisma Studio**: Visual database browser (`npx prisma studio`)
- **DBeaver**: Universal database tool
- **TablePlus**: Modern database management tool

Your BU Connect project is now configured for PostgreSQL! 🚀
