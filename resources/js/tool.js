Nova.booting((Vue, router, store) => {
  router.addRoutes([
    {
      name: 'nova-invoice-tools',
      path: '/nova-invoice-tools',
      component: require('./components/Tool'),
    },
  ])
})
