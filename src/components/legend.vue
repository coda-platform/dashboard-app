<template>
  <div :class="'legendContainer ' + direction">
    <div v-if="direction === 'vertical'">
      <ul class="ToggleController">
        <li v-for="(site, x) in sites.slice(0, 5)" v-bind:key="site">
          <label
            class="siteItem"
            v-bind="highlight"
            @mousemove="$emit('update:highlight', site)"
            @mouseout="$emit('update:highlight', null)"
          >
            <span
              class="siteIcon"
              :class="site === 'Mean' ? 'Mean' : ''"
              v-bind:style="{ background: colors[x] }"
            ></span>
            <span class="siteLabel">{{
              site === "Mean" ? $t("meanTxt") : site
            }}</span>
          </label>
        </li>
      </ul>
    </div>

    <div
      v-if="direction === 'vertical' && tooManySites()"
      :class="direction === 'horizontal' ? 'col-lg-6 col-md-12 col-sm-12' : ''"
    >
      <ul class="ToggleController">
        <li v-for="(site, x) in sites.slice(5, 10)" v-bind:key="site">
          <label
            class="siteItem"
            v-bind="highlight"
            @mousemove="$emit('update:highlight', site)"
            @mouseout="$emit('update:highlight', null)"
          >
            <span
              class="siteIcon"
              v-if="site !== ''"
              :class="site === 'Mean' ? 'Mean' : ''"
              v-bind:style="{ background: colors.slice(5, 10)[x] }"
            ></span>
            <span class="siteLabel" v-html="label(site)"></span>
          </label>
        </li>
      </ul>
    </div>

    <div v-if="direction === 'horizontal'" class="horizontal">
      <div class="ToggleController">
        <div v-for="(site, x) in sites" class="site" v-bind:key="site">
          <label
            class="siteItem"
            v-bind="highlight"
            @mousemove="$emit('update:highlight', site)"
            @mouseout="$emit('update:highlight', null)"
          >
            <span
              class="siteIcon"
              :class="site === 'Mean' ? 'Mean' : ''"
              v-bind:style="{ background: colors[x] }"
            ></span>
            <span class="siteLabel" v-html="label(site)"></span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Legend",
  props: {
    colors: {
      type: Array,
    },
    sites: {
      type: Array,
    },
    highlight: {
      type: String,
    },
    direction: {
      type: String,
    },
    labels: {
      type: Object,
    },
  },
  methods: {
    tooManySites() {
      if (this.sites.length > 4) return true;
      else return false;
    },
    label(site) {
      var label = "";
      if (site === "Mean") {
        label = "Mean";
      } else if (site === "total") {
        label = "Total";
      } else label = `${this.labels[site][this.$i18n.locale]}`;
      return label;
    },
  },
  // watch:{
  //   labels(){
  //     this.labels = this.labels
  //   }
  // }
};
</script>

<style scoped></style>
