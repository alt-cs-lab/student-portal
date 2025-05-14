<template>
  <div :class="shared['flex-centered']">
  <div :class="shared['content-container']"> 
    <!--Admin note dialog-->
    <Dialog id="notesDialog" class="notes-dialog" v-model:visible="NotesDialog" modal header="Edit Notes" :style="{ width: '25rem' }">
      <div class="flex items-center gap-4">
        <label for="username" class="font-semibold w-24">Name: <span>{{fullName}}</span></label>
      </div>
      <br>
      <div class="flex items-center gap-4 mb-8">
        <IftaLabel variant="in">
          <Textarea 
            id="notesDialogText"
            rows="10" 
            cols="75"
            autoResize
            style="width:100%">
          {{ this.ApplicationData.adminNotes }}
          </Textarea>
        </IftaLabel>
      </div>
      <div class="flex justify-end gap-2">
        <Button id="notesDialogCancel" label="Cancel" severity="secondary" @click="NotesDialog = false"></Button>
        <Button id="notesDialogSave" label="Save" @click="HandleSaveNotesClick; NotesDialog = false"></Button>
      </div>
    </Dialog>

    <!--Email Dialog-->
    <Dialog id="emailDialog" class="email-dialog" v-model:visible="EmailDialog" modal header="Email" :style="{ width: '40rem' }">
      <IftaLabel variant="in">
        <InputText id="emailTo" :placeholder="selectedApplications.map(applicant => applicant.user.email).join(', ')" variant="filled" :class="styles['input']" readonly/>
        <label for="emailTo">To:</label>
      </IftaLabel><br>
      <IftaLabel variant="in">
        <InputText id="emailSubject" v-model="emailData.subject" variant="filled" :class="styles['input']" />
        <label for="emailSubject">Subject:</label>
      </IftaLabel><br>
      <IftaLabel variant="in">
        <InputText id="emailCC" v-model="emailData.cc" variant="filled" :class="styles['input']" />
        <label for="emailCC">CC:</label>
      </IftaLabel> <br>
      <div class="flex items-center gap-4 mb-8">
        <IftaLabel variant="in">
          <Textarea 
            id="emailDialogText"
            rows="10" 
            cols="80"
            autoResize
            style="width:100%">
          {{ this.emailData.body }}
          </Textarea>
        </IftaLabel>
      </div>
      <div class="flex justify-end gap-2">
        <Button id="emailDialogCancel" label="Cancel" severity="secondary" @click="EmailDialog = false"></Button>
        <Button id="emailDialogSend" label="Send" @click="HandleSendEmailClick; EmailDialog = false"></Button>
      </div>
    </Dialog>

    <!--Edit application dialog-->
    <Dialog id="editDialog" class="edit-dialog" v-model:visible="EditDialog" modal header="Application" :style="{ width: '60rem' }">
      <div class="flex items-center gap-4 mb-8">
        <div class="grid" style="padding-top: 3rem; width: 100%">

          <!--Info field-->
          <div class="col-10 col-offset-1">
              <label class="font-semibold w-24" :class="styles['input']">Name: <span>{{ fullName }}</span></label>
              <br />
              <label class="font-semibold w-24" :class="styles['input']">EID: <span>{{ ApplicationData.user.eid }}</span></label>
              <br />
              <label class="font-semibold w-24" :class="styles['input']">Email: <span>{{ ApplicationData.user.email }}</span></label>
              <br />
              <label class="font-semibold w-24" :class="styles['input']">WID: <span>{{ ApplicationData.user.wid }}</span></label>
              <br />
              <label class="font-semibold w-24" :class="styles['input']">Advisor: <span>{{ ApplicationData.advisor }}</span></label>
              <br />
              <label class="font-semibold w-24" :class="styles['input']">Semester: <span>{{ ApplicationData.semester }}</span></label>
          </div>

          <!--Status drop down-->
          <div class="col-10 col-offset-1">
              <IftaLabel variant="in">
              <Select 
              id="status" 
              v-model="ApplicationData.status" 
              :options="statusOptions" 
              :class="styles['input']"
              />
              <label for="status">Status:</label>
              </IftaLabel>
          </div>

          <!--Course table-->
          <div class="col-10 col-offset-1">
            <div :class="styles['table']"> 
                <DataTable :value="ApplicationData.courses" stripedRows id="appTable" >
                  <Column header="Course">
                      <template #body="{ data }">
                          {{ data.subject }} {{ data.class_number }}
                      </template>
                  </Column>
                  <Column field="course_status" header="Status" />
                  <Column header="Waiver">
                    <template #body="{ data }">
                      <Checkbox v-model="data.waiver" binary :disabled="true" />
                    </template>
                  </Column>
                  <Column field="grade" header="Grade" />
                </DataTable>
            </div>
          </div>

          <!--Student notes-->
          <div class="col-10 col-offset-1">
              <IftaLabel>
              <Textarea 
              placeholder="Add comments or additional information here" 
              v-model="ApplicationData.notes" 
              rows="7" cols="75"
              autoResize
              id="commentBox"
              style="width:100%"
              readonly
              />
              <label for="commentBox">Comments:</label>
              </IftaLabel>
          </div>

        </div>
      </div>
      <div class="flex justify-end gap-2">
        <Button id="editDialogCancel" label="Cancel" severity="secondary" @click="EditDialog = false"></Button>
        <Button id="editDialogUpdate" label="Update" @click="HandleSaveApplicationClick; EditDialog = false"></Button>
      </div>
    </Dialog>

    <LoadingIndicator v-if="isLoading" />

    <div class="grid" style="width: 100%;" v-else>

      <!--Header-->
      <div class="col-8 col-offset-2 xl:col-8 xl:col-offset-2">
        <div :class="shared['app-header']">
          <h1 :class="shared['h1-style']">Review Applications</h1>
          <h4 :class="shared['h4-style']">Total Applications: {{ applications?.length || 0  }}</h4>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="col-10 col-offset-1" :class="styles['button-container']">
          <div>

            <!--Button to download selected applicants-->
            <Button
            label="Download Selected"
              @click="handleDownloadSelected"
              id="download_selected"
              variant="success"
              :class="styles['form-header-button']"
            />

            <!--Button to email selected applicants-->
            <Button
              @click="handleEmailSelected"
              label="Email Selected"
              id="email_selected"
              variant="secondary"
              :class="styles['form-header-button']"
            />
          </div>
      </div>

      <!-- Applications Table -->
      <div class="col-10 col-offset-1" :class="styles['table']">
        <div>
            <DataTable :value="applications" v-model:selection="selectedApplications" stripedRows showGridlines 
            v-model:filters="filters" removableSort paginator :rows="8" id="adminTable" style="border-radius: 10px; overflow: hidden;"
            :globalFilterFields="['user.first_name', 'user.last_name', 'user.eid', 'user.wid']">
              <template #header>
                  <div class="flex justify-end">
                      <IconField>
                          <InputIcon>
                              <i class="pi pi-search" style="padding-right: 20px"/>
                          </InputIcon>
                          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                      </IconField>
                  </div>
              </template>
                <Column selectionMode="multiple"/>
                <Column field="user.first_name" header="First Name" sortable />
                <Column field="user.last_name" header="Last Name" sortable />
                <Column field="user.eid" header="EID" />
                <Column field="user.email" header="Email" sortable />
                <Column field="user.wid" header="WID" />
                <Column field="semester" header="Semester" />
                <Column field="status" header="Status"/>
                <Column header="Admin Notes">
                  <template #body="slotProps">
                    <Button label="View Notes" @click="handleAdminNoteClick(slotProps.data)" />
                  </template>
                </Column>
                <Column header="">
                  <template #body="slotProps">
                    <Button label="Review" @click="HandleEditClick(slotProps.data)" />
                  </template>
                </Column>
            </DataTable>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
//Vue
import { ref, onMounted } from "vue";

//Components
import { unparse } from 'papaparse';
import { useReviewerStore } from '@/stores/ReviewerStore';

//Primevue components
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import IftaLabel from 'primevue/iftalabel';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Checkbox from 'primevue/checkbox';
import { FilterMatchMode } from '@primevue/core/api';

//Our components
import LoadingIndicator from '@/components/common/LoadingIndicator.vue';

//CSS
import styles from '@/components/styles/AdminForm.module.css'; 
import shared from '@/components/styles/Shared.module.css';

export default {
    components: {
    Button,
    Select,
    Dialog,
    DataTable,
    Checkbox,
    Column,
    InputText,
    IftaLabel,
    Textarea,
    LoadingIndicator,
  },
  data() {
    const statusOptions = [
      "All",
      "Accepted",
      "Pending",
      "Pending/Exception",
      "Pending/Dismissed",
      "Pending/Reinstated",
      "Pending(All)",
      "Declined",
      "Declined/Exception",
      "Withdrawn"
    ];
    
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      'user.first_name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      'user.last_name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      'user.eid': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      'user.email': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      'user.wid': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    return {
      styles,
      shared,
      filters,
      isLoading: false,
      applications: [],
      selectedApplications: [],
      NotesDialog: false,
      EditDialog: false,
      EmailDialog: false,
      emailData: {},
      ApplicationData: {},
      statusOptions,
    };
  },
  methods: {
    async loadApplications() {
      const reviewStore = useReviewerStore();
      await reviewStore.fetchApplications(); 
      this.applications = reviewStore.applications; 
    },
    HandleSendEmailClick(){

    },
    HandleSaveNotesClick(event){
      //take the studentNotes and save it wherever it needs to go
    },
    HandleSaveApplicationClick(event){
      //update application being edited
    },
    //Open notes
    handleAdminNoteClick(data){
      this.ApplicationData = data;
      this.NotesDialog = true;
    },
    //Open edit dialog
    async HandleEditClick(data) {
      const reviewStore = useReviewerStore(); // Get the store here directly
      this.ApplicationData = data;
      this.EditDialog = true;
      await reviewStore.fetchApplicationsCourses(this.ApplicationData.user.id);
      this.ApplicationData.courses = reviewStore.app_courses;
    },
    fetchCourses(wid) { 
      //This could just be an axios request, I think? We have a courseRoutes that currently isn't getting used
      if (!wid){
        console.error("WID is undefined, cannot fetch courses.");
        return;
      }
      try{
          const response = watch(fetch(`http://localhost:3002/api/v1/protected/courses?id=${wid}`));
          const data = watch(response.json());
          setCourses(data.courses);  
      } catch (error){
        console.error('Failed to fetch courses: ${error.message}');
      }
    },
    refreshApplications() {
      console.log("Attempted to refresh applications, not implemented") 
    },
    handleReview(wid) { /* Handle review action */ 
      console.log("Attempted to handle review, not implemented")
    },
    handleEdit(eid) { 
      console.log("Attempted eid edit, not implemented") 
    },
    formatDate(dateString) { /* Format date logic */ 
      const date = new Date(dateString);
        const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const timeOptions = { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formattedDate = date.toLocaleDateString('en-US', dateOptions);
        const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
        return `${formattedDate} at ${formattedTime}`;
    },
    handleDownloadSelected() { /* Handle download selected applications */ 
      if(this.selectedApplications.length === 0) return;
      
      const data = this.selectedApplications.map(app => ({
            "First Name": app.first_name,
            "Last Name": app.last_name,
            "EID": app.eid,
            "Email": app.email,
            "WID": app.wid,
            "Semester": app.semester,
            "Waiver": app.waiver ? "Yes" : "No",
            "Status": app.status,
            "Admin Notes": app.notes,
            "DARS Update": this.formatDate(app.d_update)  
        }));

        // Convert data to CSV
        const csv = unparse(data);

        // Create a blob link to download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'download.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    handleEmailSelected() { /* Handle email selected applications */ 
      if(this.selectedApplications.length > 0){
        this.EmailDialog = true;
      }
    },
  },
  mounted() {
    this.loadApplications(); // Call the loadApplications method on mount
  },
  computed: {
    fullName: {
      get() {
        return `${this.ApplicationData.user.first_name} ${this.ApplicationData.user.last_name}`
      }
    },
  },
};
</script>