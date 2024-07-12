export default{
    template :`<div class='d-flex justify-content-center' style="margin-top: 25vh">
    <div class="mb-3 p-5 bg-light">
    <h1>Create Album</h1>
        <div class='text-danger'>*{{error}}</div>
        <label for="album-name" class="form-label">Album Name</label>
        <input type="name" class="form-control" id="album-name" placeholder="album" v-model="name">
        <button class="btn btn-primary mt-2" @click='addalbum' > Add Album </button>
    </div> 
  </div>
  `,
  data() {
    return {
      name : "",
      error: null,
      user_id: localStorage.getItem('user-id')
    }
  },
  created() {
    const user_id = parseInt(localStorage.getItem('user-id'));
    console.log(typeof(user_id))
}
,
  methods:{
    async addalbum(){
        console.log(this.name,this.user_id)
        const res = await fetch('/api/user/album', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({name : this.name  , user_id: this.user_id}),
          })
          const data = await res.json()
          if (res.ok) {
            this.$router.push({ path: '/uploaded'})
          } else{
              this.error=data.message
    
}
  }
}
}