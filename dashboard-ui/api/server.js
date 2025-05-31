import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 5174;
const USERS_FILE = "./users.json";

app.use(cors());
app.use(express.json());

function readUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}

function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post("/api/register", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }
    const users = readUsers();
    if (users.find(u => u.email === email)) {
        return res.status(409).json({ error: "User already exists" });
    }
    users.push({ email, password });
    writeUsers(users);
    res.json({ success: true });
});

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
}); 