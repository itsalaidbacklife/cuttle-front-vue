<template>
    <v-dialog v-model="show">
        <v-card id="four-discard-dialog">
            <v-card-title>Discard Two Cards</v-card-title>
            <v-card-text>
                <p>Your Opponent has resolved a Four One-Off.</p>
                <p>You must discard two cards. Click to discard.</p>
            </v-card-text>
            <v-card-actions class="d-flex justify-end">
                <v-btn
                    color="primary"
                    data-cy="close-four-dialog"
                    @click="show = false"
                >
                    Okay
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

export default {
    name: 'FourDialog',
    props: {
        value: {
            required: true,
            type: Boolean,
        },
    },
    computed: {
        show: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            },
        },
    },
}
</script>