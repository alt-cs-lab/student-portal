<script>
import styles from '../../styles/Footer.module.css'; 
import { VContainer, VRow, VCol } from 'vuetify/components';
import footerImage from '../../img/Footer2.jpg'; 
import footerImageSmall from '../../img/Footer.jpg';
</script>

<template>
    <footer className={styles.footer}>
      <img :src={footerImage} alt="Footer Background" className={styles.footerImg} />
      <img :src={footerImageSmall} alt="Footer Background Small" className={styles.footerImgSmall} />  
      <VContainer className={styles.footerContent}>
       <VRow>
         <VCol xs={12} md={6} lg={3}>
           <p>Department of Computer Science<br />
           2184 Engineering Hall</p>
         </VCol>
         <VCol xs={12} md={6} lg={3}>
           <p>1701D Platt St., Manhattan, KS 66506</p>
         </VCol>
         <VCol xs={12} md={6} lg={3}>
           <p>785-532-6350 | 785-532-7353 fax | csoffice@k-state.edu</p>
         </VCol>
         <VCol xs={12} md={6} lg={3}>
           <p>Monday – Friday<br />
           8 a.m. – noon<br />
           1 p.m. – 5 p.m.</p>
         </VCol>
       </VRow>
     </VContainer>
   </footer>
</template>

<style>
.footer {
  position: relative;
  text-align: center;
  color: white; 
}

.footerImg {
  display: block;
  width: 100%;
  height: 20vh; 
  object-fit: cover;
  object-position: center top;  
}

.footerImgSmall {
  display: none;  
}

.footerContent {
  position: absolute;
  top: 50%;  
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%; 
  max-width: 500px;  
}

@media (max-width: 768px) {
  .footerContent {
      width: 90%;  
      font-size: 14px; 
      /* Adjust font size for smaller screens */
  }
  .footerImg {
    display: none; /* Hide the original image */
  }
  
  .footerImgSmall {
    display: block; /* Show the smaller image */
    width: 100%;
    height: 30vh;
    object-fit: cover;
    object-position: center bottom;
  }
}
</style>