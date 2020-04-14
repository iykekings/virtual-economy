<script>
  import Paystack from "svelte-paystack";
  import { credit } from "./helper.js";

  let apiBaseUrl = "http://localhost:3000/api";
  let userEmail = "";
  let name = "";
  let loggedIn = false;
  let user = {};

  // transfer
  let recEmail = "";
  let recMmount = 0;
  let config = {
    key: "pk_test_a869b0564dc0763418d5cfb3b3b7a2590b1312c6",
    email: "iykekings36@gmail.com",
    amount: 100000,
    currency: "NGN",
    embed: false,
    disabled: false,
    value: "Recharge",
    callback: function(response) {
      if (response.status === "success") {
        credit(userEmail);
        fetchUser();
      } else {
        console.log(response);
      }
    },
    onClose: function() {
      console.log("window closed");
    }
  };
  function logout() {
    userEmail = "";
    name = "";
    user = {};
    loggedIn = false;
  }
  function login() {
    if (userEmail && name) {
      loggedIn = true;
      fetchUser();
    }
  }
  async function fetchUser() {
    let req = await fetch(apiBaseUrl + "/users/" + userEmail);
    user = await req.json();
    console.log(user);
  }

  async function transfer() {
    if (recEmail && recMmount) {
      let req = await fetch(apiBaseUrl + "/transactions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          donorEmail: userEmail,
          receiverEmail: recEmail,
          amount: recMmount
        })
      });
      let res = await res.json();
      console.log(res);
      // refresh user account to update UI
      fetchUser();
    } else {
      alert("Transfer fields mustbe filled");
    }
  }
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
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
      {#if !loggedIn}
        <form id="loginform">
          <input type="text" bind:value={name} placeholder="Full Name" />
          <input type="email" bind:value={userEmail} placeholder="Email" />
          <button type="submit" on:click|preventDefault={login}>Login</button>
        </form>
      {:else}
        <button on:click={logout}>Log out</button>
      {/if}
      {#if user.id}
        <div id="user-profile">
          <p>Welcome {user.firstName + ' ' + user.lastName}!</p>
          <p>Email: {user.email}</p>
          <p>Balance: {user.balance}</p>
        </div>
      {/if}
    </section>
    <section id="recharge">
      {#if loggedIn}
        <p>Recharge your account to easily transfer funds.</p>
        <div>
          <Paystack {config} />
        </div>
      {/if}
    </section>
    <section id="transfers">
      <form id="transform">
        <input type="number" bind:value={recMmount} placeholder="Amount" />
        <input
          type="email"
          bind:value={recEmail}
          placeholder="Recipient's Email" />
        <button type="submit" on:click|preventDefault={transfer}>
          Transfer
        </button>
      </form>
    </section>
  </main>
</main>
