import API from "./api";

const userService = {
  // List Users
  getUsers() {
    return API.get("auth/users/");
  },

  // Single User
  getUser(id) {
    return API.get(`auth/users/${id}/`);
  },

  // Create User
  createUser(data) {
    return API.post("auth/users/", data);
  },

  // Update User
  updateUser(id, data) {
    return API.put(`auth/users/${id}/`, data);
  },

  // Delete User
  deleteUser(id) {
    return API.delete(`auth/users/${id}/`);
  },
};

export default userService;