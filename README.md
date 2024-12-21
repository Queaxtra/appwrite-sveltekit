## What is Appwrite?
Appwrite is an open source and self-hosted backend service platform that aims to simplify common and complex tasks required to build modern web and mobile applications. Designed as an open source alternative to Firebase, Appwrite offers developers a wide range of features such as user authentication, database management, file storage, cloud functions and real-time communication. These features allow developers to build faster and more secure applications, while greatly streamlining the back-end development process.

## What is SvelteKit?
SvelteKit can be described as an application framework (or “metaframework”) based on Svelte. While Svelte is a lightweight and performance-oriented UI framework used to build user interface components, SvelteKit is a tool that helps you build modern web applications using these components. SvelteKit provides developers with support for different rendering techniques such as server-side rendering (SSR), client-side rendering (CSR), static site generation (SSG) and single-page apps (SPA), allowing you to optimize the performance and SEO features of your apps.

## Using Appwrite on SvelteKit
First we create a SvelteKit project. I will use [bun](https://bun.sh) to build this project, you can also use npm or pnpm.

![1](https://hackmd.io/_uploads/ByQ9qSVrke.png)
![2](https://hackmd.io/_uploads/H1xscBEHJx.png)
![3](https://hackmd.io/_uploads/r1Dj5S4ryx.png)

Now we have SvelteKit files. Now we need to create a new project via Appwrite.

![4](https://hackmd.io/_uploads/Sk-AqSVrJg.png)

After creating the project, you need to click on “API key” in this section.

![5](https://hackmd.io/_uploads/Hy4loBNSJg.png)

Here you need to set the name of your API key and the expiration date. It is recommended to set the expiration date to “Never”.

![6](https://hackmd.io/_uploads/H11VoSEHyl.png)

After making those settings, you need to select all scopes values here.

![9](https://hackmd.io/_uploads/rkxH2SVB1l.png)
Finally, you need to go to the project settings section and copy the “Project ID” part.

That was our Appwrite setup, now let's move on to using it on the project.

![7](https://hackmd.io/_uploads/rJnooB4B1g.png)

We will first need to download the Appwrite module to use it in the project. You can include it in the project by typing `bun i appwrite` command.

![8](https://hackmd.io/_uploads/ryjZ2rEBkx.png)

After downloading the module, you should create a file named `db.ts` under `src/lib`.

![10](https://hackmd.io/_uploads/rk9t3HESyl.png)

To add the `import.meta.env.VITE_APP_PROJECT_ID` part here, you must first open an `.env` file and enter a value named `VITE_APP_PROJECT_ID`. This value will be the “Project ID” value you get from Appwrite.

![11](https://hackmd.io/_uploads/rk462HVHJe.png)

Now that we have prepared this `.env` file, we need to prepare **register**, **login** and **profile** files.

First of all we need to prepare the `register` file because first of all the user needs to create an account. We need to open a file named `src/routes/register/+page.svelte` and add the following codes into it.

```svelte
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
```

Now that we have done the registration system, the **profile** part is next. Open a file named `src/routes/login/+page.svelte` and write the following code in it.

```svelte
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
```

The last thing left to do is the profile part, which we will do in `src/routes/profile/+page.svelte`.

```svelte
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
```

That's it, now your project is ready. You can complete your project by adding more on top of it. You can view the source code by clicking [this link](https://github.com/queaxtra/appwrite-sveltekit).