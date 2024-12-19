<template>
    <div>
      <div class="grid nested-grid">
        <div class="col-10 col-offset-1 xl:col-6 xl:col-offset-3">
            <!--Header-->
            <div :class="shared['app-header']">
                <h1 :class="shared['h1-style']">Professional Program Application</h1>
                <h4 :class="shared['h4-style']">Application For Entry Into the CS Professional Program</h4>
            </div>
        </div>
        <!--Form-->
        <div class="col-10 col-offset-1 xl:col-6 xl:col-offset-3">
            <form @submit.prevent="handleSubmit" id="applyForm" :class="styles['doc']">
                <div class="grid" style="padding-top: 3rem">

                    <!--Name field-->
                    <div class="col-10 col-offset-1">
                        <IftaLabel variant="in">
                        <InputText id="studentName" v-model="studentData.name" variant="filled" :class="styles['input']" />
                        <label for="studentName">Name:</label>
                        </IftaLabel>
                    </div>

                    <!--WID field-->
                    <div class="col-10 col-offset-1">
                        <IftaLabel variant="in">
                        <InputText id="wid" v-model="studentData.wid" variant="filled" :class="styles['input']" />
                        <label for="wid">WID:</label>
                        </IftaLabel>
                    </div>

                    <!--Advisor drop down-->
                    <div class="col-10 col-offset-1">
                        <IftaLabel variant="in">
                        <Select 
                        id="advisor" 
                        v-model="selectedAdvisor" 
                        :options="advisorOptions" 
                        showClear
                        :class="styles['input']"
                        />
                        <label for="advisor">Advisor:</label>
                        </IftaLabel>
                    </div>
                    
                    <!--Message-->
                    <div class="col-10 col-offset-1">
                        <div :class="styles['custom-message']">
                            <p>To be accepted to the Computer Science Professional Program, you must complete the following Pre-Professional Courses <em>with a grade of C or better</em> and <em>with a 2.3 cumulative</em> GPA <strong>within these courses</strong>.</p>
                            <p>Any courses you are currently taking can be marked as <em>In Progress</em>. Any courses that you do not plan on taking need to be marked <em>Waiver Requested</em> and the reasons you are asking for the waiver must be explained below.</p>
                        </div>
                    </div>

                    <!--Course table-->
                    <div class="col-12 col-offset-0 xl:col-10 xl:col-offset-1">
                        <div :class="styles['table']"> 
                            <DataTable :value="courses" stripedRows id="appTable">
                                <Column field="class_descr" header="Course" />
                                <Column field="course_id" header="Course ID" />
                                <Column field="status" header="Status" />
                                <Column field="grade" header="Grade" />
                            </DataTable>
                    </div>
                    </div>
                    
                    <!--Message-->
                    <div class="col-10 col-offset-1">
                        <div :class="styles['custom-message']">
                            <p>Please use this space to add any comments that should be made regarding these classes.</p>
                            <p>If you requested a waiver for any of these classes, please explain in detail the reasons you are requesting a 
                                waiver for meeting all of the requirements for entrance into the Computer Science Professional Program. 
                                You may also be required to meet with the curriculum committee to evaluate the waiver request.</p> 
                        </div>
                    </div>

                    <!--Comments text area-->
                    <div class="col-10 col-offset-1">
                        <Textarea 
                        placeholder="Add comments or additional information here" 
                        v-model="additionalInfo" 
                        rows="7" cols="75"
                        autoResize
                        id="commentBox"
                        style="width:100%"
                        />
                    </div>

                    <!--Submit button-->
                    <div class="col-12">
                        <div :class="shared['flex-centered']" >
                        <Button id="submitBtn" type="button" :class="styles['btn-submit']">
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
            </form>
        </div>
    </div>
    </div>
  </template>
  
  <script>

  //Components
  import { shallowRef, ref } from 'vue';

  //Primevue components
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import Alert from 'primevue/message';
  import IftaLabel from 'primevue/iftalabel';
  import Select from 'primevue/select';
  import Textarea from 'primevue/textarea';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';

  //CSS
  import styles from '../../styles/ApplicationForm.module.css'; 
  import shared from '../../styles/Shared.module.css';

  
  export default {
    name: 'ApplicationForm',
    components: {
      InputText,
      Textarea,
      Select,
      Button,
      Alert,
      IftaLabel,
      DataTable,
      Column
    },
    setup() {
      //Could easily get the profileStore in here and pull information from the logged in user
      const studentData = ref({wid: 1234, name: "Test Student"});
      const courses = shallowRef([
        {class_descr: "Required", course_id: "CIS642", status: "Passed", grade: "A"},
        {class_descr: "Required", course_id: "CIS505", status: "Passed", grade: "B"},
        {class_descr: "Not Required", course_id: "CIS625", status: "Failed", grade: "D"},
      ]);
      const loading = shallowRef(false);
      const statusMessage = shallowRef('');
      const alertStatus = shallowRef('info');
      const showAlert = shallowRef(false);
      const selectedAdvisor = shallowRef('');
      const courseUpdates = shallowRef({});
      const submitting = shallowRef(false);
      const additionalInfo = shallowRef('');
      const hardcodedGPA = "3.5";
  
        const statusOptions = [
        { value: "Complete", label: "Complete" },
        { value: "In-Progress", label: "In Progress" },
        { value: "transferred", label: "Transferred" },
        { value: "retaking", label: "Retaking" },
        { value: "waiver-requested", label: "Waiver Requested" },
      ];
  
        const gradeOptions = [
        { value: "n/a", label: "N/A" },
        { value: "A", label: "A" },
        { value: "B", label: "B" },
        { value: "C", label: "C" },
        { value: "D", label: "D" },
        { value: "F", label: "F"}
        ];
    
        const advisorOptions = [
            "Advisor1", "Advisor2"
        ];

        return {styles, shared, studentData, courses, loading, statusMessage, alertStatus, showAlert, selectedAdvisor, courseUpdates, submitting, additionalInfo, hardcodedGPA, advisorOptions}
    }
}

</script>