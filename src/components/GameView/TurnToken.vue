<template>
    <v-expand-transition>
        <v-card
            v-if="show"
            id="turn-token"
            rounded="circle"
            height="32"
            width="32"
            elevation="3"
            class="mx-2"
        >
            <v-img :src="require('@/assets/logo_head.svg')" />
        </v-card>
    </v-expand-transition>
</template>

<script>
export default {
    name: 'TurnToken',
    props: {
        show: {
            type: Boolean,
            required: true,
        },
    },
}
</script>