<template>
	<ion-page>
		<ion-tabs>
			<ion-router-outlet></ion-router-outlet>
			<BottomTabs />
		</ion-tabs>
		</ion-header>
		<ion-content>
			<ion-refresher slot="fixed" @ionRefresh="doRefresh">
				<ion-refresher-content></ion-refresher-content>
			</ion-refresher>
	</ion-page>
</template>

<script setup>
import { IonTabs, IonPage, IonRouterOutlet } from "@ionic/vue"
import BottomTabs from "@/components/BottomTabs.vue"
</script>
<script>
import { ref } from "vue"
import { IonRefresher, IonRefresherContent } from "@ionic/vue"

export default {
  components: {
    IonRefresher,
    IonRefresherContent,
  },
  beforeRouteEnter(to, from, next) {
    refreshData(to, next)
  },
  beforeRouteUpdate(to, from, next) {
    refreshData(to, next)
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

function refreshData(to, next) {
  const { name } = to
  if (name === "Home") {
    // Reload home-specific resources
    // Example: await homeResource.reload()
  } else if (name === "AttendanceDashboard") {
    // Reload attendance-specific resources
    // Example: await attendanceResource.reload()
  } else if (name === "LeavesDashboard") {
    // Reload leaves-specific resources
    // Example: await leaveResource.reload()
  } else if (name === "ExpenseClaimsDashboard") {
    // Reload expense claims-specific resources
    // Example: await expenseResource.reload()
  } else if (name === "SalarySlipsDashboard") {
    // Reload salary slips-specific resources
    // Example: await salarySlipResource.reload()
  }
  next()
}
</script>
