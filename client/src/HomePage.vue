<!--Home page for the student portal-->
<template>
  <div :class="shared['flex-centered']">
    <div :class="shared['content-container']">
    <div class="grid" style="width:100%;">
      <div class="col-8 col-offset-2 xl:col-8 xl:col-offset-2">
        <!--Header-->
        <div :class="shared['app-header']">
          <h1 :class="shared['h1-style']">CS Student Portal</h1>
          <h4 :class="shared['h4-style']">Welcome to the CS Student Portal System</h4>
          <!--<Galleria :value="images" :numVisible="5" :circular="true" :showThumbnails="false" v-model:activeIndex="activeIndex"
              :showIndicators="false" :changeItemOnIndicatorHover="false" :showIndicatorsOnItem="true" indicatorsPosition="top">
              <template #item="slotProps">
                  <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%; display: block" />
              </template>
          </Galleria> -->
        </div>
      </div>
      <div class="col-8 col-offset-2 md:col-6 md:col-offset-3 lg:col-6 lg:col-offset-3 xl:col-2 xl:col-offset-3">
          <Card style="width: 100%; overflow: hidden; max-width: 468px;">
            <template #header>
              <img alt="header" src="@/components/assets/cards/Card1.png" />
            </template>
            <template #title>CS Professional Program</template>
            <template #content>
                <p class="m-0">
                    Ready to join the professional program? Click below and submit your application today!
                </p>
            </template>
            <template #footer>
                <div class="flex gap-4 mt-1">
                    <Button label="Apply" class="w-full" :to="'/professional-program/apply'" as="RouterLink"/>
                </div>
            </template>
        </Card>
      </div>
      <div class="col-8 col-offset-2 md:col-6 md:col-offset-3 lg:col-6 lg:col-offset-3 xl:col-2 xl:col-offset-0">
          <Card style="width: 100%; overflow: hidden; max-width: 468px;">
            <template #header>
              <img alt="header" src="@/components/assets/cards/Card2.png" />
            </template>
            <template #title>Connect With Us</template>
            <template #content>
                <p class="m-0">
                    Connect your Discord account and join the CS Discord server! Click below to get started!
                </p>
            </template>
            <template #footer>
                <div class="flex gap-4 mt-1">
                    <Button label="Connect" class="w-full" :to="'/profile'" as="RouterLink" />
                </div>
            </template>
        </Card>
      </div>
      <div class="col-8 col-offset-2 md:col-6 md:col-offset-3 lg:col-6 lg:col-offset-3 xl:col-2 xl:col-offset-0">
          <Card style="width: 100%; overflow: hidden; max-width: 468px;">
            <template #header>
              <img alt="header" src="@/components/assets/cards/Card3.png" />
            </template>
            <template #title>Link Your GitHub</template>
            <template #content>
                <p class="m-0">
                    Link your GitHub to easily share projects and coursework with your instructors.
                </p>
            </template>
            <template #footer>
                <div class="flex gap-4 mt-1">
                  <Button label="Link" class="w-full" :to="'/profile'" as="RouterLink" />
                </div>
            </template>
        </Card>
      </div>
    </div>
  </div>
</div>
</template>

<script>
//Vue
import { ref, onMounted, onUnmounted } from "vue";

//Primevue components
import Button from 'primevue/button';
import Galleria from 'primevue/galleria';
import Card from 'primevue/card';

//CSS
import styles from '@/components/styles/HomePage.module.css';
import shared from '@/components/styles/Shared.module.css';

//Gallery
import photo1 from '@/components/assets/gallery/Gallery1.png'
import photo2 from '@/components/assets/gallery/Gallery2.png'

export default {
  name: 'HomePage',
  components: {
    Button,
    Galleria,
    Card,
  },
  setup(){
    const images = ref([{itemImageSrc: photo1}, {itemImageSrc: photo2}])
    const activeIndex = ref(0);
    let interval = null;

    onMounted(() => {
      interval = setInterval(() => {
        activeIndex.value = (activeIndex.value + 1) % images.value.length;
      }, 5000); // Change image every 5 seconds
    });

    onUnmounted(() => {
      clearInterval(interval);
    });
    return {styles, shared, images, activeIndex}
  },
};
</script>
<style scoped>
  .p-galleria {
    width: 900px;
  height: 300px;
  object-fit: cover;
  border-radius: 0px;
  border: 4px solid grey;
  border-top: 0px;
  }
</style>