<script lang="ts">
    import { account } from "$lib/db";
    import { v4 as uuidv4 } from 'uuid';
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    let email: string = '';
    let password: string = '';
    let warning: string = '';
    let isLoading: boolean = false;
    let loggedInUser = null;

    const allowedDomains = [
        '@gmail.com',
        '@outlook.com',
        '@hotmail.com',
        '@yahoo.com',
        '@icloud.com',
        '@live.com',
        '@msn.com',
        '@proton.me',
        '@protonmail.com',
        '@aol.com'
    ];

    onMount(async () => {
        loggedInUser = await account.get();
        if (loggedInUser) {
            goto('/profile');
        }
    });

    const isValidEmail = (email: string) => {
        return allowedDomains.some(domain => email.toLowerCase().endsWith(domain));
    };

    const isValidPassword = (password: string) => {
        return password.length >= 8;
    };

    const handleSubmit = () => {
        isLoading = true;
        if (!isValidEmail(email)) {
            warning = "Please use a valid email address from a known provider. We only support the following domains: " + allowedDomains.join(', ');
            return;
        }

        if (!isValidPassword(password)) {
            warning = "Password must be at least 8 characters long";
            return;
        }
        
        account.create(uuidv4(), email, password).then(() => {
            warning = "Account created successfully!";
            goto('/login');
        }).catch((error) => {
            warning = error.message;
        }).finally(() => {
            isLoading = false;
        });
    };
</script>

<div class="min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div class="text-center">
            <h2 class="text-3xl font-bold text-black">Create Account</h2>
            <p class="mt-2 text-sm text-black/60">Sign up to get started</p>
        </div>
        
        <form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmit}>
            <div class="space-y-4">
                <div>
                    <label for="email" class="text-sm font-medium text-black/70">Email address</label>
                    <input id="email" type="email" bind:value={email} required class="mt-1 block w-full px-3 py-2 border border-black/20 rounded-md shadow-sm" />
                </div>
                <div>
                    <label for="password" class="text-sm font-medium text-black/70">Password</label>
                    <input id="password" type="password" bind:value={password} required class="mt-1 block w-full px-3 py-2 border border-black/20 rounded-md shadow-sm" />
                </div>
            </div>

            {#if warning}
            <div class="text-red-500 text-sm">{warning}</div>
            {/if}

            <button type="submit" disabled={!email || !password} class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 disabled:opacity-50">{isLoading ? 'Registering...' : 'Register'}</button>

            <div class="text-center">
                <a href="/login" class="text-sm text-black/60 hover:text-primary">Already have an account? Login</a>
            </div>
        </form>
    </div>
</div>