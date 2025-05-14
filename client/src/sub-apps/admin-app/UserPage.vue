 <template>
  <div :class="shared['flex-centered']">
    <div :class="shared['content-container']">
      <div class="grid" style="width: 100%;">
        <div class="col-8 col-offset-2 xl:col-8 xl:col-offset-2">
          
          <!-- Header -->
          <div :class="shared['app-header']">
            <h1 :class="shared['h1-style']">User Control Panel</h1>
            <h4 :class="shared['h4-style']">Welcome aboard captain</h4>
          </div>
          <!-- Editing roles -->
          <div> 
            <DataTable v-model:filters="filters" :value="allUsers.data" removableSort paginator :rows="8" stripedRows showGridlines style="border-radius: 10px; overflow: hidden;"
            :globalFilterFields="['user', 'wid']">
            
            <template #header>
                  <h1 style="text-align: center;">
                    Role Management
                  </h1>
                <div class="flex justify-end">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" style="padding-right: 20px"/>
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
              <Column field="user" header="User" style="max-width: 5rem">
                <template #body="{ data }">
                  {{ data.first_name + " " + data.last_name }}
                </template>
              </Column>
              <Column field="wid" header="WID" style="max-width: 5rem">
                <template #body="{ data }">
                  {{ data.wid}}
                </template>
              </Column>
              <Column header="Roles">
                <template #body="{ data }">
                  <div class="flex gap-4 items-center">
                    <div class="flex items-center gap-2" v-for="role in ['reviewer', 'admin']" :key="role">
                      <Checkbox
                        v-model="data.roles"
                        :value="role"
                        @change="() => updateRole(data)"
                      />
                      <label>{{ role }}</label>
                    </div>
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
          <div class="col-4 col-offset-4">
            <div class="pt-2">
              <Card class="max-w-2xl shadow-4 surface-100 border-round-xl p-5 bg-white" style="text-align: center;">
                <template #title>
                  <h1>KSIS File Import</h1>
                </template>

                <template #content>
                  <!-- Import Reports -->
                  <div class="mb-4">
                    <p class="mb-2 text-md text-color-secondary">Select a .csv report from KSIS to import:</p>

                    <div class="gap-3 flex flex-column align-items-center">
                      <!-- Student File Input -->
                      <div class="w-full flex flex-column justify-center items-center gap-2" style="display:flex; justify-content: center; align-items: center;">
                        <label class="text-sm">Student File:</label>
                        <InputText 
                          id="studentReportImport" 
                          type="file" 
                          accept=".csv" 
                          style="background-color: #d1d1d1; width:20rem;" />
                        <Button 
                          label="Import Student Report" 
                          icon="pi pi-upload" 
                          style="width:20rem;" 
                          @click="ParseStudentReport" />
                      </div>

                      <!-- Enrollment File Input -->
                      <div class="w-full flex flex-column justify-center items-center gap-2 mt-4" style="display:flex; justify-content: center; align-items: center;">
                        <label class="text-sm">Enrollment File:</label>
                        <InputText 
                          id="enrollmentReportImport" 
                          type="file" 
                          accept=".csv" 
                          style="background-color: #d1d1d1; width:20rem;" />
                        <Button 
                          label="Import Enrollment Report" 
                          icon="pi pi-upload" 
                          style="width:20rem;" 
                          @click="ParseEnrollmentReport" />
                      </div>
                    </div>
                  </div>
                </template>
              </Card>
            </div>

          </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useAdminStore } from '@/stores/AdminStore.js';

//primevue components
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import IftaLabel from 'primevue/iftalabel';
import Select from 'primevue/select';
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import { FilterMatchMode } from '@primevue/core/api';

//styles
import styles from '@/components/styles/AdminPage.module.css';
import shared from '@/components/styles/Shared.module.css';


export default {
  name: 'RolesPage',
  components: { Button,Card, InputText, IftaLabel, Select, DataTable, Column, Checkbox},
  setup() {
    const toast = useToast();
    const adminStore = useAdminStore();
    const allUsers = ref([]);
    const studentOptions = ref([]);

    // Calls the function before anything else happens to properly get all users
    const fetchUsers = async() => {
      const response = await adminStore.getAllUsers();
      console.log(response.data)
      //For filtering the data table by name
      response.data.forEach(u => {
        u.user = `${u.first_name} ${u.last_name}`;
      });
      allUsers.value = response;
    }
    onMounted(fetchUsers);
    const selectedStudent = ref("");

    //Datatable filters
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      user: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      wid: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    
    // Updates the role of the user so that can access more or less
    const updateRole = async (user) =>{
      await adminStore.updateUserRoles(user.id, user.roles);
    }
    const ParseEnrollmentReport = () => {
        try{
          const report = document.getElementById("enrollmentReportImport").files[0]
          Papa.parse(report, {header: true, complete: ImportEnrollmentReport})
        }
        catch(error){
          toast.add({ severity: 'error', summary: 'File not selected', detail: 'Please select a file.', life: 3000, });
        }
      }
  
      const ImportEnrollmentReport = async(results, file) => {
          const result = await adminStore.importEnrollmentReport(results);
          if (result) {
            toast.add({severity: 'success', summary: 'KSIS enrollment report has been imported', life: 3000})}
          else {
            toast.add({severity: 'error', summary: 'Error importing KSIS report', life: 3000}) }
      }
  
      const ParseStudentReport = () => {
        try{
          const report = document.getElementById("studentReportImport").files[0]
          Papa.parse(report, {header: true, complete: ImportStudentReport})
        }catch(error){
          toast.add({ severity: 'error', summary: 'File not selected', detail: 'Please select a file.', life: 3000, });
        }
      }
  
      const ImportStudentReport = async(results, file) => {
          const result = await adminStore.importStudentReport(results);
          if (result) {
            toast.add({severity: 'success', summary: 'KSIS student report has been imported', life: 3000})}
          else {
            toast.add({severity: 'error', summary: 'Error importing KSIS report', life: 3000}) }
      }

    return { styles, shared, filters, selectedStudent, studentOptions, allUsers, updateRole, ParseEnrollmentReport, ParseStudentReport };
  }
};
</script>
