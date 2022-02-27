<template>
  <vue-autosuggest
    ref="autosuggest"
    v-model="query"
    :suggestions="suggestions"
    :inputProps="inputProps"
    :sectionConfigs="sectionConfigs"
    :renderSuggestion="renderSuggestion"
    :getSuggestionValue="getSuggestionValue"
    :shouldRenderSuggestions="shouldRenderSuggestions"
    @input="fetchResults"
  >
  </vue-autosuggest>
</template>

<script>
import { VueAutosuggest } from "vue-autosuggest";
import service from "@/services/service.js";

export default {
  name: "app",
  components: {
    VueAutosuggest,
  },
  props: ["inputProps", "initialValue", "id"],
  data() {
    return {
      query: "",
      results: [],
      timeout: null,
      selected: null,
      searchText: "",
      error: false,
      debounceMilliseconds: 500,
      suggestions: [],
      sectionConfigs: {
        cities: {
          limit: 6,
          label: "Cities",
          onSelected: (selected) => {
            let newval = {
              ...selected,
              city_id: this.id,
            };
            this.$emit("getSelectedValue", newval);

            this.selected = selected.item;
          },
        },
        destinations: {
          limit: 6,
          label: "Destinations",
          onSelected: (selected) => {
            let newval = {
              ...selected,
              city_id: this.id,
            };
            this.$emit("getSelectedValue", newval);
            this.selected = selected.item;
          },
        },
        default: {
          onSelected: () => {
            this.doSearch(this);
          },
        },
      },
    };
  },
  methods: {
    doSearch() {
      console.log("Searching...");
    },
    fetchResults(input) {
      const query = this.query;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        const citiesPromise = service.get(`city/?search=${input}`);
        const destinationsPromise = service.get(`destination/?search=${input}`);

        Promise.all([destinationsPromise, citiesPromise]).then((values) => {
          this.suggestions = [];
          this.selected = null;

          const dest_res = this.filterResults(
            values[0].data,
            query,
            "destination"
          );
          const city_res = this.filterResults(values[1].data, query, "city");

          if (city_res.length) {
            this.suggestions = [{ name: "cities", data: city_res }];
          }
          if (dest_res.length) {
            this.suggestions = [{ name: "destinations", data: dest_res }];
          }
        });
      }, this.debounceMilliseconds);
    },
    filterResults(data, text, field) {
      return data
        .filter((item) => {
          if (item[field].toLowerCase().indexOf(text.toLowerCase()) > -1) {
            return item[field];
          }
        })
        .sort();
    },
    renderSuggestion(suggestion) {
      if (suggestion.name === "cities") {
        return `${suggestion.item.city}, ${suggestion.item.state}, ${suggestion.item.country}`;
      } else if (suggestion.name === "destinations") {
        return `${suggestion.item.destination}, ${suggestion.item.city}, ${suggestion.item.state}, ${suggestion.item.country}`;
      } else {
        return suggestion.item.label;
      }
    },
    getSuggestionValue(suggestion) {
      let { name, item } = suggestion;
      return name === "destinations"
        ? `${item.destination}, ${item.city}, ${item.state}, ${item.country}`
        : item.city + ", " + item.state + ", " + item.country;
    },
    shouldRenderSuggestions(suggestions, loading) {
      if (suggestions > 0) {
        return !loading;
      } else {
        this.suggestions = [
          {
            name: "error",
            data: [{ id: 1, label: "result not found" }],
          },
        ];
      }
    },
  },
  created() {
    this.query = this.initialValue;
  },
};
</script>
