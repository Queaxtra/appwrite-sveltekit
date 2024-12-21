<script lang="ts">
    import { account } from "$lib/db";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    let email: string = '';
    let password: string = '';
    let warning: string = '';
    let isLoading: boolean = false;
    let loggedInUser = null;

    onMount(async () => {
        loggedInUser = await account.get();
        if (loggedInUser) {
            goto('/profile');
        }
    });

    const handleSubmit = () => {
        isLoading = true;
        account.createEmailPasswordSession(email, password).then(() => {
            goto('/profile');
        }).catch((error) => {
            warning = error.message;
        }).then(() => {
            isLoading = false;
        });
    };
</script>

<div class="min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div class="text-center">
            <h2 class="text-3xl font-bold text-black">Login</h2>
            <p class="mt-2 text-sm text-black/60">Welcome back!</p>
        </div>
        
        <form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmit}>
            <div class="space-y-4">
                <div>
                    <label for="email" class="text-sm font-medium text-black/70">Email address</label>
                    <input id="email" type="email" bind:value={email} required class="mt-1 block w-full px-3 py-2 border border-black/20 rounded-md shadow-sm focus:ring-primary focus:border-primary focus:ring-opacity-50" />
                </div>
                <div>
                    <label for="password" class="text-sm font-medium text-black/70">Password</label>
                    <input id="password" type="password" bind:value={password} required class="mt-1 block w-full px-3 py-2 border border-black/20 rounded-md shadow-sm focus:ring-primary focus:border-primary focus:ring-opacity-50" />
                </div>
            </div>

            {#if warning}
            <div class="text-sm text-red-500">{warning}</div>
            {/if}

            <button type="submit" disabled={!email || !password} class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 disabled:opacity-50">{isLoading ? 'Logging in...' : 'Login'}</button>

            <div class="text-center">
                <a href="/register" class="text-sm text-black/60 hover:text-primary">Don't have an account? Register</a>
            </div>
        </form>
    </div>
</div>