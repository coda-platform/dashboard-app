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
                <BButton block variant="success" @click="getPrepare" class="prepareButton">
                  {{ $t("sendPrepareTxt") }}
                  <span v-if="isPreparing">(loading)</span></BButton
                >
              </div>
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
                  @click="getTrain"
                  :disabled="isTrainButtonDisabled"
                  >{{ $t("sendTrainTxt") }}
                  <span v-if="isTraining">(loading)</span>
                </BButton>
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
      <BCol lg="4" md="4" offset="1" v-if="!inProgress" style="padding-top: 16px">
        <BCard class="sitesCard">
          <BCardHeader class="cardHeader text-center">
            <div class="panelTitle">
              <span>{{ $t("activeConnectionsTxt") }}</span>
            </div>
          </BCardHeader>
          <BCardBody class="sitesCardBody">
            <BFormGroup>
              <BFormCheckbox
                class="sites-checkbox"
                v-model="selectedSites"
                v-for="availableSite in availableSites"
                :key="availableSite.uid"
                :value="availableSite.uid"
              >
                <strong
                  >{{ availableSite.uid }} - {{ availableSite.name }}</strong
                >
              </BFormCheckbox>
            </BFormGroup>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol lg="5" md="8" offset="1" v-if="inProgress">
        <BRow v-for="metric in metrics" :key="metric.name">
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
                  :dataToPlot="metric"
                  :data="progressResult"
                ></LearningLineChart>
              </BCardBody>
            </BCard>
          </BOverlay>
        </BRow>
      </BCol>
      <BCol lg="4" md="4" offset="1" v-if="!inProgress">
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
import LearningApi from "@/api/LearningApi";
import SiteApi from "@/api/SiteApi";
import LearningLineChart from "../components/LearningLineChart.vue";

export default {
  components: { LearningLineChart },
  name: "Learning",
  methods: {
    getSelectedSitesList() {
      console.log('Selected sites', this.selectedSites)
      return (this.selectedSites ?? []).join(",")
    },
    getPrepare() {
      const sitesUri = this.getSelectedSitesList()
      this.isPreparing = true;

      console.log(sitesUri);
      LearningApi.getPrepare(this.prepareBody, sitesUri).then((res) => {
        if (res.status == 200) {
          this.jobID = res.data[0].job;
          this.trainBody = `{"job": "${this.jobID}","rounds": 10}`;
          this.isPreparing = false;
          this.countResult = res.data;
          this.showCountResult = true;
          this.isTrainButtonDisabled = false;
          this.showTrainInput = true;
        } else if (res.status == 500) {
          this.isError = true;
          this.errorMsg = res.message;
        }
      });
    },
    getTrain() {
      this.progressResult = [];
      this.isTrainButtonDisabled = true;
      this.isTraining = true;

      this.getProgress();
      this.progressInterval = setInterval(() => {
        this.getProgress();
      }, 2000);
      const sitesUri = this.getSelectedSitesList()
      LearningApi.getTrain(this.trainBody, sitesUri)
        .then((res) => {
          if (res.status == 200) {
            clearInterval(this.progressInterval);
            this.getProgress();
            this.getEvaluate();
            this.isTraining = false;
          } else if (res.status == 500) {
            this.isError = true;
            this.errorMsg = res.message;
          }
        })
        .catch((error) => {
          console.log("Error during training: ", error);
          this.isTraining = false;
        });
    },
    getProgress() {
      const sitesUri = this.getSelectedSitesList()
      LearningApi.getProgress(this.progressBody, sitesUri).then((res) => {
        if (res.status == 200) {
          this.progressResult = res.data;
          this.inProgress = true;
          if (this.progressResult.length != 0) this.showGraphLoading = false;
        } else if (res.status == 500) {
          this.isError = true;
          this.errorMsg = res.message;
        }
      });
    },
    getEvaluate() {
      const sitesUri = this.getSelectedSitesList()
      
      LearningApi.getEvaluate(this.evaluateBody, sitesUri).then((res) => {
        if (res.status == 200) {
          this.evaluateCompleted = true;
          this.evaluateResult = res.data;
        } else if (res.status == 500) {
          this.isError = true;
          this.errorMsg = res.message;
        }
      });
    },
  },
  async created() {
    await SiteApi.get()
      .then((res) => res.data)
      .then((json) => json.connections)
      .then((conn) => {
        this.availableSites = conn;
        console.log('Available sites: ', this.availableSites)
      });
  },
  data() {
    return {
      isError: false,
      errorMsg: "",
      trainBody: "",
      selectedSites: [],
      availableSites: [],
      showGraphLoading: true,
      showTrainInput: false,
      showCountResult: false,
      isTrainButtonDisabled: false,
      inProgress: false,
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
      prepareBody: `
      {
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
}`,
    };
  },
  computed: {
    progressBody: function () {
      return `{"job": "${this.jobID}"}`;
    },
    evaluateBody: function () {
      return `{"job": "${this.jobID}"}`;
    },
  },
};
</script>

<style scoped></style>
