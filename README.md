# iCare

## Project Setup

### Backend Setup

#### Prerequisites
- Java 25
- PostgreSQL database
- Gradle (or use the included Gradle wrapper)

#### Environment Configuration

Copy the `.env.example` file to `.env` and update the values accordingly.

#### Installation & Running

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build the project:
   ```bash
   ./gradlew build
   ```
   Or on Windows:
   ```bash
   gradlew.bat build
   ```

3. Run the application:
   ```bash
   ./gradlew bootRun
   ```
   Or on Windows:
   ```bash
   gradlew.bat bootRun
   ```

The backend server will start on `http://localhost:8080`

---

### Frontend Setup

#### Prerequisites
- Node.js (recommended with [bun](https://bun.sh/))

#### Installation & Running

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   bun install
   ```
   Or with npm:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   bun start
   ```
   Or with npm:
   ```bash
   npm start
   ```

The frontend will start on `http://localhost:3000`
