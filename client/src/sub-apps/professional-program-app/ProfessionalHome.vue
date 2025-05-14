<template>
  <div :class="shared['flex-centered']">
    <div :class="shared['content-container']">
      <div class="grid nested-grid" style="width:100%;">
        <!--Header-->
        <div class="col-8 col-offset-2 xl:col-8 xl:col-offset-2">
          <div :class="shared['app-header']">
            <h1 :class="shared['h1-style']">CS Applications</h1>
            <h4 :class="shared['h4-style']">Welcome to the CS Applications System</h4>
          </div>
        </div>

        <!--Requirements box-->
        <div class="col-8 col-offset-2 xl:col-3 xl:col-offset-3">

          <div class="grid" style="width:100%;">

            <div class="col-12" style="width:100%;">
              <div :class="styles['box-style']" >
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

            <div v-if="academics.gpa" class="col-12" style="width:100%;">
              <div :class="styles['status-box-style']">
                <h2 :class="styles['status-h2-style']" style="display: flex; align-items: center; gap: 30px;">
                  <i 
                    :class="academics.gpa > 2.29 ? 'pi pi-check' : 'pi pi-exclamation-triangle'" 
                    style="font-size: 1.5rem;" 
                    :style="{ color: academics.gpa > 2.29 ? 'green' : 'goldenrod' }">
                  </i>
                  <span>
                    Cumulative GPA:
                    <span :style="{ color: academics.gpa > 2.29 ? 'green' : 'goldenrod' }">{{ academics.gpa }}</span>
                  </span>
                </h2>
              </div>
            </div>

            <div v-if="academics.warning" class="col-12" style="width:100%;">
              <div :class="styles['status-box-style']">
                <h2 :class="styles['status-h2-style']" style="display: flex; align-items: center; gap: 30px;">
                  <div style="display: flex; gap: 10px;">
                    <i class="pi pi-exclamation-triangle" style="font-size: 1.5rem; color: goldenrod;"></i>
                  </div>
                  <span>
                    Academic Status:
                    <span style="color:goldenrod;"> Warning</span>
                  </span>
                </h2>
              </div>
            </div>

            <div v-if="academics.probation" class="col-12" style="width:100%;">
              <div :class="styles['status-box-style']">
                <h2 :class="styles['status-h2-style']" style="display: flex; gap: 30px; align-items: center;">
                  <div style="display: flex; gap: 10px;">
                    <i class="pi pi-exclamation-triangle" style="font-size: 1.5rem; color: goldenrod;"></i>
                  </div>
                  <span>
                    Standing:
                    <span style="color:goldenrod;">On Probation</span>
                  </span>
                </h2>
              </div>
            </div>

            </div>

        </div>

        <!--Apply box-->
        <div class="col-8 col-offset-2 xl:col-3 xl:col-offset-0">
          <div v-if="IsReviewer" :class="styles['apply-box-style']" style="width:100%;">
            <h2 :class="styles['h2-style']">Review Applications</h2>
            <p>When you are ready to review student CS applications, click the button below!</p>
            <br />
            <RouterLink :to="{ name: 'review' }" :class="shared['no-decoration']">
              <div :class="shared['flex-centered']">
                <Button buttonText="Review!"/>
              </div>
            </RouterLink>
          </div>
          <div v-else :class="styles['apply-box-style']" style="width:100%;">
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
import styles from '../../components/styles/HomePage.module.css';
import shared from '../../components/styles/Shared.module.css';

//Components
import adminMixin from '@/components/mixins/RoleMixin';

//Stores
import { storeToRefs } from 'pinia'
import { useProfileStore } from '@/stores/ProfileStore';

export default {
  name: 'HomePage',
  components: {
    Button,
  },
  mixins:[adminMixin],
  setup() {
    const { IsReviewer } = adminMixin.setup();

    const profileStore = useProfileStore()
    if (process.env.NODE_ENV !== 'test') {
      profileStore.hydrate()
    }

    const { academics } = storeToRefs(profileStore)

    return{
      IsReviewer,
      styles, 
      shared,
      academics
    }
  },
};
</script>