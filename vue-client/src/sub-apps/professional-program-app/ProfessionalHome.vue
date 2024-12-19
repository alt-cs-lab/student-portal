<template>
  <div :class="shared['flex-centered']">
    <div :class="styles['home-container']" class="w-12 xl:w-6 md:w-9">
      <div class="grid">
        <!--Header-->
        <div class="col-8 col-offset-2 xl:col-12 xl:col-offset-0">
          <div :class="shared['app-header']">
            <h1 :class="shared['h1-style']">CS Applications</h1>
            <h4 :class="shared['h4-style']">Welcome to the CS Applications System</h4>
          </div>
        </div>

        <!--Requirements box-->
        <div class="col-8 col-offset-2 xl:col-6 xl:col-offset-0">
          <div :class="styles['box-style']" style="background-color: #d1d1d1" >
            <h2 :class="styles['h2-style']">Requirements</h2>
            <p>In order to be considered for admission to the professional program, a student must have:</p>
            <ol :class="styles['custom-list']">
              <div>
              <li>Passed all pre-professional program courses with a C or better</li>
              <li>Achieved at least a 2.3 GPA on all pre-professional courses (including transfer courses)</li>
            </div>
            </ol>
          </div>
        </div>

        <!--Apply box-->
        <div class="col-8 col-offset-2 xl:col-6 xl:col-offset-0">
          <div v-if="IsAdminMode && IsAdmin" :class="styles['apply-box-style']">
            <h2 :class="styles['h2-style']">Review Applications</h2>
            <p>When you are ready to review student CS applications, click the button below!</p>
            <br />
            <RouterLink :to="{ name: 'apply' }" :class="shared['no-decoration']">
              <div :class="shared['flex-centered']">
                <Button buttonText="Go!"/>
              </div>
            </RouterLink>
          </div>
          <div v-else :class="styles['apply-box-style']">
            <h2 :class="styles['h2-style']">Apply</h2>
            <p>When you are ready to apply, click the button below!</p>
            <br />
            <RouterLink :to="{ name: 'apply' }" :class="shared['no-decoration']">
              <div :class="shared['flex-centered']">
                <Button/>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
//CSS
import Button from '../../components/common/Button.vue';
import styles from '../../styles/HomePage.module.css';
import shared from '../../styles/Shared.module.css';

//Components
import adminMixin from '@/mixins/adminMixin';

export default {
  name: 'HomePage',
  components: {
    Button,
  },
  mixins:[adminMixin],
  setup() {
    const { IsAdmin, IsAdminMode } = adminMixin.setup();

    return{
      IsAdminMode,
      IsAdmin,
      styles, 
      shared,
    }
  },
};
</script>