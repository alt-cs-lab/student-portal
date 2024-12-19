<script setup>
import Footer from './components/layout/Footer.vue'
import Header from './components/layout/Header.vue'
import { RouterView } from 'vue-router'
import { useTokenStore } from './stores/TokenStore';
import Toast from 'primevue/toast'
//import ProtectedAdminRoute from './components/common/ProtectedAdminRoute.vue';
import './App.css';
const tokenStore = useTokenStore();

tokenStore.getToken();
</script>

<template>
        <div className="appContainer"> 
          <Header/>
          <div className="contentBackground">
            <RouterView />
          </div> 
          <Footer/>
        </div>
    <!--Toast Library-->
    <Toast position="bottom-right"/> 
</template>

