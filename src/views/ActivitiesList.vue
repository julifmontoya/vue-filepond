<template>
  <div class="content-general">
    <div class="title-button">
      <h1 class="title-button__title">List</h1>
      <router-link
        :to="{
          name: 'ActivityCreate',
        }"
      >
        <button class="btn btn--blue mb-10">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 45.958 45.958"
            xml:space="preserve"
            class="icon-l fill-light"
          >
            <g>
              <path
                d="M22.979,0C10.288,0,0,10.289,0,22.979s10.288,22.979,22.979,22.979c12.69,0,22.979-10.289,22.979-22.979S35.67,0,22.979,0z M32.253,26.977h-5.301v5.289c0,2.207-1.765,3.996-3.972,3.996c-2.206,0-3.971-1.789-3.971-3.996v-5.291H13.71 c-2.207,0-4.006-1.789-4.006-3.997c0-2.207,1.796-3.996,4.003-3.996h5.302v-5.289c0-2.208,1.765-3.997,3.971-3.997 c2.208,0,3.972,1.789,3.972,3.997v5.29h5.301c2.207,0,3.997,1.79,3.997,3.997C36.25,25.188,34.46,26.977,32.253,26.977z"
              />
            </g>
          </svg>
          <span class="text-icon">Create</span>
        </button>
      </router-link>
    </div>
    <div class="table-scroll">
      <table class="wd-100p">
        <thead class="sticky__thead">
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody class="sticky__body">
          <tr v-for="(activity, index) in activities" :key="index">
            <td>{{ activity.id }}</td>
            <td>{{ activity.title }}</td>
            <td>
              <router-link
                :to="{
                  name: 'ActivityEdit',
                  params: { id: activity.id },
                }"
                title="Editar"
              >
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="0 0 512 512"
                  style="enable-background: new 0 0 512 512"
                  xml:space="preserve"
                  class="icon-xl mr-5 fill-primary"
                >
                  <g>
                    <g>
                      <g>
                        <path
                          d="M352.459,220c0-11.046-8.954-20-20-20h-206c-11.046,0-20,8.954-20,20s8.954,20,20,20h206C343.505,240,352.459,231.046,352.459,220z"
                        />
                        <path
                          d="M126.459,280c-11.046,0-20,8.954-20,20c0,11.046,8.954,20,20,20H251.57c11.046,0,20-8.954,20-20c0-11.046-8.954-20-20-20H126.459z"
                        />
                        <path
                          d="M173.459,472H106.57c-22.056,0-40-17.944-40-40V80c0-22.056,17.944-40,40-40h245.889c22.056,0,40,17.944,40,40v123c0,11.046,8.954,20,20,20c11.046,0,20-8.954,20-20V80c0-44.112-35.888-80-80-80H106.57c-44.112,0-80,35.888-80,80v352c0,44.112,35.888,80,80,80h66.889c11.046,0,20-8.954,20-20C193.459,480.954,184.505,472,173.459,472z"
                        />
                        <path
                          d="M467.884,289.572c-23.394-23.394-61.458-23.395-84.837-0.016l-109.803,109.56c-2.332,2.327-4.052,5.193-5.01,8.345l-23.913,78.725c-2.12,6.98-0.273,14.559,4.821,19.78c3.816,3.911,9,6.034,14.317,6.034c1.779,0,3.575-0.238,5.338-0.727l80.725-22.361c3.322-0.92,6.35-2.683,8.79-5.119l109.573-109.367C491.279,351.032,491.279,312.968,467.884,289.572zM333.776,451.768l-40.612,11.25l11.885-39.129l74.089-73.925l28.29,28.29L333.776,451.768z M439.615,346.13l-3.875,3.867l-28.285-28.285l3.862-3.854c7.798-7.798,20.486-7.798,28.284,0C447.399,325.656,447.399,338.344,439.615,346.13z"
                        />
                        <path
                          d="M332.459,120h-206c-11.046,0-20,8.954-20,20s8.954,20,20,20h206c11.046,0,20-8.954,20-20S343.505,120,332.459,120z"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import service from "@/services/service.js";

export default {
  components: {},
  data() {
    return {
      activities: [],
    };
  },
  beforeMount() {
    this.getData();
  },
  methods: {
    async getData() {
      const response = await service.get(`tours/`);
      this.activities = response.data;
    },
  },
};
</script>

<style scoped>
.title-button {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 15px;
}
.title-button__title {
  margin: 0 15px 10px 0px;
}
</style>