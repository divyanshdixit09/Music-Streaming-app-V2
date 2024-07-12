import login from  './login.js'
export default {
   template :`<div>
   <login />
   <router-link to="/adminlogin" class="btn btn-primary">ADMIN LOGIN</router-link>
   </div>`,
   components:{
      login
   }
   
}