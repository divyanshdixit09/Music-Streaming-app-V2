import home from './components/home.js'
import login from './components/login.js'
import dashboard from './components/dashboard.js'
import register from './components/register.js'
import lyrics from  './components/lyrics.js'
import album_songs from  './components/album_songs.js'
import playlistform from './components/playlistform.js'
import playlist from './components/playlist.js'
import editplaylist from './components/editplaylist.js'
import AddSong from  './components/addsong.js'
import viewplaylistsong from  './components/viewplaylistsong.js'
import upload from  './components/upload.js'
import uploaded from './components/uploaded.js'
import editsong from './components/editsong.js'
import uploadalbum  from "./components/uploadalbum.js";
import creatoralbumsong from './components/creatoralbumsong.js'
import creatoralbum from './components/creatoralbum.js'
import editalbum from './components/editalbum.js'
import addsongalbum from './components/addsongalbum.js'
import adminlogin from './components/adminlogin.js'
const routes = [{path : '/' , component : home},
                {path : '/login', component : login},
                {path: '/adminlogin' , component:adminlogin},
                {path : '/dashboard',component : dashboard},
                {path : '/register',component : register},
                {path : '/lyrics/:id',component : lyrics},
                {path : '/album/:id/songs', component : album_songs},
                {path : '/addplaylist', component : playlistform},
                {path : '/playlist', component: playlist},
                {path : '/editplaylist/:id', component: editplaylist},
                {path : '/addsong/:id', component: AddSong},
                {path : '/playlistsong/:id', component: viewplaylistsong},
                {path: '/upload', component : upload},
                {path: '/uploaded', component : uploaded},
                {path: '/uploadalbum' , component : uploadalbum },
                {path:'/editsong/:id', component:editsong},
                {path:'/creatoralbum', component: creatoralbum},
                {path:'/editalbum/:id',component:editalbum},
                {path : '/addalbumsong/:id',component:addsongalbum},
                {path:'/viewalbumsong/:id',component:creatoralbumsong}
]
export default  new VueRouter({
    routes,
})
