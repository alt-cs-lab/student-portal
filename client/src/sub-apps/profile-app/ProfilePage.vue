<template>
  <div :class="shared['flex-centered']">
    <div :class="shared['content-container']">
      <div class="grid nested-grid" style="width:100%;">
        <!--Header-->
        <div class="col-8 col-offset-2 xl:col-8 xl:col-offset-2">
          <div :class="shared['app-header']">
              <h1 :class="shared['h1-style']">Your Profile</h1>
              <h4 :class="shared['h4-style']">Update your user profile:</h4>
          </div>
        </div>
        <!--Form-->
        <div class="col-12 md:col-8 md:col-offset-2 lg:col-8 lg:col-offset-2 xl:col-3 xl:col-offset-3" style="text-align: center; justify-content:center;  display:flex;">
              <div class="grid bg-white border-round-sm p-0 m-0 align-items-center justify-content-center" style="width:80%;">
                  <div class="col-12"/>
                  <div class="col-12 align-items-center justify-content-center" style="width:80%;">
                    <!-- First Name Field -->
                    <IftaLabel variant="in">
                      <InputText id="firstName" v-model="user.first_name" variant="filled" style="width:100%;"/>
                      <label for="firstName">First Name</label>
                    </IftaLabel>
                  </div>

                  <div class="col-12 align-items-center justify-content-center" style="width:80%;">
                    <!-- Last Name Field -->
                    <IftaLabel variant="in">
                      <InputText id="lastName" v-model="user.last_name" variant="filled" style="width:100%;"/>
                      <label for="lastName">Last Name</label>
                    </IftaLabel>
                  </div>

                  <div class="col-12 align-items-center justify-content-center" style="width:80%;">
                    <!-- Email Field -->
                    <IftaLabel variant="in">
                      <InputText id="email" v-model="user.email" variant="filled" readonly style="width:100%;"/>
                      <label for="email">Email</label>
                    </IftaLabel>
                  </div>

                  <div class="col-12 align-items-center justify-content-center" style="width:80%;">
                    <!-- WID Field -->
                    <IftaLabel variant="in">
                      <InputText id="wid" v-model="user.wid" variant="filled" readonly style="width:100%;"/>
                      <label for="wid">WID</label>
                    </IftaLabel>
                  </div>

                  <div class="col-12 flex align-items-center justify-content-center">
                    <!-- Submit Button -->
                    <button type="button" class=" align-items-stretch" :class="styles['btn-update']" @click="save" :loading="loading">Save</button>
                  </div>
              </div>
        </div> 

        <div class="col-12 md:col-8 md:col-offset-2 lg:col-offset-2 lg:col-8 xl:col-3 xl:col-offset-0">
          <div class="grid p-0 m-0 align-items-center justify-content-center">
            <!--Discord-->
            <div class="col-12 border-round-sm" style="background-color: gray; border: 3px solid #757575; height:16rem; width:80%" >
                  <img :src="discordText" alt="discord text" style="margin: 15px; height: 40px; margin-left: auto; margin-right: auto; display: block;text-align: center;"/>
                  <h4 :class="styles['text']" v-if="discord === '' | discord === undefined" style ="text-align: center; color:white">Click the button below to connect to the official <br>K-State Discord.</h4>
                  <h4 :class="styles['text']" v-else style ="text-align: center; color:white"><span style="color:#41d873">Verified: {{discord}}</span><br><br>Now join the discord:<a style="color:plum; font-weight: bold; text-decoration: underline;" href="https://discord.gg/EpMjM4JbXG">Click here</a><br>Click the button below to unlink your account.</h4>
                <div class="flex align-items-center justify-content-center" v-if="discord === '' | discord === undefined">
                  <button type="button" :class="styles['btn-update']">
                    <img :src="discordIcon" alt="discord Logo" width="40" Height="40" @click='HandleDiscordClick' />
                  </button>
                </div>
                <div class="flex align-items-center justify-content-center" v-else>
                  <button type="button" :class="styles['btn-verified']">
                    <img :src="discordIcon" alt="discord Logo" width="40" Height="40" @click='HandleDiscordUnlink' />
                  </button>
                </div>
            </div>

            <!--Spacer-->
            <div class="col-12"/>
            
            <!--GitHub-->
              <div class="col-12 border-round-sm" style="background-color: gray; border: 3px solid #757575; height:16rem; width:80%">
                    <img :src="githubText" alt="github text" style="margin: 15px; text-align: center; height: 50px; margin-left: auto; margin-right: auto; display: block;" />
                    <h4 :class="styles['text']" v-if="github === '' | github === undefined" style="text-align: center; color:white">Click the button below to link <br>your GitHub account.</h4>
                    <h4 :class="styles['text']" v-else style ="text-align: center; color:white"><span style="color:#41d873">Verified: {{github}}</span><br><br>Click the button below to unlink your account.</h4>
                  <div class="flex align-items-center justify-content-center" v-if="github === '' | github === undefined">
                      <button type="button" :class="styles['btn-update']" @click="HandleGitHubClick">
                      <img :src="githubIcon" alt="github icon" width="40" Height="40" />
                      </button>
                  </div>
                  <div class="flex align-items-center justify-content-center" v-else>
                      <button type="button" :class="styles['btn-verified']" @click="HandleGitHubUnlink">
                      <img :src="githubIcon" alt="github icon" width="40" Height="40" />
                      </button>
                  </div>
              </div>
          </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>

//Components
import { ref, onMounted, watch  } from 'vue';
import { useRoute, useRouter } from 'vue-router';
//You have to import the method you created in the store file to be able to use it
import { useProfileStore } from '@/stores/ProfileStore';
import { useTokenStore } from '@/stores/TokenStore';
import { storeToRefs } from 'pinia'

//PrimeVue components
import InputText from 'primevue/inputtext';
import IftaLabel from 'primevue/iftalabel';
import { useToast } from 'primevue/usetoast'

//CSS
import styles from '@/components/styles/ProfileForm.module.css';
import shared from '@/components/styles/Shared.module.css';

//Images and icons
import discordIcon from '@/components/assets/Discord.svg'
import discordText from '@/components/assets/DiscordText.png'
import githubText from '@/components/assets/GitHubText.png'
import githubIcon from '@/components/assets/GitHub-Logo.png'

export default {
  name: 'ProfilesForm',
  components: {
    InputText,
    IftaLabel,
  },
  methods: {
    SaveProfile(event) {
      if (event) {
        alert(`Attempting to submit form with values:\nFirst Name: ${this.firstName}\nLast Name: ${this.lastName}\nEmail: ${this.email}\nGitHub: ${this.GitHub}`);
      }
    }
  },
  setup() {
    
    // Stores
    //And assign it to a variable at the beginning of setup
    const profileStore = useProfileStore()
    //This was a bit of a workaround for our tests, which were failing because information we were trying to test was getting replaced
    if (process.env.NODE_ENV !== 'test') {
      //Hydrate just tells the store to check if it has the current information
      profileStore.hydrate()
    }

    //The storeToRefs method allows you to pull out various fields as a ref, which is a JavaScript type
    //Refs are async, so when you first get them, they are likely empty, and will be filled in later by the async method
    //This can cause issues if you are trying to work with the fields while still in the setup, but this page doesn't do that
    //Look at the professional programs application form if you want to see some of that
    //This page just uses the fields as data binding, which you can see in the HTML above, and is done completely normally

    // Setup Stores
    const tokenStore = useTokenStore();
    const { profile_updated, get_profile_updated } = storeToRefs(tokenStore)
    const { user, discord, github } = storeToRefs(profileStore)
    const toast = useToast()
    const userId = tokenStore.id;
    profileStore.getDiscordInfo(userId);
    profileStore.getGitHubInfo(userId);

    //Check if user has not updated profile
    const route = useRoute()
    const router = useRouter()
    function maybeShowToast(query) {
      if (query.showToast === 'true') {
        toast.add({
          severity: 'warn',
          summary: 'Update Required',
          detail: 'You must update your profile before navigating from this page.',
          life: 3000,
        })
        // Remove the query param from the URL
        router.replace({ path: route.path, query: {} })
      }
    }
    onMounted(() => {
      maybeShowToast(route.query)
    })
    watch(() => route.query, maybeShowToast, { immediate: false })
    
    //Function for linking GitHub account
    const HandleGitHubClick = () => {
      const gitAuthUrl = `${import.meta.env.VITE_SERVER_URL}/api/v1/github?state=${userId}`;
      window.location.href = gitAuthUrl;
    };

    //Function for linking Discord account
    const HandleDiscordClick = () => {
    const discordAuthUrl = `${import.meta.env.VITE_SERVER_URL}/api/v1/discord?state=${userId}`;
    window.location.href = discordAuthUrl;
    };

    const HandleDiscordUnlink = async () => {
    try {
      const response = await profileStore.unlinkDiscord(userId);
      profileStore.getDiscordInfo(userId)
      if (response) {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Discord Unlinked!',
          life: 3000,
        });
      }
      else{
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not unlink discord.',
          life: 3000,
        });
      }
    } catch (error) {
      console.error('Error unlinking Discord:', error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to unlink Discord account',
        life: 3000,
      });
    }
  };

  const HandleGitHubUnlink = async () => {
    try {
      const response = await profileStore.unlinkGitHub(userId);
      profileStore.getGitHubInfo(userId)
      if (response) {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'GitHub Unlinked!',
          life: 3000,
        });
      }
      else{
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to unlink GitHub account.',
          life: 3000,
        });
      }
    } catch (error) {
      console.error('Error unlinking GitHub:', error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to unlink GitHub!',
        life: 3000,
      });
    }
  };

    //Logger.debug(user)

    //Save Button Code
    const errors = ref({})
    const message = ref('')
    const loading = ref(false)

    const save = async () => {
    loading.value = true
    errors.value = {}
    message.value = ''
    try {
      await profileStore.update()
      await tokenStore.getToken()
      toast.add({ severity: 'success', summary: 'Success', detail: 'Profile Updated!', life: 3000 })
    } catch (error) {
      if (error.response.data.data) {
        errors.value = error.response.data.data
        message.value = 'The server rejected this submission. Please correct errors listed below'
      } else {
        message.value =
          'The server rejected this submission due to an SQL Error. Refresh and try again'
        }
      }
    loading.value = false
    }
    
    return { user, discord, github, HandleDiscordClick, HandleDiscordUnlink, HandleGitHubClick, HandleGitHubUnlink, styles, shared, discordIcon, discordText, errors, message, loading, save, githubText, githubIcon, profile_updated, get_profile_updated};
  },
};
</script>
