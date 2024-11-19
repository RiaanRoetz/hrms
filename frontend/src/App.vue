<template>
	<ion-app>
		<ion-router-outlet id="main-content" />
		<Toasts />

		<InstallPrompt />
	</ion-app>
</template>

<script setup>
import { onMounted, inject } from "vue"
import { IonApp, IonRouterOutlet } from "@ionic/vue"

import { Toasts } from "frappe-ui"

import InstallPrompt from "@/components/InstallPrompt.vue"
import { showNotification } from "@/utils/pushNotifications"

onMounted(() => {
	window?.frappePushNotification?.onMessage((payload) => {
		showNotification(payload)
	});

	const socket = inject("$socket");
	socket.on("hrms:update", (data) => {
		// Handle the update event and refresh the necessary parts of the UI
		console.log("Received update event", data);
		// For example, you can reload resources or refresh the view
	});
})
</script>
