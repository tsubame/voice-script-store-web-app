<template>
  <v-app id="inspire">
      <v-navigation-drawer 
      id="left-navigation-drawer"
      width="50">
        <v-sheet
          color="grey-lighten-5"
          height="128"
          width="100¥%"
        ></v-sheet>
      </v-navigation-drawer>

      <v-main>
        main
        <slot />
      </v-main>

      <v-navigation-drawer location="right" v-if="!useDisplay().mobile.value">
        <v-list>
          <v-list-item
            v-for="n in 5"
            :key="n"
            :title="`Item ${ n }`"
            link
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
    <v-footer
      height="72"
      app
    >
      <v-text-field
        bg-color="grey-lighten-1"
        class="overflow-hidden"
        density="compact"
        rounded="pill"
        variant="solo-filled"
        flat
        hide-details
      ></v-text-field>
    </v-footer>
  </v-app>
</template>

<style lang="scss">
  #left-navigation-drawer {
  
    opacity: 0;
  }

  .v-container {
    width: 100%;
    border: solid 1px #999999;
  }
</style>