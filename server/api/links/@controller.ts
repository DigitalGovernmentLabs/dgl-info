import { createController } from './$relay'

export default createController({
  get: () => ({
    status: 200,
    body: [
      {
        name: '法など',
        links: [
          {
            url: 'http://law.e-gov.go.jp/htmldata/H25/H25HO027.html',
            label: '番号法'
          }
        ]
      }
    ]
  })
})
