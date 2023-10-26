<template>
<v-container class="mainContainer">
 <h1>{{ $t('titleTxt')}}</h1>
  <div class="row">
    <div class="col-lg-7 col-md-7">
    <div class="selectData">
          <BForm class="mx-5 my-3" @submit.prevent="onSubmit" @reset="onReset" >
            <BFormGroup id="input-group-selectData"  >
              <BFormInput
                  id="input-selectData1"
                  v-model="form.query"

                  placeholder="Query"
              ></BFormInput>
            </BFormGroup>
             <BFormGroup id="input-group-selectData3">
                   <p>{{$t('selectVariableTxt')}}</p>
                  <BFormSelect v-model="form.variables" :options="options"  multiple :select-size="4" ></BFormSelect>
            </BFormGroup>
            <BFormGroup id="input-group-selectData4">
              <p>{{$t('selectDaysTxt')}} </p>
              <!-- removed vue slider, incompatible with vue 3 -->
            </BFormGroup>
            <BFormGroup>

              <b>{{$t('selectHospitalTxt')}}</b><br>
              <BFormCheckbox
                  v-model="allSelected"
                  :indeterminate="indeterminate"
                  aria-describedby="sitesOptions"
                  aria-controls="sitesOptions"
                  @change="toggleAll"
              >
                {{ allSelected ? $t('unselectAllTxt') : $t('selectAllTxt') }}
              </BFormCheckbox>

              <BFormCheckboxGroup
                  id="site_checkbox_group"
                  v-model="sites"
                  :options="sitesOptions"
                  name="site"
                  stacked
              ></BFormCheckboxGroup>
            </BFormGroup>
            <BButton type="submit" pill block variant="success">{{$t('selectTxt')}}</BButton>
          </BForm>
        </div>

      </div>
           <div class="col-lg-5 col-md-5">
            <div class="connectedPanel">
           <h3>{{$t('siteTitleTxt')}}</h3>
           <hr/>
           <ul v-for="place in places" v-bind:key="place">
                <li class="ok">{{place}}</li>
           </ul>
            </div>
      </div>
    </div>
     </v-container>
</template>

<script>
import { bus } from "@/main"
import _ from 'underscore'
import GeneralApi from "../api/GeneralApi";

export default {
  name: "AppHeader",
  computed: {
    options() {
      return [
        { value: 'length_of_stay', text:  "Length of stay" },
        { value: 'icu', text: 'ICU'   },
        { value: { C: 'CIUSS' }, text: 'Group' , disabled: true },
        { value: 'age_groups', text: "Age groups" }
      ]
    }
  },
  data() {
    return {
      places: ["Centre Hospitalier de l'Université de Montréal", "Hôpital Maisonneuve-Rosemont","Hôpital Général Juif", "Centre Universitaire Santé McGill", "Hôpital Sacré-Coueur de Montréal", "Centre Hospitalier Universitaire Sainte-Justine","Centre Hospitalier Universitaire de Québec", "CISSS de Chaudière-Appalaches"],

      value: [0, 30],
      selected: null,
      sitesOptions:[
        {text:'Centre Hospitalier de l\'Université de Montréal', value:'CHUM'},
        {text:'Hôpital Général Juif', value:'HGJ'},
        {text:'Centre Universitaire Santé McGill', value:"MUHC"},
        {text:'Hôpital Maisonneuve-Rosemont', value: 'HMR'},
        {text:'Hôpital Sacré-Cœur de Montréal', value:'HSCM'},
        {text:'Centre Hospitalier Universitaire de Québec', value: 'CHUQ'},
        {text:'Centre Hospitalier Universitaire Sainte-Justine', value:'CHUSJ'},
        {text:'CISSS de Chaudière-Appalaches', value:'CISSS-CA'},
        {text:'The Ottawa Hospital', value:'OttawaHospital'}
      ],
      allSelected: true,
      indeterminate: false,
      form: {
        query:null,
        variables: [],
      },
      sites: []
    };
  },
  components: {},
  mounted(){
    this.sites = _.map(this.sitesOptions, opt=>{
      return opt.value
    })
  },
  methods:{
    onSubmit() {
      const post_data = {
        sites: this.sites,
        query: this.form.query,
        variables: this.form.variables
      };

      console.info('post_data', post_data);

      //TODO: Send request to server
      GeneralApi.testData(post_data)
          .then(response => response.data)
          .then(data => {
            console.info('res_data', data);

            bus.emit('showDashboard', data);
          })

    },
    onReset() {

    },
    toggleAll(checked) {
      this.sites = checked ? this.sitesOptions.map(option=>{return option.value}).slice() : []
    }
  },
  watch: {
    sites(newVal) {
      if (newVal.length === 0) {
        this.indeterminate = false
        this.allSelected = false
      } else if (newVal.length === this.sitesOptions.length) {
        this.indeterminate = false
        this.allSelected = true
      } else {
        this.indeterminate = true
        this.allSelected = false
      }
    }
  }
}
</script>
