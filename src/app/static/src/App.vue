<template>

    <div id="app">

        <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
            <a class="navbar-brand" href="#">comet</a>
            <div id="navbarsExampleDefault" class="collapse navbar-collapse">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <router-link class="nav-link" to="/">Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/about">About</router-link>
                    </li>
                </ul>
            </div>
        </nav>

        <main class="container" role="main">
            <router-view/>
        </main>

    </div>

</template>

<style lang="scss">
@import 'assets/custom.scss';
@import '../node_modules/bootstrap/scss/bootstrap.scss';
@import '../node_modules/bootstrap-vue/src/index.scss';

body {
    padding-top: 5rem;
}

@media only screen and (min-width : 1200px) {
  .container { max-width: 1500px; }
}

</style>
