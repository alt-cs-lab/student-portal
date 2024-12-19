<script setup>
import Load from '../../img/Loading.svg';
const handleImageError = () => {
  alert('Failed to load the image!');
};
</script>

<template> 
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
    <img :src= "Load" alt="Loading..." @error="handleImageError" />
  </div>
</template>
