<template>
  <v-container class="mainContainer">
    <v-card class="resultContainer">
      <div class="panelTitle">
        <span>{{ $t("resultsTxt") }}</span>
      </div>
      <div class="resultPanel">
        <div class="subPanel" v-for="(table, idx) in tables" v-bind:key="idx">
          <div class="tableTitle">
            <span class="tableIdx">{{ $t("tableTxt") + (idx + 1) + "." }}</span
            ><span>{{ $t(table.nameKey) }}</span>
          </div>
          <BTable
            :striped="false"
            :bordered="false"
            :borderless="true"
            :outlined="false"
            :small="true"
            :hover="false"
            :dark="false"
            :fixed="false"
            :foot-clone="false"
            :no-border-collapse="false"
            :items="renameKeys(table.fieldslang[$t('langCode')], table.items)"
            :fields="table.fieldslang[$t('langCode')].values"
            :head-variant="null"
            :table-variant="'light'"
            :responsive="true"
          ></BTable>
        </div>
        <v-divider></v-divider>
        <div class="subPanel" v-for="(figure, idx) in figures" v-bind:key="idx">
          <div class="tableTitle">
            <span class="tableIdx">{{ $t("figureTxt") + (idx + 1) + "." }}</span
            ><span>{{ $t(figure.nameKey) }}</span>
          </div>
          <rangeBarchart
            v-if="figure.type === 'range'"
            :id="'svg-' + idx"
            style="height: 40vh"
            :colors="colors"
            :breakdown="figure.breakdown"
            :category="figure.category"
            :data="figure.data"
            :group="true"
            :labels="siteLabels"
            autoresize
          ></rangeBarchart>
          <BarChart
            v-if="figure.type === 'bar'"
            :id="'svg-' + idx"
            style="width: 100%"
            :category="figure.category[0]"
            :colors="colors"
            :data="figure.data"
            :group="figure.category[1]"
            :labels="siteLabels"
            :margin="figure.margin"
          ></BarChart>
          <BarChart
            v-if="figure.type === 'stackBar'"
            :id="'svg-' + idx"
            style="width: 100%"
            :category="figure.category[0]"
            :colors="colors"
            :data="figure.data"
            :group="figure.category[1]"
            :labels="siteLabels"
            :margin="figure.margin"
            :stack="figure.stack"
          ></BarChart>
          <LineChart
            v-if="figure.type === 'line'"
            style="width: 100%"
            :categories="figure.categories"
            :dates="figure.dates"
            :data="figure.data"
          ></LineChart>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import BarChart from "@/components/barChart";
import Const from "@/const";
import { bus } from "@/main";
import rangeBarchart from "@/components/rangeBarchart";
import LineChart from "@/components/lineChart";

export default {
  name: "Results",
  components: { BarChart, rangeBarchart, LineChart },
  props: {
    tables: {
      type: Array,
    },
    figures: {
      type: Array,
    },
  },
  computed: {
    legendSites() {
      var legendSites = this.sites;
      legendSites.push("Mean");
      return legendSites;
    },
    legendColors() {
      var legendColors = Const.colors.slice(0, this.sites.length - 1);
      legendColors.push("black");
      return legendColors;
    },
  },
  methods: {
    renameKeys(keysMap, dataArray) {
      let newObjArray = [];
      dataArray.forEach((obj) => {
        const keyValues = Object.keys(obj).map((key) => {
          const newKey = keysMap[key] || key;
          return { [newKey]: obj[key] };
        });
        newObjArray.push(Object.assign({}, ...keyValues));
      });

      return newObjArray;
    },
    newSearch() {
      bus.emit("newSearch");
    },
  },
  data() {
    return {
      colors: Const.colors,
      siteLabels: {
        101: {
          en: "101",
          fr: "101",
        },
        102: {
          en: "102",
          fr: "102",
        },
        103: {
          en: "103",
          fr: "103",
        },
      },
    };
  },
};
</script>

<style scoped></style>
