<template>
    <div class="dispatch">
        <PickupQueue class="ma-2" />
        <ScheduledPickupQueue class="ma-2" />
    </div>
</template>

<script>
import PickupQueue from "@/components/PickupQueue.vue";
import ScheduledPickupQueue from "@/components/ScheduledPickupQueue.vue";

export default {
    name: "IntakeDispatch",

    components: {
        PickupQueue,
        ScheduledPickupQueue
    }
}
</script>
