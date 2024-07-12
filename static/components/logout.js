export default{
    template : `<div>
                <button class="btn btn-primary mt-2" @click='logout' > Logout </button>
                </div>`
                ,
    methods :{
    async logout() {
        const res = await fetch('/logout')
         if(!res.ok) throw new Error(await res.text());
         localStorage.removeItem( "auth-token")
         localStorage.removeItem("role")
         localStorage.removeItem("user-id")
 
         this.$router.push('/login')
      }
    },
}
        
    

