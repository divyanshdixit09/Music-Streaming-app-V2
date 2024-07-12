import register from "./register.js";

export default {
  template: `
  <div class="container-fluid" style="height: 100vh; display: flex; justify-content: center; align-items: center; background-color: #f7f7f7;">
  <!-- Card container with shadow, rounded corners, and blue background -->
  <div class="card p-4" style="width: 350px; height: 350px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); background-color: #007bff; display: flex; flex-direction: column; justify-content: space-around; align-items: center;">
    <!-- Login header with user icon, increased font size, weight, and text alignment -->
    <h1 class="text-center mb-2" style="font-size: 2rem; font-weight: bold; color: white; text-align: center;">👤 LOGIN</h1>
    <!-- Error message styling with text alignment -->
    <div class="text-danger mb-2" v-if="error" style="text-align: center;">{{ error }}</div>
    <!-- Email input field with text alignment and adjusted width -->
    <div class="mb-3" style="text-align: left; width: 80%;">
      <label for="user-email" class="form-label" style="font-weight: bold; color: #fff;">Email address</label>
      <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="cred.email" style="padding: 10px; border-radius: 5px; border: 1px solid #ccc; width: 100%;">
    </div>
    <!-- Password input field with text alignment and adjusted width -->
    <div class="mb-3" style="text-align: left; width: 80%;">
      <label for="user-password" class="form-label" style="font-weight: bold; color: #fff;">Password</label>
      <input type="password" class="form-control" id="user-password" v-model="cred.password" style="padding: 10px; border-radius: 5px; border: 1px solid #ccc; width: 100%;">
    </div>
    <!-- Login button with green color and adjusted width -->
    <button class="btn w-100" @click='login' style="padding: 10px; border-radius: 5px; font-weight: bold; background-color: #28a745; color: white; transition: background-color 0.3s; width: 80%;">Login</button>
  </div>
  <!-- Registration link with adjusted positioning -->
  <router-link to="/register" class="link-secondary text-decoration-none" style="position: absolute; right: 10px; bottom: 10px; color: #6c757d;">
    Don't have an account? Register Here
  </router-link>
</div>




  `,
  data() {
    return {
      cred: {
        email: null,
        password: null,
      },
      error: null,
    };
  },
  methods: {
    async login() {
      const res = await fetch('/listener-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.cred),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('auth-token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('user-id', data.id);
        this.$router.push({ path: '/dashboard' });
      } else {
        this.error = data.message;
      }
    },
  },
  components: {
    register,
  },
};
