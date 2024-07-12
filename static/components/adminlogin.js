export default {
    template: `
    <div class="container-fluid" style="height: 100vh; display: flex; justify-content: center; align-items: center; background-color: #f7f7f7;">
    <!-- Card container with shadow, rounded corners, and blue background -->
    <div class="card p-4" style="max-width: 370px; width: 100%; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); background-color: #007bff; display: flex; flex-direction: column; justify-content: space-around; align-items: center;">
      <!-- Login header with user icon, increased font size, weight, and text alignment -->
      <h1 class="text-center mb-2" style="font-size: 2rem; font-weight: bold; color: white; text-align: center;">👤 ADMIN LOGIN</h1>
      <!-- Error message styling with text alignment -->
      <div class="text-danger mb-2" v-if="error" style="text-align: center; color: #fff;">{{ error }}</div>
      <!-- Email input field with text alignment and full width -->
      <div class="mb-3" style="text-align: left; width: 80%;">
        <label for="admin-email" class="form-label" style="font-weight: bold; color: #fff;">Email address</label>
        <input type="email" class="form-control" id="admin-email" placeholder="admin@example.com" v-model="cred.email" style="padding: 10px; border-radius: 5px; border: 1px solid #ccc; width: 100%;">
      </div>
      <!-- Password input field with text alignment and full width -->
      <div class="mb-3" style="text-align: left; width: 80%;">
        <label for="admin-password" class="form-label" style="font-weight: bold; color: #fff;">Password</label>
        <input type="password" class="form-control" id="admin-password" v-model="cred.password" style="padding: 10px; border-radius: 5px; border: 1px solid #ccc; width: 100%;">
      </div>
      <!-- Login button with green color and full width -->
      <button class="btn w-100" @click='login' style="padding: 10px; border-radius: 10px; font-weight: bold; background-color: #28a745; color: white; transition: background-color 0.3s; width: 80%;">Login</button>
    </div>
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
        const res = await fetch('/admin-login', {
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
  };
  