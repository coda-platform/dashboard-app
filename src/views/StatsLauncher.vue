<template>
  <div class="mainContainer">
    <v-container>
      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-12">
          <SelectData
            v-bind:connections="connections"
            v-bind:measures="measures"
            v-bind:resources="resources"
            v-bind:minimize="showDash"
          />
        </div>

        <div class="col-lg-6 col-md-6 col-sm-12">
          <StatsResults v-if="showResults" :tables="tables" :figures="figures">
          </StatsResults>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import SelectData from "@/views/SelectData";
import { bus } from "@/main";
import SiteApi from "@/api/SiteApi";
import StatsResults from "./StatsResults";
import GeneralApi from "../api/GeneralApi";

const intersection = (...sets) =>
  sets.reduce(
    (acc, el) => acc.filter({}.hasOwnProperty.bind(el)),
    Object.keys(sets[0]),
  );
const getSiteKeys = (resources) =>
  resources.reduce((acc, el) => {
    acc[`${el.type}|${el.attribute}|${el.datatype}`] = el;
    return acc;
  }, {});

export default {
  name: "StatsLauncher",
  components: {
    StatsResults,
    SelectData,
  },
  props: {},
  async created() {
    bus.on("showDashboard", (data) => {
      this.summary = data.summary;
      this.sites = data.summary.sites;
      //this.length_of_stay = data.length_of_stay;
      //this.age_groups = data.age_groups;
      var ageIdx = data.summary.categories.indexOf("patient|age|number"),
        stayIdx = data.summary.categories.indexOf("episode|los|number");
      this.age_groups = data.summary.data[ageIdx];
      this.length_of_stay = data.summary.data[stayIdx];
      this.component = "Dashboard";
      this.showDash = true;
    });

    bus.on("showResults", (data) => {
      this.tables = data.tables;
      this.figures = data.figures;

      this.showResults = true;
    });

    try {

        await SiteApi.get()
          .then((res) => res.data)
          .then((json) => json.connections)
          .then((conn) => this.load(conn))
          .catch((error) => console.error(error));

      } catch (err) {
        console.error('Could not fetch sites.', err)
      }

      try {
        await GeneralApi.Measures().then((res) => this.loadMeasures(res.data));
      } catch (err) {
        console.error('Could not fetch measures.', err)
      }
  },
  data() {
    return {
      component: "SelectData",
      summary: {},
      sites: [],
      length_of_stay: [],
      age_groups: [],
      // -- Down is good --
      connections: [],
      resources: [],
      showDash: false,
      showResults: false,
      tables: [],
      figures: [],
      measures: {},
    };
  },
  methods: {
    load: function (connections) {
      // Loading active connections
      this.connections = connections.map((conn) => Object.assign({}, conn)); // Clone for safety

      // Finding common set of resources.
      const siteResources = connections.map((conn) =>
        getSiteKeys(conn.resources),
      );
      const commonRes = intersection(...siteResources);

      // Take resource definition from
      this.resources = commonRes.map((key) => {
        let type, attr, dtype;
        [type, attr, dtype] = key.split("|");
        return { type: type, attribute: attr, datatype: dtype };
      });
    },
    loadMeasures: function (data) {
      // reworking the new data for old expected package.
      this.measures = {
        cont: data.continuous.map((el) => ({
          label_en: el.labels.en,
          label_fr: el.labels.en,
          value: el.code,
        })),
        disc: data.discrete.map((el) => ({
          label_en: el.labels.en,
          label_fr: el.labels.en,
          value: el.code,
        })),
      };
    },
    fetch: function (url) {
      return fetch(url)
        .then((res) => res.json())
        .then((json) => json.connections)
        .then((conn) => this.load(conn));
    },
  },
};
</script>
