import { createApp } from 'vue'
import './style.css'
import App from './App.vue'


declare global {
    interface Window {
    ethereum: any

   
  }

}


createApp(App).mount('#app')
