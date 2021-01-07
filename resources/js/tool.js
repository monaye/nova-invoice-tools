Nova.booting((Vue, router, store) => {
  router.addRoutes([
    {
      name: 'invoices-index',
      path: '/invoices',
      component: require('./views/Index'),
    },
    {
        name: 'invoices-detail',
        path: '/invoices/:invoiceId',
        component: require('./views/Detail'),
      },
      {
        name: 'invoices-new',
        path: '/invoices/new',
        component: require('./views/New'),
      },
  ])
})
