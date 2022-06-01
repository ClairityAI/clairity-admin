export default (context, inject) => {
  function headerColCount() {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return 6
      case 'sm':
        return 4
      case 'md':
        return 4
      case 'lg':
        return 2
      case 'xl':
        return 2
    }
  }
  inject('headerColCount', headerColCount)
  context.$headerColCount = headerColCount

  function listCardColCount() {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return 12
      case 'sm':
        return 6
      case 'md':
        return 6
      case 'lg':
        return 4
      case 'xl':
        return 4
    }
  }
  inject('listCardColCount', listCardColCount)
  context.$listCardColCount = listCardColCount

  function mainCardColCount() {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return 12
      case 'sm':
        return 10
      case 'md':
        return 6
      case 'lg':
        return 4
      case 'xl':
        return 2
    }
  }
  inject('mainCardColCount', mainCardColCount)
  context.$mainCardColCount = mainCardColCount

  function messageColCount() {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return 12
      case 'sm':
        return 10
      case 'md':
        return 8
      case 'lg':
        return 6
      case 'xl':
        return 4
    }
  }
  inject('messageColCount', messageColCount)
  context.$messageColCount = messageColCount
}
