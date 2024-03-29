<script setup lang="ts">
import {ref, Ref, onMounted} from 'vue';
import {useRoute} from "vue-router";
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import {Base64, encode} from "js-base64";
import {getContentAPI} from "@/apis/content";
import {getCategoryAPI} from "@/apis/category";
import {getTagAPI} from "@/apis/tag";
import type {Tag} from "@/types/schemas/tag";
import type {ContentOutput} from "@/types/schemas/resource";
import {useUserStore} from "@/stores/user";


const userStore = useUserStore()
const vditor = ref<Vditor | null>(null);
const host = import.meta.env.VITE_BASE_URL === '/api'?
    `${document.location.protocol}//${window.location.host}`: ''

onMounted(() => {
  // must use onMounted
  vditor.value = new Vditor('vditor', {
    cache: {
      enable: false,
    },
    preview: {
      hljs: {
        style: 'dracula',
      }
    },
    fullscreen: {
      index: 999,
    },
    toolbar: [
      'headings',
      'bold',
      'italic',
      'strike',
      'inline-code',
      '|',
      'table',
      'check',
      'link',
      'quote',
      'line',
      'emoji',
      'upload',
      '|',
      'undo',
      'redo',
      'outline',
      'edit-mode',
      'export',
    ],
    upload: {
      accept: 'image/*, .mp3, .wav, .rar',
      headers: {
        Authorization: `Bearer ${userStore.access_token}}`,
        'refresh-token': `${userStore.refresh_token}}`,
        'connection': 'keep-alive',
        'X-content-id': `${route.params.id}`
      },
      multiple: true,
      fieldName: 'files',
      url: `${import.meta.env.VITE_BASE_URL}/file/static/upload`,
      success: (editor: HTMLPreElement, msg: string) => {
        const images = JSON.parse(msg).files
        for (const image of images) {
          vditor.value!.insertValue(
              `![${image.name}](${host}${import.meta.env.VITE_BASE_URL}/${image.path})`
          )
        }
      },
      error(msg: string) {
        alert(`failed to upload ${msg}`)
      },
      filename: (name: string) => {
        return name.replace(
            /[^(a-zA-Z0-9\u4e00-\u9fa5.)]/g,
            ''
        ).replace(
            /[?\\/:|<>*[\]()$%{}@~]/g,
            ''
        ).replace(
            '/\\s/g',
            ''
        )
      },
      linkToImgUrl: `${import.meta.env.VITE_BASE_URL}/file/static/url`,
      linkToImgFormat: (responseText: string) => {
        const image = JSON.parse(responseText)
        // Get the image url in mark down image syntax
        const pattern = new RegExp(
            `(?<=!\\[.*]\\()${image.url}(?=\\))`,
            'g'
        )

        const replace_url = async () => {
          vditor.value!.setValue(
              vditor.value!.getValue().replace(
                  pattern,
                  `${host}${import.meta.env.VITE_BASE_URL}/${image.path}`
              ),
          )
        }
        replace_url()
        return JSON.stringify({
          msg: 'success',
          code: 200,
          data : {
            originalURL: image.url,
            url: image.path
          }
        })
      },
    },
    after: () => {
      // vditor.value is an instance of Vditor now and thus can be safely used here
      getCategoryAPI(null,(tags: Tag[]) => {
        categories.value = tags
        findContent()
      })
      getTagAPI({}, (data: Tag[]) => {
        tags.value = data
      })
    },
  })
})

const tags = ref()
const tagSelect = ref()
const categories: Ref<Array<Tag>> = ref([])
const categorySelect = ref()
const status = ref([
  {
    title: 'draft',
    url: '/draft'
  },
  {
    title: 'publish',
    url: '/post'
  },
])
const statusSelect = ref()

const title = ref()
const route = useRoute()
const contentData = ref()

function findContent() {
  getContentAPI(route.params.id, (data: ContentOutput) => {
    contentData.value = data
    title.value = data.title
    if (data.content != null) {
      vditor.value!.setValue(Base64.decode(data.content))
    }

    for (const st of status.value) {
      if (data.parent_url === st.url) {
        statusSelect.value = st
        break
      }
    }

    for (const cat of categories.value) {
      if (cat.id === data.category?.id) {
        categorySelect.value = cat
        break
      }
    }
    tagSelect.value = data.tags
  })
}

defineExpose({
  getEditorContents() {
    contentData.value.title = title.value
    contentData.value.content = encode(vditor.value!.getValue())
    contentData.value.tags = tagSelect.value
    contentData.value.parent_url = statusSelect.value.url
    if (contentData.value.parent_url === '/post') {
      contentData.value.permission = 701
    } else {
      contentData.value.permission = 700
    }

    if (categorySelect.value !== undefined
        && categorySelect.value.name !== undefined) {
      contentData.value.category = categorySelect.value
    }
    contentData.value.files = scanImages()
    return contentData.value
  }
})

const scanImages = () => {
  const md = vditor.value!.getValue()
  // match image and domains, get url
  const pattern = new RegExp(
      `(?<=!\\[.*]\\(.*${import.meta.env.VITE_BASE_URL}/static/content/\\d*/).*?(?=\\))`,
      'g'
  )
  const images = md.match(pattern) ?? []
  console.log(images)
  return images
}
</script>

<template>
  <v-card max-width="1000">
  <v-container class="mt-n2 mb-n6">
    <v-row>
      <v-col cols="8">
        <v-text-field
          density="compact"
          variant="underlined"
          color="indigo"
          label="Title"
          v-model="title"
        />
      </v-col>
      <v-col cols="4" class="align-self-end">
        <v-select
          return-object
          item-title="title"
          item-value="url"
          density="compact"
          variant="underlined"
          color="indigo"
          label="Status"
          :items="status"
          v-model="statusSelect"
        />
      </v-col>
      <v-col cols="6" class="align-self-end mt-n8">
        <v-select
          return-object
          item-title="name"
          item-value="id"
          density="compact"
          variant="underlined"
          color="indigo"
          label="Category"
          :items="categories"
          v-model="categorySelect"
        />
      </v-col>
      <v-col cols="6" class="align-self-end mt-n8">
        <v-combobox
          chips
          multiple
          clearable
          hide-selected
          closable-chips
          return-object
          item-title="name"
          item-value="id"
          label="Tags"
          density="compact"
          variant="underlined"
          color="indigo"
          v-model="tagSelect"
          :items="tags"
        />
      </v-col>
    </v-row>
  </v-container>
  <div id="vditor"/>
  </v-card>
</template>

<style>
#vditor {
  height: calc(100vh - 3rem) !important;
  overflow-y: scroll;
}
</style>
