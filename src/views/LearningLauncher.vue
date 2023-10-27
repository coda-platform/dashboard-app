<template>
  <v-container class="mainContainer">
    <div class="learning">
      <h1>{{ $t("learningTitle") }}</h1>
    </div>
    <div>{{ $t("federated_simulation") }}</div>
    <br />
    <BRow>
      <BCol lg="5" md="8" offset="1">
        <BRow>
          <v-card class="learningContainer">
            <div class="panelTitle">
              <span>{{ $t("prepareRequestTxt") }}</span>
            </div>
            <div class="preparePanel">
              <div class="prepare">
                <BFormGroup id="learningPrepareBodyForm">
                  <textarea
                    id="learningPrepareBodyTextArea"
                    size="sm"
                    v-model="prepareBody"
                    rows="20"
                    style="color: black;"
                  ></textarea>
                </BFormGroup>
                <BButton block variant="success" @click="getPrepare" class="prepareButton"
                :disabled="isPrepareButtonDisabled">
                  {{ $t("sendPrepareTxt") }}
                  <span v-if="isPreparing">(Please wait...)</span></BButton
                >
              </div>
            </div>
          </v-card>
        </BRow>
        <BRow v-if="showCountResult">
          <v-card class="resultContainer">
            <div class="panelTitle">
              <span>{{ $t("countResultTxt") }}</span>
            </div>
            <div>
              <BTable
                striped
                hover
                :items="countResult"
                :fields="countFields"
              ></BTable>
            </div>
          </v-card>
        </BRow>
        <BRow v-if="showTrainInput">
          <v-card class="learningContainer">
            <div class="panelTitle">
              <span>{{ $t("TrainRequestTxt") }}</span>
            </div>

            <div class="preparePanel">
              <div class="train">
                <BFormGroup id="learningTrainBodyForm">
                  <textarea
                    id="learningTrainBodyTextArea"
                    size="sm"
                    v-model="trainBody"
                    rows="3"
                  ></textarea>
                </BFormGroup>
                <BButton
                  block
                  variant="success"
                  class="trainButton"
                  @click="getTrain"
                  :disabled="isTrainButtonDisabled"
                  >{{ $t("sendTrainTxt") }}
                  <span v-if="isTraining">(Please wait...)</span>
                </BButton>
              </div>
            </div>
          </v-card>
        </BRow>
        
        <BRow v-if="evaluateCompleted">
          <v-card class="resultContainer">
            <div class="panelTitle">
              <span>{{ $t("evaluateResultTxt") }}</span>
            </div>
            <div>
              <BTable striped hover :items="evaluateResult"></BTable>
            </div>
          </v-card>
        </BRow>
      </BCol>
      <BCol lg="4" md="4" offset="1" v-if="!(isTraining || evaluationInProgress || evaluateCompleted)" style="padding-top: 16px">
        <BCard class="sitesCard">
          <BCardHeader class="cardHeader text-center">
            <div class="panelTitle">
              <span>Select Hospital Sites:</span>
            </div>
          </BCardHeader>
          <BCardBody class="sitesCardBody">
              
            <BFormCheckbox
              class="sites-checkbox"
              v-for="availableSite in availableSites"
              :key="availableSite.value"
              :checked="isSelected(availableSite.value)"
              @change="toggleSiteSelection(availableSite)"
            >
              <strong>{{ availableSite.value }} - {{ availableSite.name }}</strong>
            </BFormCheckbox>

          </BCardBody>
        </BCard>
      </BCol>
      <BCol lg="5" md="8" offset="1" v-if="isTraining || evaluationInProgress || evaluateCompleted" :key="chartKey">
        <BRow v-for="metric in metrics" v-bind:key="metric.name">
          <BOverlay
            :show="showGraphLoading"
            spinner-variant="primary"
            spinner-type="grow"
            rounded="sm"
            class="metricsPanel"
          >
            <BCard class="metricsCard text-center">
              <BCardHeader class="cardHeader">{{ metric.name }}</BCardHeader>
              <BCardBody class="metricsCardBody">
                <LearningLineChart
                  :key="metric.name + '-' + chartKey.toString()"
                  :dataToPlot="metric"
                  :dataValues="progressResult.map((item) => ({ value: item[metric.value], round: item.currentRound, siteCode: item.siteCode }))"
                  :sites="selectedSites"
                ></LearningLineChart>
              </BCardBody>
            </BCard>
          </BOverlay>
        </BRow>
      </BCol>
      <BCol lg="4" md="4" offset="1" v-if="isError">
        <div>
          <BAlert v-model="isError" variant="danger" dismissible>
            {{ errorMsg }}
          </BAlert>
        </div>
      </BCol>
    </BRow>
  </v-container>
</template>

<script>
import { isProxy, toRaw } from 'vue'

import LearningApi from "@/api/LearningApi";
import LearningLineChart from "../components/LearningLineChart.vue";
import SiteApi from "@/api/SiteApi";

const defaultPrepareBody = `{
  "selectors": [
    {
      "resource": "Patient",
      "label": "PA",
      "limit": 1000,
      "filters": [],
      "fields": [
        {
          "path": "gender",
          "label": "gender",
          "type": "string"
        },
        {
          "path": "age",
          "label": "age",
          "type": "integer"
        },
        {
          "path": "isDeceased",
          "label": "isDeceased",
          "type": "boolean"
        }
      ]
    },
    {
      "resource": "Observation",
      "label": "OB",
      "filters": [
        {
          "path": "code.coding.code",
          "operator": "is",
          "value": "20570-8",
          "type": "string"
        }
      ],
      "fields": [
        {
          "path": "value.Quantity.value",
          "label": "hematocrit",
          "type": "integer"
        }
      ]
    }
  ],
  "options": {
    "model": {
      "class_name": "Sequential",
      "config": {
        "name": "sequential_1",
        "layers": [
          "etc..."
        ]
      }
    },
    "inputs": [
      "gender",
      "age",
      "hematocrit"
    ],
    "outputs": [
      "isDeceased"
    ],
    "optimizer": {
      "name": "adam",
      "parameters": {
        "learning_rate": 0.00025,
        "validation_split": 0.33,
        "evaluation_split": 0.2,
        "epochs": 1,
        "batch_size": 2,
        "shuffle": 1000
      }
    },
    "compiler": {
      "parameters": {
        "loss": "binaryCrossentropy",
        "metrics": [
          "accuracy"
        ]
      }
    }
  }
}`

export default {
  components: { LearningLineChart },
  name: "LearningLauncher",
  methods: {
    getPrepareBody() {
      return JSON.parse(isProxy(this.prepareBody) ? toRaw(this.prepareBody) : this.prepareBody)
    },
    getSelectedSitesList() {
      const rawData = this.selectedSites
      const sites = isProxy(rawData) ? toRaw(rawData) : [...rawData]
      return sites.join(",")
    },
    getPrepare() {
      const sitesUri = this.getSelectedSitesList()
      this.isPreparing = true;

      console.info(`Launching prepare query for sites ${this.getPrepareBody()}, `, 
        JSON.stringify(this.getPrepareBody(), null, 2))

      LearningApi.getPrepare(this.getPrepareBody(), sitesUri).then((res) => {
        if (res.status == 200) {
          this.jobID = res.data[0].job;
          this.trainBody = `{"job": "${this.jobID}","rounds": 10}`;
          this.isPreparing = false;
          this.countResult = res.data;
          this.showCountResult = true;
          this.isPrepareButtonDisabled = true;
          this.isTrainButtonDisabled = false;
          this.showTrainInput = true;
        } else if (res.status == 500) {
          this.isError = true;
          this.errorMsg = res.message;
        }
      });
    },
    getTrain() {

      if (this.isTraining) return

      this.progressResult = [];
      this.isTrainButtonDisabled = true;
      this.isTraining = true;

      this.progressInterval = setInterval(() => {
        this.getProgress();
      }, 2000);

      const sitesUri = this.getSelectedSitesList()
      try {
        LearningApi.getTrain(this.trainBody, sitesUri)
      } catch (err) {
        console.log("Error during training: ", err);
        this.isTraining = false;
        clearInterval(this.progressInterval)
      }
      
    },
    getProgress() {
      const sitesUri = this.getSelectedSitesList()
      LearningApi.getProgress(this.progressBody, sitesUri).then((res) => {
        if (res.status == 200) {
          if (this.evaluateCompleted) {
            console.log('Evaluate completed')
            clearInterval(this.progressInterval);
            return
          }
          if (this.errorMsg) {
            console.log('Aborting due to error')
            clearInterval(this.progressInterval);
            return
          }
          this.progressResult = res.data;
          console.log('Training progress: ', toRaw(this.progressResult))

          if (this.progressResult.length != 0) {
            this.showGraphLoading = false;
            if (this.progressResult[0] && 
            this.progressResult[0].currentRound === 
            this.progressResult[0].totalRounds) {
              console.log('Training completed')
              this.getEvaluate()
              this.isTraining = false;
            }
          }
        } else if (res.status == 500) {
          this.isError = true;
          this.errorMsg = res.message;
        }
      });
    },
    getEvaluate() {
      console.log('Evaluate called')
      const sitesUri = this.getSelectedSitesList()
      if (this.evaluationInProgress || this.evaluateCompleted) {
        return
      } else {
        this.evaluationInProgress = true
      }
      try {
        console.log('Evaluate requested')
        LearningApi.getEvaluate(this.evaluateBody, sitesUri).then((res) => {
          if (res.status == 200) {
            this.evaluateCompleted = true;
            this.evaluationInProgress = false;
            this.evaluateResult = res.data;
            console.log('Evaluate completed')
          } else if (res.status == 500) {
            this.isError = true;
            this.errorMsg = res.message;
            this.evaluateCompleted = false;
            this.evaluationInProgress = false;
            console.error('Evaluate errored', res.message)
          }
        });
      } catch (err) {
        this.isError = true;
        this.errorMsg = err.message;
        this.evaluateCompleted = true;
        this.evaluationInProgress = false;
      }
    },
    
    // Check if a site is selected
    isSelected(uid) {
      return this.selectedSites.includes(uid);
    },
    
    // Toggle the site selection based on its UID
    toggleSiteSelection(event) {
      const selection = toRaw(event)
      const value = selection?.value
      if (this.isSelected(value)) {
        this.selectedSites = this.selectedSites.filter(siteUid => siteUid !== value)
      } else {
        this.selectedSites = [...this.selectedSites, value]
      }
      if (this.selectedSites.length > 0) {
        this.isPrepareButtonDisabled = false
      } else {
        this.isPrepareButtonDisabled = true
      }
    }

  },
  async created() {
    await SiteApi.get()
      .then((res) => res.data)
      .then((json) => json.connections)
      .then((conn) => {
        this.availableSites = conn.map(({uid, name}) => ({value: uid, name}))
        .sort((a, b) => a.name.localeCompare(b.name));
        console.log('Available sites: ', this.availableSites)
      })
  },
  data() {
    return {
      chartKey: 0,
      isError: false,
      errorMsg: "",
      trainBody: "",
      selectedSites: [],
      availableSites: [],
      showGraphLoading: true,
      showTrainInput: false,
      showCountResult: false,
      isPrepareButtonDisabled: true,
      isTrainButtonDisabled: false,
      evaluationInProgress: false,
      isPreparing: false,
      isTraining: false,
      evaluateCompleted: false,
      metrics: [
        { name: "Accuracy", value: "acc" },
        { name: "Loss", value: "loss" },
        { name: "Validation Accuracy", value: "val_acc" },
        { name: "Validation Loss", value: "val_loss" },
      ],
      countFields: ["siteCode", "count"],
      progressInterval: null,
      progressResult: [],
      evaluateResult: [],
      countResult: [],
      jobID: "",
      prepareBody: defaultPrepareBody,
    };
  },
  computed: {
    progressBody: function () {
      return `{"job": "${this.jobID}"}`;
    },
    evaluateBody: function () {
      return `{"job": "${this.jobID}"}`;
    },
  }

};
</script>

<style scoped></style>
