<template>
  <div>
    <heading class="mb-6">請求書</heading>

    <div class="flex" style="">
      <div class="flex-no-shrink ml-auto mb-3">
        <router-link
          dusk="create-button"
          class="btn btn-default btn-primary"
          :to="{
            name: `${resouceName}-new`,
          }"
          >新規請求書
        </router-link>
      </div>
    </div>
    <loading-view :loading="loading">
      <card class="overflow-hidden">
        <table class="table w-full" cellpadding="0" cellspacing="0">
          <thead class="rounded-t">
            <tr>
              <th class="w-16 text-left">ID</th>
              <th class="text-left">タイトル</th>
              <th class="text-left">請求日</th>
              <th class="text-right">金額</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="resource in resources.data" :key="resource.id">
              <td>{{ resource.id }}</td>
              <td>{{ resource.title }}</td>
              <td class="td-fit text-right pr-6 align-middle">
                <div class="inline-flex items-center">
                  <router-link
                    class="inline-flex cursor-pointer text-70 hover:text-primary mr-3"
                    :dusk="`${resource.id}-edit-button`"
                    :to="{
                      name: `${resouceName}-edit`,
                      params: {
                        categoryId: cat.id,
                        category: cat,
                      },
                    }"
                    v-tooltip.click="__('Edit')"
                  >
                    <icon type="edit" />
                  </router-link>
                  <button
                    :data-testid="`${cat.id}-delete-button`"
                    :dusk="`${cat.id}-delete-button`"
                    class="inline-flex appearance-none cursor-pointer text-70 hover:text-primary mr-3"
                    @click.prevent="openDeleteModal(cat.id)"
                  >
                    <icon />
                  </button>
                  <portal
                    to="modals"
                    transition="fade-transition"
                    v-if="deleteModalOpen"
                  >
                    <delete-resource-modal
                      v-if="deleteModalOpen"
                      @confirm="confirmDelete"
                      @close="closeDeleteModal"
                      mode="delete"
                    >
                      <div slot-scope="{ uppercaseMode, mode }" class="p-8">
                        <heading :level="2" class="mb-6">{{
                          __(uppercaseMode + " Resource")
                        }}</heading>
                        <p class="text-80 leading-normal">
                          {{
                            __(
                              "Are you sure you want to " +
                                mode +
                                " this category?"
                            )
                          }}
                        </p>
                      </div>
                    </delete-resource-modal>
                  </portal>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="bg-20 rounded-b">
          <nav class="flex justify-between items-center">
            <!-- Previous Link -->
            <button
              :disabled="!resources.prev_page_url || linksDisabled"
              class="btn btn-link py-3 px-4"
              :class="{
                'text-primary dim': resources.prev_page_url,
                'text-80 opacity-50': !resources.prev_page_url || linksDisabled,
              }"
              rel="prev"
              @click.prevent="selectPreviousPage"
              dusk="previous"
            >
              {{ __("Previous") }}
            </button>

            <span class="text-sm text-80 px-4">
              {{ resourceCountLabel }}
            </span>

            <button
              :disabled="!resources.next_page_url || linksDisabled"
              class="btn btn-link py-3 px-4"
              :class="{
                'text-primary dim': categories.next_page_url,
                'text-80 opacity-50':
                  !categories.next_page_url || linksDisabled,
              }"
              rel="next"
              @click.prevent="selectNextPage"
              dusk="next"
            >
              {{ __("Next") }}
            </button>
          </nav>
        </div>
      </card>
    </loading-view>
  </div>
</template>

<script>
export default {
  data: () => ({
    resources: {},
    linksDisabled: false,
    loading: true,
    deleteModalOpen: false,
    resouceName = 'invoices',
  }),
  metaInfo() {
    return {
      title: "請求書一覧",
    };
  },
  async mounted() {
    console.log("mounted");
    this.getResources();
  },
  computed: {
    /**
     * Return the resource count label
     */
    resourceCountLabel() {
      return (
        this.resources.data &&
        `${this.resources.from} - ${this.resources.to} ${this.__(
          "of"
        )} ${Nova.formatNumber(this.resources.total)}`
      );
    },
  },
  methods: {
    selectPreviousPage() {
      this.getResources(this.resources.current_page - 1);
    },
    selectNextPage() {
      this.getResources(this.resources.current_page + 1);
    },
    async getResources(page = 1) {
      //   this.loading = true;
      const resources = await Nova.request().get(`/${this.resouceName}?page=${page}`);
      console.log("resources", resources);
      if (resources.status !== 200) {
        // throw some error
        console.log("handle error", resources.status);
      }
      this.loading = false;
      this.resources = resources.data;
    },
    openDeleteModal(resourceId) {
      this.deleteResourceId = resourceId;
      this.deleteModalOpen = true;
    },

    confirmDelete(resourceId) {
      console.log("confirm delete", resourceId);
      this.deleteResource(resourceId);
      this.closeDeleteModal();
    },

    closeDeleteModal() {
      this.deleteResourceId = null;
      this.deleteModalOpen = false;
    },
    /**
     * Delete the given resources.
     */
    async deleteResource() {
      const result = await Nova.request({
        url: `/${this.resouceName}/`,
        method: "delete",
        params: {
          data: {
            resourceId: this.deleteResourceId,
          },
        },
      });
      if (result.status !== 200) {
        console.log("error delete", result);
        Nova.error(
          "カテゴリーの削除に失敗しました。一度ログアウトしもう一度お試しください。"
        );
      }
      this.getResources(this.resources.current_page);
      Nova.success("カテゴリーを削除しました。");
    },
  },
};
</script>

<style>
/* Scoped Styles */
</style>
