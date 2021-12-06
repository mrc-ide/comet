<template>

    <div id="app">

        <nav class="navbar navbar-expand-md bg fixed-top text-white" style="background: #41669b">
            <a class="navbar-brand text-white" href="#">comet</a>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/" exact>
                          Home
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/about">
                          About
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/accessibility">
                          Accessibility
                        </router-link>
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
@import '../node_modules/bootstrap/scss/bootstrap.scss';
@import '../node_modules/bootstrap-vue/src/index.scss';
@import '../node_modules/vue-select/src/scss/vue-select.scss';
@import 'assets/custom.scss';

body {
    padding-top: 5rem;
    background-color: #eee;
}

@media only screen and (min-width : 1200px) {
  .container { max-width: 1800px; }
}

</style>
