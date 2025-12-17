<template>
    <nav class="navbar">
        <div class="navbar-left">
            <slot name="left" />
        </div>
        <div class="navbar-right">
            <slot name="right" />
        </div>
    </nav>
</template>

<script>
export default {
    name: 'NavBar'
}
</script>

<style scoped>
.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #333;
    padding: 0.5rem 1rem;
}
.navbar-left {
    display: flex;
    align-items: center;
}
.navbar-right {
    display: flex;
    align-items: center;
}
</style>