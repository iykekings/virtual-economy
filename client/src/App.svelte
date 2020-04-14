<script>
  import Paystack from "svelte-paystack";
  import {
    credit,
    postData,
    fetchUser,
    transfer,
    fetchTransactions
  } from "./helper.js";

  let apiBaseUrl = "http://localhost:3000/api";
  let userEmail = "";
  let transactions = [];
  let name = "";
  let loggedIn = false;
  let user = {};

  // transfer
  let recEmail = "";
  let recAmount;
  let config = {
    key: "pk_test_a869b0564dc0763418d5cfb3b3b7a2590b1312c6",
    email: "iykekings36@gmail.com",
    amount: 100000,
    currency: "NGN",
    embed: false,
    disabled: false,
    value: "Fund Wallet",
    callback: function(response) {
      if (response.status === "success") {
        credit(userEmail)
          .then(_ => updateDetails())
          .catch(err => console.log(err));
      } else {
        alert("Tranfer failed. Try again!");
      }
    }
  };
  function logout() {
    userEmail = "";
    name = "";
    user = {};
    loggedIn = false;
    transactions = [];
  }
  async function updateDetails() {
    user = await fetchUser(user.email);
  }
  async function login() {
    if (userEmail && name) {
      user = await fetchUser(userEmail);
      if (!user.id) {
        alert("User doesn't exist");
      }
      loggedIn = true;
      transactions = await fetchTransactions(user.id);
    }
  }
  async function sendMoney() {
    await transfer(recEmail, recAmount, user.email);
    user = await updateDetails();
  }
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
  #dashboard {
    display: flex;
    justify-content: center;
  }
  #transform {
    display: flex;
    flex-direction: column;
    margin: 0 2rem;
    padding: 1rem;
    border: 1px solid tomato;
  }

  #recharge {
    border: 1px #8ae28a solid;
    background-color: #8ae28a0f;
    padding: 1rem;
  }
  #user {
    display: flex;
    flex-direction: column-reverse;
    margin: 0 2rem;
    color: #3e3e3e;
    font-weight: 500;
    padding: 1rem;
    border: 1px tomato solid;
    background-color: #f4433614;
  }
  aside ul {
    align-items: center;
    display: flex;
    flex-direction: column;
    align-content: center;
  }
  aside ul li {
    display: flex;
    list-style: none;
    border: 1px solid #ff63474d;
    padding: 0.5rem 1rem;
    margin-bottom: 10px;
  }
  aside ul li > * {
    margin: 0 5px;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <h1>Virtual Economy</h1>
  <main id="dashboard">
    <section id="user">
      <form
        id="loginform"
        style={!loggedIn ? 'display: flex' : 'display: none'}>
        <input type="text" bind:value={name} placeholder="Full Name" />
        <input type="email" bind:value={userEmail} placeholder="Email" />
        <button type="submit" on:click|preventDefault={login}>Login</button>
      </form>

      {#if loggedIn}
        <button on:click={logout}>Log out</button>
      {/if}
      {#if loggedIn && user.id}
        <div id="user-profile">
          <h2>{user.firstName + ' ' + user.lastName}</h2>
          <p>{user.email}</p>
          <p>Wallet Balance: {user.balance}</p>
        </div>
      {/if}
    </section>
    <section
      id="recharge"
      style={loggedIn ? 'display: block' : 'display: none'}>
      <h3>Credit your wallet</h3>
      <div>
        <Paystack {config} />
      </div>
    </section>
    <section id="transfers">
      <form id="transform" style={loggedIn ? 'display: flex' : 'display: none'}>
        <h3>Transfer</h3>
        <input type="number" bind:value={recAmount} placeholder="Amount" />
        <input
          type="email"
          bind:value={recEmail}
          placeholder="Recipient's Email" />
        <button type="submit" on:click|preventDefault={sendMoney}>
          Send Money
        </button>
      </form>
    </section>
  </main>
  <aside>
    <h3>Your recents Transfers</h3>
    {#if transactions.length}
      <ul>
        {#each transactions as trans}
          <li>
            <p>&#x20A6;{trans.amount}</p>
            <p>{trans.donorId == user.id ? 'Debited' : 'credited'}</p>
            <p>on {new Date(trans.createdAt).toGMTString()}</p>
          </li>
        {/each}
      </ul>
    {:else}
      <p>None</p>
    {/if}
  </aside>
</main>
