<script setup>
//Components
import { useRoute } from 'vue-router';

//CSS
import '../../styles/ErrorPage.css';
 
const route = useRoute();
const message = route.params.message || 'A Happy Little Accident (The page you are viewing does not exist 😞)';
</script>
 
<template>
  <div style="position: relative; text-align: center;">
    <div style="background-color: #512888; margin: 10px auto; width: 70%; border: 3px solid #fff; border-radius: 10px;">
      <h1 style="font-size: 80px; font-weight: 600; color: #fff;">Error Page</h1>
      <p style="font-size: 30px; color: #fff;">{{ message }}</p>
    </div>
    <img src="https://media.gettyimages.com/id/50467803/photo/tv-painting-instructor-artist-bob-ross-jubiantly-holding-up-paint-pallette-brushes-as-he-stands.jpg?s=612x612&w=0&k=20&c=LMajXi9w9M1LnnNfBcaIbiXZb6dICIQq48hS8Mo-xWQ=" alt="Bob Ross" />
  </div>
</template>