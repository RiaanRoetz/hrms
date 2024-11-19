<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <BottomTabs />
    </ion-tabs>
    <ion-header>
    </ion-header>
    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="doRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonTabs, IonPage, IonRouterOutlet } from "@ionic/vue"
import BottomTabs from "@/components/BottomTabs.vue"
</script>

<script>
import { ref } from "vue"
import { IonRefresher, IonRefresherContent } from "@ionic/vue"
import { employeeResource, userResource } from "@/data"

export default {
  components: {
    IonRefresher,
    IonRefresherContent,
  },
  setup() {
    const doRefresh = async (event) => {
      // Reload relevant resources
      await employeeResource.reload()
      await userResource.reload()
      // Add other resources as needed

      event.target.complete()
    }

    return {
      doRefresh,
    }
  }
}
</script>
