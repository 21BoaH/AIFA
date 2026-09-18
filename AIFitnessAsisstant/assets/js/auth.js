// auth.js
// Neutralized for academic project demonstration - no authentication required

class Auth {
    static register(name, email, password) {
        return { name: name || "Student", email: email || "demo@school.edu" };
    }

    static login(email, password) {
        return { name: "Student", email: email || "demo@school.edu" };
    }

    static logout() {
        const inSubDir = window.location.pathname.includes('/pages/') || window.location.pathname.includes('/exercises/');
        window.location.href = inSubDir ? '../index.html' : 'index.html';
    }

    static getCurrentUser() {
        return null;
    }

    static requireAuth() {
        return { name: "Student", email: "student@school.edu" };
    }

    static redirectIfAuthenticated() {
        // No-op for unrestricted academic showcase
    }
}
