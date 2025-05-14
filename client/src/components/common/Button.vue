<script>
//CSS
import "../../components/styles/Button.scss";

export default {
  props: {
    buttonText: {
      type: String,
      default: "Apply!" // Default text if no prop is provided
    }
  }
};
</script>

<template>
  <div class="button-container-1">
    <span class="mas">{{ buttonText }}</span>
    <button type="button" name="Hover">
      {{ buttonText }}
    </button>
  </div>
</template>