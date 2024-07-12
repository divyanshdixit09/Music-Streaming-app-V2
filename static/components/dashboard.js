import admindash from "./admindash.js"
import creatordash from "./creatordash.js"
import listenerdash from "./listenerdash.js"

export default{
    template : `<div>
    <admindash v-if="userRole=='admin'"/>
    <creatordash v-if="userRole=='creator'"/>
    <listenerdash v-if="userRole=='listener'"/>
    </div>`,

    data(){
        return{
            userRole : localStorage.getItem('role'),
        }
    },
    components:{
        admindash,
        creatordash,
        listenerdash,
    }
}