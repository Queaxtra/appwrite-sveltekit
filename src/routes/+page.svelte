<script lang="ts">
    import { goto } from "$app/navigation";
</script>

<div class="min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div class="text-center">
            <h2 class="text-3xl font-bold text-black">Welcome</h2>
            <p class="mt-2 text-sm text-black/60">Choose an option to continue</p>
        </div>

        <div class="space-y-4">
            <button on:click={() => goto('/register')} class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300">Register</button>
            <button on:click={() => goto('/login')} class="w-full py-2 px-4 border border-black/20 rounded-md shadow-sm text-black hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300">Login</button>
        </div>
    </div>
</div>