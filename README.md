# Shabble - Daily Shape Guessing Puzzle Game
### A fun and challenging daily puzzle game where you guess the hidden shape.
Link: https://shabble.vercel.app
## Getting Started
### Prerequisites
- Node.js and npm (or pnpm): Ensure you have Node.js and npm (or pnpm) installed on your system. You can download them from the official Node.js website.
### Installation
- Clone the Repository:
```
git clone https://github.com/coder-zs-cse/Shabble.git
cd Shabble
```

### Set Up Environment Variables:
- Rename the .env.example file to .env.
- Update the POSTGRES_URL variable in the .env file with your PostgreSQL database connection string.

### Install Dependencies:
```
pnpm install
```

### Run Database Migrations:
```
npm run prisma:migrate
```

### Start the Development Server:
```
npm run dev
```

Access the Game: Open your web browser and navigate to ```http://localhost:3000``` to play the game.

### Troubleshooting

#### Common Prisma Connection Errors

**Error: `P1001: Can't reach database server`**
- **Cause**: The PostgreSQL database server is not running or the connection string is incorrect.
- **Solution**:
  1. Verify your `POSTGRES_URL` in the `.env` file is correctly formatted.
  2. Ensure PostgreSQL is installed and running on your system.
  3. Test the connection string format: `postgresql://user:password@localhost:5432/database_name`
  4. Check that the database name, username, and password are correct.

**Error: `P1000: Authentication failed against database server`**
- **Cause**: Invalid credentials in the connection string.
- **Solution**:
  1. Double-check your PostgreSQL username and password.
  2. Ensure there are no special characters that need URL encoding in your password.
  3. If using special characters, encode them (e.g., `@` becomes `%40`).

**Error: `P2021: Table not found in the current database`**
- **Cause**: Database migrations haven't been run or the schema is out of sync.
- **Solution**:
  1. Run migrations: `npm run prisma:migrate dev`
  2. If migrations fail, check the error messages in the console for schema issues.
  3. Verify the database exists and is accessible.

#### Setting Up PostgreSQL

**Option 1: Local PostgreSQL Installation**

- **macOS (using Homebrew)**:
  ```bash
  brew install postgresql
  brew services start postgresql
  createdb shabble_dev
  ```

- **Ubuntu/Debian**:
  ```bash
  sudo apt-get install postgresql postgresql-contrib
  sudo systemctl start postgresql
  sudo -u postgres createdb shabble_dev
  ```

- **Windows**: Download the installer from [postgresql.org](https://www.postgresql.org/download/windows/)

**Option 2: Cloud Providers (Recommended for Quick Setup)**

- **Neon**: Free PostgreSQL hosting with connection string ready to use. Visit [neon.tech](https://neon.tech)
- **Supabase**: Free PostgreSQL database with a user-friendly interface. Visit [supabase.com](https://supabase.com)
- **Railway**: Simple PostgreSQL deployment. Visit [railway.app](https://railway.app)

Simply copy the connection string provided by these services into your `.env` file as `POSTGRES_URL`.

#### Environment Variables Setup

Ensure your `.env` file contains:
```
POSTGRES_URL=postgresql://user:password@localhost:5432/shabble_dev
NEXT_PUBLIC_BASE_URL=/api
NODE_ENV=development
```

Replace `user`, `password`, `localhost`, and `shabble_dev` with your actual database credentials.

#### Schema Sync Issues

If you encounter schema mismatches:
1. **Reset the database** (caution: this deletes all data):
   ```bash
   npm run prisma:reset
   ```
2. **Create a new migration after schema changes**:
   ```bash
   npm run prisma:migrate dev --name describe_your_changes
   ```
3. **Generate Prisma client after manual schema updates**:
   ```bash
   npm run prisma:generate
   ```

#### Still Having Issues?

- Check the [Prisma Documentation](https://www.prisma.io/docs/)
- Review GitHub issues: [Shabble Issues](https://github.com/coder-zs-cse/Shabble/issues)
- Ask for help in the project discussions or create a new issue with detailed error messages.

### Snapshots


![Screenshot from 2024-11-12 21-26-05](https://github.com/user-attachments/assets/4db18650-b6b8-48c4-9362-a6d7b044498c)

![Screenshot from 2024-11-12 21-27-22](https://github.com/user-attachments/assets/75973585-c52a-44c1-b68b-7157f215771c)

![Screenshot from 2024-11-12 21-28-23](https://github.com/user-attachments/assets/76fc3e73-4f63-4f6b-b566-83e5fe298c7e)

![Screenshot from 2024-11-12 21-28-51](https://github.com/user-attachments/assets/bab843d3-47e1-4c1d-8135-2c3e651291d9)

![Screenshot from 2024-11-12 21-30-07](https://github.com/user-attachments/assets/be5c8567-c58e-4991-98b7-7a37de910508)

![Screenshot from 2024-11-12 21-30-27](https://github.com/user-attachments/assets/f20ba887-738c-4cbd-9be2-167a3d2f2d14)

### Easy Level

![Screenshot from 2024-11-12 21-31-18](https://github.com/user-attachments/assets/8cc9867f-cae3-4b15-afb6-be5b52b8ea75)

### Hard Level

![Screenshot from 2024-11-12 21-30-55](https://github.com/user-attachments/assets/0c880d10-e13f-4777-8285-7b815b9e9006)
