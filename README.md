A Budget Control App using MERN stack, along with typescript

https://github.com/user-attachments/assets/ac58cb6b-b889-438b-a59c-621319d14559

## Installation

### Step 1: Configure the Database

To change the database the project connects to, follow these steps:

1. Open the `.env` file in the backend of the project.
2. Find the variable `MONGO_URI`.
3. Change its value to the URL of your MongoDB database.

### Step 2: Install the dependencies in the frontend
1. Go to the frontend root file and then enter this in the terminal:

```bash
npm install
```
### Step 3: Start docker-compose
1. Go to the root file of the project and then enter this in the terminal:

```bash
docker-compose up --build
```
