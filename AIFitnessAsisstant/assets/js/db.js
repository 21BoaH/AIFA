// db.js
// Simulated LocalStorage Database for prototype purposes

const DB_USERS_KEY = 'aifit_users';
const DB_SESSION_KEY = 'aifit_session';

class Database {
    static init() {
        if (!localStorage.getItem(DB_USERS_KEY)) {
            localStorage.setItem(DB_USERS_KEY, JSON.stringify([]));
        }
    }

    static getUsers() {
        this.init();
        return JSON.parse(localStorage.getItem(DB_USERS_KEY));
    }

    static getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    static createUser(name, email, password) {
        const users = this.getUsers();
        if (this.getUserByEmail(email)) {
            throw new Error("Email is already registered.");
        }

        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password, // In a real app, this MUST be hashed by a backend
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
        return newUser;
    }

    static setSession(user) {
        // Strip password before saving to session
        const sessionUser = { id: user.id, name: user.name, email: user.email };
        localStorage.setItem(DB_SESSION_KEY, JSON.stringify(sessionUser));
    }

    static getSession() {
        const sessionStr = localStorage.getItem(DB_SESSION_KEY);
        return sessionStr ? JSON.parse(sessionStr) : null;
    }

    static clearSession() {
        localStorage.removeItem(DB_SESSION_KEY);
    }
}
