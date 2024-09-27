<template>
  <div :class="buttonContainer">
    <Button @click="handleClick">Click Me</Button>
  </div>
</template>

<script>
import DxButton from 'devextreme-vue/button';
import styles from './styles/Button.scss';

export default {
  components: {
    Button
  },
  data() {
    return {
      buttonContainer: styles.buttonContainer
    };
  },
  methods: {
    handleClick() {
      // Handle button click here
      console.log("Button clicked!");
    }
  }
};
</script>

<style scoped>
@import './assets/styles/yourstyles.css';
</style>
