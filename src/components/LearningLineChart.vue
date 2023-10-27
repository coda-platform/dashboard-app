<template>
  <v-chart class="chart" ref="LearningLineChart" :option="option" />
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
} from "echarts/components";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
  LineChart,
]);

export default {
  name: "LearningLineChart",
  components: { VChart },
  props: {
    dataValues: Array,
  },
  methods: {
    onResize() {
      this.$refs.MultiLineChart.resize();
    },
    range: function (start, stop, step) { 
      return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)
    },
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  computed: {
    option() {
      
      const series = this.dataValues.reduce((val, acc) => {
          if (!acc[val.siteCode]) acc[val.siteCode] = {
            type: "line",
            name: val.siteCode,
            showSymbol: true,
            data: []
          }
          acc[val.siteCode].data.push(val.value)
          return acc
        }, {})

      const len = Object.keys(series).length > 0 ? 
        Object.values(series)[0].data.length : 0

      return {
        series: series,
        legend: { data: this.sites },
        tooltip: { trigger: "axis" },
        grid: { bottom: "3%", containLabel: true },
        toolbox: { feature: { saveAsImage: {} } },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.range(1,len,1)
        },
        yAxis: {
          type: "value",
        },
      };
    },
  },
};
</script>

<style scoped></style>
