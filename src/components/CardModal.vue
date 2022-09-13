<script setup lang="ts">
import { inject, Ref } from "vue";

defineProps({
  symbol: String,
});

const showModal = <Ref<boolean>>inject("ShowModal");
const isDeposit = <Ref<boolean>>inject("IsDeposit");
const amount = <Ref<number>>inject("Amount");
const error = <Ref<number>>inject("Error");
const depositOrWithdraw = <(symbol: string) => void>inject("DepositOrWithdraw");

function stopPropagation() {
  //
}
</script>

<template>
  <div class="modaly">
    <div>
      <form>
        <div class="mb-3">
          <div class="modal-header">
            <h2 class="modal-title">{{ symbol.toUpperCase() }}</h2>
          </div>
          <label for="exampleInputEmail1" class="form-label"> (Amount)</label>
          <input
            type="text"
            class="form-control"
            v-model="amount"
            id="amount"
            inputmode="decimal"
            aria-describedby="amount"
          />
          <div id="amount" class="form-text text-danger" v-if="error?.length">
            {{ error }}
          </div>
          <div id="amount" class="form-text" v-else>
            Amount to Depoist Or Withdraw.
          </div>
        </div>
        <div class="row g-3">
          <div class="col-6">
            <button
              type="button"
              class="btn btn-success"
              style="width: 100%"
              @click="(isDeposit = true), depositOrWithdraw(symbol)"
            >
              Deposit
            </button>
          </div>

          <div class="col-6">
            <button
              type="button"
              class="btn btn-primary"
              style="width: 100%"
              @click="(isDeposit = false), depositOrWithdraw(symbol)"
            >
              Withdraw
            </button>
          </div>

          <div class="col-12">
            <button
              type="button"
              class="btn btn-danger"
              style="marginright: 42px"
              @click="showModal = false"
            >
              Close
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* .modaly {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
} */

.modal-content {
  background-color: #fff;
  width: 500px !important;
}

.modal-title {
  margin: auto;
}
</style>
