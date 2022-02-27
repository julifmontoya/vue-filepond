<template>
  <div class="content-general">
    <form @submit.prevent="submitData">
      <div :class="{ 'form-group--error': $v.title.$error }">
        <fieldset>
          <legend>Title</legend>
          <label class="label-form">This will create or update by Json *</label>
          <input
            v-model="$v.title.$model"
            type="text"
            class="form-control col48sm"
          />
          <p
            v-if="$v.title.$error && !$v.title.required"
            class="validation-error"
          >
            Título es requerido
          </p>
        </fieldset>
      </div>

      <fieldset>
        <legend>Detalles</legend>

        <textarea
          class="form-control col48sm"
          v-model="$v.description.$model"
          :maxlength="maxDesc"
        ></textarea>
        <p
          v-if="$v.description.$error && !$v.description.required"
          class="validation-error"
        >
          Detalles es requerido
        </p>
        <div class="textarea-addon" v-text="maxDesc - description.length"></div>
      </fieldset>

      <div class="card-details">
        <h3 class="mb-10">Imágenes</h3>
        <p>Agrega las imágenes que deseas </p>
        <file-pond
          ref="filepond"
          label-idle="Arrastra tus imágenes aqui..."
          :allow-multiple="true"
          accepted-file-types="image/jpeg, image/png"
          labelFileTypeNotAllowed="Archivo de tipo no válido"
          fileValidateTypeLabelExpectedTypes="Esperaba {allButLastType} o {lastType}"
          max-file-size="2MB"
          labelMaxFileSizeExceeded="Archivo es demasiado grande"
          labelMaxFileSize="Tamaño máximo es {filesize}"
          :files="images_pond"
          v-on:updatefiles="handleFilePondUpdateFile"
          :allowRevert="true"
          @reorderfiles="reorderFiles"
          @processfile="fileUploaded"
          @removefile="fileReverted"
        />
      </div>

      <div class="form__save">
        <button type="submit" class="btn btn--blue mr-10">Save</button>
      </div>
    </form>
  </div>
</template>

<script>
import service from "@/services/service.js";
import { required } from "vuelidate/lib/validators";
import vueFilePond, { setOptions } from "vue-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

const FilePond = vueFilePond(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

setOptions({
  allowReorder: true,
  imagePreviewHeight: 230,
});

export default {
  components: {
    FilePond,
  },
  data() {
    return {
      title: "",
      description: "",
      maxDesc: 1400,
      images_pond: [],
      files: [],
    };
  },
  provide() {
    return {
      $v: this.$v,
    };
  },
  validations: {
    title: {
      required,
    },
    description: {
      required,
    },
  },
  async beforeMount() {
    if (this.$route.name == "ActivityCreate") {
      console.log("create");
    } else {
      this.getData();
    }
  },
  methods: {
    async getData() {
      const response = await service.get(`tours/${this.$route.params.id}/`);
      this.details = response.data;

      this.title = this.details.title;
      this.description = this.details.description;

      this.images_pond = this.details.images.map((item) => item.image);
    },
    handleFilePondUpdateFile(files) {
      this.files = files.map((file) => {
        return new File([file.file], file.file.name, {
          type: file.type,
        });
      });
    },
    async submitData() {
      this.$v.$touch();
      if (this.$v.$anyError) {
        this.$nextTick(() => {
          window.validateFocusElement();
        });
      } else {
        let data = {};
        let body = {};
        body["title"] = this.title;
        body["description"] = this.description;

        const fd = new FormData();
        for (let i = 0; i < this.files.length; i++) {
          fd.append("image", this.files[i]);
        }

        if (this.$route.name == "ActivityCreate") {
          data = await service.post(`tours/`, body);
          if (data.data.id.length > 0) {
            await service.post(`tours-image-create/${data.data.id}/`, fd);
          }
        } else {
          await service.put(`tours/${this.$route.params.id}/`, body);
          await service.put(`tours-image/${this.$route.params.id}/`, fd);
        }
        this.$router.push({ name: "ActivitiesList" });
      }
    },
    reorderFiles() {
      this.emitChangedEvent();
    },
    fileUploaded() {
      this.emitChangedEvent();
    },
    fileReverted() {
      this.emitChangedEvent();
    },
    emitChangedEvent() {
      let processingFiles = this.$refs.filepond.getFiles(),
        isFilesUploaded = processingFiles.every(
          (file) => file.status === 5 || file.status === 2
        );
      if (isFilesUploaded) {
        if (processingFiles.length >= 1) {
          this.files = processingFiles.map((file) => {
            return new File([file.file], file.file.name, {
              type: file.type,
            });
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.form__save {
  text-align: center;
  margin-top: 30px;
}
</style>