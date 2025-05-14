<template>
  <div :class="shared['flex-centered']">
    <div :class="shared['content-container']">
      <div class="grid" style="width:100%;">
        <div class="col-8 col-offset-2 xl:col-8 xl:col-offset-2"> 
          <!--Header-->
          <div :class="shared['app-header']">
            <h1 :class="shared['h1-style']">Grades</h1>
            <h4 :class="shared['h4-style']">Check your progress</h4>
          </div>
        </div>

        <div class="col-12 col-offset-0 xl:col-8 xl:col-offset-2">
          <div v-if="courses.length > 0"> 
            <DataTable :value="courses" removableSort paginator :rows="8" stripedRows showGridlines style="border-radius: 10px; overflow: hidden;">
              <Column field="name" header="Class" />
              <Column header="Course Code">
                <template #body="slotProps">
                  {{ slotProps.data.subject + ' ' + slotProps.data.catalog}}
                </template>
              </Column>
              <Column header="Status">
                <template #body="slotProps">
                  {{ slotProps.data.grade ? 'Completed' : 'In Progress' }}
                </template>
              </Column>
              <Column field="credit_hours" header="Credit Hours" />
              <Column field="grade" header="Grade" />
            </DataTable>
          </div>
          <div v-else>
            <Card class="w-full sm:w-25rem mx-auto text-center">
              <template #title>
                No Grades Found
              </template>
              <template #content>
                <p class="text-gray-600">
                  There are currently no grades available to display.
                </p>
              </template>
            </Card>
          </div>
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
//Vue
import { shallowRef, ref, toRaw } from 'vue';

//Primevue components
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';

//Toast
import { useToast } from 'primevue/usetoast'

//CSS
import styles from '@/components/styles/HomePage.module.css';
import shared from '@/components/styles/Shared.module.css';

//Stores
import {useStudentStore} from '@/stores/StudentStore.js'
import {storeToRefs} from 'pinia'

export default {
  name: 'GradesPage',
  components: {
    Button,
    DataTable,
    Column,
    Card
  },
  setup(){
    //courses
    const studentStore = useStudentStore();
    studentStore.hydrate();
    const {courses} = storeToRefs(studentStore);

    return {styles, shared, courses}
  },
};
</script>
<style>
.p-datatable-column-header-content {
  text-align: center !important;
}
</style>