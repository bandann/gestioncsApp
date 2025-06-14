const API_BASE_URL = 'https://gestioncsapp-bk.onrender.com/api';

export const apiService = {
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.statusText}`);
    }
    return await response.json();
  },
  createUser: async (user) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error(`Error creating user: ${response.statusText}`);
    }
    return await response.json();
  },
  updateUser: async (id, user) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error(`Error updating user: ${response.statusText}`);
    }
    return await response.json();
  },
  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error deleting user: ${response.statusText}`);
    }
    return await response.json();
  },
  getAdmins: async () => {
    const response = await fetch(`${API_BASE_URL}/admin`);
    if (!response.ok) {
      throw new Error(`Error fetching admins: ${response.statusText}`);
    }
    return await response.json();
  },
  createAdmin: async (admin) => {
    const response = await fetch(`${API_BASE_URL}/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(admin),
    });
    if (!response.ok) {
      throw new Error(`Error creating admin: ${response.statusText}`);
    }
    return await response.json();
  },
  updateAdmin: async (id, admin) => {
    const response = await fetch(`${API_BASE_URL}/admin/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(admin),
    });
    if (!response.ok) {
      throw new Error(`Error updating admin: ${response.statusText}`);
    }
    return await response.json();
  },
  deleteAdmin: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error deleting admin: ${response.statusText}`);
    }
    return await response.json();
  },
  getNotifications: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications`);
    if (!response.ok) {
      throw new Error(`Error fetching notifications: ${response.statusText}`);
    }
    return await response.json();
  },
  createNotification: async (notification) => {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification),
    });
    if (!response.ok) {
      throw new Error(`Error creating notification: ${response.statusText}`);
    }
    return await response.json();
  },
  updateNotification: async (id, notification) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification),
    });
    if (!response.ok) {
      throw new Error(`Error updating notification: ${response.statusText}`);
    }
    return await response.json();
  },
  deleteNotification: async (id) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error deleting notification: ${response.statusText}`);
    }
    return await response.json();
  },
  getReports: async () => {
    const response = await fetch(`${API_BASE_URL}/reports`);
    if (!response.ok) {
      throw new Error(`Error fetching reports: ${response.statusText}`);
    }
    return await response.json();
  },
};