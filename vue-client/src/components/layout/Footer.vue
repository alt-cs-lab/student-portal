<template>
  <footer :class="style.footer">
    <!--Footer Images-->
    <div class="style.imgContainer">
      <img :src="footerImage" alt="Footer Background" :class="style.footerImg" />
      <img :src="footerImage" alt="Footer Background" :class="style.footerImgSmall" />
    </div>
    <!--Footer Text-->
    <div class="grid" :class="style.footerContent">
      <div class="col-12">
        <p>Department of Computer Science<br />
          2184 Engineering Hall
        </p>
      </div>
      <div class="col-12">
        <p>1701D Platt St., Manhattan, KS 66506</p>
      </div>
      <div class="col-12">
        <p>785-532-6350 | 785-532-7353 fax | csoffice@k-state.edu</p>
      </div>
      <div class="col-12">
        <p>Monday – Friday<br />
          8 a.m. – noon<br />
          1 p.m. – 5 p.m.
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
//CSS
import styles from '../../styles/Footer.module.css'; 
import '/node_modules/primeflex/primeflex.css'

//Images and icons
import footerImage from '../../img/Footer2.jpg'; 

export default {
  name: 'Footer',
  computed: {
    style() {
      return styles;
    },
  },
  data() {
    return {
      footerImage,
    };
  },
};
</script>