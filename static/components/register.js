export default{
    template :`<div class='d-flex justify-content-center' style="margin-top: 25vh">
    <div class="mb-3 p-5 bg-light" style="border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 255, 0.5); background-color: #cce5ff;">
        <h1 style="color: #007bff;">REGISTRATION</h1>
        <div class='text-danger'>*{{error}}</div>
        <label for="user-email" class="form-label">Email address</label>
        <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="cred.email">
        <label for="user-password" class="form-label">Password</label>
        <input type="password" class="form-control" id="user-password" v-model="cred.password">
        <button class="btn btn-primary mt-2" style="background-color: #28a745; border-color: #28a745;" @click='register'>Register</button>
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
    }
  },
  methods:{
    async register(){
        const res = await fetch('/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.cred),
          })
          const data = await res.json()
          if (res.ok) {
            this.$router.push({ path: '/login'})
          } else{
              this.error=data.message
    
}
  }
}
}