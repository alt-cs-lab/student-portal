<template>
  <div> 
    <!-- Dialogs go here -->
    <Dialog v-model:visible="AdminNotes" modal header="Edit Notes" :style="{ width: '25rem' }">
  <div class="flex items-center gap-4">
    <label for="username" class="font-semibold w-24">Name: {{ NotesName }}</label>
  </div>
  <br>
  <div class="flex items-center gap-4 mb-8">
    <FloatLabel variant="in">
      <Textarea 
        rows="10" 
        cols="75"
        autoResize
        style="width:100%">
      {{ studentNotes }}
      </Textarea>
    </FloatLabel>
  </div>
  <div class="flex justify-end gap-2">
    <Button type="button" label="Cancel" severity="secondary" @click="AdminNotes = false"></Button>
    <Button type="button" label="Save" @click="HandleSaveNotesClick; AdminNotes = false"></Button>
  </div>
</Dialog>

    <LoadingIndicator v-if="isLoading" />

    <div class="grid" v-else>
      <!-- Alert goes here-->

      <div class="col-8 col-offset-2 xl:col-6 xl:col-offset-3" :class="shared['app-header']">
          <h1 :class="shared['h1-style']">Review Applications</h1>
          <h4 :class="shared['h4-style']">Total Applications: {{ applications.length }}</h4>
      </div>

      <!-- Action Buttons -->
      <div class="col-10 col-offset-1" :class="styles['button-container']">
          <div>
            <Button
              @click="handleDisable"
              label="Disable Application(s)" 
              id="disable_application"
              severity="danger"
              :class="styles['form-header-button']"
              :disabled="isNoApplicationsChecked"
            />
            <Button
            label="Download Selected"
              @click="handleDownloadSelected"
              id="download_selected"
              variant="success"
              :class="styles['form-header-button']"
              :disabled="isNoApplicationsChecked"
            />
            <Button
              @click="handleEmailSelected"
              label="Email Selected"
              id="email_selected"
              variant="secondary"
              :class="styles['form-header-button']"
              :disabled="isNoApplicationsChecked"
            />
          </div>
      </div>

      <!-- Applications Table -->
      <div class="col-10 col-offset-1" :class="styles['table']">
        <div>
            <DataTable :value="applications" stripedRows removableSort paginator :rows="8">
                <Column selectionMode="multiple"/>
                <Column field="firstName" header="First Name" sortable />
                <Column field="lastName" header="Last Name" sortable />
                <Column field="eid" header="EID" />
                <Column field="email" header="Email" sortable />
                <Column field="wid" header="WID" />
                <Column field="advisor" header="Advisor" />
                <Column field="semester" header="Semester" />
                <Column field="waiver" header="Waiver" />
                <Column field="status" header="Status" />
                <Column field="review" header="Review" />
                <Column header="Admin Notes">
                  <template #body="slotProps">
                    <Button label="View Notes" @click="handleAdminNoteClick(slotProps.data.firstName, slotProps.data.lastName)" />
                  </template>
                </Column>
                <Column field="dars" header="DARS Update" />
                <Column field="edit" header="Edit" />
            </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { shallowRef, ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Alert from 'primevue/message';
import FloatLabel from 'primevue/floatlabel';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import { applicationData } from './test-data/applicationData.js';

//CSS
import styles from '../../styles/AdminForm.module.css'; 
import shared from '../../styles/Shared.module.css';

//import ViewNotesModal from './adminModals/ViewNotesModal.vue';
//import ReviewModal from './adminModals/ReviewModal.vue';

export default {
    components: {
    Button,
    Dialog,
    DataTable,
    Column,
    FloatLabel,
  },
  data() {
    return {
      // Define all reactive data properties here
      styles,
      shared,
      isLoading: false,
      applications: applicationData,
      AdminNotes: false,
      NotesName: "",
      studentNotes: "",
      
    };
  },
  methods: {
    resetSortConfig(event){

    },
    HandleSaveNotesClick(event){
      //take the studentNotes and save it wherever it needs to go
    },
    handleAdminNoteClick(firstName, lastName ){
      this.NotesName = firstName + " " + lastName;
      this.studentNotes = "testing purposes here"; //get students nots and put them here
      this.AdminNotes = true;
    },
    fetchCourses(wid) { 
      if (!WID){
        console.error("WID is undefined, cannot fetch courses.");
        return;
      }
      try{ //below items commented out because causes program to crash. im assuming due to it not beign set up yet but it may just be wrong
          const response = watch(fetch(`http://localhost:3002/api/courses?id=${wid}`));
          const data = watch(response.json());
          setCourses(data.courses);  
      } catch (error){
        console.error('Failed to fetch courses: ${error.message}');
      }
    },
    saveNotes(appId, notes) {
      console.log("Attempted to save notes, not implemented")
    },
    closeReviewModal() { /* Close review modal logic */
      console.log("Attempted to close review modal, not implemented")
     },
    refreshApplications() {
      console.log("Attempted to refresh applications, not implemented") 
    },
    handleCheckAllChange(event) { /* Handle check all checkbox change */ 
      console.log("handle check box change, not implemented")
    },
    handleSort(key) { /* Handle sorting */ 
      console.log("Attempted to sort, not implemented")
    },
    handleFilterChange(e) { /* Handle filter change */ 
      console.log("Attempted to change filter, not implemented")
    },
    handleCheckboxChange(appId, isChecked) { /* Handle individual checkbox change */ 
      console.log("Attempted to handle checkbox change, not implemented")
    },
    handleReview(wid) { /* Handle review action */ 
      console.log("Attempted to handle review, not implemented")
    },
    handleEdit(eid) { 
      console.log("Attempted eid edit, not implemented") 
    },
    closeApplicationModal() {
      console.log("Attempted to close application modal, not implemented")
    },
    handleViewNotes(wid, notes) { /* Handle view notes action */ 
      console.log("Attempted to view notes, not implemented")
    },
    formatDate(dateString) { /* Format date logic */ 
      const date = new Date(dateString);
        const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const timeOptions = { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formattedDate = date.toLocaleDateString('en-US', dateOptions);
        const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
        return `${formattedDate} at ${formattedTime}`;
    },
    handleDisable() { /* Handle disable action */ 
      console.log("Attempted to save disable application, not implemented")
    },
    handleDownloadSelected(applications, checkedStates) { /* Handle download selected applications */ 
      console.log("Attempted to download selected, not implemented")
    },
    handleEmailSelected() { /* Handle email selected applications */ 
      console.log("Attempted to handle email selected, not implemented")
    },
  },
};
</script>