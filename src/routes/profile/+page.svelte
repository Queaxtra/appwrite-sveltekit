<script lang="ts">
    import { onMount } from "svelte";
    import { account } from "$lib/db";
    import { goto } from "$app/navigation";

    let loggedInUser: any = null;
    let isEditing = false;
    let newName = '';
    let updateMessage = '';
    let isLoading = false;

    onMount(async () => {
        try {
            loggedInUser = await account.get();
            newName = loggedInUser.name || '';
        } catch (error) {
            goto('/login');
        }
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleUpdateName = async () => {
        isLoading = true;
        try {
            await account.updateName(newName);
            loggedInUser = await account.get();
            updateMessage = "Name updated successfully!";
            setTimeout(() => updateMessage = '', 3000);
        } catch (error) {
            updateMessage = error.message;
        } finally {
            isLoading = false;
        }
    };

    const handleLogout = async () => {
        await account.deleteSession('current');
        goto('/login');
    };
</script>

<div class="min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div class="text-center">
            <h2 class="text-3xl font-bold text-black">Profile</h2>
            <p class="mt-2 text-sm text-black/60">Your account information</p>
        </div>

        {#if loggedInUser}
        <div class="space-y-6">
            <div class="border-b border-black/10 pb-4">
                <div class="space-y-4">
                    <div>
                        <label class="text-sm font-medium text-black/70">Name</label>
                        {#if isEditing}
                        <div class="mt-1 space-y-2">
                            <input type="text" bind:value={newName} class="block w-full px-3 py-2 border border-black/20 rounded-md shadow-sm focus:ring-primary focus:border-primary focus:ring-opacity-50" />
                            <button on:click={handleUpdateName} disabled={isLoading} class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 disabled:opacity-50">{isLoading ? 'Updating...' : 'Update Name'}</button>
                        </div>
                        {:else}
                        <p class="mt-1 text-black">{loggedInUser.name || 'Not set'}</p>
                        {/if}
                    </div>

                    <div>
                        <label class="text-sm font-medium text-black/70">Email</label>
                        <p class="mt-1 text-black">{loggedInUser.email}</p>
                        <span class="text-xs {loggedInUser.emailVerification ? 'text-green-600' : 'text-yellow-600'}">
                            {loggedInUser.emailVerification ? 'Verified' : 'Not verified'}
                        </span>
                    </div>

                    <div>
                        <label class="text-sm font-medium text-black/70">Member since</label>
                        <p class="mt-1 text-black">{formatDate(loggedInUser.registration)}</p>
                    </div>

                    <div>
                        <label class="text-sm font-medium text-black/70">Account Status</label>
                        <p class="mt-1 flex items-center">
                            <span class={`inline-block w-2 h-2 rounded-full mr-2 ${loggedInUser.status ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span class="text-black">{loggedInUser.status ? 'Active' : 'Inactive'}</span>
                        </p>
                    </div>

                    {#if updateMessage}
                    <p class="text-sm text-primary">{updateMessage}</p>
                    {/if}
                </div>
            </div>

            <div class="space-y-4">
                <button on:click={() => isEditing = !isEditing} class="w-full py-2 px-4 border border-black/20 rounded-md shadow-sm text-black hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300">{isEditing ? 'Cancel Editing' : 'Edit Profile'}</button>
                <button on:click={handleLogout} class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300">Logout</button>
            </div>
        </div>
        {/if}
    </div>
</div>